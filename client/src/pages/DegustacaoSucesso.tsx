/*
 * DegustacaoSucesso.tsx — 4 Pilares LGPD
 * Página de sucesso da degustação
 */
import { motion } from "framer-motion";
import { CheckCircle2, Mail, Calendar, Zap, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function DegustacaoSucesso() {
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
            <h1 className="title-serif text-4xl lg:text-5xl text-slate-900 mb-4">Degustação iniciada!</h1>
            <p className="text-lg text-slate-600 mb-8">
              Obrigado por escolher 4 Pilares LGPD. Você receberá um e-mail em breve com os próximos passos e acesso ao seu painel de degustação.
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
              <Link href="/">
                <Button className="bg-blue-700 hover:bg-blue-800 text-white h-11 px-6 rounded-xl">
                  Voltar ao início
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* O que esperar */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="title-serif text-3xl text-slate-900 text-center mb-16">O que esperar nos próximos dias</h2>

            <div className="space-y-6">
              {[
                {
                  numero: 1,
                  icon: Mail,
                  titulo: "E-mail de Confirmação",
                  descricao: "Você receberá um e-mail com os dados da sua degustação e um link para acessar o painel.",
                  tempo: "Imediato",
                  color: "#1D4ED8",
                },
                {
                  numero: 2,
                  icon: Zap,
                  titulo: "Acesso ao Painel de Degustação",
                  descricao: "Explore o painel interativo com visualização dos 4 pilares, módulos e status de conformidade.",
                  tempo: "Até 1 hora",
                  color: "#059669",
                },
                {
                  numero: 3,
                  icon: Calendar,
                  titulo: "Contato do Especialista",
                  descricao: "Nosso time entrará em contato para agendar uma demonstração personalizada e responder dúvidas.",
                  tempo: "Até 24 horas",
                  color: "#EA580C",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.numero}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-6">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.numero}
                        </div>
                        {i < 2 && (
                          <div className="w-1 h-12 rounded-full" style={{ backgroundColor: item.color + "40" }} />
                        )}
                      </div>

                      <div className="flex-1 pt-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-slate-900 text-lg">{item.titulo}</h3>
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {item.tempo}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{item.descricao}</p>
                      </div>

                      <Icon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Dicas */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
              className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-8"
            >
              <h3 className="font-semibold text-slate-900 mb-4">💡 Dicas para aproveitar ao máximo</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                  <span>
                    <strong>Explore os 4 Pilares</strong> — Navegue por Lei, Regras, Conformidade e Titular para entender a estrutura completa
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                  <span>
                    <strong>Verifique o status</strong> — Veja o progresso de conformidade em cada pilar com base nos dados que você forneceu
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                  <span>
                    <strong>Baixe os documentos</strong> — Acesse templates de políticas, termos e outros documentos base
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                  <span>
                    <strong>Tire suas dúvidas</strong> — Use o WhatsApp ou e-mail para conversar com nosso time especializado
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
              custom={4}
              className="mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900 mb-6">Perguntas frequentes</h3>
              <div className="space-y-4 text-sm">
                {[
                  {
                    q: "Quanto tempo dura a degustação?",
                    a: "A degustação é válida por 14 dias. Você pode contratar um plano a qualquer momento para continuar com acesso completo.",
                  },
                  {
                    q: "Posso converter para um plano pago?",
                    a: "Sim! Você pode contratar qualquer um dos nossos planos (Básico, Essencial, Profissional, Empresarial ou Enterprise) a partir do painel.",
                  },
                  {
                    q: "Meus dados são seguros?",
                    a: "Seus dados são armazenados com segurança em servidores criptografados. Nós seguimos todas as normas de LGPD.",
                  },
                  {
                    q: "Posso cancelar a degustação?",
                    a: "Sim, você pode cancelar a qualquer momento. Se contratar um plano pago, pode cancelar com 7 dias de antecedência.",
                  },
                ].map((item) => (
                  <div key={item.q}>
                    <p className="font-medium text-slate-900 mb-1">{item.q}</p>
                    <p className="text-slate-600">{item.a}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA Final */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={5}
              className="mt-12 text-center"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Pronto para começar?</h3>
              <p className="text-slate-600 mb-6 max-w-xl mx-auto">
                Verifique seu e-mail para acessar o painel de degustação. Se não receber em 5 minutos, verifique a pasta de spam.
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
                <a
                  href="mailto:contato@sajodiagnos.club"
                  className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl text-sm font-medium text-blue-600 border border-blue-600 hover:bg-blue-50 no-underline transition-colors"
                >
                  Enviar E-mail
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
