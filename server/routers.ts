import { z } from "zod";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import {
  createDiagnostic,
  getDiagnosticByPublicId,
  updateDiagnostic,
  getAllDiagnostics,
  getDiagnosticsCount,
  getPaidDiagnosticsCount,
  getTotalRevenue,
  createFeedback,
  getFeedbackByDiagnosticId,
  getAccuracyStats,
} from "./db";
import { calculatePillars } from "./sajo";
import { createPaymentPreference, initMercadoPago } from "./mercadopago";

// Admin procedure with role check
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

const adminRouter = router({
  stats: adminProcedure.query(async () => {
    const total = await getDiagnosticsCount();
    const paid = await getPaidDiagnosticsCount();
    const revenue = await getTotalRevenue();
    const conversionRate = total > 0 ? ((paid / total) * 100).toFixed(2) : "0.00";
    return {
      totalDiagnostics: total,
      paidDiagnostics: paid,
      totalRevenue: revenue.toFixed(2),
      conversionRate: parseFloat(conversionRate),
    };
  }),

  diagnostics: adminProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      const items = await getAllDiagnostics(input.limit, input.offset);
      const total = await getDiagnosticsCount();
      return { items, total };
    }),
});

const diagnosticRouter = router({
  create: publicProcedure
    .input(
      z.object({
        consultantName: z.string().optional(),
        birthDate: z.string(),
        birthTime: z.string(),
        birthPlace: z.string(),
        hasDst: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const publicId = nanoid(16);
      const pillarsData = calculatePillars(input.birthDate, input.birthTime, input.hasDst);

      // Generate tasting analysis with LLM
      const name = input.consultantName || "Viajante";
      const prompt = `Você é um analista de padrões comportamentais baseado em ciclos coreanos SAJO (사주). Seu tom é direto, preditivo e hipnotizante — sem linguagem épica ou fantasia. Fale em português brasileiro.

Dados do consulente:
- Nome: ${name}
- Signo Animal: ${pillarsData.animalSign}
- Pilar do Dia (essencial): ${pillarsData.dayPillar.stem.name} sobre ${pillarsData.dayPillar.branch.name}
- Elemento dominante: ${pillarsData.dominantElement}
- Traços observáveis: ${pillarsData.personalityTraits.join(", ")}
- Pontos fortes: ${pillarsData.strengths.join(", ")}
- Padrões de risco: ${pillarsData.challenges.join(", ")}
- Equilíbrio dos elementos: ${JSON.stringify(pillarsData.elementBalance)}

Escreva uma análise de degustação (4-5 parágrafos) que:
1. Abra com 1-2 frases que acertam em cheio: uma afirmação forte + 1 pergunta de checagem ("Se eu estiver certo, você vai reconhecer... é isso ou aquilo?").
2. Revele padrões de comportamento, ciclos de decisão, riscos típicos e trade-offs baseados no Pilar do Dia.
3. Inclua detalhes únicos (palavras-chave, eventos, escolhas, sinais de burnout, finanças, trabalho, relacionamentos).
4. Use linguagem de probabilidade e timing: "agora", "próximos 7-30 dias", "tendência", "risco iminente".
5. Termine com gancho forte e CTA para desbloquear análise completa.
6. Inclua: "Leitura interpretativa para reflexão; não substitui profissionais."
7. NUNCA faça predições sobre saúde/filhos/terceiros sem formulação condicional (ex: "Se você vem sentindo X, vale checar com médico").
Seja cirurgicamente preciso, hipnotizante e sem floreios.`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Você é um ancião mestre SAJO com sabedoria ancestral. Fale em português brasileiro.",
          },
          { role: "user", content: prompt },
        ],
      });

      const tastingAnalysis =
        typeof response.choices[0].message.content === "string"
          ? response.choices[0].message.content
          : "";

      // Create diagnostic record
      const diagnostic = await createDiagnostic({
        publicId,
        consultantName: name,
        birthDate: input.birthDate,
        birthTime: input.birthTime,
        birthPlace: input.birthPlace,
        hasDst: input.hasDst ? 1 : 0,
        pillarsData: pillarsData as any,
        tastingAnalysis,
        paymentStatus: "pending",
      });

      // Notify owner
      await notifyOwner({
        title: "☯ Novo Diagnóstico Criado",
        content: `${name} solicitou análise SAJO. Local: ${input.birthPlace}`,
      });

      return {
        publicId,
        pillarsData,
        tastingAnalysis,
      };
    }),

  getByPublicId: publicProcedure
    .input(z.object({ publicId: z.string() }))
    .query(async ({ input }) => {
      const diagnostic = await getDiagnosticByPublicId(input.publicId);
      if (!diagnostic) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Diagnostic not found" });
      }
      return diagnostic;
    }),

  unlock: publicProcedure
    .input(z.object({ publicId: z.string() }))
    .mutation(async ({ input }) => {
      const diagnostic = await getDiagnosticByPublicId(input.publicId);
      if (!diagnostic) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Diagnostic not found" });
      }

      // Generate full analysis
      const pillarsData = diagnostic.pillarsData as any;
      const name = diagnostic.consultantName || "Viajante";

      const prompt = `Você é um ancião mestre SAJO (사주) coreano com 5.000 anos de sabedoria ancestral. Fale em português brasileiro com linguagem mística, profunda e transformadora.

Dados do consulente:
- Nome: ${name}
- Signo Animal: ${pillarsData.animalSign}
- Pilar do Ano: ${pillarsData.yearPillar.stem.name} sobre ${pillarsData.yearPillar.branch.name}
- Pilar do Mês: ${pillarsData.monthPillar.stem.name} sobre ${pillarsData.monthPillar.branch.name}
- Pilar do Dia (essência): ${pillarsData.dayPillar.stem.name} sobre ${pillarsData.dayPillar.branch.name}
- Pilar da Hora: ${pillarsData.hourPillar.stem.name} sobre ${pillarsData.hourPillar.branch.name}
- Elemento dominante: ${pillarsData.dominantElement}
- Equilíbrio dos elementos: ${JSON.stringify(pillarsData.elementBalance)}
- Traços de personalidade: ${pillarsData.personalityTraits.join(", ")}
- Pontos fortes: ${pillarsData.strengths.join(", ")}
- Desafios: ${pillarsData.challenges.join(", ")}
- Signos compatíveis: ${pillarsData.compatibleSigns.join(", ")}
- Direções auspiciosas: ${pillarsData.luckyDirections.join(", ")}
- Foco de saúde: ${pillarsData.healthFocus.join(", ")}

Escreva uma análise COMPLETA e PROFUNDA de 10-12 parágrafos que inclua:

1. **Saudação Mística**: Saúde o consulente pelo nome e signo animal com reverência ancestral
2. **Análise dos 4 Pilares**: Descreva cada pilar (Ano, Mês, Dia, Hora) com significado profundo
3. **Essência do Ser**: Revele a essência do Pilar do Dia com metáforas poéticas
4. **Missão de Vida**: Descreva a jornada espiritual e propósito de vida baseado nos pilares
5. **Saúde e Vitalidade**: Analise o equilíbrio dos 5 elementos e recomendações de saúde
6. **Finanças e Abundância**: Previsões sobre ciclos financeiros e oportunidades de riqueza
7. **Relacionamentos e Amor**: Análise de compatibilidade e dinâmicas relacionais
8. **Guia Xamânico**: Ofereça sabedoria ancestral e práticas para harmonização energética
9. **Ciclos Temporais**: Descreva ciclos de 10 anos (Grandes Ciclos) e próximas transformações
10. **Encerramento Inspirador**: Termine com uma mensagem de esperança e empoderamento

Use linguagem poética, referências à natureza coreana, yin-yang e xamanismo. Seja profundo, transformador e esperançoso.`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Você é um ancião mestre SAJO com sabedoria ancestral. Fale em português brasileiro.",
          },
          { role: "user", content: prompt },
        ],
      });

      const fullAnalysis =
        typeof response.choices[0].message.content === "string"
          ? response.choices[0].message.content
          : "";

      // Update diagnostic with full analysis
      await updateDiagnostic(input.publicId, {
        fullAnalysis,
        basicAnalysis: fullAnalysis,
      });

      // Notify owner
      await notifyOwner({
        title: "✦ Análise Completa Desbloqueada",
        content: `${name} desbloqueou a análise completa dos 4 Pilares.`,
      });

      return { success: true };
    }),
});

const feedbackRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        diagnosticId: z.number(),
        accuracy: z.enum(["very_accurate", "accurate", "neutral", "inaccurate", "very_inaccurate"]),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const feedback = await createFeedback({
        diagnosticId: input.diagnosticId,
        accuracy: input.accuracy,
        comment: input.comment,
      });
      return feedback;
    }),

  getByDiagnosticId: publicProcedure
    .input(z.object({ diagnosticId: z.number() }))
    .query(async ({ input }) => {
      return await getFeedbackByDiagnosticId(input.diagnosticId);
    }),

  stats: adminProcedure.query(async () => {
    return await getAccuracyStats();
  }),
});

const paymentRouter = router({
  createPreference: publicProcedure
    .input(
      z.object({
        diagnosticId: z.string(),
        userEmail: z.string(),
        userName: z.string(),
        returnUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        initMercadoPago();
        const preference = await createPaymentPreference({
          diagnosticId: input.diagnosticId,
          userEmail: input.userEmail,
          userName: input.userName,
          amount: 14.99,
          returnUrl: input.returnUrl,
        });

        return {
          preferenceId: preference.preferenceId,
          initPoint: preference.initPoint,
          sandboxInitPoint: preference.sandboxInitPoint,
        };
      } catch (error) {
        console.error("[Payment] Failed to create preference:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao criar preferência de pagamento",
        });
      }
    }),

  // Legacy Pix endpoint (kept for backward compatibility)
  createPix: publicProcedure
    .input(z.object({ diagnosticId: z.string() }))
    .mutation(async () => {
      return {
        pixKey: "55 63 98438-1782",
        beneficiary: "FUSION-SAJO Diagnósticos Ancestrais",
        amount: 14.99,
      };
    }),

  confirm: publicProcedure
    .input(z.object({ diagnosticId: z.string(), paymentMethod: z.string() }))
    .mutation(async ({ input }) => {
      // In production, this would verify payment. For now, trust the user.
      await updateDiagnostic(input.diagnosticId, { paymentStatus: "paid" });
      return { success: true };
    }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  diagnostic: diagnosticRouter,
  payment: paymentRouter,
  feedback: feedbackRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
