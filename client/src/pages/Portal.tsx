/*
 * Portal.tsx — 4 Pilares LGPD
 * Área do cliente — portal completo com seções funcionais
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderOpen, MessageSquare, BarChart3,
  Package, User, Scale, CheckCircle2, Clock, AlertCircle,
  Download, FileText, Shield, BookOpen, ArrowRight, Bell,
  Menu, X, ChevronRight, Lock, CreditCard, Building2,
  TrendingUp, AlertTriangle, CheckSquare, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

const SIDEBAR_BG = "#FFFFFF";
const CONTENT_BG = "#F8FAFC";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: FolderOpen, label: "Meus Documentos", id: "documentos" },
  { icon: MessageSquare, label: "Chamados", id: "chamados" },
  { icon: BarChart3, label: "Status da Adequação", id: "status" },
  { icon: Package, label: "Módulos", id: "modulos" },
  { icon: CreditCard, label: "Meu Plano", id: "plano" },
  { icon: User, label: "Minha Conta", id: "conta" },
];

const documentos = [
  { nome: "Política de Privacidade", tipo: "PDF", data: "15 Jan 2025", status: "Vigente", statusColor: "#059669", pilar: "Lei", pilarColor: "#1D4ED8" },
  { nome: "Aviso de Cookies", tipo: "PDF", data: "15 Jan 2025", status: "Vigente", statusColor: "#059669", pilar: "Regras", pilarColor: "#059669" },
  { nome: "ROPA — Registro de Atividades", tipo: "XLSX", data: "22 Jan 2025", status: "Em revisão", statusColor: "#EA580C", pilar: "Conformidade", pilarColor: "#EA580C" },
  { nome: "Relatório de Impacto (RIPD)", tipo: "PDF", data: "05 Fev 2025", status: "Pendente", statusColor: "#7C3AED", pilar: "Titular", pilarColor: "#7C3AED" },
  { nome: "DPA — Acordo de Processamento", tipo: "PDF", data: "10 Fev 2025", status: "Vigente", statusColor: "#059669", pilar: "Regras", pilarColor: "#059669" },
  { nome: "Procuração DPO", tipo: "PDF", data: "01 Mar 2025", status: "Pendente", statusColor: "#EA580C", pilar: "Lei", pilarColor: "#1D4ED8" },
];

const chamados = [
  { id: "#0042", tipo: "Solicitação de titular", descricao: "Pedido de exclusão de dados", status: "Aberto", urgente: true, data: "08 Mar 2025" },
  { id: "#0039", tipo: "Dúvida sobre ROPA", descricao: "Questionamento sobre dados de RH", status: "Em análise", urgente: false, data: "02 Mar 2025" },
  { id: "#0035", tipo: "Incidente de segurança", descricao: "Acesso não autorizado identificado", status: "Resolvido", urgente: false, data: "20 Fev 2025" },
  { id: "#0031", tipo: "Atualização de política", descricao: "Revisão anual da política de privacidade", status: "Resolvido", urgente: false, data: "10 Fev 2025" },
];

const etapasAdequacao = [
  { label: "Diagnóstico Inicial", status: "Concluído", progress: 100, color: "#059669", icon: CheckCircle2 },
  { label: "Documentação Base", status: "Concluído", progress: 100, color: "#059669", icon: CheckCircle2 },
  { label: "Treinamento da Equipe", status: "Em andamento", progress: 60, color: "#EA580C", icon: RefreshCw },
  { label: "Implementação Técnica", status: "Em andamento", progress: 35, color: "#EA580C", icon: RefreshCw },
  { label: "Monitoramento Contínuo", status: "Pendente", progress: 0, color: "#94A3B8", icon: Clock },
];

const pilaresProgress = [
  { label: "Lei", color: "#1D4ED8", bg: "#EFF6FF", progress: 85, icon: Scale },
  { label: "Regras", color: "#059669", bg: "#ECFDF5", progress: 72, icon: BookOpen },
  { label: "Conformidade", color: "#EA580C", bg: "#FFF7ED", progress: 48, icon: Shield },
  { label: "Titular", color: "#7C3AED", bg: "#F5F3FF", progress: 30, icon: User },
];

const modulos = [
  { id: "lei", label: "Pilar da Lei", desc: "Entenda a Lei 13.709/2018 e suas obrigações", color: "#1D4ED8", bg: "#EFF6FF", icon: Scale, href: "/lei", done: true },
  { id: "regras", label: "Pilar das Regras", desc: "Políticas internas e normas da ANPD", color: "#059669", bg: "#ECFDF5", icon: BookOpen, href: "/regras", done: true },
  { id: "conformidade", label: "Pilar da Conformidade", desc: "Diagnóstico e implementação técnica", color: "#EA580C", bg: "#FFF7ED", icon: Shield, href: "/conformidade", done: false },
  { id: "titular", label: "Pilar do Titular", desc: "Gestão dos direitos dos titulares de dados", color: "#7C3AED", bg: "#F5F3FF", icon: User, href: "/titular", done: false },
];

export default function Portal() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificacoes] = useState(3);
  const [, setLocation] = useLocation();

  const { data: user } = trpc.auth.me.useQuery();
  const { data: subscription } = trpc.subscriptions.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setLocation("/login");
    } catch (e) {
      toast.error("Erro ao sair");
    }
  };

  const planoAtual = { 
    nome: subscription?.planName || "Nenhum plano ativo", 
    preco: subscription?.priceMonthly ? `R$ ${(subscription.priceMonthly / 100).toFixed(2).replace('.', ',')}/mês` : "-", 
    vencimento: "-", 
    status: subscription?.status || "Inativo" 
  };
  
  const responsavelFallback = user?.email?.split('@')[0] || "Usuário";
  const empresa = { 
    razaoSocial: user?.name || "Empresa / Cliente", 
    cnpj: "Disponível em breve", 
    segmento: "Geral", 
    responsavel: user?.name || responsavelFallback 
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: CONTENT_BG }}>
      {/* Sidebar */}
      <aside
        className={`flex-shrink-0 flex flex-col border-r border-slate-200 transition-all duration-300 ${sidebarOpen ? "w-56" : "w-16"}`}
        style={{ backgroundColor: SIDEBAR_BG, minHeight: "100vh" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center flex-shrink-0">
            <Scale className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-slate-900 text-sm font-semibold leading-none truncate">4 Pilares LGPD</p>
              <p className="text-slate-400 text-xs font-mono mt-0.5">Área do Cliente</p>
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
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-slate-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Menu className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="text-xs">Recolher menu</span>}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors mt-0.5">
            <Lock className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="text-xs">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <div>
            <h1 className="text-slate-900 font-semibold capitalize">{navItems.find(n => n.id === activeSection)?.label || "Dashboard"}</h1>
            <p className="text-slate-400 text-xs">{empresa.razaoSocial}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="w-4 h-4" />
              {notificacoes > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {empresa.responsavel.charAt(0)}
              </div>
              {sidebarOpen && <span className="text-sm text-slate-700 font-medium hidden sm:block">{empresa.responsavel.split(" ")[0]}</span>}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {/* ===== DASHBOARD ===== */}
              {activeSection === "dashboard" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {pilaresProgress.map((p) => {
                      const Icon = p.icon;
                      return (
                        <div key={p.label} className="bg-white rounded-xl p-4 border border-slate-200">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: p.bg }}>
                              <Icon className="w-3.5 h-3.5" style={{ color: p.color }} />
                            </div>
                            <span className="text-xs font-medium text-slate-600">Pilar {p.label}</span>
                          </div>
                          <p className="text-2xl font-bold text-slate-900">{p.progress}%</p>
                          <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                            <div className="h-full rounded-full transition-all" style={{ width: `${p.progress}%`, backgroundColor: p.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Adequação */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                      <h3 className="font-semibold text-slate-900 mb-4">Etapas da Adequação</h3>
                      <div className="space-y-3">
                        {etapasAdequacao.map((etapa) => {
                          const Icon = etapa.icon;
                          return (
                            <div key={etapa.label} className="flex items-center gap-3">
                              <Icon className="w-4 h-4 flex-shrink-0" style={{ color: etapa.color }} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-slate-700 truncate">{etapa.label}</span>
                                  <span className="text-xs font-medium ml-2 flex-shrink-0" style={{ color: etapa.color }}>{etapa.progress}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-slate-100">
                                  <div className="h-full rounded-full" style={{ width: `${etapa.progress}%`, backgroundColor: etapa.color }} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chamados recentes */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-slate-900">Chamados Recentes</h3>
                        <button
                          onClick={() => setActiveSection("chamados")}
                          className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                        >
                          Ver todos <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {chamados.slice(0, 3).map((c) => (
                          <div key={c.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${c.urgente ? "bg-red-500" : c.status === "Resolvido" ? "bg-green-500" : "bg-orange-500"}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">{c.tipo}</p>
                              <p className="text-xs text-slate-500">{c.id} · {c.data}</p>
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

              {/* ===== DOCUMENTOS ===== */}
              {activeSection === "documentos" && (
                <div className="space-y-4">
                  <p className="text-slate-500 text-sm">Documentos emitidos para a sua empresa. Faça download ou acompanhe o status de revisão.</p>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Documento</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Pilar</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Data</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                          <th className="px-5 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {documentos.map((doc, i) => (
                          <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-slate-800">{doc.nome}</p>
                                  <p className="text-xs text-slate-400">{doc.tipo}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 hidden sm:table-cell">
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: doc.pilarColor + "20", color: doc.pilarColor }}>
                                {doc.pilar}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-500 hidden md:table-cell">{doc.data}</td>
                            <td className="px-5 py-4">
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: doc.statusColor + "15", color: doc.statusColor }}>
                                {doc.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <button
                                onClick={() => toast.info("Download disponível em breve.")}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ===== CHAMADOS ===== */}
              {activeSection === "chamados" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-500 text-sm">Acompanhe suas solicitações e chamados abertos com a equipe 4 Pilares.</p>
                    <button
                      onClick={() => toast.info("Abertura de chamados disponível em breve.")}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Novo chamado
                    </button>
                  </div>
                  <div className="space-y-3">
                    {chamados.map((c) => (
                      <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
                        <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${c.urgente ? "bg-red-500" : c.status === "Resolvido" ? "bg-green-500" : "bg-orange-400"}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-slate-900">{c.tipo}</p>
                              <p className="text-sm text-slate-500 mt-0.5">{c.descricao}</p>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                              c.status === "Resolvido" ? "bg-green-100 text-green-700" :
                              c.status === "Aberto" ? "bg-red-100 text-red-700" :
                              "bg-orange-100 text-orange-700"
                            }`}>{c.status}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-2">{c.id} · Aberto em {c.data}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== STATUS DA ADEQUAÇÃO ===== */}
              {activeSection === "status" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="font-semibold text-slate-900 mb-2">Progresso Geral de Adequação</h3>
                    <p className="text-slate-500 text-sm mb-6">Acompanhe cada etapa do processo de adequação à LGPD da sua empresa.</p>
                    <div className="space-y-5">
                      {etapasAdequacao.map((etapa, i) => {
                        const Icon = etapa.icon;
                        return (
                          <div key={i} className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: etapa.color + "20" }}>
                              <Icon className="w-4 h-4" style={{ color: etapa.color }} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-medium text-slate-800">{etapa.label}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold" style={{ color: etapa.color }}>{etapa.progress}%</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    etapa.status === "Concluído" ? "bg-green-100 text-green-700" :
                                    etapa.status === "Em andamento" ? "bg-orange-100 text-orange-700" :
                                    "bg-slate-100 text-slate-500"
                                  }`}>{etapa.status}</span>
                                </div>
                              </div>
                              <div className="h-2 rounded-full bg-slate-100">
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${etapa.progress}%`, backgroundColor: etapa.color }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {pilaresProgress.map((p) => {
                      const Icon = p.icon;
                      return (
                        <div key={p.label} className="bg-white rounded-xl border border-slate-200 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: p.bg }}>
                              <Icon className="w-4 h-4" style={{ color: p.color }} />
                            </div>
                            <span className="text-sm font-medium text-slate-700">Pilar {p.label}</span>
                          </div>
                          <p className="text-3xl font-bold text-slate-900">{p.progress}%</p>
                          <div className="mt-2 h-2 rounded-full bg-slate-100">
                            <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: p.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ===== MÓDULOS ===== */}
              {activeSection === "modulos" && (
                <div className="space-y-4">
                  <p className="text-slate-500 text-sm">Acesse os módulos de aprendizado e gestão dos 4 Pilares da LGPD.</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {modulos.map((m) => {
                      const Icon = m.icon;
                      return (
                        <Link key={m.id} href={m.href}>
                          <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group">
                            <div className="flex items-start justify-between mb-3">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: m.bg }}>
                                <Icon className="w-5 h-5" style={{ color: m.color }} />
                              </div>
                              {m.done ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                              )}
                            </div>
                            <h3 className="font-semibold text-slate-900">{m.label}</h3>
                            <p className="text-sm text-slate-500 mt-1">{m.desc}</p>
                            <div className="mt-3">
                              <span className={`text-xs font-medium ${m.done ? "text-green-600" : "text-slate-400"}`}>
                                {m.done ? "✓ Concluído" : "Pendente"}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ===== MEU PLANO ===== */}
              {activeSection === "plano" && (
                <div className="space-y-4 max-w-2xl">
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{planoAtual.nome}</h3>
                        <p className="text-blue-600 font-semibold text-2xl mt-1">{planoAtual.preco}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">{planoAtual.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-500">Próximo vencimento</p>
                        <p className="font-medium text-slate-800 mt-0.5">{planoAtual.vencimento}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Forma de pagamento</p>
                        <p className="font-medium text-slate-800 mt-0.5">Cartão de crédito</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
                      <button onClick={() => toast.info("Gerenciamento de pagamento disponível em breve.")} className="px-4 py-2 border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition-colors font-medium">
                        Gerenciar pagamento
                      </button>
                      <Link href="/planos">
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium">
                          Ver outros planos
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== MINHA CONTA ===== */}
              {activeSection === "conta" && (
                <div className="space-y-4 max-w-2xl">
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h3 className="font-semibold text-slate-900">Dados da Empresa</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { label: "Razão Social", value: empresa.razaoSocial },
                        { label: "CNPJ", value: empresa.cnpj },
                        { label: "Segmento", value: empresa.segmento },
                        { label: "Responsável", value: empresa.responsavel },
                      ].map((f) => (
                        <div key={f.label}>
                          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{f.label}</p>
                          <p className="text-slate-900 font-medium">{f.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <button onClick={() => toast.info("Edição de perfil disponível em breve.")} className="px-4 py-2 border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition-colors font-medium">
                        Editar dados
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
