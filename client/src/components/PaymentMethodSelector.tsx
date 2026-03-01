import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard, QrCode, Loader2 } from 'lucide-react';
import { StripeCheckout } from './StripeCheckout';

interface PaymentMethodSelectorProps {
  diagnosticPublicId: string;
  plan: 'promo' | 'normal' | 'lifetime';
  price: number;
  userEmail?: string;
  onMercadoPagoClick: () => void;
  mercadoPagoLoading?: boolean;
  mercadoPagoReady?: boolean;
}

export function PaymentMethodSelector({
  diagnosticPublicId,
  plan,
  price,
  userEmail,
  onMercadoPagoClick,
  mercadoPagoLoading = false,
  mercadoPagoReady = false,
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<'mercadopago' | 'stripe' | null>(null);

  const planMap = {
    promo: 'promotional',
    normal: 'normal',
    lifetime: 'lifetime',
  } as const;

  return (
    <div className="space-y-4">
      {/* Payment Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Mercado Pago Option */}
        <Card
          className={`p-4 cursor-pointer border-2 transition-all ${
            selectedMethod === 'mercadopago'
              ? 'border-green-500 bg-green-50'
              : 'border-primary/30 hover:border-green-400'
          }`}
          onClick={() => setSelectedMethod('mercadopago')}
        >
          <div className="flex items-center gap-3 mb-2">
            <QrCode className="h-6 w-6 text-green-600" />
            <div>
              <div className="font-bold text-green-900">Pix (Recomendado)</div>
              <div className="text-xs text-green-700">Instantâneo e seguro</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Também aceita cartão de crédito
          </div>
        </Card>

        {/* Stripe Option */}
        <Card
          className={`p-4 cursor-pointer border-2 transition-all ${
            selectedMethod === 'stripe'
              ? 'border-blue-500 bg-blue-50'
              : 'border-primary/30 hover:border-blue-400'
          }`}
          onClick={() => setSelectedMethod('stripe')}
        >
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <div>
              <div className="font-bold text-blue-900">Cartão de Crédito</div>
              <div className="text-xs text-blue-700">Visa, Mastercard, Amex</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Parcelamento disponível
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {selectedMethod === 'mercadopago' && (
          <Button
            className="w-full py-6 bg-green-600 hover:bg-green-700 text-white rounded-lg text-lg font-bold"
            onClick={onMercadoPagoClick}
            disabled={mercadoPagoLoading}
          >
            {mercadoPagoLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Preparando Pix...
              </>
            ) : (
              <>
                <QrCode className="mr-2 h-5 w-5" />
                Continuar com Pix
              </>
            )}
          </Button>
        )}

        {selectedMethod === 'stripe' && (
          <StripeCheckout
            diagnosticPublicId={diagnosticPublicId}
            plan={planMap[plan]}
            countryCode="BR"
            userEmail={userEmail}
            amount={Math.round(price * 100)} // Convert to cents
            currency="R$"
          />
        )}

        {!selectedMethod && (
          <div className="text-center text-sm text-muted-foreground py-4">
            Selecione um método de pagamento acima
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
        <strong>💡 Dica:</strong> Ambos os métodos são seguros. Escolha o que preferir!
      </div>
    </div>
  );
}
