/*
 * Admin.tsx — 4 Pilares LGPD
 * Painel Administrativo — Estrutura conceitual SaaS premium
 * Design: Dark sidebar + light content area
 */
import { useState } from "react";
import {
  LayoutDashboard, Users, Building2, CreditCard, FileText,
  FolderOpen, MessageSquare, BarChart3, Settings, Scale,
  ChevronRight, TrendingUp, AlertCircle, CheckCircle2, Clock,
  Search, Bell, LogOut, Menu, X
} from "lucide-react";
import { toast } from "sonner";

const ADMIN_BG = "#060B14";
const ADMIN_SURFACE = "#0C1525";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Users, label: "Clientes", id: "clientes", badge: "24" },
  { icon: Building2, label: "Empresas", id: "empresas" },
  { icon: CreditCard, label: "Planos", id: "planos" },
  { icon: FileText, label: "Contratos", id: "contratos", badge: "3" },
  { icon: FolderOpen, label: "Documentos", id: "documentos" },
  { icon: MessageSquare, label: "Chamados", id: "chamados", badge: "7" },
  { icon: BarChart3, label: "Relatórios", id: "relatorios" },
  { icon: Settings, label: "Configurações", id: "configuracoes" },
];

const statsCards = [
  { label: "Clientes ativos", value: "24", change: "+3 este mês", icon: Users, color: "#1D4ED8", bg: "#EFF6FF" },
  { label: "Contratos vigentes", value: "18", change: "2 vencendo", icon: FileText, color: "#059669", bg: "#ECFDF5" },
  { label: "Chamados abertos", value: "7", change: "2 urgentes", icon: MessageSquare, color: "#EA580C", bg: "#FFF7ED" },
  { label: "Docs emitidos", value: "142", change: "+12 este mês", icon: FolderOpen, color: "#7C3AED", bg: "#F5F3FF" },
];

const recentClients = [
  { name: "Tech Solutions Ltda", plan: "Profissional", status: "Em adequação", progress: 65, color: "#059669" },
  { name: "Clínica Saúde Total", plan: "Essencial", status: "Diagnóstico", progress: 20, color: "#1D4ED8" },
  { name: "Construtora Alfa", plan: "Empresarial", status: "Monitoramento", progress: 90, color: "#7C3AED" },
  { name: "Escola Digital", plan: "Profissional", status: "Implementação", progress: 50, color: "#EA580C" },
];

const recentChamados = [
  { id: "#0042", empresa: "Tech Solutions", tipo: "Solicitação de titular", status: "Aberto", urgente: true },
  { id: "#0041", empresa: "Clínica Saúde Total", tipo: "Dúvida sobre ROPA", status: "Em análise", urgente: false },
  { id: "#0040", empresa: "Construtora Alfa", tipo: "Incidente de segurança", status: "Resolvido", urgente: false },
];

export default function Admin() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNav = (id: string) => {
    setActiveSection(id);
    if (id !== "dashboard") {
      toast.info(`Módulo "${navItems.find(n => n.id === id)?.label}" em desenvolvimento.`);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8FAFC" }}>
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 flex flex-col transition-all duration-300 ${sidebarOpen ? "w-60" : "w-16"}`}
        style={{ backgroundColor: ADMIN_BG, minHeight: "100vh" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "#1a2640" }}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Scale className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-white text-sm font-semibold leading-none">4 Pilares LGPD</p>
              <p className="text-slate-500 text-xs font-mono mt-0.5">Admin</p>
            </div>
          )}
        </div>

        {/* Nav */}
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
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="text-sm flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${isActive ? "bg-white/20 text-white" : "bg-slate-700 text-slate-300"}`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-2 pb-4 border-t pt-4" style={{ borderColor: "#1a2640" }}>
          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${sidebarOpen ? "" : "justify-center"}`}>
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold">
              JP
            </div>
            {sidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-white text-xs font-medium truncate">Dr. João Pedro</p>
                <p className="text-slate-500 text-xs truncate">Administrador</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar clientes, contratos..."
                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              JP
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Page title */}
          <div className="mb-6">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Painel Administrativo</p>
            <h1 className="text-xl font-semibold text-slate-900" style={{ fontFamily: "var(--font-sans)" }}>
              {navItems.find(n => n.id === activeSection)?.label || "Dashboard"}
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                      <Icon className="w-4 h-4" style={{ color: card.color }} />
                    </div>
                    <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-mono)" }}>{card.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
                  <p className="text-xs mt-1" style={{ color: card.color }}>{card.change}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Clientes recentes */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 text-sm">Clientes — Status de Adequação</h3>
                <button className="text-xs text-blue-600 hover:underline">Ver todos</button>
              </div>
              <div className="divide-y divide-slate-100">
                {recentClients.map((client) => (
                  <div key={client.name} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{client.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{client.plan} · {client.status}</p>
                      </div>
                      <span className="text-xs font-mono font-medium" style={{ color: client.color }}>
                        {client.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${client.progress}%`, backgroundColor: client.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chamados recentes */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 text-sm">Chamados Recentes</h3>
                <button className="text-xs text-blue-600 hover:underline">Ver todos</button>
              </div>
              <div className="divide-y divide-slate-100">
                {recentChamados.map((c) => (
                  <div key={c.id} className="px-5 py-4 flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      c.status === "Resolvido" ? "bg-green-50" : c.urgente ? "bg-red-50" : "bg-slate-100"
                    }`}>
                      {c.status === "Resolvido" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : c.urgente ? (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-mono text-slate-400">{c.id}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          c.status === "Resolvido" ? "bg-green-50 text-green-700" :
                          c.status === "Aberto" ? "bg-red-50 text-red-700" :
                          "bg-yellow-50 text-yellow-700"
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{c.tipo}</p>
                      <p className="text-xs text-slate-500">{c.empresa}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notice */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Painel em desenvolvimento</p>
              <p className="text-xs text-blue-700 mt-0.5">
                Esta é a estrutura conceitual do painel administrativo. As funcionalidades completas serão implementadas nas próximas versões, incluindo autenticação real, banco de dados e integrações.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
