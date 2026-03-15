/*
 * PilarConformidade.tsx — 4 Pilares LGPD
 * Pilar da Conformidade — #EA580C
 */
import { motion } from "framer-motion";
import { Shield, ClipboardList, BarChart3, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const COLOR = "#EA580C";
const BG_LIGHT = "#FFF7ED";

const topicos = [
  { icon: ClipboardList, title: "Diagnóstico de Maturidade", desc: "Avaliação do nível atual de conformidade da empresa com a LGPD, identificando lacunas e prioridades de ação." },
  { icon: Shield, title: "Implementação Técnica", desc: "Aplicação de medidas de segurança, controles de acesso, criptografia e demais salvaguardas técnicas exigidas pela lei." },
  { icon: BarChart3, title: "Monitoramento Contínuo", desc: "Acompanhamento periódico da conformidade, relatórios de status e atualização de processos conforme mudanças regulatórias." },
  { icon: AlertTriangle, title: "Gestão de Incidentes", desc: "Plano de resposta a incidentes de segurança, notificação à ANPD e aos titulares afetados, e medidas corretivas." },
];

export default function PilarConformidade() {
  return (
    <Layout>
      <section className="py-20 border-b border-slate-100" style={{ backgroundColor: BG_LIGHT }}>
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLOR }}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-mono font-medium tracking-widest uppercase" style={{ color: COLOR }}>
                Pilar 03 · CONFORMIDADE
              </span>
            </div>
            <h1 className="title-serif text-4xl lg:text-5xl text-slate-900 mb-4">Pilar da Conformidade</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Diagnóstico, plano de adequação, implementação técnica e jurídica para garantir conformidade contínua com a LGPD.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container">
          <div className="mb-10">
            <h2 className="title-serif text-2xl text-slate-900 mb-2">O que abrange este pilar</h2>
            <p className="text-slate-600 text-sm">Ações práticas para alcançar e manter a conformidade com a LGPD.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {topicos.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-shadow"
                  style={{ borderTop: `3px solid ${COLOR}` }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: BG_LIGHT }}>
                    <Icon className="w-4 h-4" style={{ color: COLOR }} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{t.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{t.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: BG_LIGHT }}>
        <div className="container text-center">
          <h2 className="title-serif text-2xl text-slate-900 mb-3">Sua empresa está em conformidade com a LGPD?</h2>
          <p className="text-slate-600 mb-6 text-sm">Solicite um diagnóstico gratuito e descubra em qual estágio você está.</p>
          <Link href="/contato">
            <Button className="h-11 px-8 rounded-xl font-medium text-white" style={{ backgroundColor: COLOR }}>
              Solicitar diagnóstico <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
