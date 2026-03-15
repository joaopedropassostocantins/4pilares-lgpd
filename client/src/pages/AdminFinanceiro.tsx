/*
 * AdminFinanceiro.tsx — 4 Pilares LGPD
 * Painel financeiro — Receitas e pagamentos
 */
import { trpc } from "@/lib/trpc";
import { CreditCard, TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react";

export default function AdminFinanceiro() {
  const { data: subscriptions, isLoading } = trpc.subscriptions.listAll.useQuery();

  const totalReceita = (subscriptions ?? [])
    .filter((s) => s.paymentStatus === "approved" && s.status === "active")
    .reduce((acc, s) => acc + parseFloat(s.priceMonthly || "0"), 0);

  const aprovados = (subscriptions ?? []).filter((s) => s.paymentStatus === "approved").length;
  const pendentes = (subscriptions ?? []).filter((s) => s.paymentStatus === "pending").length;
  const falhos = (subscriptions ?? []).filter((s) => s.paymentStatus === "failed").length;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-green-600" />
            Financeiro
          </h1>
          <p className="text-sm text-slate-500 mt-1">Receitas, pagamentos e status financeiro</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <TrendingUp className="w-5 h-5 text-green-600 mb-3" />
            <p className="text-xl font-semibold text-slate-800">
              {isLoading ? "—" : `R$ ${totalReceita.toFixed(2)}`}
            </p>
            <p className="text-xs text-slate-500 mt-1">Receita mensal recorrente</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <CheckCircle className="w-5 h-5 text-green-500 mb-3" />
            <p className="text-xl font-semibold text-slate-800">{isLoading ? "—" : aprovados}</p>
            <p className="text-xs text-slate-500 mt-1">Pagamentos aprovados</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <Clock className="w-5 h-5 text-yellow-500 mb-3" />
            <p className="text-xl font-semibold text-slate-800">{isLoading ? "—" : pendentes}</p>
            <p className="text-xs text-slate-500 mt-1">Pagamentos pendentes</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-5">
            <XCircle className="w-5 h-5 text-red-500 mb-3" />
            <p className="text-xl font-semibold text-slate-800">{isLoading ? "—" : falhos}</p>
            <p className="text-xs text-slate-500 mt-1">Pagamentos falhos</p>
          </div>
        </div>

        {/* Transactions table */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700">Histórico de pagamentos</h2>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-slate-100 text-xs font-medium text-slate-500 uppercase tracking-wide">
            <span>Empresa</span>
            <span>Plano</span>
            <span>Valor</span>
            <span>Status</span>
          </div>

          {isLoading ? (
            <div className="px-5 py-12 text-center text-sm text-slate-400">Carregando dados...</div>
          ) : (subscriptions ?? []).length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-slate-400">Nenhum pagamento registrado.</div>
          ) : (
            (subscriptions ?? []).map((sub) => (
              <div
                key={sub.id}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 border-b border-slate-50 hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700">{sub.razaoSocial || "—"}</p>
                  {sub.mercadoPagoId && (
                    <p className="text-xs text-slate-400 font-mono mt-0.5">MP: {sub.mercadoPagoId}</p>
                  )}
                </div>
                <span className="text-sm text-slate-600">{sub.planName || "—"}</span>
                <span className="text-sm font-medium text-slate-800">
                  {sub.priceMonthly ? `R$ ${parseFloat(sub.priceMonthly).toFixed(2)}` : "—"}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    sub.paymentStatus === "approved"
                      ? "bg-green-100 text-green-700"
                      : sub.paymentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {sub.paymentStatus === "approved"
                    ? "Aprovado"
                    : sub.paymentStatus === "pending"
                    ? "Pendente"
                    : sub.paymentStatus === "failed"
                    ? "Falhou"
                    : sub.paymentStatus || "—"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
