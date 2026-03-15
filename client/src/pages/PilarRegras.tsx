/*
 * PilarRegras.tsx — 4 Pilares LGPD
 * Pilar das Regras — #059669
 */
import { motion } from "framer-motion";
import { BookOpen, FileCheck, Users, Settings, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const COLOR = "#059669";
const BG_LIGHT = "#ECFDF5";

const topicos = [
  { icon: FileCheck, title: "Políticas Internas", desc: "Elaboração de políticas de privacidade, segurança da informação, retenção de dados e resposta a incidentes alinhadas à LGPD." },
  { icon: BookOpen, title: "Normas da ANPD", desc: "Acompanhamento das resoluções, guias e orientações da Autoridade Nacional de Proteção de Dados para garantir conformidade atualizada." },
  { icon: Users, title: "Contratos e Terceiros", desc: "Revisão e adequação de contratos com fornecedores, parceiros e operadores de dados, incluindo cláusulas de proteção de dados." },
  { icon: Settings, title: "Procedimentos Operacionais", desc: "Definição de fluxos de trabalho para coleta, tratamento, armazenamento e descarte de dados pessoais." },
];

export default function PilarRegras() {
  return (
    <Layout>
      <section className="py-20 border-b border-slate-100" style={{ backgroundColor: BG_LIGHT }}>
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLOR }}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-mono font-medium tracking-widest uppercase" style={{ color: COLOR }}>
                Pilar 02 · REGRAS
              </span>
            </div>
            <h1 className="title-serif text-4xl lg:text-5xl text-slate-900 mb-4">Pilar das Regras</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Mapeamento e implementação das regras internas de privacidade, políticas de tratamento de dados e normas da ANPD para sua empresa.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container">
          <div className="mb-10">
            <h2 className="title-serif text-2xl text-slate-900 mb-2">O que abrange este pilar</h2>
            <p className="text-slate-600 text-sm">Regras e políticas que estruturam a governança de dados da sua empresa.</p>
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
          <h2 className="title-serif text-2xl text-slate-900 mb-3">Quer estruturar as regras de privacidade da sua empresa?</h2>
          <p className="text-slate-600 mb-6 text-sm">Elaboramos políticas e procedimentos personalizados para o seu negócio.</p>
          <Link href="/contato">
            <Button className="h-11 px-8 rounded-xl font-medium text-white" style={{ backgroundColor: COLOR }}>
              Solicitar proposta <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
