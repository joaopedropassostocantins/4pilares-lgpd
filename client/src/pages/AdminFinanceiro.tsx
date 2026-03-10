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
import { trpc } from "@/lib/trpc";

const ADMIN_BG = "#060B14";

export default function AdminFinanceiro() {
  const [periodoFilter, setPeriodoFilter] = useState("6m");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const { data: subscriptions = [], isLoading } = trpc.subscriptions.listAll.useQuery();

  let mrr = 0;
  let inadimplencia = 0;
  let renovacoes = 0;
  const planCount: Record<string, number> = {};

  const assinaturas = subscriptions.map((sub) => {
    const isPago = sub.status === "active";
    const valor = Number(sub.priceMonthly) || 0;
    
    if (isPago) mrr += valor;
    if (sub.status === "expired") inadimplencia += valor;

    const planName = sub.planName || "Básico";
    planCount[planName] = (planCount[planName] || 0) + 1;

    return {
      empresa: sub.razaoSocial || `Cliente #${sub.id}`,
      plano: planName,
      valor: valor,
      status: isPago ? "Pago" : (sub.paymentStatus === "pending" ? "Pendente" : "Inadimplente"),
      vencimento: sub.startDate ? new Date(new Date(sub.startDate).getTime() + 30*24*60*60*1000).toLocaleDateString('pt-BR') : "N/A",
      metodo: "Checkout",
      statusColor: isPago ? "#059669" : (sub.paymentStatus === "pending" ? "#EA580C" : "#DC2626"),
    };
  });

  const distribuicaoPlanos = Object.entries(planCount).map(([name, value], idx) => {
    const colors = ["#1D4ED8", "#059669", "#EA580C", "#7C3AED"];
    return { name, value, color: colors[idx % colors.length], preco: 0 };
  });

  const mrrData = [
    { mes: "Mês Anterior", mrr: mrr * 0.8, novos: 0, cancelamentos: 0 },
    { mes: "Mês Atual", mrr: mrr, novos: mrr * 0.2, cancelamentos: 0 },
  ];

  const churnRate = 0.0;

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
