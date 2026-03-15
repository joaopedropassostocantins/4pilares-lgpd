/*
 * FAQ.tsx — 4 Pilares LGPD
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const categorias = [
  {
    cat: "Sobre a LGPD",
    faqs: [
      { q: "O que é a LGPD?", a: "A Lei Geral de Proteção de Dados (Lei 13.709/2018) é a legislação brasileira que regula o tratamento de dados pessoais por pessoas físicas e jurídicas, de direito público ou privado, com o objetivo de proteger os direitos fundamentais de liberdade e privacidade." },
      { q: "Quem precisa se adequar à LGPD?", a: "Toda empresa ou pessoa física que realiza tratamento de dados pessoais de pessoas naturais localizadas no Brasil, independentemente do porte, setor ou localização da empresa." },
      { q: "Quais são as penalidades por descumprimento?", a: "A ANPD pode aplicar advertências, multas simples de até 2% do faturamento (limitada a R$ 50 milhões por infração), multa diária, publicização da infração, bloqueio e eliminação dos dados pessoais." },
    ],
  },
  {
    cat: "Processo de Adequação",
    faqs: [
      { q: "Quanto tempo leva a adequação?", a: "Depende do porte e complexidade da empresa. Microempresas: 30-60 dias. PMEs: 60-120 dias. Grandes empresas: 6-12 meses. O diagnóstico inicial define o cronograma real." },
      { q: "Por onde começo?", a: "O primeiro passo é o diagnóstico de maturidade em privacidade, que mapeia o fluxo de dados, identifica riscos e lacunas, e define as prioridades do plano de adequação." },
      { q: "Preciso contratar um DPO?", a: "A LGPD exige que controladores e operadores indiquem um Encarregado (DPO). Ele pode ser interno ou externo. Oferecemos o serviço de DPO as a Service para empresas que não têm estrutura para um DPO dedicado." },
    ],
  },
  {
    cat: "Documentação",
    faqs: [
      { q: "Quais documentos são obrigatórios?", a: "Os principais são: Política de Privacidade, Aviso de Cookies, Registro de Atividades de Tratamento (ROPA), Relatório de Impacto (RIPD), contratos com operadores e procedimentos de resposta a incidentes." },
      { q: "A Política de Privacidade precisa ser específica para minha empresa?", a: "Sim. Modelos genéricos não atendem às exigências da LGPD. A política deve refletir as atividades reais de tratamento de dados da sua empresa, com linguagem clara e acessível." },
      { q: "O que é o ROPA?", a: "O Registro de Operações de Processamento de Dados (ROPA) é o inventário de todas as atividades de tratamento de dados da empresa: quais dados são coletados, com qual finalidade, base legal, prazo de retenção e com quem são compartilhados." },
    ],
  },
  {
    cat: "Titular dos Dados",
    faqs: [
      { q: "Quais são os direitos do titular?", a: "Acesso, correção, anonimização, portabilidade, eliminação, informação sobre compartilhamento, não consentimento com decisões automatizadas e revogação do consentimento." },
      { q: "Como devo responder às solicitações dos titulares?", a: "A LGPD exige resposta em prazo razoável (interpretado como até 15 dias). É necessário ter um canal de atendimento identificado e procedimentos claros para cada tipo de solicitação." },
      { q: "O que fazer em caso de incidente de segurança?", a: "Comunicar à ANPD e aos titulares afetados em prazo razoável, conforme a gravidade do incidente. É necessário ter um plano de resposta a incidentes previamente estabelecido." },
    ],
  },
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <Layout>
      <section className="bg-white py-20 border-b border-slate-100">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl">
            <p className="section-number mb-3">FAQ</p>
            <h1 className="title-serif text-4xl lg:text-5xl text-slate-900 mb-4">
              Perguntas frequentes
            </h1>
            <p className="text-slate-600 text-lg">
              Respondemos as principais dúvidas sobre LGPD, adequação, documentação e direitos dos titulares.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container max-w-3xl mx-auto">
          {categorias.map((cat, ci) => (
            <motion.div
              key={cat.cat}
              custom={ci}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mb-10"
            >
              <h2 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider font-mono text-slate-500">{cat.cat}</h2>
              <div className="space-y-2">
                {cat.faqs.map((faq, fi) => {
                  const key = `${ci}-${fi}`;
                  return (
                    <div key={fi} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenItem(openItem === key ? null : key)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-medium text-slate-900 text-sm pr-4">{faq.q}</span>
                        {openItem === key ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        )}
                      </button>
                      {openItem === key && (
                        <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          <div className="bg-blue-700 rounded-2xl p-8 text-center text-white mt-12">
            <h3 className="title-serif text-2xl mb-3">Não encontrou sua resposta?</h3>
            <p className="text-blue-200 mb-6 text-sm">Entre em contato e responderemos em até 24 horas úteis.</p>
            <Link href="/contato">
              <Button className="bg-white text-blue-700 hover:bg-blue-50 h-10 px-6 rounded-xl font-medium">
                Fale conosco <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
