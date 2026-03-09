/*
 * Checkout.tsx — 4 Pilares LGPD
 * Integração com Mercado Pago Payment Brick
 */
import { useEffect, useState } from "react";
import { useSearchParams } from "wouter";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

declare global {
  interface Window {
    MercadoPago?: any;
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const MERCADO_PAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
const MERCADO_PAGO_SDK_URL = "https://sdk.mercadopago.com/js/v2";

const planosPagamento = {
  essencial: { nome: "Essencial", preco: 29900, parcelas: 1 },
  profissional: { nome: "Profissional", preco: 79900, parcelas: 1 },
  empresarial: { nome: "Empresarial", preco: 199900, parcelas: 1 },
};

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const planType = (searchParams.get("plan") || "profissional") as keyof typeof planosPagamento;
  const plano = planosPagamento[planType] || planosPagamento.profissional;

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [brickReady, setBrickReady] = useState(false);

  // Carregar SDK do Mercado Pago
  useEffect(() => {
    if (window.MercadoPago) {
      initializeBrick();
      return;
    }

    const script = document.createElement("script");
    script.src = MERCADO_PAGO_SDK_URL;
    script.async = true;
    script.onload = () => {
      initializeBrick();
    };
    script.onerror = () => {
      toast.error("Erro ao carregar Mercado Pago. Tente novamente.");
      setLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initializeBrick = async () => {
    if (!window.MercadoPago || !MERCADO_PAGO_PUBLIC_KEY) {
      toast.error("Chave pública do Mercado Pago não configurada.");
      setLoading(false);
      return;
    }

    try {
      const mp = new window.MercadoPago(MERCADO_PAGO_PUBLIC_KEY, {
        locale: "pt-BR",
      });

      const brickBuilder = mp.bricks();

      const settings = {
        initialization: {
          amount: plano.preco / 100, // Converter para reais
          payer: {
            email: "",
          },
        },
        customization: {
          paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            ticket: "all",
            bankTransfer: "all",
          },
          visual: {
            hideFormTitle: false,
            style: {
              customVariables: {
                baseColor: "#5b21b6", // Roxo 4 Pilares
              },
            },
          },
        },
        callbacks: {
          onReady: () => {
            setBrickReady(true);
            setLoading(false);
          },
          onSubmit: async (formData: any) => {
            setStatus("processing");
            try {
              // Aqui você enviaria os dados para seu backend processar o pagamento
              // const response = await fetch('/api/payments/process', {
              //   method: 'POST',
              //   headers: { 'Content-Type': 'application/json' },
              //   body: JSON.stringify(formData)
              // });
              // const result = await response.json();

              // Simulação de sucesso
              setTimeout(() => {
                setStatus("success");
                toast.success("Pagamento processado com sucesso!");
              }, 2000);
            } catch (error) {
              setStatus("error");
              toast.error("Erro ao processar pagamento. Tente novamente.");
            }
          },
          onError: (error: any) => {
            setStatus("error");
            console.error("Brick error:", error);
            toast.error("Erro no formulário de pagamento. Verifique os dados.");
          },
        },
      };

      await brickBuilder.create("payment", "paymentBrick_container", settings);
    } catch (error) {
      console.error("Erro ao inicializar Brick:", error);
      toast.error("Erro ao carregar formulário de pagamento.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container max-w-2xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-8">
            <Link href="/planos">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar aos planos
              </Button>
            </Link>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="mb-8">
                <h1 className="title-serif text-3xl text-slate-900 mb-2">Checkout</h1>
                <p className="text-slate-600">Finalize sua assinatura ao plano {plano.nome}</p>
              </div>

              {/* Resumo do pedido */}
              <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-500 font-mono">Plano</p>
                    <p className="text-lg font-semibold text-slate-900">{plano.nome}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-mono">Valor</p>
                    <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-mono)" }}>
                      R$ {(plano.preco / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 font-mono">Faturamento</p>
                  <p className="text-sm text-slate-700">Mensalidade recorrente · Máximo {plano.parcelas}x</p>
                </div>
              </div>

              {/* Payment Brick */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : status === "success" ? (
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="title-serif text-xl text-slate-900 mb-2">Pagamento confirmado!</h3>
                  <p className="text-slate-600 mb-6">
                    Sua assinatura foi ativada. Você receberá um e-mail de confirmação em breve.
                  </p>
                  <Link href="/dashboard">
                    <Button className="bg-blue-700 hover:bg-blue-800 text-white h-11 px-8 rounded-xl">
                      Ir para o painel
                    </Button>
                  </Link>
                </motion.div>
              ) : status === "error" ? (
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Erro no pagamento</p>
                      <p className="text-sm text-red-700 mt-1">Verifique os dados do seu cartão e tente novamente.</p>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {!loading && status !== "success" && (
                <div id="paymentBrick_container" className="mb-6" />
              )}

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-700">
                  <p className="font-medium mb-1">Pagamento seguro</p>
                  <p>Seus dados são processados diretamente pelo Mercado Pago com criptografia de ponta a ponta.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
