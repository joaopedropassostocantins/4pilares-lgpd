import { z } from "zod";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import { sendEmailWithAnalysis } from "./_core/email";
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
import { createPaymentPreference, initMercadoPago, createPixPayment } from "./mercadopago";
import { authRouter } from "./_core/systemRouter";
import { createPaymentIntent, getCurrencyCode, getPrice } from "./stripe";
import { selectHooks, selectHooksByCategory } from "./hooksEngine_turbinado";
import type { Hook } from "./hooksEngine_turbinado";

// ============================================================================
// DORES ALEATORIAS PARA FECHAMENTO PERSUASIVO - DIRETO E POPULAR
// ============================================================================
const SPECIFIC_PAINS = [
  // CANSACO E ESGOTAMENTO
  {
    category: "Cansaco",
    pains: [
      "esse cansaco que voce sente todo dia, aquele que nem dormindo resolve",
      "aquele esgotamento profissional que voce nao consegue desligar, nem no fim de semana",
      "a sensacao de estar sempre cansado, sem energia pra nada, nem pra viver",
      "aquele cansaco mental que te deixa vazio, sem vontade de fazer nada",
      "o cansaco que vem de trabalhar demais e ganhar pouco, aquele que corroi a alma",
    ]
  },
  // ANSIEDADE E MEDO
  {
    category: "Ansiedade",
    pains: [
      "aquela ansiedade que nao deixa voce dormir, que te acorda no meio da noite com o peito acelerado",
      "o medo constante de que algo ruim vai acontecer, mesmo quando tudo esta bem",
      "aquela preocupacao que nao sai da sua cabeca, que te consome o tempo todo",
      "o panico que vem do nada e te paralisa, deixando voce sem ar",
      "aquele medo de nao ser bom o suficiente, de fracassar em tudo que tenta",
    ]
  },
  // RELACIONAMENTOS E SOLIDAO
  {
    category: "Relacionamentos",
    pains: [
      "aquela solidao que voce sente mesmo estando rodeado de gente",
      "o fim de um relacionamento que ainda doi, que deixou cicatrizes profundas",
      "a dificuldade de encontrar alguem que realmente te entenda e te ame de verdade",
      "os conflitos constantes com pessoas que voce ama, aqueles que machucam fundo",
      "o medo de ficar sozinho para o resto da vida, de morrer sem ter alguem do lado",
    ]
  },
  // DINHEIRO E CARREIRA
  {
    category: "Dinheiro",
    pains: [
      "aquele aperto no peito quando chega a conta, quando o dinheiro nao e suficiente",
      "a sensacao de estar preso numa carreira que nao te realiza, que te sufoca",
      "as brigas sobre dinheiro que estao destruindo seu relacionamento",
      "o medo de nao conseguir pagar as contas, de ficar na rua",
      "aquela divida que cresce todo mes e voce nao consegue pagar, que te sufoca",
    ]
  },
  // SAUDE E CORPO
  {
    category: "Saude",
    pains: [
      "aquele medo silencioso de ter uma doenca grave, de receber uma noticia ruim do medico",
      "o peso que voce carrega no corpo e que afeta sua autoestima todos os dias",
      "os sintomas fisicos do estresse que os medicos nao conseguem explicar",
      "aquela pressao alta, aquele coracao acelerado, aquele mal-estar constante",
      "a falta de energia, aquele corpo pesado que nao responde mais como antes",
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
        hookCategory: z.string().optional(),
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
         urgencyText = `Esta oferta de R$ 14,99 está disponível somente para os próximos 100 acessos que chegarem hoje — ${urgency.value}`;
      }

      // Build closing with pain variation
      const closingClosingPain = toneVariation === "soft" 
        ? `está sentindo um peso profundo relacionado a ${selectedPain}`
        : `está sofrendo profundamente com ${selectedPain}`;

      const prompt = `Você é um Mestre Ancestral de SAJO. Sua voz é profunda, assertiva, hipnótica — como alguém que enxerga o que ninguém vê e fala direto na alma.

Dados do consulente:
- Nome: ${name}
- Gênero: ${genderText}
- Signo Animal: ${pillarsData.animalSign}
- Pilar do Dia (essência): ${pillarsData.dayPillar.stem.name} sobre ${pillarsData.dayPillar.branch.name}
- Elemento dominante: ${pillarsData.dominantElement}
- Traços observáveis: ${pillarsData.personalityTraits.join(", ")}
- Pontos fortes: ${pillarsData.strengths.join(", ")}
- Padrões de risco: ${pillarsData.challenges.join(", ")}

Você vai entregar a DEGUSTAÇÃO GRATUITA. A análise DEVE ter EXATAMENTE 2 PARTES separadas pelo marcador ===CORTE_AQUI===

A análise deve conter 5 ELEMENTOS OBRIGATÓRIOS (todos devem aparecer):
1. Maldição/carma familiar ou doença energética (OBRIGATÓRIO na Parte 1)
2. Traições/quebras de confiança ou inveja/olho grande (OBRIGATÓRIO na Parte 1)
3. Bloqueio financeiro grave ligado a padrão ancestral (na Parte 2 - OCULTO)
4. Espírito/obsessor ou influência energética negativa de terceiro (na Parte 2 - OCULTO)
5. Ciclo de repetição em relacionamentos com camada oculta perigosa (na Parte 2 - OCULTO)

=== PARTE 1 (VISÍVEL - o usuário vê esta parte) ===
Estrutura (6-8 parágrafos):
1. Revelação dos 4 Pilares (formato simbólico: "Ano do [Elemento-Animal] • Mês do [Elemento-Animal] • Dia do [Elemento-Animal] • Hora do [Elemento-Animal]")
2. Abertura cirúrgica (1-2 frases que "acertam em cheio") + pergunta de checagem
3. REVELAR Elemento 1: Maldição/carma familiar OU doença energética (detalhado, com eventos específicos, tom condicional para saúde)
4. REVELAR Elemento 2: Traições/inveja (detalhado, com palavras-chave pessoais)
5. ALERTA GRAVE: Após revelar os 2 elementos, escreva um parágrafo FORTE dizendo:
   "Mas ${name}, preciso ser honesto com você. Nos seus Pilares apareceram mais 3 padrões que eu NÃO POSSO revelar aqui na degustação. São padrões GRAVES. Um deles envolve uma influência energética de terceiro que está agindo sobre você neste exato momento. Outro mostra um bloqueio financeiro ancestral que explica por que seu dinheiro some sem explicação. E o terceiro... é o mais delicado de todos — envolve um ciclo de repetição nos seus relacionamentos que, se não for interrompido, vai se intensificar nos próximos meses. Esses 3 padrões são urgentes e precisam de atenção imediata. Só posso revelá-los na análise completa."

Depois do alerta, escreva o marcador: ===CORTE_AQUI===

=== PARTE 2 (OCULTA - coberta por blur/cadeado, só visível após pagamento) ===
Estrutura (6-8 parágrafos):
1. Revelar Elemento 3: Bloqueio financeiro grave (detalhado, com especificidade)
2. Revelar Elemento 4: Espírito/obsessor ou influência energética (tom condicional, observação)
3. Revelar Elemento 5: Ciclo de repetição em relacionamentos (camada oculta perigosa)
4. Predições condicionais sobre saúde/família
5. Caminho de correção e ações ancestrais
6. Fechamento com urgência

REGRAS ABSOLUTAS:
- Português brasileiro fluente, hipnótico, direto
- Cada frase deve fazer a pessoa sentir que você leu a mente dela
- Use detalhes que pareçam extraídos da vida real dela
- NUNCA use: "universo conspira", "jornada interior", "talvez você precise", "vai mudar sua vida"
- NUNCA use porcentagens ("80%", "100%")
- Para saúde/filhos/espíritos: SEMPRE use tom condicional ("pode estar", "há indícios de")
- O marcador ===CORTE_AQUI=== DEVE aparecer EXATAMENTE UMA VEZ, separando as duas partes
- A Parte 1 deve terminar com o alerta grave sobre os 3 padrões ocultos
- A Parte 2 deve começar revelando os 3 padrões que foram mencionados como ocultos`;

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

      // Select hooks for this diagnostic
      const selectedHooksData = input.hookCategory
        ? selectHooksByCategory(
            input.hookCategory,
            input.gender || "",
            input.birthDate,
            4
          )
        : selectHooks(
            input.gender || "",
            input.birthDate,
            4 // Select 4 hooks
          );

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
        selectedHooks: selectedHooksData.hooks as any,
        selectedVariants: selectedHooksData.selectedVariants as any,
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

      return { 
        publicId, 
        diagnostic, 
        abTestVariant: input.abTestVariant || "A",
        selectedHooks: selectedHooksData.hooks,
        selectedVariants: selectedHooksData.selectedVariants,
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

      // Send email with full analysis if email is available
      if (diagnostic.email) {
        await sendEmailWithAnalysis(
          diagnostic.email,
          diagnostic.consultantName || "Viajante",
          fullAnalysis,
          "full"
        );
      }

      // Notify owner of payment
      await notifyOwner({
        title: "Novo Pagamento Confirmado",
        content: `${diagnostic.consultantName} desbloqueou analise completa. Email: ${diagnostic.email || "N/A"}`,
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

  // Create PIX payment and return QR code
  createPixPayment: publicProcedure
    .input(
      z.object({
        diagnosticPublicId: z.string(),
        amount: z.number().default(29.99),
      })
    )
    .mutation(async ({ input }) => {
      const diagnostic = await getDiagnosticByPublicId(input.diagnosticPublicId);
      if (!diagnostic) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Diagnostic not found" });
      }

      const pixPayment = await createPixPayment({
        diagnosticId: diagnostic.publicId,
        userEmail: diagnostic.email || `user-${input.diagnosticPublicId}@fusion-sajo.com`,
        userName: diagnostic.consultantName || "Viajante",
        amount: input.amount,
      });

      if (pixPayment.paymentId) {
        await updateDiagnostic(diagnostic.publicId, {
          paymentId: String(pixPayment.paymentId),
        });
      }

      console.log("[Mercado Pago PIX] Payment created:", {
        paymentId: pixPayment.paymentId,
        qrCode: pixPayment.qrCode ? "present" : "missing",
        copyAndPaste: pixPayment.copyAndPaste ? "present" : "missing",
      });

      return pixPayment;
    }),

  // ========================================================================
  // STRIPE PAYMENT PROCEDURES (International)
  // ========================================================================
  createStripePayment: publicProcedure
    .input(
      z.object({
        diagnosticPublicId: z.string(),
        plan: z.enum(["promotional", "normal", "lifetime"]),
        countryCode: z.string().default("BR"),
        userEmail: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const diagnostic = await getDiagnosticByPublicId(input.diagnosticPublicId);
        if (!diagnostic) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Diagnostic not found" });
        }

        // Get price for the plan and country
        const amount = getPrice(input.countryCode, input.plan);
        const currency = getCurrencyCode(input.countryCode);

        // Create Stripe payment intent
        const paymentIntent = await createPaymentIntent(
          amount,
          currency,
          input.countryCode,
          diagnostic.publicId,
          input.userEmail || diagnostic.email || undefined
        );

        // Store payment intent ID in diagnostic
        await updateDiagnostic(diagnostic.publicId, {
          paymentId: paymentIntent.id,
          paymentStatus: "pending",
        });

        console.log("[Stripe] Payment intent created:", {
          paymentIntentId: paymentIntent.id,
          amount,
          currency,
          country: input.countryCode,
          plan: input.plan,
        });

        return {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amount,
          currency,
        };
      } catch (error) {
        console.error("[Stripe] Error creating payment intent:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create payment intent",
        });
      }
    }),

  // Confirm Stripe payment (called after successful card payment)
  confirmStripePayment: publicProcedure
    .input(
      z.object({
        diagnosticPublicId: z.string(),
        paymentIntentId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const diagnostic = await getDiagnosticByPublicId(input.diagnosticPublicId);
        if (!diagnostic) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Diagnostic not found" });
        }

        // Mark diagnostic as paid
        await updateDiagnostic(diagnostic.publicId, {
          paymentStatus: "paid",
        });

        // Send email with analysis if email is available
        if (diagnostic.email) {
          await sendEmailWithAnalysis(
            diagnostic.email,
            diagnostic.consultantName || "Viajante",
            diagnostic.fullAnalysis || "Analise em processamento",
            "full"
          );
        }

        // Notify owner
        await notifyOwner({
          title: "Novo Pagamento Stripe Confirmado",
          content: `Pagamento confirmado para ${diagnostic.consultantName}\nID: ${input.paymentIntentId}`,
        });

        console.log("[Stripe] Payment confirmed:", {
          diagnosticId: diagnostic.publicId,
          paymentIntentId: input.paymentIntentId,
        });

        return { success: true, diagnosticId: diagnostic.publicId };
      } catch (error) {
        console.error("[Stripe] Error confirming payment:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to confirm payment",
        });
      }
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
