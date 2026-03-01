import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';

interface StripeCheckoutProps {
  diagnosticPublicId: string;
  plan: 'promotional' | 'normal' | 'lifetime';
  countryCode?: string;
  userEmail?: string;
  amount?: number;
  currency?: string;
}

export function StripeCheckout({
  diagnosticPublicId,
  plan,
  countryCode = 'BR',
  userEmail,
  amount,
  currency,
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createPayment = trpc.payment.createStripePayment.useMutation();
  const confirmPayment = trpc.payment.confirmStripePayment.useMutation();

  const handlePayment = useCallback(async () => {
    setIsLoading(true);
    try {
      // Step 1: Create payment intent on backend
      const paymentData = await createPayment.mutateAsync({
        diagnosticPublicId,
        plan,
        countryCode,
        userEmail,
      });

      // Step 2: Load Stripe
      const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (!stripePublishableKey) {
        throw new Error('Stripe publishable key not configured');
      }

      const stripe = await loadStripe(stripePublishableKey);
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      // Step 3: Confirm payment
      await confirmPayment.mutateAsync({
        diagnosticPublicId,
        paymentIntentId: paymentData.paymentIntentId,
      });

      // Redirect to thank you page
      window.location.href = `/obrigado/${diagnosticPublicId}`;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Erro ao processar pagamento: ' + (error instanceof Error ? error.message : 'Tente novamente'));
    } finally {
      setIsLoading(false);
    }
  }, [diagnosticPublicId, plan, countryCode, userEmail, createPayment, confirmPayment]);

  const displayAmount = amount ? `${currency} ${(amount / 100).toFixed(2)}` : 'Carregando...';

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200"
    >
      {isLoading ? (
        <>
          <span className="animate-spin mr-2">⏳</span>
          Processando...
        </>
      ) : (
        <>
          💳 Pagar com Cartão ({displayAmount})
        </>
      )}
    </Button>
  );
}
