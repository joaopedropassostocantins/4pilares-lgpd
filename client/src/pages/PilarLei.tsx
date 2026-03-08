/*
 * PilarLei.tsx — 4 Pilares LGPD
 * Pilar da Lei — #1D4ED8
 */
import { motion } from "framer-motion";
import { Scale, BookOpen, FileText, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const COLOR = "#1D4ED8";
const BG_LIGHT = "#EFF6FF";

const topicos = [
  { icon: BookOpen, title: "Estrutura da Lei", desc: "A LGPD é composta por 65 artigos organizados em 10 capítulos, abrangendo desde os fundamentos e princípios até as disposições transitórias." },
  { icon: FileText, title: "Bases Legais", desc: "10 hipóteses que autorizam o tratamento de dados pessoais: consentimento, legítimo interesse, execução de contrato, obrigação legal, entre outras." },
  { icon: Scale, title: "Princípios", desc: "Finalidade, adequação, necessidade, livre acesso, qualidade dos dados, transparência, segurança, prevenção, não discriminação e responsabilização." },
  { icon: AlertTriangle, title: "Sanções", desc: "Advertência, multa de até 2% do faturamento (máx. R$ 50M por infração), publicização, bloqueio e eliminação de dados." },
];

export default function PilarLei() {
  return (
    <Layout>
      <section className="py-20 border-b border-slate-100" style={{ backgroundColor: BG_LIGHT }}>
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLOR }}>
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-mono font-medium tracking-widest uppercase" style={{ color: COLOR }}>
                Pilar 01 · LEI
              </span>
            </div>
            <h1 className="title-serif text-4xl lg:text-5xl text-slate-900 mb-4">
              Pilar da Lei
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Compreensão profunda da Lei Geral de Proteção de Dados (Lei 13.709/2018), suas bases legais, princípios, obrigações e penalidades aplicáveis.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container">
          <div className="mb-10">
            <h2 className="title-serif text-2xl text-slate-900 mb-2">O que abrange este pilar</h2>
            <p className="text-slate-600 text-sm">Fundamentos legais que sustentam toda a estrutura de conformidade.</p>
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

      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container max-w-3xl mx-auto">
          <div className="bg-slate-900 rounded-2xl p-8 text-white">
            <h3 className="title-serif text-2xl mb-3">Lei 13.709/2018 — Estrutura</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                { cap: "Cap. I", titulo: "Disposições Preliminares" },
                { cap: "Cap. II", titulo: "Do Tratamento de Dados Pessoais" },
                { cap: "Cap. III", titulo: "Dos Direitos do Titular" },
                { cap: "Cap. IV", titulo: "Do Tratamento pelo Poder Público" },
                { cap: "Cap. V", titulo: "Da Transferência Internacional" },
                { cap: "Cap. VI", titulo: "Dos Agentes de Tratamento" },
                { cap: "Cap. VII", titulo: "Da Segurança e Boas Práticas" },
                { cap: "Cap. VIII", titulo: "Da Fiscalização" },
                { cap: "Cap. IX", titulo: "Da ANPD" },
                { cap: "Cap. X", titulo: "Disposições Finais e Transitórias" },
              ].map((c) => (
                <div key={c.cap} className="flex items-start gap-3 py-2 border-b border-slate-800 last:border-0">
                  <span className="text-xs font-mono text-slate-400 flex-shrink-0 mt-0.5">{c.cap}</span>
                  <span className="text-slate-300">{c.titulo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: BG_LIGHT }}>
        <div className="container text-center">
          <h2 className="title-serif text-2xl text-slate-900 mb-3">Precisa de orientação jurídica sobre a LGPD?</h2>
          <p className="text-slate-600 mb-6 text-sm">Nossa equipe está pronta para esclarecer dúvidas e orientar sua empresa.</p>
          <Link href="/contato">
            <Button className="h-11 px-8 rounded-xl font-medium text-white" style={{ backgroundColor: COLOR }}>
              Falar com especialista <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
