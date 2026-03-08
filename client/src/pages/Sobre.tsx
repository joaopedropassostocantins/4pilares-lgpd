/*
 * Sobre.tsx — 4 Pilares LGPD
 * Design: Clareza Estrutural — Apresentação institucional, missão, valores, representante
 */
import { motion } from "framer-motion";
import { Scale, Target, Eye, Heart, Award, MapPin, Globe, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const valores = [
  { icon: Scale, title: "Rigor Jurídico", desc: "Atuação fundamentada na lei, com interpretação técnica precisa e atualizada." },
  { icon: Target, title: "Foco em Resultados", desc: "Conformidade real, não apenas documental. Processos que funcionam na prática." },
  { icon: Eye, title: "Transparência", desc: "Comunicação clara sobre cada etapa, custo e responsabilidade do processo." },
  { icon: Heart, title: "Compromisso com o Titular", desc: "Respeito genuíno aos direitos das pessoas cujos dados são tratados." },
];

export default function Sobre() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-white py-20 border-b border-slate-100">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <p className="section-number mb-3">Sobre nós</p>
            <h1 className="title-serif text-4xl lg:text-5xl text-slate-900 mb-6">
              Especialistas em adequação à{" "}
              <span className="italic text-blue-700">LGPD</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              A 4 Pilares LGPD é uma plataforma jurídica-digital especializada em adequação à Lei Geral de Proteção de Dados. Combinamos expertise jurídica com tecnologia para oferecer soluções práticas e escaláveis para empresas brasileiras.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Missão / Visão */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                label: "Missão",
                color: "#1D4ED8",
                bg: "#EFF6FF",
                text: "Tornar a adequação à LGPD acessível, estruturada e eficaz para empresas de todos os portes, por meio de metodologia clara e suporte especializado.",
              },
              {
                icon: Eye,
                label: "Visão",
                color: "#059669",
                bg: "#ECFDF5",
                text: "Ser a referência nacional em plataformas de governança de dados pessoais, integrando direito, tecnologia e educação para um ecossistema digital mais seguro.",
              },
              {
                icon: Heart,
                label: "Valores",
                color: "#7C3AED",
                bg: "#F5F3FF",
                text: "Rigor jurídico, transparência, compromisso com o titular dos dados, inovação responsável e foco em resultados concretos para nossos clientes.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: item.bg }}>
                    <Icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-3">{item.label}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Representante */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <p className="section-number mb-3">Representante</p>
                <h2 className="title-serif text-3xl text-slate-900 mb-4">
                  Dr. João Pedro Pereira Passos
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Especialista em Direito Digital e Proteção de Dados, com atuação focada em adequação à LGPD para empresas brasileiras. Combina formação jurídica sólida com visão tecnológica para oferecer soluções práticas e eficazes.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    Palmas / TO — Atendimento nacional
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span className="font-mono text-xs">ORCID: 0000-0001-7181-4587</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Award className="w-4 h-4 text-slate-400" />
                    DPO certificado · Especialista LGPD
                  </div>
                </div>
              </motion.div>

              <motion.div
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-slate-900 rounded-2xl p-8 text-white"
              >
                <p className="text-xs font-mono text-slate-400 mb-4 uppercase tracking-wider">Dados da empresa</p>
                <div className="space-y-4">
                  {[
                    { label: "Razão Social", value: '4 PILARES LGPD "LEI-REGRAS-CONFORMIDADE-TITULAR DOS DADOS"' },
                    { label: "CNPJ", value: "58.551.044/0001-90" },
                    { label: "Cidade-base", value: "Palmas / TO" },
                    { label: "Atendimento", value: "100% remoto nacional" },
                  ].map((item) => (
                    <div key={item.label} className="border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                      <p className="text-xs text-slate-500 font-mono mb-1">{item.label}</p>
                      <p className="text-sm text-slate-200">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className="mb-12">
            <p className="section-number mb-3">Nossos valores</p>
            <h2 className="title-serif text-3xl text-slate-900">O que nos guia</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="bg-white rounded-xl p-6 border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                    <Icon className="w-4 h-4 text-slate-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2 text-sm">{v.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-700">
        <div className="container text-center">
          <h2 className="title-serif text-3xl text-white mb-4">Pronto para iniciar sua adequação?</h2>
          <p className="text-blue-200 mb-8 max-w-md mx-auto">
            Solicite um diagnóstico inicial e descubra em qual estágio sua empresa está.
          </p>
          <Link href="/contato">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 h-12 px-8 rounded-xl font-medium">
              Solicitar diagnóstico <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
