/*
 * AdminClientes.tsx — 4 Pilares LGPD
 * Gestão completa de clientes — /admin/clientes
 */
import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Scale, Users, Search, Filter, Plus, ChevronLeft,
  Building2, CheckCircle2, Clock, AlertCircle, BarChart3,
  MessageSquare, FileText, MoreHorizontal, ArrowUpRight, ChevronRight, Shield
} from "lucide-react";

import { trpc } from "@/lib/trpc";

const ADMIN_BG = "#060B14";

const statusOptions = ["Todos", "Diagnóstico", "Em adequação", "Implementação", "Monitoramento"];
const segmentoOptions = ["Todos", "Tecnologia", "Saúde", "Construção", "Educação", "Logística", "Financeiro", "Varejo"];
const planoOptions = ["Todos", "Básico ANPD", "Essencial", "Profissional", "Empresarial"];

export default function AdminClientes() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [selectedSegmento, setSelectedSegmento] = useState("Todos");
  const [selectedPlano, setSelectedPlano] = useState("Todos");
  const { data: subscriptions = [], isLoading } = trpc.subscriptions.listAll.useQuery();

  const clientes = subscriptions.map((sub) => ({
    id: sub.id,
    name: sub.razaoSocial || `Cliente #${sub.id}`,
    cnpj: sub.cnpj || "N/A",
    plano: sub.planName || "Básico",
    planoColor: sub.planName === "Essencial" ? "#059669" : (sub.planName === "Profissional" ? "#EA580C" : (sub.planName === "Empresarial" ? "#7C3AED" : "#1D4ED8")),
    segment: "N/A",
    status: sub.status === "active" ? "Monitoramento" : "Diagnóstico",
    statusColor: sub.status === "active" ? "#059669" : "#1D4ED8",
    progress: sub.status === "active" ? 100 : 20,
    responsavel: "N/A",
    email: "N/A",
    telefone: "N/A",
    since: sub.startDate ? new Date(sub.startDate).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : "N/A",
    score: sub.status === "active" ? 100 : 20,
  }));

  const [selectedClient, setSelectedClient] = useState<typeof clientes[0] | null>(null);

  const filtered = clientes.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.cnpj.includes(search);
    const matchStatus = selectedStatus === "Todos" || c.status === selectedStatus;
    const matchSeg = selectedSegmento === "Todos" || c.segment === selectedSegmento;
    const matchPlano = selectedPlano === "Todos" || c.plano === selectedPlano;
    return matchSearch && matchStatus && matchSeg && matchPlano;
  });

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
            { href: "/admin/clientes", icon: Users, active: true },
            { href: "/admin/financeiro", icon: Shield, active: false },
            { href: "/admin/incidentes", icon: AlertCircle, active: false },
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
                <Users className="w-4 h-4 text-blue-600" /> Clientes
              </h1>
              <p className="text-slate-400 text-xs">{clientes.length} clientes cadastrados</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Novo cliente
          </button>
        </header>

        <main className="flex-1 p-6">
          {selectedClient ? (
            /* Client detail view */
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
              <button onClick={() => setSelectedClient(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm transition-colors">
                <ChevronLeft className="w-4 h-4" /> Voltar à lista
              </button>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: selectedClient.statusColor }}>
                      {selectedClient.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{selectedClient.name}</h2>
                      <p className="text-slate-500 text-sm">{selectedClient.cnpj} · {selectedClient.segment}</p>
                    </div>
                  </div>
                  <span className="text-sm px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: selectedClient.statusColor + "15", color: selectedClient.statusColor }}>
                    {selectedClient.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                  {[
                    { label: "Plano", value: selectedClient.plano },
                    { label: "Cliente desde", value: selectedClient.since },
                    { label: "Responsável", value: selectedClient.responsavel },
                    { label: "E-mail", value: selectedClient.email },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{f.label}</p>
                      <p className="text-sm font-medium text-slate-800 mt-0.5 truncate">{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900 mb-4">Score de Adequação</h3>
                  <div className="text-center py-2">
                    <p className="text-5xl font-bold" style={{ color: selectedClient.statusColor }}>{selectedClient.score}%</p>
                    <p className="text-slate-500 text-sm mt-2">Progresso geral</p>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-slate-100">
                    <div className="h-full rounded-full transition-all" style={{ width: `${selectedClient.score}%`, backgroundColor: selectedClient.statusColor }} />
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900 mb-4">Ações Rápidas</h3>
                  <div className="space-y-2">
                    {[
                      { label: "Abrir chamado", icon: MessageSquare },
                      { label: "Ver documentos", icon: FileText },
                      { label: "Ver contrato", icon: FileText },
                      { label: "Editar plano", icon: BarChart3 },
                    ].map((a) => {
                      const Icon = a.icon;
                      return (
                        <button key={a.label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm text-left">
                          <Icon className="w-4 h-4 text-slate-400" /> {a.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Client list */
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou CNPJ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 transition-colors"
                  />
                </div>
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 bg-white text-slate-700">
                  {statusOptions.map((s) => <option key={s}>{s}</option>)}
                </select>
                <select value={selectedSegmento} onChange={(e) => setSelectedSegmento(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 bg-white text-slate-700">
                  {segmentoOptions.map((s) => <option key={s}>{s}</option>)}
                </select>
                <select value={selectedPlano} onChange={(e) => setSelectedPlano(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 bg-white text-slate-700">
                  {planoOptions.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Empresa</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Plano</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Segmento</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Progresso</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((client) => (
                      <tr key={client.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedClient(client)}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: client.statusColor }}>
                              {client.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{client.name}</p>
                              <p className="text-xs text-slate-400">{client.cnpj}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: client.planoColor + "15", color: client.planoColor }}>{client.plano}</span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600 hidden lg:table-cell">{client.segment}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 w-28">
                            <div className="flex-1 h-1.5 rounded-full bg-slate-100">
                              <div className="h-full rounded-full" style={{ width: `${client.progress}%`, backgroundColor: client.statusColor }} />
                            </div>
                            <span className="text-xs text-slate-500 flex-shrink-0">{client.progress}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: client.statusColor + "15", color: client.statusColor }}>{client.status}</span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">Nenhum cliente encontrado com esses filtros.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400">{filtered.length} de {clientes.length} clientes</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
