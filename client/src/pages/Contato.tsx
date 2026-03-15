/*
 * Contato.tsx — 4 Pilares LGPD
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Building2, Clock, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "wouter";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function Contato() {
  const [form, setForm] = useState({ nome: "", empresa: "", email: "", telefone: "", assunto: "", mensagem: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada com sucesso! Retornaremos em até 24 horas úteis.");
    setForm({ nome: "", empresa: "", email: "", telefone: "", assunto: "", mensagem: "" });
  };

  return (
    <Layout>
      <section className="bg-white py-20 border-b border-slate-100">
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl">
            <p className="section-number mb-3">Contato</p>
            <h1 className="title-serif text-4xl lg:text-5xl text-slate-900 mb-4">
              Fale com nossa equipe
            </h1>
            <p className="text-slate-600 text-lg">
              Solicite seu diagnóstico inicial, tire dúvidas ou solicite uma proposta personalizada.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            {/* Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="lg:col-span-2 space-y-6"
            >
              <div>
                <h2 className="title-serif text-2xl text-slate-900 mb-2">Canais de atendimento</h2>
                <p className="text-sm text-slate-600">Escolha o canal mais conveniente para você.</p>
              </div>

              {[
                {
                  icon: Phone,
                  color: "#25D366",
                  bg: "#ECFDF5",
                  label: "WhatsApp",
                  value: "(63) 98438-1782",
                  href: "https://wa.me/5563984381782",
                },
                {
                  icon: Mail,
                  color: "#1D4ED8",
                  bg: "#EFF6FF",
                  label: "E-mail geral",
                  value: "contato@sajodiagnos.club",
                  href: "mailto:contato@sajodiagnos.club",
                },
                {
                  icon: Mail,
                  color: "#059669",
                  bg: "#ECFDF5",
                  label: "Atendimento",
                  value: "atendimento@sajodiagnos.club",
                  href: "mailto:atendimento@sajodiagnos.club",
                },
                {
                  icon: Mail,
                  color: "#7C3AED",
                  bg: "#F5F3FF",
                  label: "Titular dos dados",
                  value: "titular@sajodiagnos.club",
                  href: "mailto:titular@sajodiagnos.club",
                },
                {
                  icon: Mail,
                  color: "#EA580C",
                  bg: "#FFF7ED",
                  label: "Documentação",
                  value: "docs@sajodiagnos.club",
                  href: "mailto:docs@sajodiagnos.club",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-sm transition-all no-underline group"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.bg }}>
                      <Icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-mono">{item.label}</p>
                      <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors">{item.value}</p>
                    </div>
                  </a>
                );
              })}

              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono">Horário de atendimento</p>
                  <p className="text-sm font-medium text-slate-900">Seg–Sex, 8h–18h (Brasília)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Resposta em até 24h úteis</p>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="lg:col-span-3"
            >
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-6">Envie uma mensagem</h3>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Nome completo *</label>
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

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
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
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Telefone</label>
                    <input
                      type="tel"
                      value={form.telefone}
                      onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Assunto</label>
                  <select
                    value={form.assunto}
                    onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="diagnostico">Solicitar diagnóstico</option>
                    <option value="proposta">Solicitar proposta</option>
                    <option value="duvida">Dúvida sobre LGPD</option>
                    <option value="dpo">DPO as a Service</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Mensagem *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.mensagem}
                    onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Descreva sua necessidade em detalhes..."
                  />
                </div>

                <Button type="submit" className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium">
                  Enviar mensagem <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <p className="text-xs text-slate-400 text-center mt-3">
                  Ao enviar, você concorda com nossa{" "}
                  <Link href="/privacidade" className="text-blue-600 hover:underline">
                    Política de Privacidade
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
