/*
 * AdminFinanceiro.tsx — 4 Pilares LGPD
 * Painel financeiro — /admin/financeiro
 */
import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Scale, Users, AlertCircle, BarChart3, ChevronLeft,
  DollarSign, TrendingUp, TrendingDown, CreditCard,
  CheckCircle2, Clock, AlertTriangle, Download, Filter, Shield
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const ADMIN_BG = "#060B14";

const mrrData = [
  { mes: "Out/24", mrr: 24000, novos: 3200, cancelamentos: 800 },
  { mes: "Nov/24", mrr: 27500, novos: 4500, cancelamentos: 1000 },
  { mes: "Dez/24", mrr: 29800, novos: 3100, cancelamentos: 800 },
  { mes: "Jan/25", mrr: 32100, novos: 3500, cancelamentos: 1200 },
  { mes: "Fev/25", mrr: 35600, novos: 4800, cancelamentos: 1300 },
  { mes: "Mar/25", mrr: 38400, novos: 4200, cancelamentos: 1400 },
];

const distribuicaoPlanos = [
  { name: "Básico ANPD", value: 4, color: "#1D4ED8", preco: 150 },
  { name: "Essencial", value: 8, color: "#059669", preco: 997 },
  { name: "Profissional", value: 7, color: "#EA580C", preco: 1997 },
  { name: "Empresarial", value: 5, color: "#7C3AED", preco: 3997 },
];

const assinaturas = [
  { empresa: "Tech Solutions Ltda", plano: "Profissional", valor: 1997, status: "Pago", vencimento: "15/03/2025", metodo: "Cartão", statusColor: "#059669" },
  { empresa: "Construtora Alfa", plano: "Empresarial", valor: 3997, status: "Pago", vencimento: "01/04/2025", metodo: "Cartão", statusColor: "#059669" },
  { empresa: "Escola Digital", plano: "Profissional", valor: 1997, status: "A vencer", vencimento: "30/03/2025", metodo: "Boleto", statusColor: "#EA580C" },
  { empresa: "Clínica Saúde Total", plano: "Essencial", valor: 997, status: "Pago", vencimento: "10/04/2025", metodo: "Cartão", statusColor: "#059669" },
  { empresa: "Farmácia Vida+", plano: "Essencial", valor: 997, status: "Pago", vencimento: "20/04/2025", metodo: "PIX", statusColor: "#059669" },
  { empresa: "Logística Trans Br", plano: "Essencial", valor: 997, status: "Inadimplente", vencimento: "05/03/2025", metodo: "Boleto", statusColor: "#DC2626" },
  { empresa: "Banco Regional SA", plano: "Empresarial", valor: 3997, status: "Pago", vencimento: "12/04/2025", metodo: "Cartão", statusColor: "#059669" },
  { empresa: "Supermercado Bem+", plano: "Básico ANPD", valor: 150, status: "Pago", vencimento: "25/04/2025", metodo: "PIX", statusColor: "#059669" },
];

const mrr = 38400;
const inadimplencia = 997;
const renovacoes = 3;
const churnRate = 2.1;

export default function AdminFinanceiro() {
  const [periodoFilter, setPeriodoFilter] = useState("6m");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const filtered = assinaturas.filter((a) => statusFilter === "Todos" || a.status === statusFilter);

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
            { href: "/admin/financeiro", icon: DollarSign, active: true },
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
                <DollarSign className="w-4 h-4 text-green-600" /> Financeiro
              </h1>
              <p className="text-slate-400 text-xs">Receitas, assinaturas e inadimplência</p>
            </div>
          </div>
          <button className="px-3 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 font-medium flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </header>

        <main className="flex-1 p-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12%
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">R$ {(mrr/1000).toFixed(1)}k</p>
              <p className="text-xs text-slate-500 mt-0.5">MRR (Março/2025)</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded-full">1 cliente</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">R$ {(inadimplencia/1000).toFixed(1)}k</p>
              <p className="text-xs text-slate-500 mt-0.5">Inadimplência</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-full">{renovacoes} este mês</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{renovacoes}</p>
              <p className="text-xs text-slate-500 mt-0.5">Renovações próximas</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <TrendingDown className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">baixo</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{churnRate}%</p>
              <p className="text-xs text-slate-500 mt-0.5">Churn Rate</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Evolução do MRR</h3>
                <div className="flex gap-1">
                  {["3m", "6m", "12m"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriodoFilter(p)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${periodoFilter === p ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={periodoFilter === "3m" ? mrrData.slice(-3) : mrrData}>
                  <defs>
                    <linearGradient id="mrrGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, ""]} />
                  <Area type="monotone" dataKey="mrr" stroke="#059669" strokeWidth={2} fill="url(#mrrGrad2)" name="MRR" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Distribuição por Plano</h3>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={distribuicaoPlanos} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {distribuicaoPlanos.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number, name: string) => [`${v} clientes`, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {distribuicaoPlanos.map((p) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="text-xs text-slate-600">{p.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-800">{p.value}x</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assinaturas table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Assinaturas</h3>
              <div className="flex items-center gap-2">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-400 bg-white text-slate-700">
                  {["Todos", "Pago", "A vencer", "Inadimplente"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Empresa</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Plano</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Valor</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Vencimento</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Método</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-slate-800">{a.empresa}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 hidden md:table-cell">{a.plano}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-slate-900">R$ {a.valor.toLocaleString("pt-BR")}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 hidden sm:table-cell">{a.vencimento}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 hidden lg:table-cell">{a.metodo}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: a.statusColor + "15", color: a.statusColor }}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
