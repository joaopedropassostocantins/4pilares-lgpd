/*
 * Portal.tsx — 4 Pilares LGPD
 * Portal do cliente — Acesso aos serviços e documentos
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  FileText, Download, Shield, CheckCircle2, Clock,
  AlertCircle, BarChart3, MessageSquare, BookOpen, User
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

const modulos = [
  { id: "lei", label: "Pilar da Lei", icon: BookOpen, color: "#1D4ED8", href: "/lei", desc: "Fundamentação legal e bases jurídicas" },
  { id: "regras", label: "Pilar das Regras", icon: Shield, color: "#059669", href: "/regras", desc: "Políticas e procedimentos internos" },
  { id: "conformidade", label: "Pilar da Conformidade", icon: CheckCircle2, color: "#EA580C", href: "/conformidade", desc: "Adequação técnica e jurídica" },
  { id: "titular", label: "Pilar do Titular", icon: User, color: "#7C3AED", href: "/titular", desc: "Direitos e canais de atendimento" },
];

export default function Portal() {
  const [activeTab, setActiveTab] = useState<"visao" | "documentos" | "suporte">("visao");
  const { data: subscription } = trpc.subscriptions.getMySubscription.useQuery();
  const { data: user } = trpc.auth.me.useQuery();

  const handleDownload = () => {
    toast.info("Download disponível em breve.");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="text-base font-semibold text-slate-800">Portal do Cliente</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{user?.name || user?.email || "—"}</span>
            {subscription && (
              <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                {subscription.planName}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-slate-100 rounded-xl p-1 mb-6 w-fit">
          {(["visao", "documentos", "suporte"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "visao" ? "Visão Geral" : tab === "documentos" ? "Documentos" : "Suporte"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "visao" && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {modulos.map((modulo) => (
                <Link key={modulo.id} href={modulo.href}>
                  <div
                    className="bg-white rounded-xl border border-slate-100 p-5 cursor-pointer hover:border-slate-200 hover:shadow-sm transition-all group"
                    style={{ borderTop: `3px solid ${modulo.color}` }}
                  >
                    <modulo.icon className="w-5 h-5 mb-3" style={{ color: modulo.color }} />
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {modulo.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{modulo.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-600" />
                Status da Adequação
              </h2>
              {[
                { label: "Diagnóstico Inicial", progress: 100, status: "Concluído" },
                { label: "Documentação Base", progress: 100, status: "Concluído" },
                { label: "Treinamento da Equipe", progress: 60, status: "Em andamento" },
                { label: "Implementação Técnica", progress: 35, status: "Em andamento" },
                { label: "Monitoramento Contínuo", progress: 0, status: "Pendente" },
              ].map((item) => (
                <div key={item.label} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span
                      className={
                        item.status === "Concluído"
                          ? "text-green-600"
                          : item.status === "Em andamento"
                          ? "text-orange-500"
                          : "text-slate-400"
                      }
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.progress}%`,
                        backgroundColor: item.progress === 100 ? "#059669" : item.progress > 0 ? "#EA580C" : "#CBD5E1",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "documentos" && (
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700">Documentos da sua empresa</h2>
            </div>
            {[
              { nome: "Política de Privacidade", tipo: "PDF", data: "Jan 2024", status: "Vigente", color: "#1D4ED8" },
              { nome: "Aviso de Cookies", tipo: "PDF", data: "Jan 2024", status: "Vigente", color: "#059669" },
              { nome: "ROPA — Registro de Atividades", tipo: "XLSX", data: "Jan 2024", status: "Em revisão", color: "#EA580C" },
              { nome: "Relatório de Impacto (RIPD)", tipo: "PDF", data: "Fev 2024", status: "Pendente", color: "#7C3AED" },
            ].map((doc) => (
              <div key={doc.nome} className="flex items-center justify-between px-5 py-4 border-b border-slate-50 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${doc.color}15` }}>
                    <FileText className="w-4 h-4" style={{ color: doc.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{doc.nome}</p>
                    <p className="text-xs text-slate-400">{doc.tipo} • {doc.data}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      doc.status === "Vigente"
                        ? "bg-green-100 text-green-700"
                        : doc.status === "Em revisão"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {doc.status}
                  </span>
                  <button onClick={handleDownload} className="text-slate-400 hover:text-blue-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "suporte" && (
          <div className="bg-white rounded-xl border border-slate-100 p-8 text-center">
            <MessageSquare className="w-10 h-10 text-blue-600 mx-auto mb-4" />
            <h2 className="text-base font-semibold text-slate-800 mb-2">Canal de Suporte</h2>
            <p className="text-sm text-slate-500 mb-6">
              Nossa equipe está disponível para auxiliar com sua jornada de adequação LGPD.
            </p>
            <a
              href="/contato"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Abrir chamado
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
