/*
 * Planos.tsx — 4 Pilares LGPD
 * Design: Clareza Estrutural — Tabela de planos detalhada
 */
import { motion } from "framer-motion";
import { Check, X, ArrowRight, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const planos = [
  {
    name: "Essencial",
    tagline: "Para começar com segurança",
    color: "#1D4ED8",
    bgLight: "#EFF6FF",
    highlight: false,
    features: {
      "Diagnóstico inicial": true,
      "Política de Privacidade": true,
      "Aviso de Cookies": true,
      "Canal do Titular": "Básico",
      "Treinamento de equipe": "1 sessão",
      "Mapeamento de dados (ROPA)": false,
      "DPO as a Service": false,
      "Contratos com fornecedores": false,
      "Relatório de Impacto (RIPD)": false,
      "Suporte mensal": false,
      "Programa de governança": false,
      "Auditorias periódicas": false,
      "Gestão de incidentes": false,
      "Painel de monitoramento": false,
    },
  },
  {
    name: "Profissional",
    tagline: "Para PMEs com fluxo complexo",
    color: "#059669",
    bgLight: "#ECFDF5",
    highlight: true,
    features: {
      "Diagnóstico inicial": true,
      "Política de Privacidade": true,
      "Aviso de Cookies": true,
      "Canal do Titular": "Completo",
      "Treinamento de equipe": "Ilimitado",
      "Mapeamento de dados (ROPA)": true,
      "DPO as a Service": true,
      "Contratos com fornecedores": true,
      "Relatório de Impacto (RIPD)": true,
      "Suporte mensal": true,
      "Programa de governança": false,
      "Auditorias periódicas": false,
      "Gestão de incidentes": false,
      "Painel de monitoramento": false,
    },
  },
  {
    name: "Empresarial",
    tagline: "Para governança avançada",
    color: "#7C3AED",
    bgLight: "#F5F3FF",
    highlight: false,
    features: {
      "Diagnóstico inicial": true,
      "Política de Privacidade": true,
      "Aviso de Cookies": true,
      "Canal do Titular": "Avançado",
      "Treinamento de equipe": "Ilimitado",
      "Mapeamento de dados (ROPA)": true,
      "DPO as a Service": true,
      "Contratos com fornecedores": true,
      "Relatório de Impacto (RIPD)": true,
      "Suporte mensal": true,
      "Programa de governança": true,
      "Auditorias periódicas": true,
      "Gestão de incidentes": true,
      "Painel de monitoramento": true,
    },
  },
];

const featureKeys = Object.keys(planos[0].features);

export default function Planos() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-white py-20 border-b border-slate-100">
        <div className="container text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <p className="section-number mb-3">Planos</p>
            <h1 className="title-serif text-4xl lg:text-5xl text-slate-900 mb-4">
              Escolha seu plano de adequação
            </h1>
            <p className="text-slate-600 max-w-xl mx-auto">
              Todos os planos incluem diagnóstico inicial e documentação base. Os valores são definidos após análise do porte e complexidade da sua empresa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {planos.map((plano, i) => (
              <motion.div
                key={plano.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`relative rounded-2xl p-8 border ${
                  plano.highlight
                    ? "bg-slate-900 border-slate-700 shadow-2xl"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                {plano.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-xs font-medium text-white rounded-full" style={{ backgroundColor: plano.color }}>
                      Mais popular
                    </span>
                  </div>
                )}
                <div className="w-2 h-8 rounded-full mb-6" style={{ backgroundColor: plano.color }} />
                <h3 className={`title-serif text-2xl mb-1 ${plano.highlight ? "text-white" : "text-slate-900"}`}>
                  {plano.name}
                </h3>
                <p className={`text-sm mb-6 ${plano.highlight ? "text-slate-400" : "text-slate-500"}`}>
                  {plano.tagline}
                </p>
                <div className={`text-2xl font-semibold mb-6 ${plano.highlight ? "text-white" : "text-slate-900"}`} style={{ fontFamily: "var(--font-sans)" }}>
                  Sob consulta
                </div>
                <Link href={`/checkout?plan=${plano.name.toLowerCase()}`}>
                  <Button
                    className="w-full h-11 rounded-xl font-medium"
                    style={
                      plano.highlight
                        ? { backgroundColor: plano.color, color: "white" }
                        : { backgroundColor: "transparent", color: plano.color, border: `1.5px solid ${plano.color}` }
                    }
                  >
                    Escolher plano <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-700 w-1/3">Recurso</th>
                    {planos.map((p) => (
                      <th key={p.name} className="px-6 py-4 text-center">
                        <span className="text-sm font-semibold" style={{ color: p.color }}>{p.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureKeys.map((feature, i) => (
                    <tr key={feature} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}>
                      <td className="px-6 py-3.5 text-sm text-slate-700">{feature}</td>
                      {planos.map((p) => {
                        const val = p.features[feature as keyof typeof p.features];
                        return (
                          <td key={p.name} className="px-6 py-3.5 text-center">
                            {val === true ? (
                              <Check className="w-4 h-4 text-green-600 mx-auto" />
                            ) : val === false ? (
                              <X className="w-4 h-4 text-slate-300 mx-auto" />
                            ) : (
                              <span className="text-xs font-medium text-slate-600">{val}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ rápido */}
      <section className="py-20 bg-white">
        <div className="container max-w-3xl mx-auto text-center">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-4" />
          <h2 className="title-serif text-2xl text-slate-900 mb-3">Tem dúvidas sobre qual plano escolher?</h2>
          <p className="text-slate-600 mb-8">
            Agende uma conversa gratuita de 30 minutos e ajudamos a identificar o melhor caminho para sua empresa.
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
            <Link href="/faq">
              <Button variant="outline" className="h-11 px-6 rounded-xl">
                Ver perguntas frequentes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
