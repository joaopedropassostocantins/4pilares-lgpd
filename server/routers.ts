import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createTasting, getTastingByEmail, getTastingByCNPJ } from "./db";
import { processarWebhookMercadoPago } from "./webhooks";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  tastings: router({
    create: publicProcedure
      .input(z.object({
        email: z.string().email(),
        razaoSocial: z.string(),
        cnpj: z.string(),
        segmento: z.string().optional(),
        tamanho: z.enum(["micro", "pequena", "media", "grande", "multinacional"]).optional(),
        cep: z.string().optional(),
        estado: z.string().optional(),
        cidade: z.string().optional(),
        responsavel: z.string().optional(),
        cargo: z.string().optional(),
        telefone: z.string().optional(),
        demandas: z.array(z.string()).default([]),
        riscos: z.array(z.string()).default([]),
        statusLei: z.number().default(0),
        statusRegras: z.number().default(0),
        statusConformidade: z.number().default(0),
        statusTitular: z.number().default(0),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const tasting = await createTasting({
          ...input,
          status: "submitted",
          submittedAt: new Date(),
        });
        return tasting;
      }),

    getByEmail: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        return await getTastingByEmail(input.email);
      }),

    getByCNPJ: publicProcedure
      .input(z.object({ cnpj: z.string() }))
      .query(async ({ input }) => {
        return await getTastingByCNPJ(input.cnpj);
      }),
  }),

  webhooks: router({
    mercadoPago: publicProcedure
      .input(z.object({
        type: z.string(),
        data: z.object({
          id: z.number().optional(),
        }).optional(),
      }))
      .mutation(async ({ input }) => {
        return await processarWebhookMercadoPago(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
