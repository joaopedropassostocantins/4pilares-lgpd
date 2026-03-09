/*
 * Preco.tsx — 4 Pilares LGPD
 * Página de preços com 5 planos e integração com checkout
 */
import { motion } from "framer-motion";
import { Check, X, ArrowRight, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { PLANOS_ARRAY, formatarPreco, formatarPrecoSimples } from "@/const/pricing";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function Preco() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-white py-20 border-b border-slate-100">
        <div className="container text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl mx-auto">
            <p className="section-number mb-3">Preços</p>
            <h1 className="title-serif text-4xl lg:text-5xl text-slate-900 mb-4">
              Escolha seu plano de adequação LGPD
            </h1>
            <p className="text-slate-600 text-lg">
              Todos os planos incluem diagnóstico inicial, documentação base e suporte especializado. Sem taxas ocultas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Planos */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
            {PLANOS_ARRAY.map((plano, i) => (
              <motion.div
                key={plano.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`relative rounded-2xl p-6 border transition-all ${
                  plano.highlight
                    ? "bg-gradient-to-b from-slate-900 to-slate-800 border-slate-700 shadow-2xl scale-105 lg:col-span-2"
                    : "bg-white border-slate-200 shadow-sm hover:shadow-md"
                }`}
              >
                {plano.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-xs font-semibold text-white rounded-full" style={{ backgroundColor: plano.color }}>
                      {plano.badge}
                    </span>
                  </div>
                )}

                <div className="w-2 h-6 rounded-full mb-4" style={{ backgroundColor: plano.color }} />

                <h3 className={`title-serif text-xl mb-1 ${plano.highlight ? "text-white" : "text-slate-900"}`}>
                  {plano.nome}
                </h3>
                <p className={`text-xs mb-6 ${plano.highlight ? "text-slate-400" : "text-slate-500"}`}>
                  {plano.tagline}
                </p>

                {/* Preço */}
                <div className="mb-6">
                  {plano.precoPromocional ? (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-bold ${plano.highlight ? "text-white" : "text-slate-900"}`} style={{ fontFamily: "var(--font-mono)" }}>
                          {formatarPrecoSimples(plano.precoPromocional)}
                        </span>
                        <span className={`text-xs ${plano.highlight ? "text-slate-500" : "text-slate-400"}`}>/mês</span>
                      </div>
                      <div className={`text-xs mt-1 line-through ${plano.highlight ? "text-slate-600" : "text-slate-400"}`}>
                        {formatarPrecoSimples(plano.precoNormal)}
                      </div>
                      <div className={`text-xs mt-2 font-medium ${plano.highlight ? "text-green-400" : "text-green-600"}`}>
                        {plano.desconto} de desconto por {plano.mesesPromocao} meses
                      </div>
                    </div>
                  ) : plano.precoNormal ? (
                    <div className="flex items-baseline gap-2">
                      <span className={`text-2xl font-bold ${plano.highlight ? "text-white" : "text-slate-900"}`} style={{ fontFamily: "var(--font-mono)" }}>
                        {formatarPrecoSimples(plano.precoNormal)}
                      </span>
                      <span className={`text-xs ${plano.highlight ? "text-slate-500" : "text-slate-400"}`}>/mês</span>
                    </div>
                  ) : (
                    <div className={`text-lg font-semibold ${plano.highlight ? "text-white" : "text-slate-900"}`}>
                      Sob consulta
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link href={`/checkout?plan=${plano.id}`}>
                  <Button
                    className="w-full h-10 rounded-xl font-medium text-sm mb-6"
                    style={
                      plano.highlight
                        ? { backgroundColor: plano.color, color: "white" }
                        : { backgroundColor: "transparent", color: plano.color, border: `1.5px solid ${plano.color}` }
                    }
                  >
                    {plano.cta} <ArrowRight className="ml-2 w-3.5 h-3.5" />
                  </Button>
                </Link>

                {/* Features */}
                <div className="space-y-2.5 text-xs">
                  {plano.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: plano.color }} />
                      <span className={plano.highlight ? "text-slate-300" : "text-slate-600"}>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ rápido */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-5 h-5 text-slate-400" />
              <h2 className="title-serif text-xl text-slate-900">Dúvidas frequentes</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              {[
                {
                  q: "Posso mudar de plano depois?",
                  a: "Sim, você pode fazer upgrade ou downgrade a qualquer momento. A diferença será ajustada na próxima cobrança.",
                },
                {
                  q: "Qual é o período de contrato?",
                  a: "Todos os planos são mensais e podem ser cancelados a qualquer momento, sem multa.",
                },
                {
                  q: "Como funciona a promoção do Básico ANPD?",
                  a: "Você paga R$150/mês pelos primeiros 12 meses. A partir do 13º mês, o valor volta a R$299/mês.",
                },
                {
                  q: "Vocês aceitam outras formas de pagamento?",
                  a: "Atualmente aceitamos cartão de crédito. Consulte-nos para outras opções.",
                },
              ].map((item) => (
                <div key={item.q}>
                  <p className="font-semibold text-slate-900 mb-2">{item.q}</p>
                  <p className="text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container text-center">
          <h2 className="title-serif text-2xl text-slate-900 mb-3">Pronto para começar?</h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            Escolha seu plano e inicie sua jornada de conformidade LGPD hoje mesmo.
          </p>
          <Link href="/checkout?plan=profissional">
            <Button className="bg-blue-700 hover:bg-blue-800 text-white h-11 px-8 rounded-xl">
              Ir para o checkout <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
