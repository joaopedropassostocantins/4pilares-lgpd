/**
 * Email service for sending analysis and confirmations to users
 * Uses Manus built-in email API
 */

import { ENV } from "./env";

const BUILT_IN_FORGE_API_KEY = ENV.forgeApiKey;
const BUILT_IN_FORGE_API_URL = ENV.forgeApiUrl;

export async function sendEmailWithAnalysis(
  email: string,
  name: string,
  analysis: string,
  analysisType: "tasting" | "full" = "full"
): Promise<boolean> {
  try {
    if (!email) {
      console.log("[Email] No email provided, skipping email send");
      return true;
    }

    const subject = analysisType === "full" 
      ? "Sua Análise Completa - FUSION-SAJO" 
      : "Sua Análise Gratuita - FUSION-SAJO";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C9A84C;">Olá ${name},</h2>
        <p>Sua análise ${analysisType === "full" ? "completa" : "gratuita"} está pronta!</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          ${analysis}
        </div>
        <p style="color: #666; font-size: 12px;">
          Este é um email automático. Não responda diretamente.
        </p>
      </div>
    `;

    const response = await fetch(`${BUILT_IN_FORGE_API_URL}/email/send`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BUILT_IN_FORGE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject,
        html: htmlContent,
        text: analysis,
      }),
    });

    if (!response.ok) {
      console.error("[Email] Failed to send email:", response.statusText);
      return false;
    }

    console.log(`[Email] Analysis sent to ${email} (${analysisType})`);
    return true;
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return false;
  }
}

/**
 * Send payment confirmation email with analysis details
 */
export async function sendPaymentConfirmationEmail(
  email: string,
  name: string,
  module: string,
  amount: number
): Promise<boolean> {
  try {
    if (!email) {
      console.log("[Email] No email provided for confirmation");
      return true;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C9A84C;">✓ Pagamento Confirmado!</h2>
        <p>Olá ${name},</p>
        <p>Seu pagamento foi processado com sucesso!</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Módulo:</strong> ${module}</p>
          <p><strong>Valor:</strong> R$ ${(amount / 100).toFixed(2)}</p>
          <p><strong>Acesso:</strong> 90 dias com acompanhamento semanal</p>
        </div>

        <p style="color: #666;">Próximos passos:</p>
        <ul style="color: #666;">
          <li>Sua análise completa será enviada em breve</li>
          <li>Você receberá um link para agendar sua primeira videochamada</li>
          <li>Acompanhamento semanal com o Xamã durante 90 dias</li>
        </ul>

        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          Dúvidas? Entre em contato via WhatsApp.
        </p>
      </div>
    `;

    const response = await fetch(`${BUILT_IN_FORGE_API_URL}/email/send`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BUILT_IN_FORGE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject: "✓ Pagamento Confirmado - FUSION-SAJO",
        html: htmlContent,
        text: `Pagamento confirmado para ${module} - R$ ${(amount / 100).toFixed(2)}`,
      }),
    });

    if (!response.ok) {
      console.error("[Email] Failed to send confirmation:", response.statusText);
      return false;
    }

    console.log(`[Email] Confirmation sent to ${email}`);
    return true;
  } catch (error) {
    console.error("[Email] Error sending confirmation:", error);
    return false;
  }
}

/**
 * Send webhook notification email to owner
 */
export async function sendWebhookNotificationEmail(
  email: string,
  subject: string,
  details: Record<string, any>
): Promise<boolean> {
  try {
    const htmlContent = `
      <div style="font-family: monospace; background: #f5f5f5; padding: 15px; border-radius: 8px;">
        <h3>${subject}</h3>
        <pre>${JSON.stringify(details, null, 2)}</pre>
      </div>
    `;

    const response = await fetch(`${BUILT_IN_FORGE_API_URL}/email/send`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${BUILT_IN_FORGE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: email,
        subject: `[WEBHOOK] ${subject}`,
        html: htmlContent,
        text: JSON.stringify(details, null, 2),
      }),
    });

    if (!response.ok) {
      console.error("[Email] Failed to send webhook notification:", response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Email] Error sending webhook notification:", error);
    return false;
  }
}
