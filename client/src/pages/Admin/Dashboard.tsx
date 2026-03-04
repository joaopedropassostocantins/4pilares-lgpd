import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Users, DollarSign, Percent } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center text-muted-foreground">Erro ao carregar estatísticas</div>;
  }

  const metrics = [
    {
      title: "Total de Diagnósticos",
      value: stats.totalDiagnostics,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Diagnósticos Pagos",
      value: stats.paidDiagnostics,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Receita Total",
      value: `R$ ${stats.totalRevenue}`,
      icon: DollarSign,
      color: "text-yellow-500",
    },
    {
      title: "Taxa de Conversão",
      value: `${stats.conversionRate}%`,
      icon: Percent,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
          Dashboard Administrativo
        </h1>
        <p className="text-muted-foreground mt-2">Visão geral de diagnósticos e pagamentos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="bg-card/60 border-primary/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{metric.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card className="bg-card/60 border-primary/30">
        <CardHeader>
          <CardTitle className="text-lg">Resumo Executivo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Média por Diagnóstico</p>
              <p className="text-xl font-bold text-primary">
                R$ {stats.totalDiagnostics > 0 ? (parseFloat(stats.totalRevenue) / stats.totalDiagnostics).toFixed(2) : "0.00"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Diagnósticos Pendentes</p>
              <p className="text-xl font-bold text-primary">
                {stats.totalDiagnostics - stats.paidDiagnostics}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
