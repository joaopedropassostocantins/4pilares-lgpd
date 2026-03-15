import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Clock, XCircle, Loader2, ArrowRight } from "lucide-react";

interface PaymentData {
  paymentId: string;
  status: "approved" | "pending" | "failed" | "cancelled";
  planName: string;
  amount: number;
  email: string;
  razaoSocial: string;
  subscriptionId?: string;
  createdAt: string;
}

export default function PaymentConfirmation() {
  const [, navigate] = useLocation();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados do pagamento da URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get("payment_id");
    const status = params.get("status");

    if (!paymentId) {
      setError("ID de pagamento não encontrado");
      setLoading(false);
      return;
    }

    // Simular busca de dados (em produção, seria uma chamada tRPC)
    const mockData: PaymentData = {
      paymentId,
      status: (status as any) || "pending",
      planName: "Plano Básico ANPD",
      amount: 150,
      email: "empresa@example.com",
      razaoSocial: "Tech Solutions Ltda",
      subscriptionId: `sub-${paymentId}`,
      createdAt: new Date().toLocaleString("pt-BR"),
    };

    setPaymentData(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600">Carregando informações do pagamento...</p>
        </Card>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <XCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro ao Carregar Pagamento</h1>
            <p className="text-gray-600 mb-6">{error || "Informações não encontradas"}</p>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar ao Início
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Renderizar baseado no status
  const renderStatusContent = () => {
    switch (paymentData.status) {
      case "approved":
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-600" />,
          title: "Pagamento Aprovado! 🎉",
          subtitle: "Sua assinatura foi ativada com sucesso",
          bgColor: "from-green-50 to-emerald-100",
          textColor: "text-green-600",
          badge: "✅ Aprovado",
        };
      case "pending":
        return {
          icon: <Clock className="w-16 h-16 text-yellow-600" />,
          title: "Pagamento Pendente",
          subtitle: "Estamos processando seu pagamento",
          bgColor: "from-yellow-50 to-amber-100",
          textColor: "text-yellow-600",
          badge: "⏳ Pendente",
        };
      case "failed":
      case "cancelled":
        return {
          icon: <AlertCircle className="w-16 h-16 text-red-600" />,
          title: "Pagamento Falhou",
          subtitle: "Não conseguimos processar seu pagamento",
          bgColor: "from-red-50 to-orange-100",
          textColor: "text-red-600",
          badge: "❌ Falhou",
        };
      default:
        return {
          icon: <AlertCircle className="w-16 h-16 text-gray-600" />,
          title: "Status Desconhecido",
          subtitle: "Não conseguimos determinar o status",
          bgColor: "from-gray-50 to-slate-100",
          textColor: "text-gray-600",
          badge: "❓ Desconhecido",
        };
    }
  };

  const statusContent = renderStatusContent();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${statusContent.bgColor} flex items-center justify-center p-4`}>
      <div className="w-full max-w-2xl">
        {/* Status Card */}
        <Card className="p-8 mb-6 shadow-lg">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">{statusContent.icon}</div>
            <div className={`inline-block px-4 py-2 rounded-full font-semibold mb-4 ${statusContent.textColor} bg-white border-2`}>
              {statusContent.badge}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{statusContent.title}</h1>
            <p className="text-gray-600 text-lg">{statusContent.subtitle}</p>
          </div>

          {/* Detalhes do Pagamento */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 font-semibold">ID do Pagamento</p>
                <p className="text-gray-900 font-mono text-sm break-all">{paymentData.paymentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Data</p>
                <p className="text-gray-900">{paymentData.createdAt}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Plano</p>
                <p className="text-gray-900">{paymentData.planName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Valor</p>
                <p className="text-gray-900 font-bold">R$ {paymentData.amount.toFixed(2)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 font-semibold">Empresa</p>
                <p className="text-gray-900">{paymentData.razaoSocial}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 font-semibold">Email</p>
                <p className="text-gray-900">{paymentData.email}</p>
              </div>
            </div>
          </div>

          {/* Mensagens de Status */}
          {paymentData.status === "approved" && (
            <div className="bg-green-50 border-l-4 border-green-600 p-4 mb-6">
              <p className="text-green-800 font-semibold">✅ Seu acesso foi ativado!</p>
              <p className="text-green-700 text-sm mt-1">
                Você pode acessar seu painel agora. Um email de confirmação foi enviado para {paymentData.email}
              </p>
            </div>
          )}

          {paymentData.status === "pending" && (
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-6">
              <p className="text-yellow-800 font-semibold">⏳ Aguardando Confirmação</p>
              <p className="text-yellow-700 text-sm mt-1">
                Seu pagamento está sendo processado. Você receberá um email quando for confirmado.
              </p>
            </div>
          )}

          {(paymentData.status === "failed" || paymentData.status === "cancelled") && (
            <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
              <p className="text-red-800 font-semibold">❌ Pagamento Não Processado</p>
              <p className="text-red-700 text-sm mt-1">
                Houve um problema ao processar seu pagamento. Por favor, tente novamente ou entre em contato com nosso suporte.
              </p>
            </div>
          )}
        </Card>

        {/* Ações */}
        <div className="grid grid-cols-2 gap-4">
          {paymentData.status === "approved" && (
            <>
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
              >
                Acessar Painel
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="font-semibold py-3 rounded-lg"
              >
                Voltar ao Início
              </Button>
            </>
          )}

          {paymentData.status === "pending" && (
            <>
              <Button
                onClick={() => navigate("/checkout")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
              >
                Verificar Status
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="font-semibold py-3 rounded-lg"
              >
                Voltar
              </Button>
            </>
          )}

          {(paymentData.status === "failed" || paymentData.status === "cancelled") && (
            <>
              <Button
                onClick={() => navigate("/checkout")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
              >
                Tentar Novamente
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="font-semibold py-3 rounded-lg"
              >
                Voltar ao Início
              </Button>
            </>
          )}
        </div>

        {/* Suporte */}
        <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
          <p className="text-sm text-gray-600 mb-3">
            <strong>Precisa de ajuda?</strong> Entre em contato com nosso suporte:
          </p>
          <div className="space-y-2 text-sm">
            <p>📧 Email: suporte@4pilares.com.br</p>
            <p>📞 Telefone: (63) 98438-1782</p>
            <p>💬 WhatsApp: (63) 98438-1782</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
