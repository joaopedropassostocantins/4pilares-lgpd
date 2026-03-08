/*
 * Home.tsx — 4 Pilares LGPD
 * Design: Clareza Estrutural — Hero assimétrico, pilares coloridos, etapas, planos, FAQ, contato
 */
import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Scale, BookOpen, CheckSquare, Shield, User,
  ArrowRight, ChevronDown, ChevronUp, MessageSquare,
  ClipboardList, Settings, BarChart3, Check, Phone, Mail, Building2
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663415001648/Upm86DCCjih7you9GHjCBU/hero-lgpd-o8y2c2LyKb9sUXmaHSC728.webp";

const pilares = [
  {
    id: "lei",
    label: "LEI",
    color: "#1D4ED8",
    bgLight: "#EFF6FF",
    icon: Scale,
    title: "Pilar da Lei",
    desc: "Compreensão profunda da Lei Geral de Proteção de Dados (Lei 13.709/2018), suas bases legais, obrigações e penalidades aplicáveis.",
    href: "/lei",
  },
  {
    id: "regras",
    label: "REGRAS",
    color: "#059669",
    bgLight: "#ECFDF5",
    icon: BookOpen,
    title: "Pilar das Regras",
    desc: "Mapeamento e implementação das regras internas de privacidade, políticas de tratamento de dados e normas da ANPD.",
    href: "/regras",
  },
  {
    id: "conformidade",
    label: "CONFORMIDADE",
    color: "#EA580C",
    bgLight: "#FFF7ED",
    icon: Shield,
    title: "Pilar da Conformidade",
    desc: "Diagnóstico, plano de adequação, implementação técnica e jurídica para garantir conformidade contínua com a LGPD.",
    href: "/conformidade",
  },
  {
    id: "titular",
    label: "TITULAR",
    color: "#7C3AED",
    bgLight: "#F5F3FF",
    icon: User,
    title: "Pilar do Titular",
    desc: "Canal de atendimento e gestão dos direitos dos titulares de dados: acesso, correção, exclusão e portabilidade.",
    href: "/titular",
  },
];

const etapas = [
  {
    num: "01",
    icon: ClipboardList,
    title: "Diagnóstico",
    desc: "Mapeamento completo do fluxo de dados da empresa, identificação de riscos e lacunas de conformidade.",
  },
  {
    num: "02",
    icon: Settings,
    title: "Plano de Adequação",
    desc: "Elaboração de roadmap personalizado com prioridades, prazos e responsáveis para cada ação necessária.",
  },
  {
    num: "03",
    icon: CheckSquare,
    title: "Implementação",
    desc: "Execução das medidas técnicas e jurídicas: políticas, contratos, treinamentos e controles internos.",
  },
  {
    num: "04",
    icon: BarChart3,
    title: "Monitoramento",
    desc: "Acompanhamento contínuo da conformidade, atualização de processos e relatórios periódicos de status.",
  },
];

const planos = [
  {
    name: "Essencial",
    price: "Sob consulta",
    desc: "Para microempresas e profissionais autônomos que precisam de adequação básica.",
    features: [
      "Diagnóstico inicial",
      "Política de Privacidade",
      "Aviso de Cookies",
      "Canal do Titular básico",
      "1 treinamento de equipe",
    ],
    cta: "Solicitar proposta",
    highlight: false,
    color: "#1D4ED8",
  },
  {
    name: "Profissional",
    price: "Sob consulta",
    desc: "Para pequenas e médias empresas com fluxo de dados mais complexo.",
    features: [
      "Tudo do Essencial",
      "Mapeamento de dados (ROPA)",
      "DPO as a Service",
      "Contratos com fornecedores",
      "Relatório de Impacto (RIPD)",
      "Suporte mensal",
    ],
    cta: "Solicitar proposta",
    highlight: true,
    color: "#059669",
  },
  {
    name: "Empresarial",
    price: "Sob consulta",
    desc: "Para empresas de médio e grande porte com necessidades avançadas de governança.",
    features: [
      "Tudo do Profissional",
      "Programa de governança completo",
      "Auditorias periódicas",
      "Gestão de incidentes",
      "Treinamentos ilimitados",
      "Painel de monitoramento",
    ],
    cta: "Solicitar proposta",
    highlight: false,
    color: "#7C3AED",
  },
];

const faqs = [
  {
    q: "O que é a LGPD e por que minha empresa precisa se adequar?",
    a: "A Lei Geral de Proteção de Dados (Lei 13.709/2018) regula o tratamento de dados pessoais no Brasil. Empresas que não se adequam estão sujeitas a multas de até R$ 50 milhões por infração, além de danos reputacionais e sanções administrativas da ANPD.",
  },
  {
    q: "Qual o prazo para adequação à LGPD?",
    a: "A LGPD já está em vigor. As sanções administrativas estão ativas desde agosto de 2021. Quanto antes sua empresa iniciar o processo, menor o risco de autuações e incidentes.",
  },
  {
    q: "Quais documentos minha empresa precisa ter?",
    a: "Os principais são: Política de Privacidade, Aviso de Cookies, Registro de Atividades de Tratamento (ROPA), Relatório de Impacto à Proteção de Dados (RIPD), contratos com operadores e procedimentos de resposta a incidentes.",
  },
  {
    q: "O que é o titular dos dados e quais são seus direitos?",
    a: "O titular é a pessoa natural a quem os dados se referem. Seus direitos incluem: acesso, correção, anonimização, portabilidade, eliminação, informação sobre compartilhamento e revogação do consentimento.",
  },
  {
    q: "Minha empresa precisa ter um DPO (Encarregado de Dados)?",
    a: "A LGPD exige que controladores e operadores indiquem um Encarregado. Ele pode ser interno ou externo (DPO as a Service). Oferecemos essa modalidade para empresas que não têm estrutura para manter um DPO dedicado.",
  },
  {
    q: "Quanto tempo leva o processo de adequação?",
    a: "Depende do porte e complexidade da empresa. Em média: microempresas de 30 a 60 dias, PMEs de 60 a 120 dias, grandes empresas de 6 a 12 meses. Iniciamos com um diagnóstico para definir o cronograma real.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ nome: "", empresa: "", email: "", mensagem: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada! Entraremos em contato em breve.");
    setForm({ nome: "", empresa: "", email: "", mensagem: "" });
  };

  return (
    <Layout>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-white">
        <div className="container py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-mono text-blue-700 tracking-wide">LGPD · Lei 13.709/2018</span>
              </div>
              <h1 className="title-serif text-4xl lg:text-5xl xl:text-6xl text-slate-900 mb-6 leading-tight">
                Adequação à LGPD estruturada em{" "}
                <span className="italic text-blue-700">4 pilares.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                Diagnóstico, governança e gestão de privacidade para empresas brasileiras. Segurança jurídica com metodologia clara e resultados mensuráveis.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/contato">
                  <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white px-6 h-12 rounded-xl font-medium">
                    Iniciar diagnóstico
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <a
                  href="https://wa.me/5563984381782"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-xl text-sm font-medium text-white no-underline transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Falar no WhatsApp
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex items-center gap-6 flex-wrap">
                {["LGPD Compliant", "ANPD Alinhado", "100% Remoto"].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    {badge}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={HERO_IMAGE}
                  alt="4 Pilares LGPD — Representação visual dos pilares"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-slate-200 px-4 py-3">
                <p className="text-xs font-mono text-slate-500 mb-0.5">Atendimento</p>
                <p className="text-sm font-semibold text-slate-900">Nacional · 100% Remoto</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== 4 PILARES ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className="mb-12">
            <p className="section-number mb-3">02 — Os Pilares</p>
            <h2 className="title-serif text-3xl lg:text-4xl text-slate-900 mb-4">
              A metodologia dos 4 pilares
            </h2>
            <p className="text-slate-600 max-w-xl">
              Nossa abordagem estrutura a adequação à LGPD em quatro dimensões complementares, garantindo uma conformidade completa e sustentável.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pilares.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Link href={p.href} className="no-underline block h-full">
                    <div
                      className="h-full bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                      style={{ borderTop: `3px solid ${p.color}` }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: p.bgLight }}
                      >
                        <Icon className="w-5 h-5" style={{ color: p.color }} />
                      </div>
                      <span
                        className="text-xs font-mono font-medium tracking-widest uppercase mb-2 block"
                        style={{ color: p.color }}
                      >
                        {p.label}
                      </span>
                      <h3 className="title-serif text-lg text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-medium" style={{ color: p.color }}>
                        Saiba mais <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== COMO FUNCIONA ===== */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="mb-12">
            <p className="section-number mb-3">03 — Metodologia</p>
            <h2 className="title-serif text-3xl lg:text-4xl text-slate-900 mb-4">
              Como funciona o processo
            </h2>
            <p className="text-slate-600 max-w-xl">
              Da análise inicial à conformidade contínua, seguimos um processo estruturado em quatro etapas claras.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {etapas.map((e, i) => {
              const Icon = e.icon;
              return (
                <motion.div
                  key={e.num}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="relative"
                >
                  {i < etapas.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-slate-200 z-0" style={{ width: "calc(100% - 2rem)", left: "calc(100% - 1rem)" }} />
                  )}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl font-mono font-medium text-slate-200">{e.num}</span>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-600" />
                      </div>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">{e.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{e.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PLANOS ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className="mb-12 text-center">
            <p className="section-number mb-3">04 — Planos</p>
            <h2 className="title-serif text-3xl lg:text-4xl text-slate-900 mb-4">
              Planos de adequação
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Escolha o plano que melhor se adapta ao porte e às necessidades da sua empresa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                    ? "bg-slate-900 border-slate-700 shadow-2xl scale-105"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                {plano.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                      Mais popular
                    </span>
                  </div>
                )}
                <div
                  className="w-2 h-8 rounded-full mb-6"
                  style={{ backgroundColor: plano.color }}
                />
                <h3
                  className={`title-serif text-2xl mb-1 ${plano.highlight ? "text-white" : "text-slate-900"}`}
                >
                  {plano.name}
                </h3>
                <p className={`text-sm mb-6 ${plano.highlight ? "text-slate-400" : "text-slate-500"}`}>
                  {plano.desc}
                </p>
                <ul className="space-y-3 mb-8">
                  {plano.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: plano.color }}
                      />
                      <span className={`text-sm ${plano.highlight ? "text-slate-300" : "text-slate-600"}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/contato">
                  <Button
                    className="w-full h-11 rounded-xl font-medium"
                    style={
                      plano.highlight
                        ? { backgroundColor: plano.color, color: "white" }
                        : { backgroundColor: "transparent", color: plano.color, border: `1.5px solid ${plano.color}` }
                    }
                  >
                    {plano.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="mb-12 text-center">
              <p className="section-number mb-3">05 — Perguntas Frequentes</p>
              <h2 className="title-serif text-3xl lg:text-4xl text-slate-900 mb-4">
                Dúvidas sobre LGPD
              </h2>
              <p className="text-slate-600">
                Respondemos as principais dúvidas sobre adequação à LGPD.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="border border-slate-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium text-slate-900 text-sm pr-4">{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTATO ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
            {/* Info */}
            <div>
              <p className="section-number mb-3">06 — Contato</p>
              <h2 className="title-serif text-3xl lg:text-4xl text-slate-900 mb-4">
                Fale com a equipe
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Solicite seu diagnóstico inicial gratuito ou tire dúvidas sobre adequação à LGPD. Respondemos em até 24 horas úteis.
              </p>

              <div className="space-y-4">
                <a href="https://wa.me/5563984381782" className="flex items-center gap-3 text-slate-700 hover:text-green-600 transition-colors no-underline">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-mono">WhatsApp</p>
                    <p className="text-sm font-medium">(63) 98438-1782</p>
                  </div>
                </a>
                <a href="mailto:contato@sajodiagnos.club" className="flex items-center gap-3 text-slate-700 hover:text-blue-600 transition-colors no-underline">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-mono">E-mail</p>
                    <p className="text-sm font-medium">contato@sajodiagnos.club</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-mono">Sede</p>
                    <p className="text-sm font-medium">Palmas / TO — Atendimento Nacional</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Nome *</label>
                  <input
                    type="text"
                    required
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Empresa</label>
                  <input
                    type="text"
                    value={form.empresa}
                    onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    placeholder="Nome da empresa"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">E-mail *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Mensagem *</label>
                <textarea
                  required
                  rows={4}
                  value={form.mensagem}
                  onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Descreva sua necessidade..."
                />
              </div>
              <Button type="submit" className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium">
                Enviar mensagem
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <p className="text-xs text-slate-400 text-center mt-3">
                Ao enviar, você concorda com nossa{" "}
                <Link href="/privacidade" className="text-blue-600 hover:underline">
                  Política de Privacidade
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
