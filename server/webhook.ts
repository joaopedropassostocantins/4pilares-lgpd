import { getPaymentDetails } from "./mercadopago";
import { getDiagnosticByPublicId, updateDiagnostic, getDb } from "./db";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import { sendEmailWithAnalysis } from "./_core/email";
import { sendPaymentConfirmationWhatsApp, formatPhoneForWhatsApp } from "./whatsappBaileys";
import { diagnostics } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Process Mercado Pago webhook event
 * Called when payment status changes (approved, pending, rejected, etc)
 */
export async function processMercadoPagoWebhook(event: {
  action: string;
  data: {
    id: string;
  };
  type: string;
}): Promise<void> {
  try {
    // Only process payment updates
    if (event.type !== "payment" || event.action !== "payment.updated") {
      console.log(`[Webhook] Ignoring event type: ${event.type}, action: ${event.action}`);
      return;
    }

    const paymentId = event.data.id;
    console.log(`[Webhook] Processing payment: ${paymentId}`);

    // Get payment details from Mercado Pago
    const paymentDetails = await getPaymentDetails(paymentId);
    console.log(`[Webhook] Payment status: ${paymentDetails.status}`);

    // Only process approved payments
    if (paymentDetails.status !== "approved") {
      console.log(`[Webhook] Payment not approved, status: ${paymentDetails.status}`);
      return;
    }

    // Find diagnostic by payment ID
    const db = await getDb();
    if (!db) {
      console.error("[Webhook] Database not available");
      return;
    }

    const diagnostic = await db
      .select()
      .from(diagnostics)
      .where(eq(diagnostics.paymentId, paymentId))
      .limit(1);

    if (!diagnostic || diagnostic.length === 0) {
      console.error(`[Webhook] Diagnostic not found for payment: ${paymentId}`);
      return;
    }

    const diagnosticRecord = diagnostic[0];
    console.log(`[Webhook] Found diagnostic: ${diagnosticRecord.publicId}`);

    // Generate full analysis
    const fullAnalysis = await generateFullAnalysisOnPayment(diagnosticRecord.publicId);

    // Send analysis via email if email is available
    if (diagnosticRecord.email) {
      await sendEmailWithAnalysis(
        diagnosticRecord.email,
        diagnosticRecord.consultantName || "Viajante",
        fullAnalysis,
        "full"
      );
      // Update emailSentAt timestamp
      await updateDiagnostic(diagnosticRecord.publicId, {
        emailSentAt: new Date(),
      });
    }

    // Send analysis via WhatsApp if phone is available
    if (diagnosticRecord.whatsappPhone) {
      try {
        const formattedPhone = formatPhoneForWhatsApp(diagnosticRecord.whatsappPhone);
        const success = await sendPaymentConfirmationWhatsApp(
          formattedPhone,
          diagnosticRecord.consultantName || "Viajante",
          diagnosticRecord.publicId
        );
        if (success) {
          console.log(`[Webhook] WhatsApp sent to ${formattedPhone}`);
          await updateDiagnostic(diagnosticRecord.publicId, {
            whatsappSentAt: new Date(),
          });
        } else {
          console.warn(`[Webhook] Failed to send WhatsApp to ${formattedPhone}`);
        }
      } catch (error) {
        console.error(`[Webhook] Error sending WhatsApp:`, error);
      }
    }

    // Update payment status
    await updateDiagnostic(diagnosticRecord.publicId, {
      paymentStatus: "paid",
    });

    console.log(`[Webhook] Payment confirmed and analysis generated for: ${diagnosticRecord.publicId}`);

    // Notify owner of successful payment
    await notifyOwner({
      title: "✦ Pagamento Confirmado!",
      content: `Pagamento de R$ ${paymentDetails.amount} foi confirmado. Análise desbloqueada para ${diagnosticRecord.consultantName || "Viajante"}. ID: ${paymentId}`,
    });
  } catch (error) {
    console.error("[Webhook] Error processing Mercado Pago event:", error);
    throw error;
  }
}

/**
 * Generate full analysis when payment is confirmed
 */
export async function generateFullAnalysisOnPayment(diagnosticId: string): Promise<string> {
  try {
    const diagnostic = await getDiagnosticByPublicId(diagnosticId);
    if (!diagnostic) {
      throw new Error(`Diagnostic not found: ${diagnosticId}`);
    }

    const pillarsData = diagnostic.pillarsData as any;
    const name = diagnostic.consultantName || "Viajante";

    const prompt = `Você é um especialista em SAJO (사주) coreano com profundo conhecimento de padrões de destino. Seu tom é assertivo, contundente e transformador — com afirmações concretas sobre presente e futuro. Fale em português brasileiro.

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

Escreva uma análise COMPLETA e PROFUNDA de 10-12 parágrafos com AFIRMAÇÕES CONCRETAS:

1. **Saudação Assertiva**: Saúde o consulente pelo nome e signo animal com uma afirmação contundente sobre sua essência.
2. **Análise dos 4 Pilares**: Descreva cada pilar com significado profundo e afirmações sobre o que ESTÁ ACONTECENDO agora.
3. **Essência do Ser**: Revele a essência do Pilar do Dia com clareza e contundência.
4. **Missão de Vida**: Descreva a jornada e propósito de vida com afirmações concretas.
5. **Saúde e Vitalidade**: Analise o equilíbrio dos 5 elementos com recomendações específicas.
6. **Finanças e Abundância**: Previsões CONCRETAS sobre ciclos financeiros e oportunidades.
7. **Relacionamentos e Amor**: Análise de compatibilidade com afirmações sobre dinâmicas relacionais.
8. **Guia Prático**: Ofereça sabedoria ancestral e práticas concretas para harmonização.
9. **Ciclos Temporais**: Descreva ciclos de 10 anos (Grandes Ciclos) e transformações iminentes.
10. **Encerramento Empoderador**: Termine com afirmações de força e empoderamento.

Use linguagem ASSERTIVA, CONTUNDENTE, com afirmações sobre PRESENTE e FUTURO. Evite especulação. Seja direto e transformador.`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um especialista em SAJO com conhecimento profundo. Fale com assertividade, contundência e certeza. Português brasileiro.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const fullAnalysis =
      typeof response.choices[0].message.content === "string"
        ? response.choices[0].message.content
        : "";

    // Update diagnostic with full analysis
    await updateDiagnostic(diagnosticId, {
      fullAnalysis,
      basicAnalysis: fullAnalysis,
    });

    return fullAnalysis;
  } catch (error) {
    console.error("[Webhook] Error generating full analysis:", error);
    throw error;
  }
}
