/*
 * Dashboard.tsx — 4 Pilares LGPD
 * Painel do Cliente — Estrutura conceitual visual
 */
import { useState } from "react";
import {
  LayoutDashboard, FolderOpen, MessageSquare, BarChart3,
  Package, User, Scale, CheckCircle2, Clock, AlertCircle,
  Download, FileText, Shield, BookOpen, ArrowRight, Bell, Menu, X
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: FolderOpen, label: "Meus Documentos", id: "documentos" },
  { icon: MessageSquare, label: "Chamados", id: "chamados" },
  { icon: BarChart3, label: "Status da Adequação", id: "status" },
  { icon: Package, label: "Módulos", id: "modulos" },
  { icon: User, label: "Minha Conta", id: "conta" },
];

const documentos = [
  { nome: "Política de Privacidade", tipo: "PDF", data: "15 Jan 2024", status: "Vigente", color: "#1D4ED8" },
  { nome: "Aviso de Cookies", tipo: "PDF", data: "15 Jan 2024", status: "Vigente", color: "#059669" },
  { nome: "ROPA — Registro de Atividades", tipo: "XLSX", data: "22 Jan 2024", status: "Em revisão", color: "#EA580C" },
  { nome: "Relatório de Impacto (RIPD)", tipo: "PDF", data: "05 Fev 2024", status: "Pendente", color: "#7C3AED" },
];

const etapasStatus = [
  { label: "Diagnóstico", status: "Concluído", progress: 100, color: "#059669" },
  { label: "Documentação base", status: "Concluído", progress: 100, color: "#059669" },
  { label: "Treinamento da equipe", status: "Em andamento", progress: 60, color: "#EA580C" },
  { label: "Implementação técnica", status: "Em andamento", progress: 35, color: "#EA580C" },
  { label: "Monitoramento contínuo", status: "Pendente", progress: 0, color: "#94A3B8" },
];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNav = (id: string) => {
    setActiveSection(id);
    if (id !== "dashboard") {
      toast.info(`Módulo "${navItems.find(n => n.id === id)?.label}" em desenvolvimento.`);
    }
  };

  const handleDownload = () => {
    toast.info("Download disponível em breve.");
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8FAFC" }}>
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 flex flex-col transition-all duration-300 bg-white border-r border-slate-200 ${sidebarOpen ? "w-56" : "w-16"}`}
        style={{ minHeight: "100vh" }}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center flex-shrink-0">
            <Scale className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="text-slate-900 text-sm font-semibold leading-none">4 Pilares LGPD</p>
              <p className="text-slate-400 text-xs font-mono mt-0.5">Área do Cliente</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="px-2 pb-4 border-t border-slate-200 pt-4">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors no-underline">
            <ArrowRight className="w-4 h-4 flex-shrink-0 rotate-180" />
            {sidebarOpen && <span className="text-xs">Voltar ao site</span>}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100">
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div>
              <p className="text-sm font-medium text-slate-900">Olá, Tech Solutions Ltda</p>
              <p className="text-xs text-slate-500 font-mono">Plano Profissional · Ativo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-semibold">
              TS
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Área do Cliente</p>
            <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
          </div>

          {/* Progress overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Progresso de Adequação</h3>
                <p className="text-xs text-slate-500 mt-0.5">Plano Profissional · Iniciado em Jan/2024</p>
              </div>
              <span className="text-2xl font-bold font-mono text-green-600">65%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-green-500 rounded-full" style={{ width: "65%" }} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Concluídas", value: "2", color: "#059669" },
                { label: "Em andamento", value: "2", color: "#EA580C" },
                { label: "Pendentes", value: "1", color: "#94A3B8" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-lg font-bold font-mono" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Etapas */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 text-sm">Etapas do Processo</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {etapasStatus.map((etapa) => (
                  <div key={etapa.label} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {etapa.progress === 100 ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : etapa.progress > 0 ? (
                          <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                        )}
                        <span className="text-sm text-slate-900">{etapa.label}</span>
                      </div>
                      <span className="text-xs font-mono" style={{ color: etapa.color }}>{etapa.status}</span>
                    </div>
                    {etapa.progress > 0 && (
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden ml-6">
                        <div className="h-full rounded-full" style={{ width: `${etapa.progress}%`, backgroundColor: etapa.color }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Documentos */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 text-sm">Meus Documentos</h3>
                <button className="text-xs text-blue-600 hover:underline">Ver todos</button>
              </div>
              <div className="divide-y divide-slate-100">
                {documentos.map((doc) => (
                  <div key={doc.nome} className="px-5 py-3.5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: doc.color + "15" }}>
                      <FileText className="w-4 h-4" style={{ color: doc.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{doc.nome}</p>
                      <p className="text-xs text-slate-500 font-mono">{doc.tipo} · {doc.data}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        doc.status === "Vigente" ? "bg-green-50 text-green-700" :
                        doc.status === "Em revisão" ? "bg-yellow-50 text-yellow-700" :
                        "bg-slate-100 text-slate-500"
                      }`}>
                        {doc.status}
                      </span>
                      <button onClick={handleDownload} className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Módulos */}
          <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-sm">Módulos do Plano</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
              {[
                { icon: Scale, label: "Lei", color: "#1D4ED8", bg: "#EFF6FF", status: "Disponível" },
                { icon: BookOpen, label: "Regras", color: "#059669", bg: "#ECFDF5", status: "Disponível" },
                { icon: Shield, label: "Conformidade", color: "#EA580C", bg: "#FFF7ED", status: "Em breve" },
                { icon: User, label: "Titular", color: "#7C3AED", bg: "#F5F3FF", status: "Em breve" },
              ].map((mod) => {
                const Icon = mod.icon;
                return (
                  <div
                    key={mod.label}
                    className="rounded-xl p-4 border border-slate-200 cursor-pointer hover:shadow-sm transition-all"
                    style={{ borderTop: `2px solid ${mod.color}` }}
                    onClick={() => toast.info(`Módulo ${mod.label} em desenvolvimento.`)}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: mod.bg }}>
                      <Icon className="w-4 h-4" style={{ color: mod.color }} />
                    </div>
                    <p className="text-sm font-medium text-slate-900">{mod.label}</p>
                    <p className="text-xs mt-1" style={{ color: mod.status === "Disponível" ? mod.color : "#94A3B8" }}>
                      {mod.status}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Painel do cliente em desenvolvimento</p>
              <p className="text-xs text-blue-700 mt-0.5">
                Esta é a estrutura conceitual do painel do cliente. As funcionalidades completas — incluindo login real, documentos reais e chamados — serão implementadas nas próximas versões.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
