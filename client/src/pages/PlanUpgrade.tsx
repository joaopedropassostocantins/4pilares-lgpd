/*
 * PlanUpgrade.tsx — 4 Pilares LGPD
 * Página para upgrade/downgrade de plano com cálculo de créditos proporcionais
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Check, AlertCircle, RefreshCw } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { PLANOS } from "@/const/pricing";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface PlanOption {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export default function PlanUpgrade() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [creditInfo, setCreditInfo] = useState<{ remaining: number; willCredit: number } | null>(null);

  const { data: subscription, isLoading } = trpc.subscriptions.getMySubscription.useQuery(undefined, {
    enabled: !!user,
  });

  const upgradeMutation = trpc.subscriptions.upgradePlan.useMutation({
    onSuccess: () => {
      toast.success("Plano atualizado com sucesso!");
      setTimeout(() => setLocation("/subscription"), 2000);
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar plano");
      setUpgrading(false);
    },
  });

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  // Calcular créditos ao selecionar novo plano
  useEffect(() => {
    if (selectedPlan && subscription) {
      const planos = Object.values(PLANOS);
      const currentPlan = planos.find((p: any) => p.id === subscription.planId);
      const newPlan = planos.find((p: any) => p.id === selectedPlan);

      if (currentPlan && newPlan) {
        const currentPrice = (currentPlan.precoPromocional || currentPlan.precoNormal) as number;
        const newPrice = (newPlan.precoPromocional || newPlan.precoNormal) as number;

        // Calcular dias restantes do mês atual
        const startDate = new Date(subscription.startDate);
        const nextBillingDate = new Date(subscription.nextBillingDate || startDate);
        const today = new Date();
        const daysRemaining = Math.ceil((nextBillingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const totalDaysInMonth = 30; // Simplificado

        // Crédito proporcional do plano atual
        const dailyRate = currentPrice / totalDaysInMonth;
        const remainingCredit = dailyRate * daysRemaining;

        // Novo valor a pagar
        const newDailyRate = newPrice / totalDaysInMonth;
        const newCharge = newDailyRate * daysRemaining;

        setCreditInfo({
          remaining: remainingCredit,
          willCredit: remainingCredit - newCharge,
        });
      }
    }
  }, [selectedPlan, subscription]);

  if (authLoading || isLoading) {
    return (
      <Layout>
        <section className="py-12" style={{ backgroundColor: "#F8FAFC" }}>
          <div className="container">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Carregando informações...</p>
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
                <p className="text-slate-600 mb-6">Você precisa ter uma assinatura ativa para fazer upgrade/downgrade.</p>
                <Button onClick={() => setLocation("/subscription")} className="bg-blue-600 hover:bg-blue-700">
                  Voltar ao Dashboard
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  const planos = Object.values(PLANOS);
  const currentPlan = planos.find((p: any) => p.id === subscription.planId);

  return (
    <Layout>
      <section className="py-12" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Alterar Plano</h1>
              <p className="text-lg text-slate-600">
                Seu plano atual: <span className="font-semibold">{currentPlan?.nome}</span> - R$ {((currentPlan?.precoPromocional || currentPlan?.precoNormal) as number) / 100}/mês
              </p>
            </div>

            {/* Aviso de Créditos */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Como funciona o upgrade/downgrade</h3>
                  <p className="text-sm text-blue-700">
                    Seus créditos do plano atual serão proporcionalmente convertidos para o novo plano. 
                    Se houver diferença, será cobrada ou creditada na próxima fatura.
                  </p>
                </div>
              </div>
            </div>

            {/* Grid de Planos */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {planos.map((plano: any) => {
                const isCurrentPlan = plano.id === subscription.planId;
                const isSelected = selectedPlan === plano.id;
                const price = plano.precoPromocional || plano.precoNormal;

                return (
                  <motion.div
                    key={plano.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`relative rounded-2xl border-2 p-8 cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50"
                        : isCurrentPlan
                        ? "border-slate-300 bg-slate-50"
                        : "border-slate-200 bg-white hover:border-blue-300"
                    }`}
                    onClick={() => !isCurrentPlan && setSelectedPlan(plano.id)}
                  >
                    {isCurrentPlan && (
                      <div className="absolute top-4 right-4 bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Plano Atual
                      </div>
                    )}

                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plano.nome}</h3>
                    <p className="text-slate-600 text-sm mb-4">{plano.descricao}</p>

                    <div className="mb-6">
                      <div className="text-4xl font-bold text-slate-900">
                        R$ {((price as number) / 100).toFixed(0)}
                        <span className="text-lg text-slate-600 font-normal">/mês</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plano.features?.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-700">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {!isCurrentPlan && (
                      <Button
                        onClick={() => setSelectedPlan(plano.id)}
                        className={`w-full ${
                          isSelected
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                        }`}
                      >
                        {isSelected ? "Selecionado" : "Selecionar"}
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Resumo de Créditos */}
            {selectedPlan && creditInfo && selectedPlan !== subscription.planId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 p-8 mb-8"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-6">Resumo da Alteração</h3>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <p className="text-sm text-slate-500 font-mono mb-1">Crédito Atual</p>
                    <p className="text-2xl font-bold text-slate-900">
                      R$ {creditInfo.remaining.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-slate-400" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 font-mono mb-1">
                      {creditInfo.willCredit > 0 ? "Você Receberá" : "Você Pagará"}
                    </p>
                    <p className={`text-2xl font-bold ${creditInfo.willCredit > 0 ? "text-green-600" : "text-orange-600"}`}>
                      R$ {Math.abs(creditInfo.willCredit).toFixed(2)}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-6">
                  {creditInfo.willCredit > 0
                    ? "Você receberá um crédito na próxima fatura."
                    : "A diferença será cobrada na próxima fatura."}
                </p>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setSelectedPlan(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>

                  <Button
                    onClick={() => {
                      setUpgrading(true);
                      upgradeMutation.mutate({
                        newPlanId: selectedPlan,
                        creditAmount: creditInfo.willCredit,
                      });
                    }}
                    disabled={upgrading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {upgrading ? "Processando..." : "Confirmar Alteração"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Botão Voltar */}
            <div className="text-center">
              <Button
                onClick={() => setLocation("/subscription")}
                variant="outline"
              >
                Voltar ao Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
