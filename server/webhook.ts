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

    // Log payment method for debugging
    console.log(`[Webhook] Payment method: ${paymentDetails.paymentMethod}, type: ${paymentDetails.paymentType}`);

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
    const paymentMethodLabel = paymentDetails.paymentType === "pix" ? "PIX" : "Cartao";
    await notifyOwner({
      title: "✦ Pagamento Confirmado!",
      content: `Pagamento de R$ ${paymentDetails.amount} via ${paymentMethodLabel} foi confirmado. Analise desbloqueada para ${diagnosticRecord.consultantName || "Viajante"}. ID: ${paymentId}`,
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

    const diagnosticData = diagnostic.pillarsData as any;
    const name = diagnostic.consultantName || "Responsável";

    const prompt = `Você é um especialista em LGPD (Lei Geral de Proteção de Dados - Lei 13.709/2018) com amplo conhecimento em compliance, adequação e boas práticas de proteção de dados. Seu tom é claro, objetivo e orientado a soluções práticas. Fale em português brasileiro.

Dados do diagnóstico:
- Nome/Empresa: ${name}
- Módulo contratado: ${diagnosticData.module || "Diagnóstico Geral"}
- Informações adicionais: ${JSON.stringify(diagnosticData)}

Elabore um relatório de análise LGPD com 8-10 seções bem estruturadas:

1. **Resumo Executivo**: Visão geral do diagnóstico e principais pontos de atenção.
2. **Bases Legais Aplicáveis**: Identifique quais bases legais do Art. 7º são mais relevantes para o contexto.
3. **Obrigações do Controlador**: Liste as obrigações principais aplicáveis ao caso.
4. **Gaps Identificados**: Aponte os principais pontos de não conformidade ou riscos.
5. **Plano de Adequação Prioritário**: 3-5 ações imediatas recomendadas com ordem de prioridade.
6. **Documentação Necessária**: Liste os documentos e políticas que precisam ser criados ou revisados.
7. **Direitos dos Titulares**: Como estruturar o canal de atendimento para o contexto específico.
8. **Próximos Passos**: Roadmap claro com ações de curto, médio e longo prazo.

Use linguagem CLARA e ACESSÍVEL, com orientações PRÁTICAS e ACIONÁVEIS. Cite artigos da LGPD quando relevante.`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um especialista em LGPD e compliance de proteção de dados. Forneça análises claras, práticas e juridicamente embasadas. Português brasileiro.",
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
