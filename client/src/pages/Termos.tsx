/*
 * Termos.tsx — 4 Pilares LGPD
 */
import { motion } from "framer-motion";
import Layout from "@/components/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Termos() {
  return (
    <Layout>
      <section className="bg-white py-20 border-b border-slate-100">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl">
            <p className="section-number mb-3">Legal</p>
            <h1 className="title-serif text-4xl text-slate-900 mb-4">Termos de Uso</h1>
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
            className="bg-white rounded-2xl border border-slate-200 p-10 shadow-sm"
          >
            <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">1. Aceitação dos Termos</h2>
                <p>Ao acessar e utilizar o site e os serviços da <strong>4 PILARES LGPD</strong> (CNPJ: 58.551.044/0001-90), você concorda com estes Termos de Uso. Caso não concorde, por favor, não utilize nossos serviços.</p>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">2. Descrição dos Serviços</h2>
                <p>A 4 Pilares LGPD oferece serviços de consultoria jurídica especializada em adequação à Lei Geral de Proteção de Dados (LGPD), incluindo diagnóstico, elaboração de documentação, treinamentos, DPO as a Service e monitoramento de conformidade.</p>
                <p className="mt-2">As informações disponibilizadas neste site têm caráter informativo e educativo, não constituindo aconselhamento jurídico específico para sua situação.</p>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">3. Uso do Site</h2>
                <p>É vedado ao usuário:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Utilizar o site para fins ilícitos ou que violem direitos de terceiros</li>
                  <li>Reproduzir conteúdo sem autorização expressa</li>
                  <li>Tentar acessar áreas restritas sem autorização</li>
                  <li>Transmitir vírus ou código malicioso</li>
                  <li>Realizar scraping ou coleta automatizada de dados</li>
                </ul>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">4. Propriedade Intelectual</h2>
                <p>Todo o conteúdo deste site — incluindo textos, metodologias, marcas, logotipos, design e código — é de propriedade exclusiva da 4 Pilares LGPD ou de seus licenciantes, protegido pela legislação de propriedade intelectual aplicável.</p>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">5. Responsabilidade</h2>
                <p>A 4 Pilares LGPD não se responsabiliza por:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Decisões tomadas com base exclusivamente nas informações do site, sem contratação de serviço</li>
                  <li>Danos decorrentes de uso indevido dos serviços</li>
                  <li>Indisponibilidade temporária do site por razões técnicas</li>
                  <li>Conteúdo de sites de terceiros vinculados</li>
                </ul>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">6. Contratos de Serviço</h2>
                <p>A contratação de serviços está sujeita a proposta comercial específica, aceita formalmente pelo cliente. As condições particulares de cada contrato prevalecem sobre estes Termos Gerais em caso de conflito.</p>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">7. Confidencialidade</h2>
                <p>As informações compartilhadas pelo cliente no contexto da prestação de serviços são tratadas com sigilo profissional, nos termos da legislação aplicável e dos contratos firmados.</p>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">8. Alterações nos Termos</h2>
                <p>Reservamo-nos o direito de atualizar estes Termos a qualquer momento. Alterações substanciais serão comunicadas com antecedência razoável. O uso continuado dos serviços após as alterações implica aceitação dos novos termos.</p>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">9. Foro e Lei Aplicável</h2>
                <p>Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da Comarca de Palmas/TO para dirimir quaisquer controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.</p>
              </div>

              <div>
                <h2 className="title-serif text-xl text-slate-900 mb-3">10. Contato</h2>
                <p>Dúvidas sobre estes Termos: <a href="mailto:contato@sajodiagnos.club" className="text-blue-600">contato@sajodiagnos.club</a></p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
