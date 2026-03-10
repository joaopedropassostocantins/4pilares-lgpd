/*
 * AdminIncidentes.tsx — 4 Pilares LGPD
 * Gestão de incidentes e chamados — /admin/incidentes
 */
import { useState } from "react";
import { Link } from "wouter";
import {
  Scale, Users, AlertCircle, BarChart3, ChevronLeft,
  DollarSign, AlertTriangle, MessageSquare, CheckCircle2,
  Clock, Filter, Plus, ChevronDown, Shield, Search, X
} from "lucide-react";

const ADMIN_BG = "#060B14";

const incidentes = [
  { id: "#0042", empresa: "Tech Solutions Ltda", tipo: "Solicitação de Titular", descricao: "Pedido de exclusão de dados pessoais de colaborador desligado", severidade: "Alta", status: "Aberto", responsavel: "Ana Lima", abertura: "08/03/2025", prazo: "15/03/2025", categoria: "LGPD Art. 18" },
  { id: "#0041", empresa: "Clínica Saúde Total", tipo: "Dúvida sobre ROPA", descricao: "Questão sobre como registrar tratamento de dados sensíveis de saúde", severidade: "Média", status: "Em análise", responsavel: "Carlos Mendes", abertura: "06/03/2025", prazo: "13/03/2025", categoria: "Documentação" },
  { id: "#0040", empresa: "Construtora Alfa", tipo: "Incidente de Segurança", descricao: "Acesso não autorizado identificado no sistema de RH", severidade: "Alta", status: "Resolvido", responsavel: "Ana Lima", abertura: "28/02/2025", prazo: "07/03/2025", categoria: "Segurança" },
  { id: "#0039", empresa: "Escola Digital", tipo: "Atualização de Política", descricao: "Revisão semestral da Política de Privacidade exigida pelo DPO", severidade: "Baixa", status: "Em análise", responsavel: "Pedro Costa", abertura: "25/02/2025", prazo: "25/03/2025", categoria: "Documentação" },
  { id: "#0038", empresa: "Banco Regional SA", tipo: "Violação de Dados", descricao: "Vazamento de informações de 3 clientes por falha em API externa", severidade: "Crítica", status: "Resolvido", responsavel: "Carlos Mendes", abertura: "20/02/2025", prazo: "22/02/2025", categoria: "LGPD Art. 48" },
  { id: "#0037", empresa: "Farmácia Vida+", tipo: "Portabilidade de Dados", descricao: "Solicitação de exportação de dados cadastrais por cliente", severidade: "Baixa", status: "Resolvido", responsavel: "Rafael Gomes", abertura: "15/02/2025", prazo: "22/02/2025", categoria: "LGPD Art. 18" },
  { id: "#0036", empresa: "Tech Solutions Ltda", tipo: "Revisão de Contrato", descricao: "DPA com fornecedor terceiro precisa ser atualizado", severidade: "Média", status: "Aberto", responsavel: "Ana Lima", abertura: "10/02/2025", prazo: "31/03/2025", categoria: "Contratos" },
  { id: "#0035", empresa: "Logística Trans Br", tipo: "Treinamento LGPD", descricao: "Equipe de vendas ainda não completou o módulo de privacidade", severidade: "Baixa", status: "Em análise", responsavel: "Pedro Costa", abertura: "05/02/2025", prazo: "05/03/2025", categoria: "Treinamento" },
];

const severidadeConfig: Record<string, { bg: string; color: string; dot: string }> = {
  "Crítica": { bg: "#FEF2F2", color: "#DC2626", dot: "bg-red-600" },
  "Alta": { bg: "#FFF7ED", color: "#EA580C", dot: "bg-orange-500" },
  "Média": { bg: "#FEFCE8", color: "#CA8A04", dot: "bg-yellow-500" },
  "Baixa": { bg: "#F0FDF4", color: "#16A34A", dot: "bg-green-500" },
};

const statusConfig: Record<string, { bg: string; color: string }> = {
  "Aberto": { bg: "#FEF2F2", color: "#DC2626" },
  "Em análise": { bg: "#FFF7ED", color: "#EA580C" },
  "Resolvido": { bg: "#F0FDF4", color: "#16A34A" },
};

export default function AdminIncidentes() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [severidadeFilter, setSeveridadeFilter] = useState("Todos");
  const [selectedIncidente, setSelectedIncidente] = useState<typeof incidentes[0] | null>(null);

  const filtered = incidentes.filter((i) => {
    const matchSearch = i.empresa.toLowerCase().includes(search.toLowerCase()) ||
      i.tipo.toLowerCase().includes(search.toLowerCase()) || i.id.includes(search);
    const matchStatus = statusFilter === "Todos" || i.status === statusFilter;
    const matchSev = severidadeFilter === "Todos" || i.severidade === severidadeFilter;
    return matchSearch && matchStatus && matchSev;
  });

  const abertos = incidentes.filter((i) => i.status === "Aberto").length;
  const emAnalise = incidentes.filter((i) => i.status === "Em análise").length;
  const resolvidos = incidentes.filter((i) => i.status === "Resolvido").length;
  const criticos = incidentes.filter((i) => i.severidade === "Crítica" || (i.severidade === "Alta" && i.status !== "Resolvido")).length;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8FAFC" }}>
      {/* Mini sidebar */}
      <aside className="hidden lg:flex flex-col w-16" style={{ backgroundColor: ADMIN_BG, minHeight: "100vh" }}>
        <div className="flex items-center justify-center py-5 border-b" style={{ borderColor: "#1a2640" }}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" />
          </div>
        </div>
        <nav className="flex-1 py-4 px-2 space-y-1">
          {[
            { href: "/admin", icon: BarChart3, active: false },
            { href: "/admin/clientes", icon: Users, active: false },
            { href: "/admin/financeiro", icon: DollarSign, active: false },
            { href: "/admin/incidentes", icon: AlertCircle, active: true },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`p-2.5 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${item.active ? "bg-blue-600/20 text-blue-400" : "text-slate-500 hover:text-white hover:bg-white/5"}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </Link>
            <div>
              <h1 className="font-semibold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" /> Incidentes & Chamados
              </h1>
              <p className="text-slate-400 text-xs">{incidentes.length} registros · {abertos} abertos</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 font-medium flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Novo incidente
          </button>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {selectedIncidente ? (
            /* Detail view */
            <div className="space-y-4 max-w-3xl">
              <button onClick={() => setSelectedIncidente(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm transition-colors">
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-500">{selectedIncidente.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium`} style={{ backgroundColor: severidadeConfig[selectedIncidente.severidade].bg, color: severidadeConfig[selectedIncidente.severidade].color }}>
                        {selectedIncidente.severidade}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedIncidente.tipo}</h2>
                    <p className="text-slate-500 text-sm mt-1">{selectedIncidente.empresa}</p>
                  </div>
                  <span className="text-sm px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: statusConfig[selectedIncidente.status].bg, color: statusConfig[selectedIncidente.status].color }}>
                    {selectedIncidente.status}
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 mb-4">
                  <p className="text-sm text-slate-700">{selectedIncidente.descricao}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Categoria", value: selectedIncidente.categoria },
                    { label: "Responsável", value: selectedIncidente.responsavel },
                    { label: "Aberto em", value: selectedIncidente.abertura },
                    { label: "Prazo", value: selectedIncidente.prazo },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{f.label}</p>
                      <p className="text-sm font-medium text-slate-800 mt-0.5">{f.value}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex gap-3">
                  {selectedIncidente.status !== "Resolvido" && (
                    <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 font-medium transition-colors">
                      Marcar como resolvido
                    </button>
                  )}
                  <button className="px-4 py-2 border border-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-50 font-medium transition-colors">
                    Adicionar nota
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Abertos", value: abertos, color: "#DC2626", bg: "#FEF2F2", icon: AlertCircle },
                  { label: "Em análise", value: emAnalise, color: "#EA580C", bg: "#FFF7ED", icon: Clock },
                  { label: "Resolvidos", value: resolvidos, color: "#16A34A", bg: "#F0FDF4", icon: CheckCircle2 },
                  { label: "Alta/Crítica", value: criticos, color: "#7C3AED", bg: "#F5F3FF", icon: AlertTriangle },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                          <Icon className="w-4 h-4" style={{ color: card.color }} />
                        </div>
                      </div>
                      <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por empresa, tipo ou ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 bg-white text-slate-700">
                  {["Todos", "Aberto", "Em análise", "Resolvido"].map((s) => <option key={s}>{s}</option>)}
                </select>
                <select value={severidadeFilter} onChange={(e) => setSeveridadeFilter(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 bg-white text-slate-700">
                  {["Todos", "Crítica", "Alta", "Média", "Baixa"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* List */}
              <div className="space-y-3">
                {filtered.map((inc) => (
                  <div
                    key={inc.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm cursor-pointer transition-all"
                    onClick={() => setSelectedIncidente(inc)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${severidadeConfig[inc.severidade].dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs text-slate-400">{inc.id}</span>
                              <span className="font-semibold text-slate-900 text-sm">{inc.tipo}</span>
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5">{inc.empresa} · {inc.categoria}</p>
                            <p className="text-sm text-slate-600 mt-1 line-clamp-1">{inc.descricao}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: statusConfig[inc.status].bg, color: statusConfig[inc.status].color }}>
                              {inc.status}
                            </span>
                            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: severidadeConfig[inc.severidade].bg, color: severidadeConfig[inc.severidade].color }}>
                              {inc.severidade}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                          <span>Aberto: {inc.abertura}</span>
                          <span>Prazo: {inc.prazo}</span>
                          <span>Resp.: {inc.responsavel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-sm">Nenhum incidente encontrado.</div>
                )}
              </div>
              <p className="text-xs text-slate-400">{filtered.length} de {incidentes.length} incidentes</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
