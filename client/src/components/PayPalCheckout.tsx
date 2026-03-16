/*
 * PayPalCheckout.tsx — 4 Pilares LGPD
 * Seção de pagamento via PayPal (SDK oficial — client-side only)
 *
 * SEGURANÇA: apenas o Client ID vai para o frontend.
 * O Secret Key NUNCA deve ser exposto aqui.
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, CreditCard } from "lucide-react";
import { PLANOS_ARRAY, formatarPreco } from "@/const/pricing";

// ─── PayPal Client ID (identificador público — seguro no frontend) ───────────
const PAYPAL_CLIENT_ID =
  "ASCLcOPwClrPuiSTIfALZE2W7gj9D58M_WPXaWvgY9RrO1Z7D3Cb1mZSBY8U2WGsDK3C4jpSSomQFQIk";

// Planos com preço definido (Enterprise é "sob consulta")
const PLANOS_PAGAVEIS = PLANOS_ARRAY.filter((p) => p.precoNormal !== null);

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => { render: (el: HTMLElement) => void };
    };
  }
}

// ─── Hook: carrega o SDK do PayPal uma vez ───────────────────────────────────
function usePayPalSDK() {
  const [ready, setReady] = useState(!!window.paypal);

  useEffect(() => {
    if (window.paypal) { setReady(true); return; }
    const existing = document.getElementById("paypal-sdk");
    if (existing) {
      existing.addEventListener("load", () => setReady(true));
      return;
    }
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=BRL&locale=pt_BR&intent=capture&components=buttons`;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  return ready;
}

// ─── Botão PayPal para um plano específico ───────────────────────────────────
interface PayPalButtonProps {
  amount: string;
  planName: string;
  onSuccess: (name: string) => void;
  onError: () => void;
}

function PayPalButton({ amount, planName, onSuccess, onError }: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !window.paypal || rendered.current) return;
    rendered.current = true;

    window.paypal
      .Buttons({
        style: { layout: "vertical", color: "blue", shape: "rect", label: "pay", height: 44 },
        createOrder: (_data: unknown, actions: Record<string, { create: (o: unknown) => Promise<string> }>) =>
          actions.order.create({
            purchase_units: [
              {
                description: `4 Pilares LGPD — Plano ${planName}`,
                amount: { currency_code: "BRL", value: amount },
              },
            ],
            application_context: {
              brand_name: "4 Pilares LGPD",
              locale: "pt-BR",
              shipping_preference: "NO_SHIPPING",
              user_action: "PAY_NOW",
            },
          }),
        onApprove: (_data: unknown, actions: Record<string, { capture: () => Promise<{ payer: { name: { given_name: string } } }> }>) =>
          actions.order.capture().then((details) => {
            onSuccess(details.payer.name.given_name);
          }),
        onError: onError,
      })
      .render(containerRef.current);
  }, [amount, planName, onSuccess, onError]);

  return <div ref={containerRef} className="w-full" />;
}

// ─── Seção completa de pagamento PayPal ─────────────────────────────────────
export default function PayPalCheckout() {
  const sdkReady = usePayPalSDK();
  const [selectedId, setSelectedId] = useState(PLANOS_PAGAVEIS[0].id);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [successName, setSuccessName] = useState("");

  const planoAtual = PLANOS_PAGAVEIS.find((p) => p.id === selectedId)!;
  const valorCentavos = planoAtual.precoPromocional ?? planoAtual.precoNormal!;
  const valorReais = (valorCentavos / 100).toFixed(2);

  const handleSuccess = (name: string) => {
    setSuccessName(name);
    setStatus("success");
  };

  const handleError = () => setStatus("error");

  // Reset do botão ao trocar de plano
  const [buttonKey, setButtonKey] = useState(0);
  const handleSelectPlan = (id: string) => {
    setSelectedId(id);
    setStatus("idle");
    setButtonKey((k) => k + 1);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-20 bg-white border-t border-slate-100"
    >
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {/* Cabeçalho */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-4">
              <CreditCard className="w-3.5 h-3.5" />
              Pagamento seguro via PayPal
            </div>
            <h2 className="title-serif text-3xl text-slate-900 mb-2">
              Pague agora com PayPal
            </h2>
            <p className="text-slate-500 text-sm">
              Selecione o plano e conclua o pagamento em segundos. Aceitamos
              cartão de crédito, débito e saldo PayPal.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-sm">
            {/* Seletor de plano */}
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              1. Escolha o plano
            </p>
            <div className="grid grid-cols-2 gap-2 mb-6 sm:grid-cols-4">
              {PLANOS_PAGAVEIS.map((p) => {
                const valor = p.precoPromocional ?? p.precoNormal!;
                const isSelected = p.id === selectedId;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPlan(p.id)}
                    className={`rounded-xl p-3 text-left border transition-all text-xs ${
                      isSelected
                        ? "border-transparent text-white shadow-md"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                    style={isSelected ? { backgroundColor: p.color, borderColor: p.color } : {}}
                  >
                    <p className="font-semibold truncate">{p.nome}</p>
                    <p className={`mt-0.5 font-mono ${isSelected ? "text-white/80" : "text-slate-500"}`}>
                      {formatarPreco(valor)}/mês
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Resumo do plano selecionado */}
            <div
              className="rounded-xl p-4 mb-6 flex items-center justify-between"
              style={{ backgroundColor: planoAtual.bgLight }}
            >
              <div>
                <p className="text-xs font-medium text-slate-500">Plano selecionado</p>
                <p className="font-semibold text-slate-900">{planoAtual.nome}</p>
                <p className="text-xs text-slate-500 mt-0.5">{planoAtual.tagline}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Valor mensal</p>
                <p
                  className="text-2xl font-bold font-mono"
                  style={{ color: planoAtual.color }}
                >
                  {formatarPreco(valorCentavos)}
                </p>
              </div>
            </div>

            {/* Botão PayPal */}
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              2. Confirme o pagamento
            </p>

            {status === "success" ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
                <p className="font-semibold text-slate-900 text-lg">
                  Pagamento confirmado{successName ? `, ${successName}` : ""}!
                </p>
                <p className="text-sm text-slate-500">
                  Nossa equipe entrará em contato em até 24h úteis para
                  ativar seu acesso ao plano{" "}
                  <strong>{planoAtual.nome}</strong>.
                </p>
              </div>
            ) : status === "error" ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
                <p className="font-semibold text-slate-900">
                  Ocorreu um erro no pagamento
                </p>
                <button
                  onClick={() => { setStatus("idle"); setButtonKey((k) => k + 1); }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Tentar novamente
                </button>
              </div>
            ) : sdkReady ? (
              <PayPalButton
                key={`${selectedId}-${buttonKey}`}
                amount={valorReais}
                planName={planoAtual.nome}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="ml-3 text-sm text-slate-500">Carregando PayPal…</span>
              </div>
            )}

            {/* Rodapé de segurança */}
            <p className="text-xs text-slate-400 text-center mt-4">
              Pagamento processado com segurança pelo PayPal.{" "}
              <strong>4 Pilares LGPD</strong> não armazena dados do seu cartão.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
