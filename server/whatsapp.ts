/**
 * WhatsApp API Integration Module
 * Integração com WhatsApp Business API para automação de mensagens
 */

interface WhatsAppMessage {
  to: string; // Número com código de país (ex: 5511999999999)
  message: string;
  type: "text" | "template";
}

interface WhatsAppTemplate {
  name: string;
  language: string;
  parameters: string[];
}

/**
 * Enviar mensagem de confirmação de pagamento via WhatsApp
 * Exemplo: "Olá João! Seu pagamento foi confirmado. Sua análise completa está pronta em: https://..."
 */
export async function sendPaymentConfirmationWhatsApp(
  phoneNumber: string,
  userName: string,
  diagnosticId: string
): Promise<boolean> {
  try {
    const resultUrl = `https://pilaresdasabedoria.club/resultado/${diagnosticId}`;
    
    const message = `
✨ *Pagamento Confirmado!* ✨

Olá ${userName}! 🙏

Seu pagamento foi recebido com sucesso!

Sua análise completa dos 4 Pilares SAJO está pronta agora:

${resultUrl}

Nela você encontrará:
✓ Previsões exatas para os próximos 12-24 meses
✓ Análise completa de amor, carreira e saúde
✓ Rituais ancestrais que funcionam
✓ Ações corretivas para transformar seu destino

Que seus ancestrais guiem seu caminho! 🌟

FUSION-SAJO
    `.trim();
    
    return await sendWhatsAppMessage({
      to: phoneNumber,
      message,
      type: "text",
    });
  } catch (error) {
    console.error("❌ Erro ao enviar confirmação via WhatsApp:", error);
    return false;
  }
}

/**
 * Enviar lembrete para clientes com pagamento pendente
 * Exemplo: "Olá João! Sua análise está pronta, mas o pagamento ainda não foi confirmado..."
 */
export async function sendPaymentReminderWhatsApp(
  phoneNumber: string,
  userName: string,
  diagnosticId: string,
  hoursUntilExpiry: number
): Promise<boolean> {
  try {
    const resultUrl = `https://pilaresdasabedoria.club/resultado/${diagnosticId}`;
    
    const message = `
⏰ *Lembrete Importante!* ⏰

Olá ${userName}! 🙏

Sua análise de degustação está pronta, mas o pagamento ainda não foi confirmado.

⚠️ *Sua promoção expira em ${hoursUntilExpiry} horas!*

Depois disso, o preço volta ao normal (R$ 299,00).

Clique agora para desbloquear sua análise completa:
${resultUrl}

Apenas R$ 14,99 para transformar seu destino! 💎

FUSION-SAJO
    `.trim();
    
    return await sendWhatsAppMessage({
      to: phoneNumber,
      message,
      type: "text",
    });
  } catch (error) {
    console.error("❌ Erro ao enviar lembrete via WhatsApp:", error);
    return false;
  }
}

/**
 * Enviar mensagem de referral
 * Exemplo: "Convide seus amigos e ganhe R$ 9,99 de desconto!"
 */
export async function sendReferralWhatsApp(
  phoneNumber: string,
  userName: string,
  referralLink: string
): Promise<boolean> {
  try {
    const message = `
🎁 *Ganhe R$ 9,99 de Desconto!* 🎁

Olá ${userName}! 🙏

Você já compartilhou sua análise SAJO com seus amigos?

Cada amigo que usar seu link de referral ganha R$ 9,99 de desconto, e você também ganha R$ 9,99!

Seu link de referral:
${referralLink}

Compartilhe agora e ganhe descontos! 💰

FUSION-SAJO
    `.trim();
    
    return await sendWhatsAppMessage({
      to: phoneNumber,
      message,
      type: "text",
    });
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem de referral via WhatsApp:", error);
    return false;
  }
}

/**
 * Função genérica para enviar mensagens via WhatsApp
 * Integra com WhatsApp Business API (Twilio, Meta, etc)
 */
async function sendWhatsAppMessage(msg: WhatsAppMessage): Promise<boolean> {
  try {
    // TODO: Integrar com WhatsApp Business API
    // Opções:
    // 1. Twilio WhatsApp Sandbox: https://www.twilio.com/whatsapp
    // 2. Meta WhatsApp Business API: https://developers.facebook.com/docs/whatsapp
    // 3. Serviço local como Baileys ou WhatsApp Web
    
    // Por enquanto, apenas loga
    console.log(`📱 WhatsApp message sent to ${msg.to}`);
    console.log(`Message: ${msg.message}`);
    
    // Simular sucesso
    return true;
  } catch (error) {
    console.error(`❌ Erro ao enviar WhatsApp para ${msg.to}:`, error);
    return false;
  }
}

/**
 * Validar número de telefone com código de país
 * Exemplo: 5511999999999 (Brasil, São Paulo)
 */
export function validatePhoneNumber(phone: string): boolean {
  // Remove caracteres especiais
  const cleaned = phone.replace(/\D/g, "");
  
  // Validar comprimento (mínimo 10 dígitos, máximo 15)
  if (cleaned.length < 10 || cleaned.length > 15) {
    return false;
  }
  
  // Validar se começa com código de país válido
  // Brasil: 55, EUA: 1, etc
  const validCountryCodes = ["55", "1", "44", "33", "34", "39", "49", "81", "86"];
  const hasValidCountryCode = validCountryCodes.some(code => cleaned.startsWith(code));
  
  return hasValidCountryCode;
}

/**
 * Formatar número de telefone para WhatsApp
 * Entrada: "11 99999-9999" ou "11999999999"
 * Saída: "5511999999999"
 */
export function formatPhoneForWhatsApp(phone: string, countryCode: string = "55"): string {
  // Remove caracteres especiais
  let cleaned = phone.replace(/\D/g, "");
  
  // Se não tem código de país, adiciona
  if (!cleaned.startsWith(countryCode)) {
    // Remove 0 inicial se existir (padrão brasileiro)
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    cleaned = countryCode + cleaned;
  }
  
  return cleaned;
}
