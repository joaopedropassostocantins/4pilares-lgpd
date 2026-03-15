/*
 * SubscriptionDashboard.tsx — 4 Pilares LGPD
 * Dashboard para visualizar status de assinatura, próxima cobrança e histórico de pagamentos
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Clock, CreditCard, Trash2, RefreshCw, LogOut, Download } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function SubscriptionDashboard() {
  const [, setLocation] = useLocation();
  const { user, logout, loading: authLoading } = useAuth();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [canceling, setCanceling] = useState(false);

  const { data: subscription, isLoading, refetch } = trpc.subscriptions.getMySubscription.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: paymentHistory = [], isLoading: historyLoading } = trpc.subscriptions.getPaymentHistory.useQuery(undefined, {
    enabled: !!user,
  });

  const cancelMutation = trpc.subscriptions.cancelSubscription.useMutation({
    onSuccess: () => {
      toast.success("Assinatura cancelada com sucesso");
      setShowCancelModal(false);
      setCancelReason("");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao cancelar assinatura");
    },
  });

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || isLoading) {
    return (
      <Layout>
        <section className="py-12" style={{ backgroundColor: "#F8FAFC" }}>
          <div className="container">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 animate-spin">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
              <p className="mt-4 text-slate-600">Carregando dashboard...</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!subscription) {
    return (
      <Layout>
        <section className="py-12" style={{ backgroundColor: "#F8FAFC" }}>
          <div className="container">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">Nenhuma Assinatura Ativa</h2>
                <p className="text-slate-600 mb-6">Você não possui uma assinatura ativa no momento.</p>
                <Button onClick={() => setLocation("/checkout?plan=profissional")} className="bg-blue-600 hover:bg-blue-700">
                  Contratar Plano
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  const statusColor = {
    active: "bg-green-50 border-green-200 text-green-700",
    suspended: "bg-amber-50 border-amber-200 text-amber-700",
    cancelled: "bg-red-50 border-red-200 text-red-700",
    expired: "bg-slate-50 border-slate-200 text-slate-700",
  };

  const statusLabel = {
    active: "✅ Ativo",
    suspended: "⏸️ Suspenso",
    cancelled: "❌ Cancelado",
    expired: "⏱️ Expirado",
  };

  const paymentStatusLabel = {
    approved: "✅ Aprovado",
    pending: "⏳ Pendente",
    failed: "❌ Falhou",
    cancelled: "❌ Cancelado",
  };

  const nextBillingDate = subscription.nextBillingDate 
    ? new Date(subscription.nextBillingDate).toLocaleDateString("pt-BR")
    : "Não informado";

  const startDate = subscription.startDate 
    ? new Date(subscription.startDate).toLocaleDateString("pt-BR")
    : "Não informado";

  return (
    <Layout>
      <section className="py-12" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2">
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                {/* Status da Assinatura */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-slate-900">Status da Assinatura</h2>
                    <div className={`px-4 py-2 rounded-lg border font-medium ${statusColor[subscription.status as keyof typeof statusColor]}`}>
                      {statusLabel[subscription.status as keyof typeof statusLabel]}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-500 font-mono mb-1">Plano</p>
                      <p className="text-lg font-semibold text-slate-900">{subscription.planName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-mono mb-1">Valor Mensal</p>
                      <p className="text-lg font-semibold text-slate-900">R$ {parseFloat(subscription.priceMonthly as any).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-mono mb-1">Data de Início</p>
                      <p className="text-lg font-semibold text-slate-900">{startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-mono mb-1">Próxima Cobrança</p>
                      <p className="text-lg font-semibold text-slate-900">{nextBillingDate}</p>
                    </div>
                  </div>
                </div>

                {/* Empresa */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-6">Informações da Empresa</h3>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-500 font-mono mb-1">Razão Social</p>
                      <p className="text-slate-900">{subscription.razaoSocial}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-mono mb-1">CNPJ</p>
                      <p className="text-slate-900 font-mono">{subscription.cnpj}</p>
                    </div>
                  </div>
                </div>

                {/* Método de Pagamento */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">Método de Pagamento</h3>
                    <CreditCard className="w-5 h-5 text-slate-400" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Status do Pagamento</p>
                      <p className="font-semibold text-slate-900">
                        {paymentStatusLabel[subscription.paymentStatus as keyof typeof paymentStatusLabel]}
                      </p>
                    </div>
                    {subscription.mercadoPagoId && (
                      <p className="text-xs text-slate-500 font-mono">ID: {subscription.mercadoPagoId.slice(-8)}</p>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-4">
                    Pagamentos processados via Mercado Pago com segurança SSL
                  </p>
                </div>

                {/* Histórico de Pagamentos */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-6">Histórico de Pagamentos</h3>

                  {historyLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="w-6 h-6 text-slate-400 animate-spin mx-auto mb-2" />
                      <p className="text-slate-500">Carregando histórico...</p>
                    </div>
                  ) : paymentHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-500">Nenhum pagamento registrado</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-4 font-semibold text-slate-900">Data</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-900">Valor</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-900">Método</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-900">Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentHistory.map((payment: any) => (
                            <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="py-3 px-4 text-slate-900">
                                {new Date(payment.date).toLocaleDateString("pt-BR")}
                              </td>
                              <td className="py-3 px-4 font-semibold text-slate-900">
                                R$ {payment.amount.toFixed(2)}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  payment.status === "approved" ? "bg-green-100 text-green-800" :
                                  payment.status === "pending" ? "bg-amber-100 text-amber-800" :
                                  "bg-red-100 text-red-800"
                                }`}>
                                  {payment.status === "approved" ? "✅ Aprovado" :
                                   payment.status === "pending" ? "⏳ Pendente" :
                                   "❌ Falhou"}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-600">
                                {payment.paymentMethod === "pix" ? "Pix" :
                                 payment.paymentMethod === "credit_card" ? "Cartão Crédito" :
                                 payment.paymentMethod === "debit_card" ? "Cartão Débito" :
                                 "Outro"}
                              </td>
                              <td className="py-3 px-4">
                                <button className="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center gap-1">
                                  <Download className="w-3 h-3" />
                                  Recibo
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => refetch()}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Atualizar
                  </Button>

                  {subscription.status !== "cancelled" && (
                    <Button
                      onClick={() => setShowCancelModal(true)}
                      variant="outline"
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancelar Assinatura
                    </Button>
                  )}

              <Button
                onClick={() => {
                  logout();
                  setLocation("/");
                }}
                variant="outline"
                className="flex items-center gap-2 ml-auto"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div initial="hidden" animate="visible" variants={fadeIn} className="sticky top-20">
                {/* Resumo */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-6">Resumo</h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-slate-900">Assinatura Ativa</p>
                        <p className="text-slate-600">Desde {startDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-slate-900">Próxima Cobrança</p>
                        <p className="text-slate-600">{nextBillingDate}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-slate-900">Valor Mensal</p>
                        <p className="text-slate-600">R$ {parseFloat(subscription.priceMonthly as any).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      Você receberá um e-mail de confirmação antes de cada cobrança.
                    </p>
                  </div>
                </div>

                {/* Suporte */}
                <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 mt-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Precisa de Ajuda?</h4>
                  <p className="text-sm text-blue-700 mb-4">
                    Entre em contato com nosso suporte para dúvidas sobre sua assinatura.
                  </p>
                  <Button
                    onClick={() => window.location.href = "https://wa.me/5511987654321"}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    💬 WhatsApp
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full"
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Cancelar Assinatura</h3>

            <p className="text-slate-600 mb-6">
              Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos serviços.
            </p>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Por que está cancelando? (opcional)"
              className="w-full p-3 border border-slate-300 rounded-lg text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />

            <div className="flex gap-3">
              <Button
                onClick={() => setShowCancelModal(false)}
                variant="outline"
                className="flex-1"
              >
                Manter Assinatura
              </Button>

              <Button
                onClick={() => {
                  setCanceling(true);
                  cancelMutation.mutate({ reason: cancelReason || undefined });
                }}
                disabled={canceling}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {canceling ? "Cancelando..." : "Cancelar"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
}
