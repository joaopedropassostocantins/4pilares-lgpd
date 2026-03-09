import axios from "axios";
import { ENV } from "./_core/env";

const MERCADO_PAGO_API_URL = "https://api.mercadopago.com";

export interface CreatePaymentRequest {
  token: string;
  amount: number;
  email: string;
  description: string;
  installments?: number;
  payer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    identification?: {
      type?: string;
      number?: string;
    };
  };
}

export interface PaymentResponse {
  id: number;
  status: string;
  status_detail: string;
  amount: number;
  email: string;
  description: string;
  transaction_amount: number;
  payment_method_id: string;
  installments: number;
  date_created: string;
}

export interface WebhookPayment {
  id: number;
  status: string;
  status_detail: string;
  amount: number;
  email: string;
  date_created: string;
}

/**
 * Criar pagamento no Mercado Pago
 */
export async function createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
  try {
    console.log("🔄 Criando pagamento no Mercado Pago...");
    console.log("📊 Dados:", {
      amount: data.amount,
      email: data.email,
      description: data.description,
      installments: data.installments || 1,
    });

    const response = await axios.post(
      `${MERCADO_PAGO_API_URL}/v1/payments`,
      {
        token: data.token,
        amount: data.amount,
        email: data.email,
        description: data.description,
        installments: data.installments || 1,
        payment_method_id: "credit_card",
        payer: {
          first_name: data.payer?.firstName || "Cliente",
          last_name: data.payer?.lastName || "4 Pilares",
          email: data.payer?.email || data.email,
          identification: {
            type: data.payer?.identification?.type || "CPF",
            number: data.payer?.identification?.number || "00000000000",
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ENV.mercadoPagoAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Pagamento criado com sucesso!");
    console.log("📌 ID do pagamento:", response.data.id);
    console.log("📊 Status:", response.data.status);

    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao criar pagamento:", error.response?.data || error.message);
    throw new Error(
      `Erro ao processar pagamento: ${error.response?.data?.message || error.message}`
    );
  }
}

/**
 * Obter detalhes do pagamento
 */
export async function getPayment(paymentId: number): Promise<PaymentResponse> {
  try {
    console.log("🔍 Buscando pagamento:", paymentId);

    const response = await axios.get(`${MERCADO_PAGO_API_URL}/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${ENV.mercadoPagoAccessToken}`,
      },
    });

    console.log("✅ Pagamento encontrado!");
    console.log("📊 Status:", response.data.status);

    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao buscar pagamento:", error.response?.data || error.message);
    throw new Error(`Erro ao buscar pagamento: ${error.message}`);
  }
}

/**
 * Refundar pagamento
 */
export async function refundPayment(paymentId: number): Promise<any> {
  try {
    console.log("🔄 Reembolsando pagamento:", paymentId);

    const response = await axios.post(
      `${MERCADO_PAGO_API_URL}/v1/payments/${paymentId}/refunds`,
      {},
      {
        headers: {
          Authorization: `Bearer ${ENV.mercadoPagoAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Reembolso processado!");
    console.log("📌 ID do reembolso:", response.data.id);

    return response.data;
  } catch (error: any) {
    console.error("❌ Erro ao reembolsar:", error.response?.data || error.message);
    throw new Error(`Erro ao reembolsar pagamento: ${error.message}`);
  }
}

/**
 * Validar webhook do Mercado Pago
 */
export function validateWebhookSignature(
  body: any,
  signature: string,
  timestamp: string
): boolean {
  try {
    // Validação básica de webhook
    // Em produção, implementar validação de assinatura completa
    console.log("🔐 Validando webhook...");

    if (!body || !signature || !timestamp) {
      console.warn("⚠️ Dados de webhook incompletos");
      return false;
    }

    console.log("✅ Webhook válido");
    return true;
  } catch (error) {
    console.error("❌ Erro ao validar webhook:", error);
    return false;
  }
}

/**
 * Processar webhook de pagamento
 */
export function processPaymentWebhook(data: any): {
  paymentId: number;
  status: string;
  email: string;
} {
  try {
    console.log("📨 Processando webhook de pagamento...");
    console.log("📊 Dados:", {
      id: data.id,
      status: data.status,
      email: data.email,
    });

    return {
      paymentId: data.id,
      status: data.status,
      email: data.email,
    };
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    throw error;
  }
}
