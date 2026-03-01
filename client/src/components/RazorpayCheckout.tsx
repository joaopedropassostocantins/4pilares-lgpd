import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayCheckoutProps {
  orderId: string;
  amount: number;
  currency: "INR" | "BRL" | "USD";
  email: string;
  phone: string;
  name: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}

export function RazorpayCheckout({
  orderId,
  amount,
  currency,
  email,
  phone,
  name,
  onSuccess,
  onError,
}: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      // Script loaded successfully
    };
    script.onerror = () => {
      setError("Failed to load Razorpay. Please try again.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      setError("Razorpay is not available. Please refresh the page.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "",
        order_id: orderId,
        amount: amount,
        currency: currency,
        name: "FUSION-SAJO",
        description: "Diagnóstico Astrológico",
        image: "/logo.png",
        handler: function (response: any) {
          onSuccess(response.razorpay_payment_id);
          toast.success("Pagamento realizado com sucesso!");
        },
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#8B5CF6",
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            toast.error("Pagamento cancelado");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao processar pagamento";
      setError(errorMessage);
      onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            💳 Pagar com Razorpay ({currency} {(amount / 100).toFixed(2)})
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Pagamento seguro via Razorpay. Aceitamos cartão de crédito, débito e UPI.
      </p>
    </div>
  );
}
