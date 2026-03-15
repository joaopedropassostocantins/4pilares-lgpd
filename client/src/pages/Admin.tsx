/*
 * Admin.tsx — 4 Pilares LGPD
 * Painel Administrativo Principal
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import {
  LayoutDashboard, Users, CreditCard, AlertTriangle,
  BarChart3, Shield, TrendingUp, Activity, Menu, X, LogOut
} from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { icon: LayoutDashboard, label: "Visão Geral", id: "overview", href: "/admin" },
  { icon: Users, label: "Clientes", id: "clientes", href: "/admin/clientes" },
  { icon: CreditCard, label: "Financeiro", id: "financeiro", href: "/admin/financeiro" },
  { icon: AlertTriangle, label: "Incidentes", id: "incidentes", href: "/admin/incidentes" },
];

export default function Admin() {
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Sessão encerrada");
      setLocation("/login");
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-56" : "w-16"} transition-all duration-200 bg-white border-r border-slate-200 flex flex-col`}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-100">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-slate-700">Admin</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setLocation(item.href)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-sm"
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="px-2 pb-4">
          <button
            onClick={() => logoutMutation.mutate()}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-800">Visão Geral</h1>
            <p className="text-sm text-slate-500 mt-1">Painel administrativo da plataforma 4 Pilares LGPD</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Clientes ativos", value: "—", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Receita mensal", value: "—", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
              { label: "Taxa conformidade", value: "—", icon: BarChart3, color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Incidentes abertos", value: "—", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl border border-slate-100 p-5">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-xl font-semibold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <p className="text-sm text-slate-500 text-center py-8">
              Selecione uma seção no menu lateral para visualizar os dados.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
