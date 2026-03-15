/*
 * PilarTitular.tsx — 4 Pilares LGPD
 * Pilar do Titular — #7C3AED
 */
import { motion } from "framer-motion";
import { User, MessageSquare, Lock, Eye, ArrowRight, Mail } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const COLOR = "#7C3AED";
const BG_LIGHT = "#F5F3FF";

const direitos = [
  { title: "Confirmação e Acesso", desc: "Confirmar se seus dados são tratados e acessar os dados que possuímos sobre você." },
  { title: "Correção", desc: "Solicitar a correção de dados incompletos, inexatos ou desatualizados." },
  { title: "Anonimização e Eliminação", desc: "Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade." },
  { title: "Portabilidade", desc: "Receber seus dados em formato estruturado para transferência a outro fornecedor." },
  { title: "Informação sobre Compartilhamento", desc: "Saber com quais entidades públicas e privadas seus dados são compartilhados." },
  { title: "Revogação do Consentimento", desc: "Revogar o consentimento dado para o tratamento de seus dados a qualquer momento." },
];

export default function PilarTitular() {
  const handleSolicitar = () => {
    toast.info("Canal do titular em implementação. Por favor, envie sua solicitação para titular@sajodiagnos.club");
  };

  return (
    <Layout>
      <section className="py-20 border-b border-slate-100" style={{ backgroundColor: BG_LIGHT }}>
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLOR }}>
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-mono font-medium tracking-widest uppercase" style={{ color: COLOR }}>
                Pilar 04 · TITULAR
              </span>
            </div>
            <h1 className="title-serif text-4xl lg:text-5xl text-slate-900 mb-4">Pilar do Titular</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Canal de atendimento e gestão dos direitos dos titulares de dados: acesso, correção, exclusão, portabilidade e muito mais.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container">
          <div className="mb-10">
            <h2 className="title-serif text-2xl text-slate-900 mb-2">Seus direitos como titular</h2>
            <p className="text-slate-600 text-sm">A LGPD garante os seguintes direitos a todos os titulares de dados pessoais.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {direitos.map((d, i) => (
              <motion.div
                key={d.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-sm transition-shadow"
                style={{ borderLeft: `3px solid ${COLOR}` }}
              >
                <h3 className="font-semibold text-slate-900 mb-1.5 text-sm">{d.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Canal do Titular */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="title-serif text-2xl text-slate-900 mb-3">Canal de Atendimento ao Titular</h2>
            <p className="text-slate-600 text-sm">
              Para exercer seus direitos como titular de dados, entre em contato diretamente com nosso Encarregado (DPO).
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="space-y-4 mb-8">
              {[
                { icon: Mail, label: "E-mail do Encarregado (DPO)", value: "titular@sajodiagnos.club", href: "mailto:titular@sajodiagnos.club" },
                { icon: MessageSquare, label: "WhatsApp", value: "(63) 98438-1782", href: "https://wa.me/5563984381782" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-purple-200 hover:bg-purple-50 transition-all no-underline group"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: BG_LIGHT }}>
                      <Icon className="w-4 h-4" style={{ color: COLOR }} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-mono">{item.label}</p>
                      <p className="text-sm font-medium text-slate-900">{item.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-purple-900 mb-1">Prazo de resposta</p>
                  <p className="text-xs text-purple-700">Respondemos às solicitações dos titulares em até 15 dias úteis, conforme exigido pela LGPD.</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSolicitar}
              className="w-full mt-6 h-11 rounded-xl font-medium text-white"
              style={{ backgroundColor: COLOR }}
            >
              Exercer meus direitos <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
