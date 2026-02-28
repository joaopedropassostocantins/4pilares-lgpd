import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { ENV } from "./_core/env";

let client: MercadoPagoConfig | null = null;

/**
 * Initialize Mercado Pago SDK with access token
 */
export function initMercadoPago(): boolean {
  if (!ENV.mercadoPagoAccessToken) {
    console.error("[Mercado Pago] Access token not configured");
    return false;
  }

  try {
    client = new MercadoPagoConfig({
      accessToken: ENV.mercadoPagoAccessToken,
    });
    console.log("[Mercado Pago] SDK initialized successfully");
    return true;
  } catch (error) {
    console.error("[Mercado Pago] Failed to initialize SDK:", error);
    return false;
  }
}

/**
 * Get initialized Mercado Pago client
 */
export function getMercadoPagoClient(): MercadoPagoConfig {
  if (!client) {
    initMercadoPago();
  }
  if (!client) {
    throw new Error("Mercado Pago client not initialized");
  }
  return client;
}

/**
 * Create a payment preference for Pix + Cartão
 */
export async function createPaymentPreference(input: {
  diagnosticId: string;
  userEmail: string;
  userName: string;
  amount: number;
  returnUrl: string;
}) {
  try {
    const client = getMercadoPagoClient();
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: input.diagnosticId,
            title: "FUSION-SAJO - Análise Completa dos 4 Pilares",
            description: "Análise profunda: saúde, finanças, relacionamentos e guia xamânico",
            quantity: 1,
            unit_price: input.amount,
          },
        ],
        payer: {
          email: input.userEmail,
          name: input.userName,
        },
        payment_methods: {
          // Accept Pix and credit card
          excluded_payment_methods: [],
          installments: 1,
        },
        back_urls: {
          success: `${input.returnUrl}?status=success`,
          failure: `${input.returnUrl}?status=failure`,
          pending: `${input.returnUrl}?status=pending`,
        },
        auto_return: "approved",
        notification_url: `${process.env.VITE_FRONTEND_FORGE_API_URL || "https://api.manus.im"}/api/webhook/mercadopago`,
        statement_descriptor: "FUSION-SAJO",
        expires: false,
      },
    });

    return {
      preferenceId: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
    };
  } catch (error) {
    console.error("[Mercado Pago] Failed to create preference:", error);
    throw error;
  }
}

/**
 * Get payment details by ID
 */
export async function getPaymentDetails(paymentId: string) {
  try {
    const client = getMercadoPagoClient();
    const payment = new Payment(client);

    const response = await payment.get({
      id: paymentId,
    });

    return {
      id: response.id,
      status: response.status,
      statusDetail: response.status_detail,
      amount: response.transaction_amount,
      paymentMethod: response.payment_method?.id,
      paymentType: response.payment_type_id,
      createdAt: response.date_created,
    };
  } catch (error) {
    console.error("[Mercado Pago] Failed to get payment details:", error);
    throw error;
  }
}

/**
 * Verify webhook signature (optional but recommended)
 */
export function verifyWebhookSignature(
  body: Record<string, unknown>,
  signature: string,
  secret: string
): boolean {
  // Mercado Pago webhook verification
  // For now, we'll accept all webhooks (implement signature verification if needed)
  return true;
}
