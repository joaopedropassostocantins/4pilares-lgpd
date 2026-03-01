import { Request, Response } from "express";
import {
  verifyRazorpayWebhookSignature,
  getRazorpayPaymentStatus,
  getRazorpayPayment,
} from "../razorpay";
import { getDb } from "../db";
import { diagnostics } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { notifyOwner } from "../_core/notification";

export interface RazorpayWebhookPayload {
  event: string;
  created_at: number;
  payload: {
    payment?: {
      entity: {
        id: string;
        entity: string;
        amount: number;
        currency: string;
        status: string;
        method: string;
        description: string;
        amount_refunded: number;
        refund_status: string | null;
        captured: boolean;
        email: string;
        contact: string;
        notes: Record<string, string>;
        fee: number;
        tax: number;
        created_at: number;
      };
    };
    order?: {
      entity: {
        id: string;
        entity: string;
        amount: number;
        amount_paid: number;
        amount_due: number;
        currency: string;
        receipt: string;
        status: string;
        attempts: number;
        notes: Record<string, string>;
        created_at: number;
      };
    };
  };
}

/**
 * Handle Razorpay webhook events
 */
export async function handleRazorpayWebhook(req: Request, res: Response) {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    if (!verifyRazorpayWebhookSignature(body, signature)) {
      console.warn("[Razorpay Webhook] Invalid signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const payload = req.body as RazorpayWebhookPayload;

    console.log(`[Razorpay Webhook] Event: ${payload.event}`);

    // Handle payment.authorized event
    if (payload.event === "payment.authorized") {
      await handlePaymentAuthorized(payload);
    }

    // Handle payment.captured event
    if (payload.event === "payment.captured") {
      await handlePaymentCaptured(payload);
    }

    // Handle payment.failed event
    if (payload.event === "payment.failed") {
      await handlePaymentFailed(payload);
    }

    // Handle refund.created event
    if (payload.event === "refund.created") {
      await handleRefundCreated(payload);
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("[Razorpay Webhook] Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Handle payment.authorized event
 */
async function handlePaymentAuthorized(payload: RazorpayWebhookPayload) {
  try {
    const payment = payload.payload.payment?.entity;
    if (!payment) return;

    console.log(`[Razorpay] Payment authorized: ${payment.id}`);

    // Store payment record (skip for now, will implement later)
    /*
    const db = await getDb();
    await db.insert(payments).values({
      paymentId: payment.id,
      diagnosticPublicId: payment.notes.diagnostic_public_id || "",
      method: "razorpay",
      amount: payment.amount / 100, // Convert from paise to rupees
      currency: payment.currency,
      status: "pending",
      metadata: JSON.stringify({
        razorpay_payment_id: payment.id,
        razorpay_order_id: payment.notes.order_id,
        email: payment.email,
        contact: payment.contact,
      }),
      createdAt: new Date(payment.created_at * 1000),
    });
    */

    console.log(`[Razorpay] Payment record created: ${payment.id}`);
  } catch (error) {
    console.error("[Razorpay] Error handling payment.authorized:", error);
  }
}

/**
 * Handle payment.captured event
 */
async function handlePaymentCaptured(payload: RazorpayWebhookPayload) {
  try {
    const payment = payload.payload.payment?.entity;
    if (!payment) return;

    console.log(`[Razorpay] Payment captured: ${payment.id}`);

    // Unlock diagnostic
    const diagnosticPublicId = payment.notes.diagnostic_public_id;
    if (diagnosticPublicId) {
      const db = await getDb();
      if (db) {
        await db
          .update(diagnostics)
          .set({
            paymentStatus: "paid",
          })
          .where(eq(diagnostics.publicId, diagnosticPublicId));
      }

       console.log(`[Razorpay] Diagnostic unlocked: ${diagnosticPublicId}`);

      // Notify owner
      await notifyOwner({
        title: "Novo pagamento confirmado (Razorpay)",
        content: `Pagamento de INR ${(payment.amount / 100).toFixed(2)} recebido. Diagnóstico: ${diagnosticPublicId}`,
      });
    }
  } catch (error) {
    console.error("[Razorpay] Error handling payment.captured:", error);
  }
}

/**
 * Handle payment.failed event
 */
async function handlePaymentFailed(payload: RazorpayWebhookPayload) {
  try {
    const payment = payload.payload.payment?.entity;
    if (!payment) return;

    console.log(`[Razorpay] Payment failed: ${payment.id}`);

    // Update payment status (skip for now)
    // const db = await getDb();
    // await db
    //   .update(payments)
    //   .set({
    //     status: "failed",
    //   })
    //   .where(eq(payments.paymentId, payment.id));

    console.log(`[Razorpay] Payment marked as failed: ${payment.id}`);
  } catch (error) {
    console.error("[Razorpay] Error handling payment.failed:", error);
  }
}

/**
 * Handle refund.created event
 */
async function handleRefundCreated(payload: RazorpayWebhookPayload) {
  try {
    const refund = payload.payload.payment?.entity;
    if (!refund) return;

    console.log(`[Razorpay] Refund created for payment: ${refund.id}`);

    // Update payment status (skip for now)
    // const db = await getDb();
    // await db
    //   .update(payments)
    //   .set({
    //     status: "refunded",
    //   })
    //   .where(eq(payments.paymentId, refund.id));

    console.log(`[Razorpay] Payment marked as refunded: ${refund.id}`);
  } catch (error) {
    console.error("[Razorpay] Error handling refund.created:", error);
  }
}
