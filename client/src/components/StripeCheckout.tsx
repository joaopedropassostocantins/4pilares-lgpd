import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface StripeCheckoutProps {
  diagnosticPublicId: string;
  plan: 'promotional' | 'normal' | 'lifetime';
  countryCode?: string;
  userEmail?: string;
  amount?: number;
  currency?: string;
}

// Stripe Payment Form Component
function StripePaymentForm({
  diagnosticPublicId,
  plan,
  countryCode = 'BR',
  userEmail,
}: Omit<StripeCheckoutProps, 'amount' | 'currency'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Confirm payment with Stripe
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/obrigado/${diagnosticPublicId}`,
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message || 'Erro ao processar pagamento');
      }
      // If no error, Stripe will redirect to return_url automatically
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            💳 Confirmar Pagamento
          </>
        )}
      </Button>
    </form>
  );
}

// Main Stripe Checkout Component
export function StripeCheckout({
  diagnosticPublicId,
  plan,
  countryCode = 'BR',
  userEmail,
  amount,
  currency,
}: StripeCheckoutProps) {
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const createPayment = trpc.payment.createStripePayment.useMutation();

  useEffect(() => {
    // Load Stripe
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.error('Stripe publishable key not configured');
      setIsLoading(false);
      return;
    }

    setStripePromise(loadStripe(publishableKey));

    // Create payment intent
    createPayment
      .mutateAsync({
        diagnosticPublicId,
        plan,
        countryCode,
        userEmail,
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
        setIsLoading(false);
      });
  }, [diagnosticPublicId, plan, countryCode, userEmail, createPayment]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-muted-foreground">Carregando formulário de pagamento...</span>
      </div>
    );
  }

  if (!stripePromise || !clientSecret) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700">
        Erro ao carregar o formulário de pagamento. Tente novamente.
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#3b82f6',
            colorText: '#1f2937',
            colorTextSecondary: '#6b7280',
            colorTextPlaceholder: '#9ca3af',
            colorBackground: '#ffffff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          },
        },
      }}
    >
      <StripePaymentForm
        diagnosticPublicId={diagnosticPublicId}
        plan={plan}
        countryCode={countryCode}
        userEmail={userEmail}
      />
    </Elements>
  );
}
