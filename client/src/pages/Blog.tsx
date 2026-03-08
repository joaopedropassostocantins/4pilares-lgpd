/*
 * Blog.tsx — 4 Pilares LGPD
 * Blog institucional — artigos sobre LGPD, jurisprudência, compliance digital
 */
import { motion } from "framer-motion";
import { BookOpen, Calendar, ArrowRight, Tag } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const artigos = [
  {
    tag: "LGPD",
    tagColor: "#1D4ED8",
    tagBg: "#EFF6FF",
    titulo: "O que muda com a LGPD para pequenas empresas em 2024",
    resumo: "Análise das principais obrigações da LGPD aplicáveis a microempresas e EPPs, com foco nas medidas prioritárias e nos riscos mais comuns.",
    data: "15 Jan 2024",
    leitura: "8 min",
  },
  {
    tag: "Jurisprudência",
    tagColor: "#059669",
    tagBg: "#ECFDF5",
    titulo: "Primeiras sanções da ANPD: o que aprender com os casos julgados",
    resumo: "Revisão dos primeiros processos administrativos sancionatórios da ANPD e as lições para empresas que ainda estão em processo de adequação.",
    data: "22 Jan 2024",
    leitura: "12 min",
  },
  {
    tag: "Compliance",
    tagColor: "#EA580C",
    tagBg: "#FFF7ED",
    titulo: "DPO as a Service: quando contratar e como funciona",
    resumo: "Guia completo sobre o papel do Encarregado de Dados, quando a modalidade externa é adequada e como estruturar o serviço.",
    data: "05 Fev 2024",
    leitura: "10 min",
  },
  {
    tag: "Titular",
    tagColor: "#7C3AED",
    tagBg: "#F5F3FF",
    titulo: "Como estruturar o canal de atendimento ao titular de dados",
    resumo: "Passo a passo para criar um canal eficiente de exercício de direitos dos titulares, com fluxos de atendimento e prazos legais.",
    data: "18 Fev 2024",
    leitura: "7 min",
  },
  {
    tag: "LGPD",
    tagColor: "#1D4ED8",
    tagBg: "#EFF6FF",
    titulo: "ROPA: como elaborar o registro de atividades de tratamento",
    resumo: "Tutorial detalhado sobre o Registro de Operações de Processamento de Dados, com modelo de planilha e exemplos práticos.",
    data: "01 Mar 2024",
    leitura: "15 min",
  },
  {
    tag: "Compliance",
    tagColor: "#EA580C",
    tagBg: "#FFF7ED",
    titulo: "Transferência internacional de dados: o que sua empresa precisa saber",
    resumo: "Análise das hipóteses de transferência internacional permitidas pela LGPD e as cláusulas contratuais padrão aprovadas pela ANPD.",
    data: "12 Mar 2024",
    leitura: "11 min",
  },
];

export default function Blog() {
  return (
    <Layout>
      <section className="bg-white py-20 border-b border-slate-100">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl">
            <p className="section-number mb-3">Blog</p>
            <h1 className="title-serif text-4xl lg:text-5xl text-slate-900 mb-4">
              Artigos sobre LGPD e privacidade
            </h1>
            <p className="text-slate-600 text-lg">
              Conteúdo especializado sobre proteção de dados, compliance digital e jurisprudência da ANPD.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artigos.map((artigo, i) => (
              <motion.div
                key={artigo.titulo}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col">
                  <div className="h-2" style={{ backgroundColor: artigo.tagColor }} />
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: artigo.tagBg, color: artigo.tagColor }}
                      >
                        <Tag className="w-3 h-3" />
                        {artigo.tag}
                      </span>
                    </div>
                    <h3 className="title-serif text-lg text-slate-900 mb-3 group-hover:text-blue-700 transition-colors leading-snug">
                      {artigo.titulo}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-4">{artigo.resumo}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {artigo.data}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {artigo.leitura}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 mb-4">Mais artigos em breve. Assine nossa newsletter para ser notificado.</p>
            <a
              href="mailto:contato@sajodiagnos.club?subject=Newsletter 4 Pilares LGPD"
              className="inline-flex items-center gap-2 px-6 h-11 rounded-xl text-sm font-medium bg-blue-700 text-white no-underline hover:bg-blue-800 transition-colors"
            >
              Assinar newsletter <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
