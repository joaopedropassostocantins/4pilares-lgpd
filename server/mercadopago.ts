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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailRegex.test(input.userEmail) 
      ? input.userEmail 
      : `user-${input.diagnosticId}@fusion-sajo.com`;

    // Validate userName (max 256 chars, no special chars)
    const validName = input.userName
      .substring(0, 256)
      .replace(/[^a-zA-Z0-9\s\-\.]/g, '');

    console.log("[Mercado Pago] Creating preference with:", {
      email: validEmail,
      name: validName,
      amount: input.amount,
      diagnosticId: input.diagnosticId,
    });

    const response = await preference.create({
      body: {
        items: [
          {
            id: input.diagnosticId,
            title: "FUSION-SAJO - Analise Completa dos 4 Pilares",
            description: "Analise profunda: saude, financas, relacionamentos",
            quantity: 1,
            unit_price: input.amount,
            currency_id: "BRL",
          },
        ],
        payer: {
          email: validEmail,
          name: validName,
        },
        payment_methods: {
          excluded_payment_types: [],
          excluded_payment_methods: [],
          installments: 1,
          default_installments: 1,
        },
        back_urls: {
          success: input.returnUrl,
          failure: input.returnUrl,
          pending: input.returnUrl,
        },
        auto_return: "approved",
        external_reference: input.diagnosticId,
        statement_descriptor: "FUSION-SAJO",
        expires: false,
      },
    });

    console.log("[Mercado Pago] Preference created successfully:", response.id);

    return {
      preferenceId: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
    };
  } catch (error: any) {
    console.error("[Mercado Pago] Failed to create preference:", {
      message: error?.message,
      status: error?.status,
      response: error?.response?.data,
    });
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
 * Process webhook from Mercado Pago
 * Returns payment status and external reference (diagnosticId)
 */
export async function processWebhook(webhookData: any) {
  try {
    // Webhook can be payment.created, payment.updated, or payment.approved
    if (webhookData.type === "payment") {
      const paymentId = webhookData.data?.id;
      if (!paymentId) {
        console.warn("[Mercado Pago Webhook] No payment ID in webhook data");
        return null;
      }

      // Get payment details
      const paymentDetails = await getPaymentDetails(paymentId.toString());
      
      return {
        paymentId: paymentDetails.id,
        status: paymentDetails.status,
        statusDetail: paymentDetails.statusDetail,
        amount: paymentDetails.amount,
        paymentMethod: paymentDetails.paymentMethod,
        createdAt: paymentDetails.createdAt,
      };
    }
    
    return null;
  } catch (error) {
    console.error("[Mercado Pago Webhook] Error processing webhook:", error);
    throw error;
  }
}

/**
 * Create a PIX payment and return QR code
 * Returns QR code image URL and copy-paste code
 */
export async function createPixPayment(input: {
  diagnosticId: string;
  userEmail: string;
  userName: string;
  amount: number;
}) {
  try {
    const client = getMercadoPagoClient();
    const payment = new Payment(client);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailRegex.test(input.userEmail)
      ? input.userEmail
      : `user-${input.diagnosticId}@fusion-sajo.com`;

    // Validate userName (max 256 chars, no special chars)
    const validName = input.userName
      .substring(0, 256)
      .replace(/[^a-zA-Z0-9\s\-\.]/g, '');

    console.log("[Mercado Pago] Creating PIX payment with:", {
      email: validEmail,
      name: validName,
      amount: input.amount,
      diagnosticId: input.diagnosticId,
    });

    const response = await payment.create({
      body: {
        transaction_amount: input.amount,
        description: "FUSION-SAJO - Analise Completa dos 4 Pilares",
        payment_method_id: "pix",
        payer: {
          email: validEmail,
          first_name: validName.split(" ")[0],
          last_name: validName.split(" ").slice(1).join(" ") || "User",
        },
        external_reference: input.diagnosticId,
      },
    });

    console.log("[Mercado Pago] PIX payment created successfully:", response.id);

    const pixData = response.point_of_interaction?.transaction_data as any;
    
    return {
      paymentId: response.id,
      qrCode: pixData?.qr_code,
      qrCodeUrl: pixData?.qr_code_url,
      copyAndPaste: pixData?.copy_and_paste,
      status: response.status,
      amount: response.transaction_amount,
    };
  } catch (error: any) {
    console.error("[Mercado Pago] Failed to create PIX payment:", {
      message: error?.message,
      status: error?.status,
      response: error?.response?.data,
    });
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
