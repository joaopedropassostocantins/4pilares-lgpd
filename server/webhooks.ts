import { getDb } from "./db";
import { subscriptions } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { createHmac } from "crypto";
import { ENV } from "./_core/env";

/**
 * Processar webhook do Mercado Pago
 * Tipos de notificação: payment, plan, subscription, invoice, merchant_order
 */
export async function processarWebhookMercadoPago(body: any) {
  try {
    console.log("📨 Webhook Mercado Pago recebido:", {
      type: body.type,
      data_id: body.data?.id,
      timestamp: new Date().toISOString(),
    });

    if (!["payment", "subscription"].includes(body.type)) {
      console.log("⏭️ Ignorando notificação de tipo:", body.type);
      return { success: true, message: "Notificação ignorada" };
    }

    const paymentId = body.data?.id?.toString();
    if (!paymentId) {
      console.warn("⚠️ Payment ID não encontrado na notificação");
      return { success: false, message: "Payment ID não encontrado" };
    }

    console.log("💳 Processando pagamento:", paymentId);

    const db = await getDb();
    if (db) {
      await db
        .update(subscriptions)
        .set({
          paymentStatus: "approved",
          mercadoPagoId: paymentId,
        })
        .where(eq(subscriptions.mercadoPagoId, paymentId));
        
      console.log(`✅ Assinatura (Pagamento ${paymentId}) atualizada para ativa`);
    }

    console.log("✅ Webhook processado com sucesso");
    return { success: true, message: "Webhook processado com sucesso" };
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    throw error;
  }
}

/**
 * Validar assinatura do webhook usando HMAC-SHA256
 */
export function validarAssinaturaWebhook(
  body: string,
  signature: string | undefined
): boolean {
  try {
    if (!signature) {
      console.warn("⚠️ Assinatura não fornecida no webhook");
      return false;
    }

    const secret = ENV.mercadoPagoWebhookSecret;
    if (!secret) {
      console.warn("⚠️ Chave secreta do webhook não configurada");
      return false;
    }

    console.log("🔐 Validando assinatura do webhook...");

    // Calcular HMAC-SHA256
    const hmac = createHmac("sha256", secret);
    hmac.update(body);
    const calculatedSignature = hmac.digest("hex");

    // Comparar assinaturas
    const isValid = calculatedSignature === signature;
    console.log(isValid ? "✅ Assinatura válida" : "❌ Assinatura inválida");

    return isValid;
  } catch (error) {
    console.error("❌ Erro ao validar assinatura:", error);
    return false;
  }
}
