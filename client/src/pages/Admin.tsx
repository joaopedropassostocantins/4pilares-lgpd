/*
 * Admin.tsx — 4 Pilares LGPD
 * Painel Administrativo — Executive Dashboard completo
 * Design: Dark sidebar + light content area
 */
import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Building2, CreditCard, FileText,
  FolderOpen, MessageSquare, BarChart3, Settings, Scale,
  ChevronRight, TrendingUp, AlertCircle, CheckCircle2, Clock,
  Search, Bell, LogOut, Menu, X, AlertTriangle, DollarSign,
  ArrowUpRight, ArrowDownRight, Shield, Filter, Download, Plus,
  MoreHorizontal, RefreshCw, Zap
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Link as WouterLink } from "wouter";

const ADMIN_BG = "#060B14";
const ADMIN_SURFACE = "#0C1525";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Users, label: "Clientes", id: "clientes", badge: "24", href: "/admin/clientes" },
  { icon: DollarSign, label: "Financeiro", id: "financeiro", badge: null, href: "/admin/financeiro" },
  { icon: AlertTriangle, label: "Incidentes", id: "incidentes", badge: "3", href: "/admin/incidentes" },
  { icon: FileText, label: "Contratos", id: "contratos", badge: null },
  { icon: FolderOpen, label: "Documentos", id: "documentos" },
  { icon: BarChart3, label: "Relatórios", id: "relatorios" },
  { icon: Settings, label: "Configurações", id: "configuracoes" },
];

const statsCards = [
  { label: "Clientes ativos", value: "24", change: "+3 este mês", trend: "up", icon: Users, color: "#1D4ED8", bg: "#EFF6FF" },
  { label: "MRR", value: "R$ 38,4k", change: "+12% vs mês ant.", trend: "up", icon: DollarSign, color: "#059669", bg: "#ECFDF5" },
  { label: "Chamados abertos", value: "7", change: "2 urgentes", trend: "neutral", icon: MessageSquare, color: "#EA580C", bg: "#FFF7ED" },
  { label: "Docs emitidos", value: "142", change: "+12 este mês", trend: "up", icon: FolderOpen, color: "#7C3AED", bg: "#F5F3FF" },
];

const recentClients = [
  { name: "Tech Solutions Ltda", plan: "Profissional", status: "Em adequação", progress: 65, color: "#059669", segment: "Tecnologia", since: "Jan/2025" },
  { name: "Clínica Saúde Total", plan: "Essencial", status: "Diagnóstico", progress: 20, color: "#1D4ED8", segment: "Saúde", since: "Fev/2025" },
  { name: "Construtora Alfa", plan: "Empresarial", status: "Monitoramento", progress: 90, color: "#7C3AED", segment: "Construção", since: "Nov/2024" },
  { name: "Escola Digital", plan: "Profissional", status: "Implementação", progress: 50, color: "#EA580C", segment: "Educação", since: "Dez/2024" },
  { name: "Farmácia Vida+", plan: "Essencial", status: "Diagnóstico", progress: 15, color: "#1D4ED8", segment: "Saúde", since: "Mar/2025" },
];

const recentChamados = [
  { id: "#0042", empresa: "Tech Solutions", tipo: "Solicitação de titular", status: "Aberto", urgente: true, data: "08 Mar" },
  { id: "#0041", empresa: "Clínica Saúde Total", tipo: "Dúvida sobre ROPA", status: "Em análise", urgente: false, data: "06 Mar" },
  { id: "#0040", empresa: "Construtora Alfa", tipo: "Incidente de segurança", status: "Resolvido", urgente: false, data: "28 Fev" },
];

const mrrData = [
  { mes: "Out", valor: 24000 },
  { mes: "Nov", valor: 27500 },
  { mes: "Dez", valor: 29800 },
  { mes: "Jan", valor: 32100 },
  { mes: "Fev", valor: 35600 },
  { mes: "Mar", valor: 38400 },
];

const adequacaoData = [
  { segmento: "Tecnologia", score: 72 },
  { segmento: "Saúde", score: 58 },
  { segmento: "Educação", score: 45 },
  { segmento: "Construção", score: 82 },
  { segmento: "Varejo", score: 33 },
];

export default function Admin() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  const handleNav = (item: typeof navItems[0]) => {
    setActiveSection(item.id);
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
            const content = (
              <button
                key={item.id}
                onClick={() => handleNav(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="flex-1 text-sm font-medium truncate">{item.label}</span>
                )}
                {sidebarOpen && item.badge && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-600/30 text-blue-300 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );

            if (item.href) {
              return (
                <Link key={item.id} href={item.href}>
                  {content}
                </Link>
              );
            }
            return <div key={item.id}>{content}</div>;
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t" style={{ borderColor: "#1a2640" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
          >
            <Menu className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="text-xs">Recolher</span>}
          </button>
          <Link href="/">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors mt-0.5">
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span className="text-xs">Sair</span>}
            </button>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar clientes, chamados..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-400 transition-colors w-64"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">A</div>
              {sidebarOpen && <span className="text-sm text-slate-700 font-medium hidden sm:block">Admin</span>}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* ===== DASHBOARD ===== */}
              {activeSection === "dashboard" && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsCards.map((card) => {
                      const Icon = card.icon;
                      return (
                        <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                              <Icon className="w-4 h-4" style={{ color: card.color }} />
                            </div>
                            {card.trend === "up" && <ArrowUpRight className="w-4 h-4 text-green-500" />}
                            {card.trend === "neutral" && <AlertCircle className="w-4 h-4 text-orange-400" />}
                          </div>
                          <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
                          <p className="text-xs font-medium mt-1" style={{ color: card.trend === "up" ? "#059669" : "#EA580C" }}>
                            {card.change}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Charts */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">MRR (últimos 6 meses)</h3>
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">+12% MoM</span>
                      </div>
                      <ResponsiveContainer width="100%" height={160}>
                        <AreaChart data={mrrData}>
                          <defs>
                            <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.15} />
                              <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                          <Tooltip formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, "MRR"]} />
                          <Area type="monotone" dataKey="valor" stroke="#1D4ED8" strokeWidth={2} fill="url(#mrrGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">Adequação por Segmento</h3>
                        <span className="text-xs text-slate-500">Score médio</span>
                      </div>
                      <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={adequacaoData} barSize={20}>
                          <XAxis dataKey="segmento" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                          <Tooltip formatter={(v: number) => [`${v}%`, "Score"]} />
                          <Bar dataKey="score" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Tables */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Clientes recentes */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">Clientes Recentes</h3>
                        <Link href="/admin/clientes">
                          <button className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1">
                            Ver todos <ChevronRight className="w-3 h-3" />
                          </button>
                        </Link>
                      </div>
                      <div className="space-y-3">
                        {recentClients.slice(0, 4).map((client) => (
                          <div key={client.name} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: client.color }}>
                              {client.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">{client.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex-1 h-1.5 rounded-full bg-slate-100">
                                  <div className="h-full rounded-full" style={{ width: `${client.progress}%`, backgroundColor: client.color }} />
                                </div>
                                <span className="text-xs text-slate-400 flex-shrink-0">{client.progress}%</span>
                              </div>
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: client.color + "15", color: client.color }}>
                              {client.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chamados */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">Chamados em Aberto</h3>
                        <Link href="/admin/incidentes">
                          <button className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1">
                            Ver todos <ChevronRight className="w-3 h-3" />
                          </button>
                        </Link>
                      </div>
                      <div className="space-y-3">
                        {recentChamados.map((c) => (
                          <div key={c.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${c.urgente ? "bg-red-500" : c.status === "Resolvido" ? "bg-green-500" : "bg-orange-400"}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800">{c.empresa}</p>
                              <p className="text-xs text-slate-500 truncate">{c.tipo}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{c.id} · {c.data}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                              c.status === "Resolvido" ? "bg-green-100 text-green-700" :
                              c.status === "Aberto" ? "bg-red-100 text-red-700" :
                              "bg-orange-100 text-orange-700"
                            }`}>{c.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== CONTRATOS ===== */}
              {activeSection === "contratos" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-500 text-sm">Gestão de contratos dos clientes ativos.</p>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors">
                      <Plus className="w-4 h-4" /> Novo contrato
                    </button>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                      <thead><tr className="border-b border-slate-100">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Empresa</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Plano</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Valor</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Vencimento</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                      </tr></thead>
                      <tbody>
                        {[
                          { empresa: "Tech Solutions Ltda", plano: "Profissional", valor: "R$ 1.997", venc: "15/03/2025", status: "Vigente", cor: "#059669" },
                          { empresa: "Construtora Alfa", plano: "Empresarial", valor: "R$ 3.997", venc: "01/04/2025", status: "Vigente", cor: "#059669" },
                          { empresa: "Escola Digital", plano: "Profissional", valor: "R$ 1.997", venc: "30/03/2025", status: "A vencer", cor: "#EA580C" },
                          { empresa: "Clínica Saúde Total", plano: "Essencial", valor: "R$ 997", venc: "10/04/2025", status: "Vigente", cor: "#059669" },
                          { empresa: "Farmácia Vida+", plano: "Essencial", valor: "R$ 997", venc: "20/04/2025", status: "Vigente", cor: "#059669" },
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-4 text-sm font-medium text-slate-800">{row.empresa}</td>
                            <td className="px-5 py-4 text-sm text-slate-600">{row.plano}</td>
                            <td className="px-5 py-4 text-sm font-semibold text-slate-900">{row.valor}</td>
                            <td className="px-5 py-4 text-sm text-slate-600">{row.venc}</td>
                            <td className="px-5 py-4">
                              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: row.cor + "15", color: row.cor }}>{row.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ===== DOCUMENTOS ===== */}
              {activeSection === "documentos" && (
                <div className="space-y-4">
                  <p className="text-slate-500 text-sm">Documentos emitidos para todos os clientes.</p>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { tipo: "Política de Privacidade", qtd: 24, color: "#1D4ED8" },
                      { tipo: "ROPA", qtd: 18, color: "#059669" },
                      { tipo: "RIPD", qtd: 12, color: "#EA580C" },
                      { tipo: "DPA", qtd: 8, color: "#7C3AED" },
                    ].map((d) => (
                      <div key={d.tipo} className="bg-white rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-500 font-medium">{d.tipo}</p>
                        <p className="text-3xl font-bold mt-1" style={{ color: d.color }}>{d.qtd}</p>
                        <p className="text-xs text-slate-400 mt-1">documentos</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== RELATÓRIOS ===== */}
              {activeSection === "relatorios" && (
                <div className="space-y-4">
                  <p className="text-slate-500 text-sm">Relatórios gerenciais e de compliance.</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { label: "Relatório de Adequação", desc: "Score por cliente e pilar", icon: BarChart3, color: "#1D4ED8" },
                      { label: "Relatório Financeiro", desc: "MRR, inadimplência, renovações", icon: DollarSign, color: "#059669" },
                      { label: "Relatório de Incidentes", desc: "Ocorrências e tempo de resolução", icon: AlertTriangle, color: "#EA580C" },
                      { label: "Relatório de Documentos", desc: "Emissões por tipo e status", icon: FileText, color: "#7C3AED" },
                      { label: "Relatório de Chamados", desc: "Volume e SLA de atendimento", icon: MessageSquare, color: "#0891B2" },
                      { label: "Relatório ANPD", desc: "Conformidade regulatória", icon: Shield, color: "#6B21A8" },
                    ].map((r) => {
                      const Icon = r.icon;
                      return (
                        <div key={r.label} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm cursor-pointer group transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: r.color + "15" }}>
                              <Icon className="w-4 h-4" style={{ color: r.color }} />
                            </div>
                            <Download className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                          </div>
                          <h4 className="font-semibold text-slate-800">{r.label}</h4>
                          <p className="text-sm text-slate-500 mt-0.5">{r.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ===== CONFIGURAÇÕES ===== */}
              {activeSection === "configuracoes" && (
                <div className="space-y-4 max-w-2xl">
                  {[
                    { label: "Dados da Empresa", icon: Building2 },
                    { label: "Integrações", icon: Zap },
                    { label: "Notificações", icon: Bell },
                    { label: "Segurança", icon: Shield },
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between hover:border-slate-300 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-slate-600" />
                          </div>
                          <span className="font-medium text-slate-800">{s.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
