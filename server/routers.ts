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
import { authRouter } from "./_core/systemRouter";

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
      const genderText = input.gender === "male" ? "masculino" : input.gender === "female" ? "feminino" : "nao informado";
      
      const prompt = `Voce eh um Mestre Ancestral de SAJO, guardiao de uma sabedoria coreana de mais de 5.000 anos que le os 4 Pilares do destino com precisao cirurgica. Sua voz eh calma, profunda, compassiva e ao mesmo tempo autoritaria — como um anciao sabio que enxerga atraves da alma da pessoa, sem julgamento, mas com clareza absoluta.

Dados do consulente:
- Nome: ${name}
- Genero: ${genderText}
- Signo Animal: ${pillarsData.animalSign}
- Pilar do Dia (essencia): ${pillarsData.dayPillar.stem.name} sobre ${pillarsData.dayPillar.branch.name}
- Elemento dominante: ${pillarsData.dominantElement}
- Tracos observaveis: ${pillarsData.personalityTraits.join(", ")}
- Pontos fortes: ${pillarsData.strengths.join(", ")}
- Padroes de risco: ${pillarsData.challenges.join(", ")}

Voce vai entregar a DEGUSTACAO GRATUITA: uma analise teaser curta, impactante e reveladora que mostra:

1. Os 4 Pilares revelados (em formato bonito e simbolico)
2. Um insight poderoso sobre a essencia da personalidade / energia dominante
3. Um teaser emocional sobre amor/relacionamentos
4. Um teaser sobre carreira/dinheiro
5. Um teaser sobre saude/vitalidade

Escreva em portugues fluente, poetico, acolhedor e misterioso. Use linguagem que faca a pessoa sentir que voce sabe tudo sobre sua vida.

IMPORTANTE: Termine SEMPRE com um fechamento persuasivo que simule uma revelacao intima sobre a angustia que levou a pessoa a buscar voce. Escolha UMA dor concreta (baseada em padroes SAJO, mas apresentada como 100% especifica):

Estrutura do fechamento:
"Eu vejo claramente nos seus Pilares o peso que voce carrega agora. Sei exatamente por que voce chegou ate aqui hoje... sei que me procurou porque esta profundamente angustiado(a) com [INSIRA UMA DOR CONCRETA EM 8-15 PALAVRAS].

Essa dor nao eh acaso — ela esta escrita nos seus Pilares e tem um motivo ancestral. A boa noticia? Existe um caminho preciso para atravessar isso e transformar essa angustia em forca, abundancia e paz.

Efetue o pagamento agora (apenas R$ 9,99 na promocao atual) para desbloquear a analise completa e detalhada dos seus 4 Pilares — com previsoes exatas para amor, carreira, saude, ciclos de sorte nos proximos 12–24 meses e, principalmente, o que voce precisa fazer AGORA para virar esse jogo.

Nao deixe essa dor decidir seu futuro por mais um dia. Clique em 'Desbloquear tudo' e receba sua resposta completa em segundos. Estou aqui esperando para guiar voce."`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Voce eh um Mestre Ancestral de SAJO. Fale com sabedoria, compaixao e autoridade. Portugues brasileiro fluente.",
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
        title: "Novo Diagnostico Criado",
        content: `${name} iniciou analise SAJO. Signo: ${pillarsData.animalSign}`,
      });

      return { publicId, diagnostic };
    }),

  getByPublicId: publicProcedure
    .input(z.object({ publicId: z.string() }))
    .query(async ({ input }) => {
      const diagnostic = await getDiagnosticByPublicId(input.publicId);
      if (!diagnostic) throw new TRPCError({ code: "NOT_FOUND" });
      return diagnostic;
    }),

  updatePaymentStatus: publicProcedure
    .input(z.object({ publicId: z.string(), paymentStatus: z.enum(["pending", "paid"]) }))
    .mutation(async ({ input }) => {
      return updateDiagnostic(input.publicId, { paymentStatus: input.paymentStatus });
    }),
});

const paymentRouter = router({
  createPreference: publicProcedure
    .input(
      z.object({
        diagnosticPublicId: z.string(),
        amount: z.number().default(9.99),
      })
    )
    .mutation(async ({ input }) => {
      const diagnostic = await getDiagnosticByPublicId(input.diagnosticPublicId);
      if (!diagnostic) throw new TRPCError({ code: "NOT_FOUND", message: "Diagnostic not found" });

      initMercadoPago();
      const preference = await createPaymentPreference({
        diagnosticId: input.diagnosticPublicId,
        userEmail: diagnostic.email || "usuario@exemplo.com",
        userName: diagnostic.consultantName || "Viajante",
        amount: input.amount,
        returnUrl: `https://pilaresdasabedoria.club/resultado/${input.diagnosticPublicId}`,
      });

      if (preference?.preferenceId) {
        await updateDiagnostic(input.diagnosticPublicId, { paymentId: preference.preferenceId });
      }

      return { preferenceId: preference?.preferenceId };
    }),
});

const feedbackRouter = router({
  create: publicProcedure
    .input(
      z.object({
        diagnosticId: z.number(),
        accuracy: z.enum(["very_accurate", "accurate", "neutral", "inaccurate", "very_inaccurate"]),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return createFeedback(input);
    }),

  getByDiagnosticId: publicProcedure
    .input(z.object({ diagnosticId: z.number() }))
    .query(async ({ input }) => {
      return getFeedbackByDiagnosticId(input.diagnosticId);
    }),

  getStats: publicProcedure.query(async () => {
    return getAccuracyStats();
  }),
});

export const appRouter = router({
  admin: adminRouter,
  diagnostic: diagnosticRouter,
  payment: paymentRouter,
  feedback: feedbackRouter,
  system: systemRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
