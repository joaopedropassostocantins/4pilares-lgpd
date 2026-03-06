/**
 * WhatsApp Baileys Integration
 * Usa WhatsApp Web para enviar mensagens automaticamente
 * Sem necessidade de API externa
 */

import { makeWASocket, useMultiFileAuthState, DisconnectReason, WAMessage } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import path from "path";
import fs from "fs";

let sock: ReturnType<typeof makeWASocket> | null = null;
let isConnecting = false;
let connectionPromise: Promise<void> | null = null;

// Diretório para armazenar credenciais de autenticação
const AUTH_DIR = path.join(process.cwd(), ".whatsapp_auth");

// Garantir que o diretório existe
if (!fs.existsSync(AUTH_DIR)) {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
}

/**
 * Conectar ao WhatsApp Web
 * Retorna uma Promise que resolve quando conectado
 */
export async function connectWhatsApp(): Promise<void> {
  // Se já está conectado, retorna
  if (sock?.user) {
    console.log("✅ WhatsApp já conectado");
    return;
  }

  // Se já está tentando conectar, aguarda
  if (isConnecting && connectionPromise) {
    console.log("⏳ Aguardando conexão WhatsApp...");
    return connectionPromise;
  }

  isConnecting = true;

  connectionPromise = (async () => {
    try {
      const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

      sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ["FUSION-SAJO", "Chrome", "1.0.0"],
        logger: {
          level: "silent" as any,
        } as any,
      });

      sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "close") {
          const shouldReconnect =
            (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

          console.log(
            "❌ Conexão WhatsApp fechada. Reconectando:",
            shouldReconnect
          );

          if (shouldReconnect) {
            isConnecting = false;
            connectionPromise = null;
            connectWhatsApp();
          } else {
            console.log("❌ Desconectado do WhatsApp (logout)");
            isConnecting = false;
            connectionPromise = null;
            sock = null;
          }
        } else if (connection === "open") {
          console.log("✅ WhatsApp conectado com sucesso!");
          isConnecting = false;
        }
      });

      sock.ev.on("creds.update", saveCreds);

      // Aguardar até que o socket esteja pronto
      await new Promise<void>((resolve) => {
        const checkReady = setInterval(() => {
          if (sock?.user) {
            clearInterval(checkReady);
            resolve();
          }
        }, 100);

        // Timeout de 30 segundos
        setTimeout(() => {
          clearInterval(checkReady);
          resolve();
        }, 30000);
      });
    } catch (error) {
      console.error("❌ Erro ao conectar WhatsApp:", error);
      isConnecting = false;
      connectionPromise = null;
      throw error;
    }
  })();

  return connectionPromise;
}

/**
 * Enviar mensagem de texto via WhatsApp
 */
export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string
): Promise<boolean> {
  try {
    // Garantir que está conectado
    if (!sock?.user) {
      console.log("⏳ Conectando ao WhatsApp...");
      await connectWhatsApp();
    }

    if (!sock?.user) {
      console.error("❌ Falha ao conectar ao WhatsApp");
      return false;
    }

    // Formatar número para WhatsApp (adicionar @s.whatsapp.net)
    const jid = formatPhoneToJID(phoneNumber);

    // Enviar mensagem
    await sock.sendMessage(jid, { text: message });

    console.log(`✅ Mensagem enviada para ${phoneNumber}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao enviar WhatsApp para ${phoneNumber}:`, error);
    return false;
  }
}

/**
 * Enviar confirmação de pagamento
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

    return await sendWhatsAppMessage(phoneNumber, message);
  } catch (error) {
    console.error("❌ Erro ao enviar confirmação via WhatsApp:", error);
    return false;
  }
}

/**
 * Enviar lembrete de pagamento pendente
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

    return await sendWhatsAppMessage(phoneNumber, message);
  } catch (error) {
    console.error("❌ Erro ao enviar lembrete via WhatsApp:", error);
    return false;
  }
}

/**
 * Enviar mensagem de referral
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

    return await sendWhatsAppMessage(phoneNumber, message);
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem de referral via WhatsApp:", error);
    return false;
  }
}

/**
 * Formatar número de telefone para JID do WhatsApp
 * Entrada: "5511999999999" ou "+55 11 99999-9999"
 * Saída: "5511999999999@s.whatsapp.net"
 */
function formatPhoneToJID(phone: string): string {
  // Remove caracteres especiais
  let cleaned = phone.replace(/\D/g, "");

  // Se não tem código de país, adiciona 55 (Brasil)
  if (!cleaned.startsWith("55")) {
    // Remove 0 inicial se existir
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    cleaned = "55" + cleaned;
  }

  return `${cleaned}@s.whatsapp.net`;
}

/**
 * Validar número de telefone
 */
export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");

  // Mínimo 10 dígitos (sem código país) ou 12 (com código país)
  if (cleaned.length < 10 || cleaned.length > 15) {
    return false;
  }

  return true;
}

/**
 * Formatar número de telefone para exibição
 */
export function formatPhoneForWhatsApp(phone: string, countryCode: string = "55"): string {
  let cleaned = phone.replace(/\D/g, "");

  if (!cleaned.startsWith(countryCode)) {
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    cleaned = countryCode + cleaned;
  }

  return cleaned;
}

/**
 * Desconectar do WhatsApp
 */
export function disconnectWhatsApp(): void {
  if (sock) {
    sock.end(new Error("Manual disconnect"));
    sock = null;
    isConnecting = false;
    connectionPromise = null;
    console.log("✅ Desconectado do WhatsApp");
  }
}
