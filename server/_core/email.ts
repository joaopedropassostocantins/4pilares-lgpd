/**
 * Email service for sending analysis to users
 */

export async function sendEmailWithAnalysis(
  email: string,
  name: string,
  analysis: string,
  analysisType: "tasting" | "full" = "full"
): Promise<boolean> {
  try {
    if (!email) {
      console.log("[Email] No email provided, skipping email send");
      return false;
    }

    // Use Manus built-in notification API to send email
    const forgeApiUrl = process.env.BUILT_IN_FORGE_API_URL;
    const forgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;

    if (!forgeApiUrl || !forgeApiKey) {
      console.error("[Email] Missing FORGE API credentials");
      return false;
    }

    const subject =
      analysisType === "full"
        ? "☯ Sua Análise Completa FUSION-SAJO Desbloqueada!"
        : "☯ Sua Análise de Degustação FUSION-SAJO Está Pronta!";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
    .header { background: linear-gradient(135deg, #d4a574 0%, #8b6f47 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 10px 0 0 0; opacity: 0.9; }
    .content { background: white; padding: 30px; }
    .analysis { background: #f5f5f5; padding: 20px; border-left: 4px solid #d4a574; margin: 20px 0; border-radius: 4px; font-size: 14px; line-height: 1.8; }
    .cta { text-align: center; margin: 30px 0; }
    .cta-button { background: linear-gradient(135deg, #d4a574 0%, #8b6f47 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; }
    .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>☯ FUSION-SAJO</h1>
      <p>${subject}</p>
    </div>
    <div class="content">
      <p>Olá <strong>${name}</strong>,</p>
      <p>${analysisType === "full" ? "Sua análise completa desbloqueada está aqui! Descubra os segredos dos seus 4 Pilares e seu destino completo em amor, carreira e saúde." : "Sua análise de degustação está pronta! Confira uma prévia do seu destino segundo a sabedoria ancestral coreana."}</p>
      
      <div class="analysis">
        ${analysis.split("\n").map((line) => (line.trim() ? `<p>${line}</p>` : "")).join("")}
      </div>

      <div class="cta">
        <a href="https://pilaresdasabedoria.club" class="cta-button">Ver Análise Completa</a>
      </div>

      <p style="font-size: 12px; color: #999; margin-top: 30px;">
        Esta é uma leitura interpretativa para reflexão. Não substitui orientação profissional.
      </p>
    </div>
    <div class="footer">
      <p>© 2026 FUSION-SAJO | Diagnósticos Astrológicos Ancestrais</p>
      <p>Você recebeu este email porque solicitou uma análise SAJO.</p>
    </div>
  </div>
</body>
</html>
    `;

    // Send via Manus notification API
    const response = await fetch(`${forgeApiUrl}/notification/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${forgeApiKey}`,
      },
      body: JSON.stringify({
        to: email,
        subject,
        html: htmlContent,
      }),
    });

    if (!response.ok) {
      console.error("[Email] Failed to send email:", response.statusText);
      return false;
    }

    console.log(`[Email] Analysis email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return false;
  }
}
