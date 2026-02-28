import { z } from "zod";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "./trpc";
import { getSessionCookieOptions } from "./cookies";
import { COOKIE_NAME } from "@shared/const";
import { processWebhook } from "../mercadopago";
import { getDiagnosticByPublicId, updateDiagnostic } from "../db";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  mercadoPagoWebhook: publicProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.string(),
        data: z.object({
          id: z.number(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        console.log("[Webhook] Received Mercado Pago webhook:", input);

        const paymentInfo = await processWebhook(input);
        if (!paymentInfo) {
          console.warn("[Webhook] No payment info extracted");
          return { success: false, message: "No payment info" };
        }

        console.log("[Webhook] Payment info:", paymentInfo);

        if (paymentInfo.status !== "approved") {
          console.log(`[Webhook] Payment status is ${paymentInfo.status}, not approved yet`);
          return { success: false, message: `Payment status: ${paymentInfo.status}` };
        }

        console.log("[Webhook] Payment approved!");
        
        return {
          success: true,
          message: "Payment approved",
          paymentId: paymentInfo.paymentId,
          status: paymentInfo.status,
        };
      } catch (error) {
        console.error("[Webhook] Error processing webhook:", error);
        return { success: false, message: "Error processing webhook" };
      }
    }),

  confirmPaymentByDiagnosticId: publicProcedure
    .input(
      z.object({
        diagnosticPublicId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const diagnostic = await getDiagnosticByPublicId(input.diagnosticPublicId);
        if (!diagnostic) {
          return { success: false, message: "Diagnostic not found" };
        }

        if (diagnostic.paymentStatus === "paid") {
          return { success: true, message: "Already paid", alreadyPaid: true };
        }

        await updateDiagnostic(input.diagnosticPublicId, {
          paymentStatus: "paid",
        });

        console.log("[Payment Confirmation] Diagnostic marked as paid:", input.diagnosticPublicId);

        return {
          success: true,
          message: "Payment confirmed",
          alreadyPaid: false,
        };
      } catch (error) {
        console.error("[Payment Confirmation] Error:", error);
        return { success: false, message: "Error confirming payment" };
      }
    }),
});

export const authRouter = router({
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user ?? null;
  }),

  logout: protectedProcedure.mutation(({ ctx }) => {
    return { success: true };
  }),
});
