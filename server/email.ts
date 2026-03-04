import { invokeLLM } from "./_core/llm";

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

/**
 * Email 1: Bem-vindo - Enviado imediatamente após diagnóstico
 * Objetivo: Confirmar recebimento, criar urgência, apresentar oferta
 */
export function generateWelcomeEmail(userName: string, diagnosticId: string): EmailTemplate {
  const resultUrl = `https://pilaresdasabedoria.club/resultado/${diagnosticId}`;
  
  return {
    subject: `${userName}, seus 4 Pilares SAJO estão prontos! 🌟`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; }
            .content { padding: 30px; background: #f9f9f9; margin-top: 20px; border-radius: 8px; }
            .cta-button { display: inline-block; background: #e74c3c; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .urgency { color: #e74c3c; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Seus 4 Pilares SAJO Revelados!</h1>
              <p>Olá, ${userName}!</p>
            </div>
            
            <div class="content">
              <p>Sua análise de degustação está pronta! Você acabou de receber uma revelação ancestral dos seus 4 Pilares SAJO.</p>
              
              <p>Mas aqui está a verdade: <span class="urgency">a análise de degustação é apenas o começo</span>. Ela mostra quem você é, mas não revela:</p>
              
              <ul>
                <li>✨ Suas previsões exatas para os próximos 12-24 meses</li>
                <li>💝 O que você PRECISA fazer AGORA para transformar seu destino em amor</li>
                <li>💰 Os ciclos de abundância e como aproveitá-los</li>
                <li>🛡️ Rituais ancestrais que funcionam (não é superstição, é ciência milenar)</li>
                <li>⚡ As ações corretivas que vão mudar sua vida</li>
              </ul>
              
              <p><span class="urgency">⏰ Promoção especial válida apenas até 01/março às 23:59</span></p>
              <p>Depois disso, o valor volta ao normal (R$ 29,99).</p>
              
              <center>
                <a href="${resultUrl}" class="cta-button">Ver Minha Análise Completa (R$ 14,99)</a>
              </center>
              
              <p>Não deixe essa oportunidade passar. Seus ancestrais estão esperando para guiar você.</p>
              
              <p>Com gratidão ancestral,<br><strong>FUSION-SAJO</strong></p>
            </div>
            
            <div class="footer">
              <p>Você recebeu este email porque solicitou uma análise SAJO em pilaresdasabedoria.club</p>
              <p>© 2026 FUSION-SAJO. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    textContent: `
Olá ${userName},

Seus 4 Pilares SAJO foram revelados! Sua análise de degustação está pronta.

Mas aqui está a verdade: a análise de degustação é apenas o começo. Ela mostra quem você é, mas não revela suas previsões exatas, o que você precisa fazer AGORA, os ciclos de abundância, rituais ancestrais e ações corretivas.

⏰ Promoção especial válida apenas até 01/março às 23:59
Depois disso, o valor volta ao normal (R$ 29,99).

Ver sua análise completa: ${resultUrl}

Com gratidão ancestral,
FUSION-SAJO
    `
  };
}

/**
 * Email 2: Upsell - Enviado 2 dias depois
 * Objetivo: Criar urgência, apresentar depoimentos, fechar venda
 */
export function generateUpsellEmail(userName: string, diagnosticId: string): EmailTemplate {
  const resultUrl = `https://pilaresdasabedoria.club/resultado/${diagnosticId}`;
  
  return {
    subject: `${userName}, você está deixando passar uma oportunidade única 💎`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f39c12; color: white; padding: 30px; text-align: center; border-radius: 8px; }
            .testimonial { background: #ecf0f1; padding: 20px; margin: 15px 0; border-left: 4px solid #f39c12; border-radius: 5px; }
            .cta-button { display: inline-block; background: #e74c3c; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .urgency { color: #e74c3c; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Sua Promoção Expira em Breve!</h1>
            </div>
            
            <div class="content" style="padding: 30px; background: #f9f9f9; margin-top: 20px; border-radius: 8px;">
              <p>Oi ${userName},</p>
              
              <p>Você viu sua análise de degustação, mas ainda não desbloqueou a análise completa.</p>
              
              <p>Deixa eu ser honesto com você: <span class="urgency">as pessoas que desbloqueiam a análise completa relatam mudanças REAIS em suas vidas</span>.</p>
              
              <p>Veja o que nossos clientes dizem:</p>
              
              <div class="testimonial">
                <strong>Marina Silva, São Paulo</strong><br>
                "Descobri meu potencial em relacionamentos. As previsões foram 100% precisas! Finalmente entendo por que tinha dificuldades em amar."
              </div>
              
              <div class="testimonial">
                <strong>Carlos Mendes, Rio de Janeiro</strong><br>
                "A análise me ajudou a entender meu tipo de personalidade. Mudou minha carreira completamente. Recomendo para todos!"
              </div>
              
              <div class="testimonial">
                <strong>Juliana Costa, Belo Horizonte</strong><br>
                "Finalmente entendi por que tenho dificuldades em finanças. Muito revelador! Já estou aplicando as ações corretivas."
              </div>
              
              <p><span class="urgency">⏰ Atenção: Sua promoção de R$ 14,99 expira em 01/março às 23:59</span></p>
              <p>Depois disso, o preço volta para R$ 29,99.</p>
              
              <center>
                <a href="${resultUrl}" class="cta-button">Desbloquear Agora (R$ 14,99)</a>
              </center>
              
              <p><strong>Garantia de 30 dias:</strong> Se não gostar, devolvemos 100% do seu dinheiro. Sem perguntas.</p>
              
              <p>Não deixe essa oportunidade passar, ${userName}.</p>
              
              <p>Com gratidão ancestral,<br><strong>FUSION-SAJO</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2026 FUSION-SAJO. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    textContent: `
Oi ${userName},

Você viu sua análise de degustação, mas ainda não desbloqueou a análise completa.

As pessoas que desbloqueiam a análise completa relatam mudanças REAIS em suas vidas.

Depoimentos de clientes:
- Marina Silva: "Descobri meu potencial em relacionamentos. As previsões foram 100% precisas!"
- Carlos Mendes: "A análise me ajudou a entender meu tipo de personalidade. Mudou minha carreira!"
- Juliana Costa: "Finalmente entendi por que tenho dificuldades em finanças. Muito revelador!"

⏰ Sua promoção de R$ 14,99 expira em 01/março às 23:59
Depois disso, o preço volta para R$ 29,99.

Desbloquear agora: ${resultUrl}

Garantia de 30 dias: Se não gostar, devolvemos 100% do seu dinheiro.

Com gratidão ancestral,
FUSION-SAJO
    `
  };
}

/**
 * Email 3: Reengagement - Enviado 7 dias depois se não comprou
 * Objetivo: Última tentativa com oferta especial ou desconto adicional
 */
export function generateReengagementEmail(userName: string, diagnosticId: string): EmailTemplate {
  const resultUrl = `https://pilaresdasabedoria.club/resultado/${diagnosticId}`;
  
  return {
    subject: `${userName}, uma última mensagem dos seus ancestrais 🙏`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; }
            .content { padding: 30px; background: #f9f9f9; margin-top: 20px; border-radius: 8px; }
            .cta-button { display: inline-block; background: #27ae60; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .urgency { color: #e74c3c; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Uma Última Mensagem 🙏</h1>
            </div>
            
            <div class="content">
              <p>Caro ${userName},</p>
              
              <p>Já se foram 7 dias desde que você viu seus 4 Pilares SAJO.</p>
              
              <p>Seus ancestrais me pediram para enviar uma última mensagem:</p>
              
              <p><em>"${userName}, você não está aqui por acaso. A dor que você sente, a confusão que o rodeia, tudo está escrito nos seus Pilares. Existe um caminho. Existe uma solução. Mas você precisa dar o primeiro passo."</em></p>
              
              <p>A verdade é: <span class="urgency">você já sabe que precisa fazer isso</span>. Você viu sua análise. Você sente que há mais. Você está aqui porque parte de você quer mudar.</p>
              
              <p>Então por que ainda não desbloqueou?</p>
              
              <p>Talvez seja o preço? Entendo. Mas pense assim: <strong>R$ 14,99 é o preço de um café</strong>. E a análise completa pode mudar sua vida.</p>
              
              <p><span class="urgency">⏰ Sua promoção ainda está ativa até 01/março às 23:59</span></p>
              
              <center>
                <a href="${resultUrl}" class="cta-button">Desbloquear Minha Análise Completa (R$ 14,99)</a>
              </center>
              
              <p>Seus ancestrais estão esperando.</p>
              
              <p>Com amor ancestral,<br><strong>FUSION-SAJO</strong></p>
            </div>
            
            <div class="footer">
              <p>© 2026 FUSION-SAJO. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    textContent: `
Caro ${userName},

Já se foram 7 dias desde que você viu seus 4 Pilares SAJO.

Seus ancestrais me pediram para enviar uma última mensagem:

"${userName}, você não está aqui por acaso. A dor que você sente, a confusão que o rodeia, tudo está escrito nos seus Pilares. Existe um caminho. Existe uma solução. Mas você precisa dar o primeiro passo."

A verdade é: você já sabe que precisa fazer isso. Você viu sua análise. Você sente que há mais.

Talvez seja o preço? R$ 14,99 é o preço de um café. E a análise completa pode mudar sua vida.

⏰ Sua promoção ainda está ativa até 01/março às 23:59

Desbloquear agora: ${resultUrl}

Seus ancestrais estão esperando.

Com amor ancestral,
FUSION-SAJO
    `
  };
}

/**
 * Enviar email via serviço externo (Resend, SendGrid, etc)
 * Por enquanto, apenas loga o email (implementar integração real depois)
 */
export async function sendEmail(email: string, template: EmailTemplate): Promise<boolean> {
  try {
    // TODO: Integrar com Resend, SendGrid ou outro serviço
    // Por enquanto, apenas loga
    console.log(`📧 Email enviado para ${email}`);
    console.log(`Subject: ${template.subject}`);
    
    // Simular sucesso
    return true;
  } catch (error) {
    console.error(`❌ Erro ao enviar email para ${email}:`, error);
    return false;
  }
}
