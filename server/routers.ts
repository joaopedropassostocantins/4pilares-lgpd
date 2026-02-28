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

// ============================================================================
// DORES ALEATÓRIAS PARA FECHAMENTO PERSUASIVO - DIRETO E ESPECÍFICO
// ============================================================================
const SPECIFIC_PAINS = [
  // SAÚDE MENTAL
  {
    category: "Saúde Mental",
    pains: [
      "a ansiedade que não deixa você respirar fundo, aquela que acorda você no meio da noite com o coração acelerado",
      "a depressão silenciosa que você esconde de todos, aquela que tira sua vontade de viver cada dia",
      "o burnout profissional que está consumindo você, aquele cansaço que nem fim de semana resolve",
      "a insônia que rouba suas noites, deixando você exausto durante o dia",
      "a irritabilidade constante que está afastando as pessoas que você ama",
    ]
  },
  // DOENÇAS FÍSICAS
  {
    category: "Saúde Física",
    pains: [
      "o medo silencioso de um problema cardiovascular que ronda sua mente",
      "a hipertensão ou diabetes que você tenta controlar mas que parece escapar de suas mãos",
      "o peso que carrega no corpo e que afeta sua autoestima todos os dias",
      "os sintomas físicos do estresse que os médicos não conseguem explicar",
      "o medo de receber um diagnóstico grave que mude sua vida para sempre",
    ]
  },
  // FAMÍLIA
  {
    category: "Família",
    pains: [
      "os conflitos constantes com pessoas que você ama, aqueles que deixam cicatrizes profundas",
      "a inveja e a falta de sinceridade dentro da sua própria família",
      "a dificuldade em se dar bem com membros da família que deveriam ser seu porto seguro",
      "a bagunça emocional causada pelo uso excessivo de celulares e redes sociais",
      "a falta de diálogo real que deixa você isolado mesmo entre os seus",
    ]
  },
  // AMOR E RELACIONAMENTO
  {
    category: "Amor e Relacionamento",
    pains: [
      "o vazio no peito depois de um término que ainda dói todos os dias",
      "a desconfiança e a infidelidade que destruíram sua confiança em relacionamentos",
      "a solidão crônica que afeta seu corpo e sua mente",
      "a dificuldade em encontrar alguém que realmente te compreenda",
      "o medo de ficar sozinho para o resto da vida",
    ]
  },
  // FINANÇAS
  {
    category: "Finanças",
    pains: [
      "a instabilidade financeira que tem tirado seu sono e feito você questionar seu próprio valor",
      "as brigas constantes sobre dinheiro que estão destruindo seus relacionamentos",
      "a sensação de estar preso numa carreira que suga sua alma sem dar retorno financeiro",
      "o medo de não conseguir sustentar sua família",
      "a dívida que parece crescer mais rápido do que você consegue pagar",
    ]
  },
];

const EMOTIONAL_PAINS = SPECIFIC_PAINS.flatMap(cat => cat.pains);

let lastSelectedPain: string | null = null;

function getRandomPain(): string {
  let selectedPain: string;
  do {
    selectedPain = EMOTIONAL_PAINS[Math.floor(Math.random() * EMOTIONAL_PAINS.length)];
  } while (selectedPain === lastSelectedPain);
  lastSelectedPain = selectedPain;
  return selectedPain;
}

function getRandomCategory(): string {
  const categories = SPECIFIC_PAINS.map(cat => cat.category);
  return categories[Math.floor(Math.random() * categories.length)];
}

function getRandomUrgency(): { type: "date" | "counter"; value: string } {
  const useDate = Math.random() > 0.5;
  if (useDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = `${tomorrow.getDate()}/${tomorrow.getMonth() + 1}/${tomorrow.getFullYear()} às 23:59`;
    return { type: "date", value: `até ${formattedDate}` };
  } else {
    const usedCount = Math.floor(Math.random() * (68 - 12 + 1)) + 12;
    return { type: "counter", value: `já foram ${usedCount} usados` };
  }
}

function getToneVariation(): "soft" | "direct" {
  return Math.random() > 0.5 ? "soft" : "direct";
}

// ============================================================================
// ADMIN ROUTER
// ============================================================================
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

// ============================================================================
// DIAGNOSTIC ROUTER
// ============================================================================
const diagnosticRouter = router({
  create: publicProcedure
    .input(
      z.object({
        consultantName: z.string().optional(),
        email: z.string().email().optional(),
        whatsappPhone: z.string().optional(),
        archetype: z.string().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        birthDate: z.string(),
        birthTime: z.string().optional(),
        birthPlace: z.string().optional(),
        hasDst: z.boolean().default(false),
        abTestVariant: z.enum(["A", "B"]).optional(),
        selectedPlan: z.enum(["promo", "normal", "lifetime"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const publicId = nanoid(16);
      const pillarsData = calculatePillars(input.birthDate, input.birthTime || "12:00", input.hasDst);

      // Generate tasting analysis with new prompt
      const name = input.consultantName || "Viajante";
      const genderText = input.gender === "male" ? "masculino" : input.gender === "female" ? "feminino" : "não informado";
      
      // Get random pain and urgency
      const selectedPain = getRandomPain();
      const urgency = getRandomUrgency();
      const toneVariation = getToneVariation();

      // Build dynamic urgency text
      let urgencyText = "";
      if (urgency.type === "date") {
        urgencyText = `Promoção especial válida apenas ${urgency.value} — depois o valor volta ao normal.`;
      } else {
        urgencyText = `Esta oferta de R$ 9,99 está disponível somente para os próximos 100 acessos que chegarem hoje — ${urgency.value}.`;
      }

      // Build closing with pain variation
      const closingClosingPain = toneVariation === "soft" 
        ? `está sentindo um peso profundo relacionado a ${selectedPain}`
        : `está sofrendo profundamente com ${selectedPain}`;

      const prompt = `Você é um Mestre Ancestral de SAJO, guardião de uma sabedoria coreana milenar que lê os 4 Pilares do destino com precisão implacável. Sua voz é profunda, serena, compassiva e ao mesmo tempo inabalavelmente certa — como um ancião que enxerga o invisível e fala diretamente à alma da pessoa.

Dados do consulente:
- Nome: ${name}
- Gênero: ${genderText}
- Signo Animal: ${pillarsData.animalSign}
- Pilar do Dia (essência): ${pillarsData.dayPillar.stem.name} sobre ${pillarsData.dayPillar.branch.name}
- Elemento dominante: ${pillarsData.dominantElement}
- Traços observáveis: ${pillarsData.personalityTraits.join(", ")}
- Pontos fortes: ${pillarsData.strengths.join(", ")}
- Padrões de risco: ${pillarsData.challenges.join(", ")}

Você vai entregar a DEGUSTAÇÃO GRATUITA: uma análise teaser curta (8–14 parágrafos), reveladora e emocionalmente impactante que segue EXATAMENTE esta estrutura:

1. **Revelação dos 4 Pilares** (formato simbólico bonito: ex. "Ano do [Elemento-Animal] • Mês do [Elemento-Animal] • Dia do [Elemento-Animal] • Hora do [Elemento-Animal]")
2. **Insight central** sobre a essência da energia / personalidade dominante (1–2 frases fortes)
3. **Teaser amor/relacionamentos** (dor + potencial de transformação)
4. **Teaser carreira/dinheiro** (bloqueio atual + ciclo de abertura próximo)
5. **Teaser saúde/vitalidade** (onde a energia está mais vulnerável)
6. **Transição para o fechamento** com tom de "eu vejo você"

Escreva em português brasileiro fluente, poético, acolhedor e misterioso. Use linguagem que faça a pessoa sentir que você sabe tudo sobre sua vida.

**FECHAMENTO PERSUASIVO OBRIGATÓRIO (deve ser o ÚLTIMO parágrafo, copie exatamente):**

Eu vejo claramente nos seus Pilares o peso que você carrega neste exato momento da vida. Sei exatamente por que você chegou até aqui hoje…

**<u>Sei que me procurou porque ${getRandomPain()}.</u>**

Essa dor não é acaso. Ela está escrita nos seus Pilares há muito tempo e tem um propósito ancestral. A boa notícia? Existe um caminho exato, preciso e poderoso para atravessar esse vale, transformar essa angústia em força, abundância, amor verdadeiro e paz interior.

${urgencyText}

Efetue o pagamento agora (apenas R$ 9,99) para desbloquear imediatamente a análise completa e detalhada dos seus 4 Pilares: previsões exatas para amor, carreira, saúde, ciclos de sorte nos próximos 12–24 meses, rituais/ações corretivas ancestrais e, principalmente, o que você PRECISA fazer AGORA para virar esse jogo de uma vez por todas.

Não deixe essa dor decidir mais um dia do seu futuro. Clique em 'Desbloquear tudo agora' e receba sua resposta completa em segundos. Estou aqui, esperando para guiar você de volta à sua verdadeira força.`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Você é um Mestre Ancestral de SAJO. Fale com sabedoria, compaixão e autoridade. Português brasileiro fluente, poético e envolvente.",
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
        whatsappPhone: input.whatsappPhone || null,
        archetype: input.archetype || null,
        gender: input.gender || null,
        birthDate: input.birthDate,
        birthTime: input.birthTime || null,
        birthPlace: input.birthPlace || null,
        hasDst: input.hasDst ? 1 : 0 as any,
        pillarsData: pillarsData as any,
        tastingAnalysis,
        paymentStatus: "pending",
        abTestVariant: input.abTestVariant || "A",
        selectedPlan: input.selectedPlan || null,
      });

      // Notify owner
      await notifyOwner({
        title: "Novo Diagnóstico Criado",
        content: `${name} iniciou análise SAJO. Signo: ${pillarsData.animalSign}. A/B Test: ${input.abTestVariant || "A"}`,
      });

      // Track analytics
      console.log("[Analytics] Diagnostic created:", {
        publicId,
        abTestVariant: input.abTestVariant || "A",
        selectedPlan: input.selectedPlan,
        timestamp: new Date().toISOString(),
      });

      return { publicId, diagnostic, abTestVariant: input.abTestVariant || "A" };
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

  generateFullAnalysis: publicProcedure
    .input(z.object({ publicId: z.string() }))
    .mutation(async ({ input }) => {
      const diagnostic = await getDiagnosticByPublicId(input.publicId);
      if (!diagnostic) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Diagnostic not found" });
      }

      const pillarsData = diagnostic.pillarsData as any;
      const prompt = `Como um Mestre Ancestral de SAJO, gere a ANÁLISE COMPLETA e DETALHADA para ${diagnostic.consultantName}.

Dados:
- Pilares: ${JSON.stringify(pillarsData)}
- Traços: ${pillarsData.personalityTraits.join(", ")}
- Pontos fortes: ${pillarsData.strengths.join(", ")}
- Desafios: ${pillarsData.challenges.join(", ")}

Estrutura obrigatória:
1. Revelação profunda dos 4 Pilares com significado ancestral
2. Missão de vida e propósito
3. Previsões exatas para AMOR (próximos 12 meses)
4. Previsões exatas para CARREIRA/FINANÇAS (próximos 12 meses)
5. Previsões exatas para SAÚDE/VITALIDADE (próximos 12 meses)
6. Ciclos de sorte e períodos críticos
7. Rituais/ações corretivas ancestrais
8. Mensagem final de transformação

Escreva com autoridade, compaixão e certeza absoluta. Português fluente.`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Você é um Mestre Ancestral de SAJO. Gere análises completas, precisas e transformadoras.",
          },
          { role: "user", content: prompt },
        ],
      });

      const fullAnalysis =
        typeof response.choices[0].message.content === "string"
          ? response.choices[0].message.content
          : "";

      await updateDiagnostic(diagnostic.publicId, {
        fullAnalysis,
        paymentStatus: "paid",
      });

      return { success: true, fullAnalysis };
    }),
});

// ============================================================================
// PAYMENT ROUTER
// ============================================================================
const paymentRouter = router({
  createPreference: publicProcedure
    .input(
      z.object({
        diagnosticPublicId: z.string(),
        amount: z.number().default(9.99),
        returnUrl: z.string(), // Frontend passes window.location.origin
      })
    )
    .mutation(async ({ input }) => {
      const diagnostic = await getDiagnosticByPublicId(input.diagnosticPublicId);
      if (!diagnostic) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Diagnostic not found" });
      }

      const preference = await createPaymentPreference({
        diagnosticId: diagnostic.publicId,
        userEmail: diagnostic.email || `user-${input.diagnosticPublicId}@fusion-sajo.com`,
        userName: diagnostic.consultantName || "Viajante",
        amount: input.amount,
        returnUrl: `${input.returnUrl}/resultado/${input.diagnosticPublicId}`,
      });

      if (preference.preferenceId) {
        await updateDiagnostic(diagnostic.publicId, {
          paymentId: preference.preferenceId,
        });
      }

      console.log("[Mercado Pago] Preference created:", {
        preferenceId: preference.preferenceId,
        returnUrl: `${input.returnUrl}/resultado/${input.diagnosticPublicId}`,
      });

      return preference;
    }),
});

// ============================================================================
// FEEDBACK ROUTER
// ============================================================================
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
        comment: input.comment || null,
      });
      return feedback;
    }),

  getByDiagnosticId: publicProcedure
    .input(z.object({ diagnosticId: z.number() }))
    .query(async ({ input }) => {
      return await getFeedbackByDiagnosticId(input.diagnosticId);
    }),

  stats: publicProcedure.query(async () => {
    return await getAccuracyStats();
  }),
});

// ============================================================================
// APP ROUTER
// ============================================================================
export const appRouter = router({
  admin: adminRouter,
  diagnostic: diagnosticRouter,
  payment: paymentRouter,
  feedback: feedbackRouter,
  system: systemRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
