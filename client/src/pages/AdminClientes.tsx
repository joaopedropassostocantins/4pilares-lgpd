/*
 * AdminClientes.tsx — 4 Pilares LGPD
 * Gestão de clientes — Painel administrativo
 */
import { trpc } from "@/lib/trpc";
import { Users, Search, Filter, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AdminClientes() {
  const [search, setSearch] = useState("");
  const { data: subscriptions, isLoading } = trpc.subscriptions.listAll.useQuery();

  const filtered = (subscriptions ?? []).filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.razaoSocial?.toLowerCase().includes(q) ||
      s.cnpj?.toLowerCase().includes(q) ||
      s.planName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Clientes
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {filtered.length} cliente{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 mb-4 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <Input
            placeholder="Buscar por razão social, CNPJ ou plano..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 p-0 text-sm"
          />
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-slate-100 text-xs font-medium text-slate-500 uppercase tracking-wide">
            <span>Empresa</span>
            <span>Plano</span>
            <span>Status</span>
            <span></span>
          </div>

          {isLoading ? (
            <div className="px-5 py-12 text-center text-sm text-slate-400">Carregando clientes...</div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-slate-400">
              Nenhum cliente encontrado.
            </div>
          ) : (
            filtered.map((sub) => (
              <div
                key={sub.id}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700">{sub.razaoSocial || "—"}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{sub.cnpj || "—"}</p>
                </div>
                <span className="text-sm text-slate-600">{sub.planName || "—"}</span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    sub.status === "active"
                      ? "bg-green-100 text-green-700"
                      : sub.status === "suspended"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {sub.status === "active" ? "Ativo" : sub.status === "suspended" ? "Suspenso" : sub.status || "—"}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
