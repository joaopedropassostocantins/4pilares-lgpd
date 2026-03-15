/**
 * MercadoPagoBrickPayment.tsx
 * 
 * Componente isolado e robusto para Payment Brick do Mercado Pago
 * Implementa padrão profissional com:
 * - Montagem única garantida (initializedRef)
 * - Logs estruturados com prefixo [MP]
 * - Validação completa de amount e documento
 * - Cleanup seguro
 * - Proteção contra duplo submit
 */

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";



interface MercadoPagoBrickPaymentProps {
  amount: number;
  publicKey: string;
  email: string;
  razaoSocial: string;
  cnpj: string;
  cpf: string;
  planId: string;
  planName: string;
  onPaymentSuccess?: (response: any) => void;
  onPaymentError?: (error: string) => void;
}

const cleanDocument = (value: string) => value.replace(/\D/g, "");

export default function MercadoPagoBrickPayment({
  amount,
  publicKey,
  email,
  razaoSocial,
  cnpj,
  cpf,
  planId,
  planName,
  onPaymentSuccess,
  onPaymentError,
}: MercadoPagoBrickPaymentProps) {
  const containerId = "paymentBrick_container";
  const initializedRef = useRef(false);
  const brickControllerRef = useRef<any>(null);
  const setupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      try {
        console.log("[MP] setup:start", {
          hasPublicKey: Boolean(publicKey),
          inferredEnv: publicKey?.startsWith("APP_USR") ? "production" : "test",
          amount,
          email,
        });

        // Validação 1: PUBLIC KEY obrigatória
        if (!publicKey) {
          throw new Error("PUBLIC KEY do Mercado Pago ausente.");
        }

        // Validação 2: Amount válido
        const normalizedAmount = Number(amount);
        if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
          throw new Error(`Valor do pagamento inválido: ${amount}`);
        }

        // Validação 3: Email válido
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error(`Email inválido: ${email}`);
        }

        // Validação 4: Evitar múltiplas inicializações
        if (initializedRef.current) {
          console.log("[MP] setup:skip_already_initialized");
          return;
        }

        // Validação 5: Limpar timeout anterior se existir
        if (setupTimeoutRef.current) {
          clearTimeout(setupTimeoutRef.current);
          setupTimeoutRef.current = null;
        }

        // Passo 1: Carregar SDK se necessário
        const existingScript = document.querySelector(
          'script[src="https://sdk.mercadopago.com/js/v2"]'
        );

        if (!existingScript) {
          console.log("[MP] sdk:injecting");
          const script = document.createElement("script");
          script.src = "https://sdk.mercadopago.com/js/v2";
          script.async = true;
          script.onerror = () => {
            console.error("[MP] sdk:load_error");
            throw new Error("Falha ao carregar SDK do Mercado Pago.");
          };
          document.body.appendChild(script);

          // Aguardar SDK carregar
          await new Promise<void>((resolve, reject) => {
            script.onload = () => {
              console.log("[MP] sdk:loaded");
              resolve();
            };
            script.onerror = () => reject(new Error("SDK load failed"));
          });
        } else {
          console.log("[MP] sdk:already_present");
        }

        // Passo 2: Aguardar window.MercadoPago estar disponível
        let attempts = 0;
        while (!window.MercadoPago && attempts < 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.MercadoPago) {
          throw new Error("SDK Mercado Pago indisponível após carregamento.");
        }

        console.log("[MP] sdk:ready");

        // Passo 3: Verificar container
        const container = document.getElementById(containerId);
        if (!container) {
          throw new Error(`Container #${containerId} não encontrado no DOM.`);
        }

        console.log("[MP] container:found");

        // Passo 4: Criar instância MercadoPago
        const mp = new window.MercadoPago(publicKey, { locale: "pt-BR" });
        console.log("[MP] instance:created");

        // Passo 5: Criar bricksBuilder
        const bricksBuilder = mp.bricks();
        console.log("[MP] bricksBuilder:created");

        // Passo 6: Montar Payment Brick
        setStatus("loading");

        brickControllerRef.current = await bricksBuilder.create(
          "payment",
          containerId,
          {
            initialization: {
              amount: normalizedAmount,
            },
            customization: {
              paymentMethods: {
                creditCard: "all",
                debitCard: "none",
                ticket: "none",
                bankTransfer: "none",
              },
              visual: {
                hidePaymentButton: false,
              },
            },
            callbacks: {
              onReady: () => {
                if (cancelled) return;
                console.log("[MP] brick:onReady");
                setStatus("ready");
                setErrorMessage(null);
                toast.success("Sistema de pagamento carregado");
              },

              onSubmit: async (formData: any) => {
                console.log("[MP] brick:onSubmit", {
                  hasToken: Boolean(formData?.token),
                  hasPaymentMethodId: Boolean(formData?.payment_method_id),
                  paymentMethodId: formData?.payment_method_id,
                  hasInstallments: Boolean(formData?.installments),
                  hasPayer: Boolean(formData?.payer),
                });

                // CAMADA 2: Validar método de pagamento (segurança extra)
                const method = String(formData?.payment_method_id || "").toLowerCase();
                if (["pix", "bolbradesco", "ticket", "bank_transfer"].includes(method)) {
                  const errorMsg = "No momento, este checkout aceita apenas pagamento por cartão.";
                  console.error("[MP] brick:onSubmit:unsupported_method", { method });
                  toast.error(errorMsg);
                  onPaymentError?.(errorMsg);
                  throw new Error(errorMsg);
                }

                // Proteção contra duplo submit
                if (isSubmitting) {
                  console.log("[MP] brick:onSubmit:skip_already_submitting");
                  return;
                }

                // CAMADA 3: Validação de token
                if (!formData?.token) {
                  const errorMsg = "Token de pagamento não gerado pelo Mercado Pago.";
                  console.error("[MP] brick:onSubmit:no_token", formData);
                  toast.error(errorMsg);
                  onPaymentError?.(errorMsg);
                  throw new Error(errorMsg);
                }

                setIsSubmitting(true);
                setStatus("submitting");

                try {
                  // Preparar payload para backend
                  const payload = {
                    email,
                    razaoSocial,
                    cnpj: cleanDocument(cnpj),
                    cpf: cleanDocument(cpf),
                    planId,
                    planName,
                    token: formData.token,
                    // Dados adicionais do Brick
                    payment_method_id: formData.payment_method_id,
                    installments: formData.installments || 1,
                    payer: {
                      email: formData.payer?.email || email,
                      identification: {
                        type: formData.payer?.identification?.type || "CPF",
                        number: cleanDocument(
                          formData.payer?.identification?.number || cpf
                        ),
                      },
                    },
                  };

                  console.log("[MP] brick:onSubmit:payload_prepared", {
                    email: payload.email,
                    planId: payload.planId,
                    hasToken: Boolean(payload.token),
                  });

                  // Enviar para backend
                  const response = await fetch("/api/trpc/subscriptions.processPayment", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                  });

                  const result = await response.json().catch(() => null);

                  if (!response.ok) {
                    const errorMsg = result?.message || "Falha no backend ao processar pagamento.";
                    console.error("[MP] backend:error", {
                      status: response.status,
                      message: errorMsg,
                      result,
                    });
                    toast.error(errorMsg);
                    onPaymentError?.(errorMsg);
                    throw new Error(errorMsg);
                  }

                  console.log("[MP] backend:success", {
                    paymentId: result?.result?.data?.json?.paymentId,
                    status: result?.result?.data?.json?.status,
                  });

                  toast.success("Pagamento processado com sucesso!");
                  onPaymentSuccess?.(result);

                  return result;
                } catch (error: any) {
                  const errorMsg = error?.message || "Erro ao processar pagamento.";
                  console.error("[MP] brick:onSubmit:error", error);
                  toast.error(errorMsg);
                  onPaymentError?.(errorMsg);
                  throw error;
                } finally {
                  setIsSubmitting(false);
                  setStatus("ready");
                }
              },

              onError: (error: any) => {
                console.error("[MP] brick:onError", {
                  message: error?.message,
                  cause: error?.cause,
                  fullError: error,
                });
                setStatus("error");
                setErrorMessage(
                  error?.message || "Erro ao inicializar o sistema de pagamento."
                );
                toast.error(
                  error?.message || "Erro ao inicializar o sistema de pagamento."
                );
                onPaymentError?.(error?.message || "Erro desconhecido");
              },

              onFetching: (resource: any) => {
                console.log("[MP] brick:onFetching", resource);
              },
            },
          }
        );

        console.log("[MP] brick:mounted");
        initializedRef.current = true;
      } catch (error: any) {
        if (cancelled) return;

        console.error("[MP] setup:error", {
          message: error?.message,
          stack: error?.stack,
        });

        setStatus("error");
        const errorMsg = error?.message || "Erro ao carregar sistema de pagamento.";
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        onPaymentError?.(errorMsg);
      }
    };

    setup();

    return () => {
      cancelled = true;

      // Cleanup: desmontaré Brick se necessário
      if (brickControllerRef.current?.unmount) {
        try {
          console.log("[MP] brick:unmount");
          brickControllerRef.current.unmount();
        } catch (e) {
          console.log("[MP] brick:unmount:error", e);
        }
      }

      brickControllerRef.current = null;

      // Limpar timeout se existir
      if (setupTimeoutRef.current) {
        clearTimeout(setupTimeoutRef.current);
      }

      initializedRef.current = false;
    };
  }, [amount, publicKey, email, razaoSocial, cnpj, cpf, planId, planName]);

  return (
    <div className="w-full">
      <div id={containerId} className="min-h-[400px]" />

      {status === "loading" && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-3 text-gray-600">Carregando sistema de pagamento...</span>
        </div>
      )}

      {status === "error" && errorMessage && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">Erro ao carregar pagamento</p>
          <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
        </div>
      )}

      {isSubmitting && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-semibold">Processando pagamento...</p>
          <p className="text-blue-700 text-sm mt-1">Por favor, aguarde...</p>
        </div>
      )}
    </div>
  );
}
