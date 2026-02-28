import React, { useEffect, useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';

interface DashboardMetrics {
  totalDiagnostics: number;
  paidDiagnostics: number;
  totalRevenue: number;
  conversionRate: number;
  averageCAC: number;
  averageLTV: number;
  totalReferrals: number;
  referralRevenue: number;
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  accuracyStats: {
    very_accurate: number;
    accurate: number;
    neutral: number;
    inaccurate: number;
    very_inaccurate: number;
  };
  conversionByVariant: {
    A: { total: number; paid: number; rate: number };
    B: { total: number; paid: number; rate: number };
  };
  revenueByPlan: {
    promo: number;
    normal: number;
    lifetime: number;
  };
}

export function Dashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard metrics
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/trpc/admin.getDashboardMetrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setMetrics(data.result.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground">Apenas administradores podem acessar o dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando métricas...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-destructive">Erro</h1>
          <p className="text-muted-foreground">{error || 'Falha ao carregar métricas'}</p>
          <button
            onClick={fetchMetrics}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard de Análise</h1>
          <p className="text-muted-foreground">Métricas em tempo real • Atualizado a cada 30 segundos</p>
          <button
            onClick={fetchMetrics}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
          >
            🔄 Atualizar Agora
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Conversão */}
          <div className="bg-card text-card-foreground rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Taxa de Conversão</p>
                <p className="text-3xl font-bold">{metrics.conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {metrics.paidDiagnostics} de {metrics.totalDiagnostics} diagnósticos
                </p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          {/* Receita Total */}
          <div className="bg-card text-card-foreground rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Receita Total</p>
                <p className="text-3xl font-bold">R$ {metrics.totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Mensal: R$ {metrics.monthlyRevenue.toFixed(2)}
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          {/* CAC */}
          <div className="bg-card text-card-foreground rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">CAC Médio</p>
                <p className="text-3xl font-bold">R$ {metrics.averageCAC.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Custo de Aquisição
                </p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>

          {/* LTV */}
          <div className="bg-card text-card-foreground rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">LTV Médio</p>
                <p className="text-3xl font-bold">R$ {metrics.averageLTV.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Valor do Cliente
                </p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Referrals */}
          <div className="bg-card text-card-foreground rounded-lg p-6 border border-border">
            <p className="text-sm text-muted-foreground mb-2">Referrals Gerados</p>
            <p className="text-2xl font-bold">{metrics.totalReferrals}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Receita: R$ {metrics.referralRevenue.toFixed(2)}
            </p>
          </div>

          {/* Receita Diária */}
          <div className="bg-card text-card-foreground rounded-lg p-6 border border-border">
            <p className="text-sm text-muted-foreground mb-2">Receita Hoje</p>
            <p className="text-2xl font-bold">R$ {metrics.dailyRevenue.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Semanal: R$ {metrics.weeklyRevenue.toFixed(2)}
            </p>
          </div>

          {/* Diagnósticos */}
          <div className="bg-card text-card-foreground rounded-lg p-6 border border-border">
            <p className="text-sm text-muted-foreground mb-2">Total de Diagnósticos</p>
            <p className="text-2xl font-bold">{metrics.totalDiagnostics}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Pagos: {metrics.paidDiagnostics}
            </p>
          </div>
        </div>

        {/* Conversion by Variant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* A/B Test Results */}
          <div className="bg-card text-card-foreground rounded-lg p-6 border border-border">
            <h2 className="text-xl font-bold mb-4">Resultados A/B Test</h2>
            <div className="space-y-4">
              {Object.entries(metrics.conversionByVariant).map(([variant, data]) => (
                <div key={variant}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Variante {variant}</span>
                    <span className="text-sm text-muted-foreground">
                      {data.paid}/{data.total} ({data.rate.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(data.rate * 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Plan */}
          <div className="bg-card text-card-foreground rounded-lg p-6 border border-border">
            <h2 className="text-xl font-bold mb-4">Receita por Plano</h2>
            <div className="space-y-4">
              {Object.entries(metrics.revenueByPlan).map(([plan, revenue]) => {
                const total = Object.values(metrics.revenueByPlan).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (revenue / total) * 100 : 0;
                const planNames = { promo: 'Promoção', normal: 'Normal', lifetime: 'Vitalício' };
                
                return (
                  <div key={plan}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{planNames[plan as keyof typeof planNames]}</span>
                      <span className="text-sm text-muted-foreground">
                        R$ {revenue.toFixed(2)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Accuracy Stats */}
        <div className="bg-card text-card-foreground rounded-lg p-6 border border-border">
          <h2 className="text-xl font-bold mb-4">Precisão das Análises</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{metrics.accuracyStats.very_accurate}</p>
              <p className="text-xs text-muted-foreground">Muito Precisa</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{metrics.accuracyStats.accurate}</p>
              <p className="text-xs text-muted-foreground">Precisa</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{metrics.accuracyStats.neutral}</p>
              <p className="text-xs text-muted-foreground">Neutra</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{metrics.accuracyStats.inaccurate}</p>
              <p className="text-xs text-muted-foreground">Imprecisa</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{metrics.accuracyStats.very_inaccurate}</p>
              <p className="text-xs text-muted-foreground">Muito Imprecisa</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Dashboard atualizado automaticamente a cada 30 segundos</p>
          <p>Última atualização: {new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}
