import { getDb } from "./db";
import { subscriptions } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import axios from "axios";
import { ENV } from "./_core/env";
import crypto from "crypto";

/**
 * Validar assinatura HMAC do webhook
 */
export function validateWebhookSignature(
  body: string,
  xSignature: string,
  xRequestId: string
): boolean {
  try {
    const parts = xSignature.split(",");
    const signatureData = parts.reduce((acc, part) => {
      const [key, value] = part.split("=");
      acc[key?.trim()] = value?.trim();
      return acc;
    }, {} as Record<string, string>);

    const ts = signatureData.ts;
    const v1 = signatureData.v1;

    if (!ts || !v1) {
      console.log("❌ Assinatura inválida: faltam ts ou v1");
      return false;
    }

    const manifest = `${xRequestId}.${ts}.${body}`;
    const hmac = crypto
      .createHmac("sha256", ENV.mercadoPagoWebhookSecret)
      .update(manifest)
      .digest("hex");

    const isValid = hmac === v1;
    if (!isValid) {
      console.log("❌ Assinatura HMAC inválida");
    }
    return isValid;
  } catch (error) {
    console.error("❌ Erro ao validar assinatura:", error);
    return false;
  }
}

/**
 * Buscar detalhes do pagamento na API do Mercado Pago
 */
async function fetchPaymentDetails(paymentId: number) {
  try {
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${ENV.mercadoPagoAccessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Erro ao buscar pagamento ${paymentId}:`, error);
    throw error;
  }
}

/**
 * Processar webhook do Mercado Pago com reconciliação
 */
export async function processarWebhookMercadoPago(input: {
  type: string;
  data?: { id: number };
}) {
  try {
    console.log("📩 Webhook recebido:", input.type);

    // Apenas processar notificações de pagamento
    if (input.type !== "payment" || !input.data?.id) {
      console.log("⏭️ Webhook ignorado - tipo não é payment ou sem ID");
      return { success: true, message: "Webhook ignorado" };
    }

    const paymentId = input.data.id;
    console.log(`💳 Processando pagamento: ${paymentId}`);

    // Buscar detalhes do pagamento
    const payment = await fetchPaymentDetails(paymentId);
    console.log(`📊 Status do pagamento: ${payment.status}`);

    const db = await getDb();
    if (!db) {
      console.warn("⚠️ Banco de dados não disponível");
      return { success: false, message: "Banco de dados indisponível" };
    }

    // Processar baseado no status
    switch (payment.status) {
      case "approved":
        // Pagamento aprovado - ativar assinatura
        await db
          .update(subscriptions)
          .set({
            mercadoPagoId: paymentId.toString(),
            paymentStatus: "approved",
            status: "active",
            startDate: new Date(),
          })
          .where(eq(subscriptions.mercadoPagoId, paymentId.toString()));

        console.log(`✅ Assinatura ativada (Pagamento ${paymentId})`);
        break;

      case "pending":
        // Pagamento pendente - manter em pending
        await db
          .update(subscriptions)
          .set({
            mercadoPagoId: paymentId.toString(),
            paymentStatus: "pending",
          })
          .where(eq(subscriptions.mercadoPagoId, paymentId.toString()));

        console.log(`⏳ Assinatura em pendência (Pagamento ${paymentId})`);
        break;

      case "failed":
      case "cancelled":
      case "refunded":
        // Pagamento rejeitado/cancelado/reembolsado
        await db
          .update(subscriptions)
          .set({
            mercadoPagoId: paymentId.toString(),
            paymentStatus: "failed",
            status: "expired",
          })
          .where(eq(subscriptions.mercadoPagoId, paymentId.toString()));

        console.log(`❌ Assinatura expirada (Pagamento ${paymentId})`);
        break;

      default:
        console.log(`⚠️ Status desconhecido: ${payment.status}`);
    }

    console.log("✅ Webhook processado com sucesso");
    return {
      success: true,
      message: "Webhook processado com sucesso",
      paymentId,
      status: payment.status,
    };
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    throw error;
  }
}

/**
 * Retry webhook com exponential backoff
 */
export async function retryWebhookWithBackoff(
  input: { type: string; data?: { id: number } },
  maxRetries: number = 3,
  delayMs: number = 1000
) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await processarWebhookMercadoPago(input);
    } catch (error) {
      if (attempt < maxRetries - 1) {
        const delay = delayMs * Math.pow(2, attempt);
        console.log(`⏳ Retry em ${delay}ms (tentativa ${attempt + 1}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error(`❌ Falha após ${maxRetries} tentativas`);
        throw error;
      }
    }
  }
}
