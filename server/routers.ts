import { z } from "zod";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import {
  createDiagnostic,
  getDiagnosticByPublicId,
  updateDiagnostic,
} from "./db";
import { calculatePillars } from "./sajo";

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
      const prompt = `Você é um ancião mestre SAJO (사주) coreano com 5.000 anos de sabedoria ancestral. Fale em português brasileiro com linguagem mística, poética e profunda. Use referências à natureza, à tradição coreana e ao xamanismo Musok.

Dados do consulente:
- Nome: ${name}
- Signo Animal: ${pillarsData.animalSign}
- Pilar do Dia (essência): ${pillarsData.dayPillar.stem.name} sobre ${pillarsData.dayPillar.branch.name}
- Elemento dominante: ${pillarsData.dominantElement}
- Traços de personalidade: ${pillarsData.personalityTraits.join(", ")}
- Pontos fortes: ${pillarsData.strengths.join(", ")}
- Desafios: ${pillarsData.challenges.join(", ")}
- Equilíbrio dos elementos: ${JSON.stringify(pillarsData.elementBalance)}

Escreva uma análise de degustação gratuita de 4-5 parágrafos que:
1. Saúde o consulente pelo nome e signo animal
2. Revele a essência do Pilar do Dia com metáforas poéticas
3. Descreva os traços de personalidade de forma mística
4. Mencione brevemente os desafios como oportunidades de crescimento
5. Convide para a análise completa sem ser agressivo

Use markdown para formatação (negrito para conceitos importantes). Não use emojis excessivos.`;

      let tastingAnalysis = "";
      try {
        const llmResponse = await invokeLLM({
          messages: [
            { role: "system", content: "Você é um mestre ancestral SAJO coreano. Responda sempre em português brasileiro com linguagem mística e poética." },
            { role: "user", content: prompt },
          ],
        });
        tastingAnalysis = (llmResponse.choices?.[0]?.message?.content as string) || "";
      } catch (err) {
        console.error("[LLM] Failed to generate tasting analysis:", err);
        tastingAnalysis = `Ó ${name}, alma nascida sob o signo do ${pillarsData.animalSign}! Os ancestrais revelam que sua essência é marcada pelo elemento **${pillarsData.dominantElement}**, trazendo ${pillarsData.personalityTraits[0]}. A análise completa aguarda para revelar os segredos mais profundos do seu destino.`;
      }

      await createDiagnostic({
        publicId,
        consultantName: input.consultantName || null,
        birthDate: input.birthDate,
        birthTime: input.birthTime,
        birthPlace: input.birthPlace,
        hasDst: input.hasDst ? 1 : 0,
        pillarsData: pillarsData as unknown as Record<string, unknown>,
        tastingAnalysis,
        paymentStatus: "pending",
      });

      // Notify owner of new diagnostic
      try {
        await notifyOwner({
          title: "✦ Novo Diagnóstico SAJO Criado",
          content: `Um novo consulente (${input.consultantName || "Anônimo"}) solicitou diagnóstico SAJO de ${input.birthPlace}. ID: ${publicId}`,
        });
      } catch (err) {
        console.warn("[Notification] Failed to notify owner of new diagnostic:", err);
      }

      return { publicId };
    }),

  getByPublicId: publicProcedure
    .input(z.object({ publicId: z.string() }))
    .query(async ({ input }) => {
      const diagnostic = await getDiagnosticByPublicId(input.publicId);
      if (!diagnostic) throw new TRPCError({ code: "NOT_FOUND", message: "Diagnóstico não encontrado" });
      return {
        publicId: diagnostic.publicId,
        consultantName: diagnostic.consultantName,
        pillarsData: diagnostic.pillarsData,
        tastingAnalysis: diagnostic.tastingAnalysis,
        basicAnalysis: diagnostic.basicAnalysis,
        fullAnalysis: diagnostic.fullAnalysis,
        paymentStatus: diagnostic.paymentStatus,
        createdAt: diagnostic.createdAt,
      };
    }),

  unlock: publicProcedure
    .input(z.object({ publicId: z.string() }))
    .mutation(async ({ input }) => {
      const diagnostic = await getDiagnosticByPublicId(input.publicId);
      if (!diagnostic) throw new TRPCError({ code: "NOT_FOUND" });

      const pillarsData = diagnostic.pillarsData as any;
      const name = diagnostic.consultantName || "Viajante";

      const basicPrompt = `Você é um mestre SAJO coreano. Escreva em português brasileiro uma análise básica dos 4 Pilares do Destino para ${name}.

Dados:
- Pilar do Ano: ${pillarsData?.yearPillar?.stem?.name} / ${pillarsData?.yearPillar?.branch?.name} — ${pillarsData?.yearPillar?.label}
- Pilar do Mês: ${pillarsData?.monthPillar?.stem?.name} / ${pillarsData?.monthPillar?.branch?.name} — ${pillarsData?.monthPillar?.label}
- Pilar do Dia: ${pillarsData?.dayPillar?.stem?.name} / ${pillarsData?.dayPillar?.branch?.name} — ${pillarsData?.dayPillar?.label}
- Pilar da Hora: ${pillarsData?.hourPillar?.stem?.name} / ${pillarsData?.hourPillar?.branch?.name} — ${pillarsData?.hourPillar?.label}
- Elemento dominante: ${pillarsData?.dominantElement}
- Equilíbrio Yin/Yang: ${JSON.stringify(pillarsData?.yinYangBalance)}

Escreva 3-4 parágrafos explicando o significado de cada pilar e como eles interagem na vida de ${name}. Use markdown para formatação.`;

      const fullPrompt = `Você é um mestre SAJO coreano e xamã Musok. Escreva em português brasileiro uma análise completa e profunda para ${name}.

Dados completos:
${JSON.stringify(pillarsData, null, 2)}

Escreva uma análise detalhada (6-8 parágrafos) cobrindo:
1. **Missão de Vida** — propósito ancestral revelado pelos pilares
2. **Saúde e Vitalidade** — foco em ${pillarsData?.healthFocus?.join(", ")}
3. **Finanças e Prosperidade** — caminhos de abundância segundo os elementos
4. **Relacionamentos e Amor** — compatibilidade com ${pillarsData?.compatibleSigns?.join(", ")}
5. **Direções Auspiciosas** — ${pillarsData?.luckyDirections?.join(", ")}
6. **Guia Xamânico** — práticas espirituais recomendadas pelo Musok
7. **Ciclos de Vida** — períodos favoráveis e desafiadores
8. **Mensagem Final** — sabedoria ancestral personalizada

Use markdown para formatação rica. Seja profundo, poético e específico.`;

      let basicAnalysis = "";
      let fullAnalysis = "";

      try {
        const [basicRes, fullRes] = await Promise.all([
          invokeLLM({ messages: [{ role: "system", content: "Mestre SAJO ancestral. Responda em português brasileiro." }, { role: "user", content: basicPrompt }] }),
          invokeLLM({ messages: [{ role: "system", content: "Mestre SAJO ancestral e xamã Musok. Responda em português brasileiro." }, { role: "user", content: fullPrompt }] }),
        ]);
        basicAnalysis = (basicRes.choices?.[0]?.message?.content as string) || "";
        fullAnalysis = (fullRes.choices?.[0]?.message?.content as string) || "";
      } catch (err) {
        console.error("[LLM] Failed to generate full analysis:", err);
        basicAnalysis = `A análise dos seus 4 Pilares revela uma alma com elemento dominante **${pillarsData?.dominantElement}**, trazendo ${pillarsData?.strengths?.[0] || "grande potencial"}.`;
        fullAnalysis = `Sua jornada ancestral é guiada pelo elemento **${pillarsData?.dominantElement}**. Os espíritos ancestrais revelam caminhos de prosperidade nas direções ${pillarsData?.luckyDirections?.join(", ")}.`;
      }

      await updateDiagnostic(input.publicId, {
        basicAnalysis,
        fullAnalysis,
        paymentStatus: "paid",
      });

      // Notify owner of successful payment
      try {
        await notifyOwner({
          title: "✦ Pagamento Recebido - Análise Desbloqueada",
          content: `${diagnostic.consultantName || "Consulente"} desbloqueou a análise completa. ID: ${input.publicId}. Valor: R$ 20,00`,
        });
      } catch (err) {
        console.warn("[Notification] Failed to notify owner of payment:", err);
      }

      return { success: true };
    }),
});

const paymentRouter = router({
  createPix: publicProcedure
    .input(z.object({ diagnosticId: z.string() }))
    .mutation(async () => {
      return {
        pixKey: "55 63 98438-1782",
        beneficiary: "FUSION-SAJO Diagnósticos Ancestrais",
        amount: 20.0,
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
});

export type AppRouter = typeof appRouter;
