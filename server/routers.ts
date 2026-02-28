import z from "zod";
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
        email: z.string().email().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        birthDate: z.string(),
        birthTime: z.string().optional(),
        birthPlace: z.string().optional(),
        hasDst: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const publicId = nanoid(16);
      const pillarsData = calculatePillars(input.birthDate, input.birthTime || "12:00", input.hasDst);

      // Generate tasting analysis with LLM
      const name = input.consultantName || "Viajante";
      const prompt = `Você é um especialista em SAJO coreano (사주). Seu tom é DIRETO, OBJETIVO e PRÁTICO — sem floreios místicos. Fale em português brasileiro.

Dados do consulente:
- Nome: ${name}
- Signo Animal: ${pillarsData.animalSign}
- Pilar do Dia (essência): ${pillarsData.dayPillar.stem.name} sobre ${pillarsData.dayPillar.branch.name}
- Elemento dominante: ${pillarsData.dominantElement}
- Traços observáveis: ${pillarsData.personalityTraits.join(", ")}
- Pontos fortes: ${pillarsData.strengths.join(", ")}
- Padrões de risco: ${pillarsData.challenges.join(", ")}

Escreva uma análise de degustação (5-6 parágrafos) que:

1. **Abertura Direta**: Comece com 1-2 frases que acertam em cheio sobre a personalidade (uma afirmação + uma pergunta de checagem).

2. **3 Previsões Concretas e Diretas**:
   - **AMOR**: Uma previsão específica sobre dinâmica de relacionamentos ou encontros nos próximos meses (ex: "Você vai atrair pessoas que compartilham sua intensidade, mas pode se isolar quando se sente incompreendido").
   - **FINANÇAS**: Uma previsão sobre ciclos de ganho/perda ou oportunidades financeiras (ex: "Seus ganhos vêm de decisões rápidas, mas o risco é investir impulsivamente sem análise").
   - **SAÚDE/FAMÍLIA/VIAGENS**: Uma previsão sobre vitalidade, dinâmica familiar ou movimentação (ex: "Você precisa de descanso nos próximos 3 meses; viagens trazem clareza mental").

3. **Padrões Comportamentais**: Descreva ciclos de decisão, riscos típicos, trade-offs com AFIRMAÇÕES CONCRETAS (não especulativo).

4. **Linguagem Assertiva**: Use "você vai", "está acontecendo agora", "próximos 7-30 dias", "a tendência é", "o risco é".

5. **Gancho Final**: Termine com CTA forte para desbloquear análise completa.

6. **Disclaimer**: "Leitura interpretativa para reflexão; não substitui profissionais."

Seja DIRETO, PRÁTICO e sem floreios. Nada de "ancestrais", "espíritos" ou "névoa mística". Fale como um especialista em padrões comportamentais.`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Você é um especialista em padrões SAJO. Fale com assertividade, clareza e objetividade. Sem misticismo. Português brasileiro.",
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
        email: input.email || null,
        gender: input.gender || null,
        birthDate: input.birthDate,
        birthTime: input.birthTime || null,
        birthPlace: input.birthPlace || null,
        hasDst: input.hasDst ? 1 : 0,
        pillarsData: pillarsData as any,
        tastingAnalysis,
        paymentStatus: "pending",
      });

      // Notify owner
      await notifyOwner({
        title: "☯ Novo Diagnóstico Criado",
        content: `${name} solicitou análise SAJO. Local: ${input.birthPlace || "não informado"}`,
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

      const prompt = `Você é um especialista em SAJO (사주) coreano. Seu tom é DIRETO, PRÁTICO e TRANSFORMADOR — com afirmações concretas sobre presente e futuro. SEM floreios místicos. Fale em português brasileiro.

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

Escreva uma análise COMPLETA de 12-15 parágrafos com AFIRMAÇÕES CONCRETAS E DIRETAS:

1. **Saudação Assertiva**: Saúde o consulente pelo nome e signo animal com uma afirmação contundente sobre sua essência (sem floreios).

2. **Análise dos 4 Pilares**: Descreva cada pilar com significado prático e afirmações sobre o que ESTÁ ACONTECENDO agora.

3. **Essência do Ser**: Revele a essência do Pilar do Dia com clareza e objetividade.

4. **Missão de Vida**: Descreva a jornada e propósito de vida com afirmações práticas e concretas.

5. **3 Previsões Concretas e Diretas**:
   - **AMOR**: Dinâmica de relacionamentos, padrões de atração, compatibilidade. Seja específico.
   - **FINANÇAS**: Ciclos de ganho/perda, oportunidades, riscos financeiros. Dê números ou períodos.
   - **SAÚDE/FAMÍLIA/VIAGENS**: Vitalidade, dinâmica familiar, movimentação. Seja prático.

6. **Equilíbrio dos 5 Elementos**: Análise do equilíbrio com recomendações específicas e práticas.

7. **Relacionamentos e Compatibilidade**: Análise de dinâmicas relacionais com afirmações sobre o que funciona e o que não funciona.

8. **Ciclos Temporais**: Descreva ciclos de 10 anos (Grandes Ciclos) e transformações iminentes com datas/períodos.

9. **Sabedoria Prática**: Ofereça 3-4 práticas concretas para harmonização e sucesso.

10. **Encerramento Empoderador**: Termine com afirmações de força e clareza sobre o futuro.

Use linguagem ASSERTIVA, DIRETA, com afirmações sobre PRESENTE e FUTURO. Evite especulação e floreios. Seja um especialista em padrões, não um místico.`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Você é um especialista em SAJO com conhecimento profundo. Fale com assertividade, clareza e objetividade. SEM misticismo. Português brasileiro.",
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
  createPix: publicProcedure
    .input(z.object({ diagnosticId: z.string() }))
    .mutation(async ({ input }) => {
      return {
        pixKey: "55 63 98438-1782",
        beneficiary: "FUSION-SAJO Diagnósticos Ancestrais",
      };
    }),

  createPreference: publicProcedure
    .input(
      z.object({
        diagnosticId: z.string(),
        userEmail: z.string().email(),
        userName: z.string(),
        returnUrl: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const preference = await createPaymentPreference({
          diagnosticId: input.diagnosticId,
          userEmail: input.userEmail,
          userName: input.userName,
          amount: 14.99,
          returnUrl: input.returnUrl,
        });
        return preference;
      } catch (error) {
        console.error("Mercado Pago error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao criar preferência de pagamento",
        });
      }
    }),

  confirm: publicProcedure
    .input(z.object({ diagnosticId: z.string(), paymentMethod: z.string() }))
    .mutation(async ({ input }) => {
      return { success: true };
    }),
});

export const appRouter = router({
  admin: adminRouter,
  diagnostic: diagnosticRouter,
  feedback: feedbackRouter,
  payment: paymentRouter,
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(async ({ ctx }) => {
      return ctx.user || null;
    }),
    logout: publicProcedure.mutation(() => ({
      success: true,
    })),
  }),
});

export type AppRouter = typeof appRouter;

