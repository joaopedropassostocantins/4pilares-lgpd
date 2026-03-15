/*
 * Privacidade.tsx — 4 Pilares LGPD
 */
import { motion } from "framer-motion";
import Layout from "@/components/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Privacidade() {
  return (
    <Layout>
      <section className="bg-white py-20 border-b border-slate-100">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl">
            <p className="section-number mb-3">Legal</p>
            <h1 className="title-serif text-4xl text-slate-900 mb-4">Política de Privacidade</h1>
            <p className="text-slate-500 text-sm font-mono">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="bg-white rounded-2xl border border-slate-200 p-10 shadow-sm prose prose-slate max-w-none"
          >
            <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">1. Identificação do Controlador</h2>
                <p>A <strong>4 PILARES LGPD</strong> (CNPJ: 58.551.044/0001-90), com sede em Palmas/TO, é a controladora dos dados pessoais tratados por meio deste site e dos serviços prestados. O representante é Dr. João Pedro Pereira Passos.</p>
                <p className="mt-2">Para exercer seus direitos ou entrar em contato com o Encarregado (DPO), utilize: <a href="mailto:titular@sajodiagnos.club" className="text-blue-600">titular@sajodiagnos.club</a></p>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">2. Dados Coletados</h2>
                <p>Coletamos os seguintes dados pessoais:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Dados de identificação: nome, e-mail, telefone, empresa</li>
                  <li>Dados de navegação: endereço IP, cookies, logs de acesso</li>
                  <li>Dados de comunicação: mensagens enviadas via formulário ou e-mail</li>
                  <li>Dados contratuais: quando da contratação de serviços</li>
                </ul>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">3. Finalidades e Bases Legais</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left p-3 border border-slate-200 font-medium">Finalidade</th>
                        <th className="text-left p-3 border border-slate-200 font-medium">Base Legal (LGPD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Responder solicitações de contato", "Legítimo interesse (Art. 7º, IX)"],
                        ["Prestação de serviços contratados", "Execução de contrato (Art. 7º, V)"],
                        ["Envio de comunicações comerciais", "Consentimento (Art. 7º, I)"],
                        ["Cumprimento de obrigações legais", "Obrigação legal (Art. 7º, II)"],
                        ["Análise de navegação e melhoria do site", "Legítimo interesse (Art. 7º, IX)"],
                      ].map(([fin, base]) => (
                        <tr key={fin}>
                          <td className="p-3 border border-slate-200">{fin}</td>
                          <td className="p-3 border border-slate-200 font-mono text-slate-500">{base}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">4. Compartilhamento de Dados</h2>
                <p>Não vendemos dados pessoais. Podemos compartilhar dados com:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Prestadores de serviços tecnológicos (hospedagem, e-mail, analytics) — na qualidade de operadores</li>
                  <li>Autoridades públicas, quando exigido por lei</li>
                  <li>Parceiros comerciais, mediante consentimento específico do titular</li>
                </ul>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">5. Direitos dos Titulares</h2>
                <p>Nos termos da LGPD (Art. 18), você tem direito a:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Confirmação da existência de tratamento</li>
                  <li>Acesso aos dados</li>
                  <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                  <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                  <li>Portabilidade dos dados</li>
                  <li>Eliminação dos dados tratados com consentimento</li>
                  <li>Informação sobre compartilhamento</li>
                  <li>Revogação do consentimento</li>
                </ul>
                <p className="mt-3">Para exercer seus direitos: <a href="mailto:titular@sajodiagnos.club" className="text-blue-600">titular@sajodiagnos.club</a></p>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">6. Retenção de Dados</h2>
                <p>Os dados são mantidos pelo tempo necessário para as finalidades descritas, respeitando os prazos legais aplicáveis (ex.: dados fiscais por 5 anos, dados de contratos por 5 anos após o encerramento).</p>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">7. Segurança</h2>
                <p>Adotamos medidas técnicas e organizacionais adequadas para proteger os dados pessoais contra acesso não autorizado, perda, destruição ou divulgação indevida, incluindo criptografia, controle de acesso e monitoramento.</p>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">8. Cookies</h2>
                <p>Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para melhoria da experiência. Você pode gerenciar suas preferências nas configurações do navegador.</p>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">9. Contato e Reclamações</h2>
                <p>Em caso de dúvidas ou reclamações, entre em contato pelo e-mail <a href="mailto:titular@sajodiagnos.club" className="text-blue-600">titular@sajodiagnos.club</a>. Você também pode apresentar reclamação à ANPD (Autoridade Nacional de Proteção de Dados).</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
