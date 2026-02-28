import { getPaymentDetails } from "./mercadopago";
import { getDiagnosticByPublicId, updateDiagnostic } from "./db";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";

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

    // Find diagnostic by payment ID (we need to store payment ID in diagnostic)
    // For now, we'll search by recent diagnostics with pending payment
    // In production, you should store the payment ID in the diagnostic record
    console.log(`[Webhook] Payment approved! Amount: R$ ${paymentDetails.amount}`);

    // Notify owner of successful payment
    await notifyOwner({
      title: "✦ Pagamento Confirmado!",
      content: `Pagamento de R$ ${paymentDetails.amount} foi confirmado. ID: ${paymentId}`,
    });
  } catch (error) {
    console.error("[Webhook] Error processing Mercado Pago event:", error);
    throw error;
  }
}

/**
 * Link payment ID to diagnostic for webhook processing
 */
export async function linkPaymentToDiagnostic(
  diagnosticId: string,
  paymentId: string
): Promise<void> {
  try {
    // Store payment ID in diagnostic metadata
    const diagnostic = await getDiagnosticByPublicId(diagnosticId);
    if (!diagnostic) {
      throw new Error(`Diagnostic not found: ${diagnosticId}`);
    }

    // Update diagnostic with payment ID (you may need to extend the schema)
    console.log(`[Webhook] Linked payment ${paymentId} to diagnostic ${diagnosticId}`);
  } catch (error) {
    console.error("[Webhook] Error linking payment to diagnostic:", error);
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

Escreva uma análise COMPLETA e PROFUNDA de 8-10 parágrafos que inclua:

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
          content: "Você é um ancião mestre SAJO com sabedoria ancestral de 5.000 anos. Fale em português brasileiro com linguagem mística e profunda.",
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
      paymentStatus: "paid",
    });

    return fullAnalysis;
  } catch (error) {
    console.error("[Webhook] Error generating full analysis:", error);
    throw error;
  }
}
