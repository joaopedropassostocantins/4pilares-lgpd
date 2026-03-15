/*
 * CheckoutSuccess.tsx — 4 Pilares LGPD
 * Tela de sucesso com 5 próximos passos obrigatórios
 */
import { motion } from "framer-motion";
import { CheckCircle2, Mail, FileText, Phone, BarChart3, Calendar, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const passos = [
  {
    numero: 1,
    icon: Mail,
    titulo: "Verifique seu e-mail",
    descricao: "Você receberá um e-mail de confirmação com os dados da sua assinatura e acesso ao painel.",
    tempo: "Imediato",
    color: "#1D4ED8",
  },
  {
    numero: 2,
    icon: FileText,
    titulo: "Envie a Procuração DPO",
    descricao: "Envie o documento de procuração assinado para docs@sajodiagnos.club para ativar o DPO as a Service.",
    tempo: "Até 24h",
    color: "#059669",
  },
  {
    numero: 3,
    icon: Phone,
    titulo: "Aguarde contato do DPO",
    descricao: "Nosso Encarregado de Dados entrará em contato para iniciar o diagnóstico e planejamento.",
    tempo: "Até 1 dia útil",
    color: "#EA580C",
  },
  {
    numero: 4,
    icon: BarChart3,
    titulo: "Acesse o Painel do Cliente",
    descricao: "Faça login no seu painel para acompanhar o progresso da adequação e baixar documentos.",
    tempo: "Sempre disponível",
    color: "#7C3AED",
  },
  {
    numero: 5,
    icon: Calendar,
    titulo: "Agende o Kickoff",
    descricao: "Marque a reunião de kickoff para definir cronograma, responsáveis e próximas etapas.",
    tempo: "Próximos 3 dias",
    color: "#6B21A8",
  },
];

export default function CheckoutSuccess() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white border-b border-slate-100">
        <div className="container text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="mb-6"
            >
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
            </motion.div>
            <h1 className="title-serif text-4xl lg:text-5xl text-slate-900 mb-4">Pagamento confirmado!</h1>
            <p className="text-lg text-slate-600 mb-8">
              Sua assinatura foi ativada com sucesso. Agora siga os 5 próximos passos para começar sua jornada de conformidade LGPD.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/5563984381782"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl text-sm font-medium text-white no-underline"
                style={{ backgroundColor: "#25D366" }}
              >
                Falar no WhatsApp
              </a>
              <Link href="/dashboard">
                <Button className="bg-blue-700 hover:bg-blue-800 text-white h-11 px-6 rounded-xl">
                  Ir para o painel
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5 Passos */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="title-serif text-3xl text-slate-900 text-center mb-16">Próximos passos</h2>

            <div className="space-y-6">
              {passos.map((passo, i) => {
                const Icon = passo.icon;
                return (
                  <motion.div
                    key={passo.numero}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-6">
                      {/* Número e ícone */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2"
                          style={{ backgroundColor: passo.color }}
                        >
                          {passo.numero}
                        </div>
                        {i < passos.length - 1 && (
                          <div className="w-1 h-12 rounded-full" style={{ backgroundColor: passo.color + "40" }} />
                        )}
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-slate-900 text-lg">{passo.titulo}</h3>
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {passo.tempo}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{passo.descricao}</p>

                        {/* CTA específico por passo */}
                        {passo.numero === 1 && (
                          <div className="mt-4">
                            <p className="text-xs text-slate-500 mb-2">Não recebeu o e-mail?</p>
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                              Reenviar e-mail de confirmação
                            </button>
                          </div>
                        )}

                        {passo.numero === 2 && (
                          <div className="mt-4">
                            <a
                              href="mailto:docs@sajodiagnos.club"
                              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 no-underline"
                            >
                              Enviar procuração para docs@sajodiagnos.club
                              <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}

                        {passo.numero === 4 && (
                          <div className="mt-4">
                            <Link href="/dashboard">
                              <button className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                                Acessar painel do cliente
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Resumo */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={5}
              className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-8"
            >
              <h3 className="font-semibold text-slate-900 mb-4">Resumo do que vem por aí</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                  <span>
                    <strong>Diagnóstico completo</strong> — Mapeamento de todos os fluxos de dados da sua empresa
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                  <span>
                    <strong>Documentação base</strong> — Políticas, avisos e contratos personalizados
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                  <span>
                    <strong>Plano de ação</strong> — Roadmap detalhado com prioridades e prazos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                  <span>
                    <strong>Suporte especializado</strong> — Acompanhamento contínuo do seu time
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={6}
              className="mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900 mb-6">Dúvidas frequentes</h3>
              <div className="space-y-4 text-sm">
                {[
                  {
                    q: "Quando começa meu atendimento?",
                    a: "Assim que confirmarmos o recebimento da procuração DPO, nosso Encarregado entrará em contato em até 1 dia útil.",
                  },
                  {
                    q: "Posso cancelar a assinatura?",
                    a: "Sim, você pode cancelar a qualquer momento sem multa. O cancelamento é efetivo a partir do próximo ciclo de cobrança.",
                  },
                  {
                    q: "Como funciona o painel do cliente?",
                    a: "O painel oferece acesso a documentos, acompanhamento de progresso, chamados de suporte e relatórios de conformidade.",
                  },
                  {
                    q: "Qual é o horário de atendimento?",
                    a: "Atendimento de segunda a sexta, das 8h às 18h (horário de Brasília). Suporte 24/7 para clientes Empresarial e Enterprise.",
                  },
                ].map((item) => (
                  <div key={item.q}>
                    <p className="font-medium text-slate-900 mb-1">{item.q}</p>
                    <p className="text-slate-600">{item.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container text-center">
          <h2 className="title-serif text-2xl text-slate-900 mb-3">Precisa de ajuda?</h2>
          <p className="text-slate-600 mb-6">Entre em contato com nosso time de especialistas</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/5563984381782"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl text-sm font-medium text-white no-underline"
              style={{ backgroundColor: "#25D366" }}
            >
              WhatsApp
            </a>
            <a
              href="mailto:contato@sajodiagnos.club"
              className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 no-underline transition-colors"
            >
              E-mail
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
