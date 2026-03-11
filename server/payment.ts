import axios from "axios";
import { ENV } from "./_core/env";
import { getDb } from "./db";
import { subscriptions } from "../drizzle/schema";
import { eq } from "drizzle-orm";

interface MercadoPagoPayment {
  id: number;
  status: string;
  status_detail: string;
  payer: {
    email: string;
    identification: {
      number: string;
      type: string;
    };
  };
  transaction_amount: number;
  description: string;
  external_reference: string;
}

interface CreatePreferenceRequest {
  planId: string;
  planName: string;
  priceMonthly: number;
  razaoSocial: string;
  cnpj: string;
  email: string;
  userId: number;
}

/**
 * Criar preferência de pagamento no Mercado Pago
 */
export async function createMercadoPagoPreference(input: CreatePreferenceRequest) {
  try {
    const externalReference = `${input.userId}-${input.planId}-${Date.now()}`;
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const preference = {
      items: [
        {
          title: `Plano ${input.planName} - 4 Pilares LGPD`,
          description: `Assinatura mensal - ${input.razaoSocial}`,
          quantity: 1,
          unit_price: input.priceMonthly,
          currency_id: "BRL",
        },
      ],
      payer: {
        name: input.razaoSocial,
        email: input.email,
      },
      external_reference: externalReference,
      back_urls: {
        success: `${process.env.FRONTEND_URL || "https://4pilareslgpd.club"}/checkout/sucesso`,
        failure: `${process.env.FRONTEND_URL || "https://4pilareslgpd.club"}/checkout/erro`,
        pending: `${process.env.FRONTEND_URL || "https://4pilareslgpd.club"}/checkout/pendente`,
      },
      auto_return: "approved",
      notification_url: `${process.env.WEBHOOK_URL || "https://4pilareslgpd-upm86dcc.manus.space"}/api/webhooks/mercadopago`,
      recurring_payment: {
        frequency: 1,
        frequency_type: "months",
      },
    };

    const response = await axios.post(
      "https://api.mercadopago.com/checkout/preferences",
      preference,
      {
        headers: {
          Authorization: `Bearer ${ENV.mercadoPagoAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Preferência criada:", response.data.id);
    return {
      preferenceId: response.data.id,
      initPoint: response.data.init_point,
      externalReference,
    };
  } catch (error) {
    console.error("❌ Erro ao criar preferência:", error);
    throw error;
  }
}

/**
 * Processar pagamento aprovado
 */
export async function processPayment(paymentId: string) {
  try {
    console.log(`💳 Processando pagamento: ${paymentId}`);

    // Buscar detalhes do pagamento no Mercado Pago
    const paymentResponse = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${ENV.mercadoPagoAccessToken}`,
        },
      }
    );

    const payment: MercadoPagoPayment = paymentResponse.data;

    if (payment.status !== "approved") {
      console.log(`⚠️ Pagamento não aprovado: ${payment.status}`);
      return { success: false, message: `Pagamento não aprovado: ${payment.status}` };
    }

    // Atualizar assinatura no banco de dados
    const db = await getDb();
    if (db) {
      await db
        .update(subscriptions)
        .set({
          mercadoPagoId: paymentId.toString(),
          paymentStatus: "approved",
          status: "active",
        })
        .where(eq(subscriptions.mercadoPagoId, paymentId.toString()));

      console.log(`✅ Assinatura atualizada para ativa (Pagamento ${paymentId})`);
    }

    return {
      success: true,
      message: "Pagamento processado com sucesso",
      paymentId,
      externalReference: payment.external_reference,
    };
  } catch (error) {
    console.error("❌ Erro ao processar pagamento:", error);
    throw error;
  }
}

/**
 * Buscar status do pagamento
 */
export async function getPaymentStatus(paymentId: string) {
  try {
    const response = await axios.get(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${ENV.mercadoPagoAccessToken}`,
        },
      }
    );

    return {
      id: response.data.id,
      status: response.data.status,
      statusDetail: response.data.status_detail,
      amount: response.data.transaction_amount,
      externalReference: response.data.external_reference,
    };
  } catch (error) {
    console.error("❌ Erro ao buscar status do pagamento:", error);
    throw error;
  }
}

/**
 * Reembolsar pagamento
 */
export async function refundPayment(paymentId: string) {
  try {
    const response = await axios.post(
      `https://api.mercadopago.com/v1/payments/${paymentId}/refunds`,
      {},
      {
        headers: {
          Authorization: `Bearer ${ENV.mercadoPagoAccessToken}`,
        },
      }
    );

    console.log(`✅ Reembolso processado: ${response.data.id}`);
    return {
      success: true,
      refundId: response.data.id,
    };
  } catch (error) {
    console.error("❌ Erro ao reembolsar pagamento:", error);
    throw error;
  }
}
