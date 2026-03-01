import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard, QrCode, Loader2 } from 'lucide-react';
import { StripeCheckout } from './StripeCheckout';
import { RazorpayCheckout } from './RazorpayCheckout';

interface PaymentMethodSelectorProps {
  diagnosticPublicId: string;
  plan: 'promo' | 'normal' | 'lifetime';
  price: number;
  userEmail?: string;
  countryCode?: string;
  onMercadoPagoClick: () => void;
  mercadoPagoLoading?: boolean;
  mercadoPagoReady?: boolean;
}

export function PaymentMethodSelector({
  diagnosticPublicId,
  plan,
  price,
  userEmail,
  countryCode = 'BR',
  onMercadoPagoClick,
  mercadoPagoLoading = false,
  mercadoPagoReady = false,
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<'pix' | 'mercadopago' | 'stripe' | 'razorpay' | null>(null);
  const [razorpayOrderId, setRazorpayOrderId] = useState<string | null>(null);
  const [razorpayLoading, setRazorpayLoading] = useState(false);

  const planMap = {
    promo: 'promotional',
    normal: 'normal',
    lifetime: 'lifetime',
  } as const;

  const isBrazil = countryCode === 'BR';
  const isIndia = countryCode === 'IN';

  return (
    <div className="space-y-4">
      {/* Payment Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Pix Option - Only for Brazil */}
        {isBrazil && (
          <Card
            className={`p-4 cursor-pointer border-2 transition-all ${
              selectedMethod === 'pix'
                ? 'border-green-500 bg-green-50'
                : 'border-primary/30 hover:border-green-400'
            }`}
            onClick={() => setSelectedMethod('pix')}
          >
            <div className="flex items-center gap-3 mb-2">
              <QrCode className="h-6 w-6 text-green-600" />
              <div>
                <div className="font-bold text-green-900">Pix</div>
                <div className="text-xs text-green-700">Instantaneo</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Apenas Brasil
            </div>
            <div className="mt-2 inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
              Recomendado
            </div>
          </Card>
        )}

        {/* Mercado Pago Cartao Option */}
        <Card
          className={`p-4 cursor-pointer border-2 transition-all ${
            selectedMethod === 'mercadopago'
              ? 'border-yellow-500 bg-yellow-50'
              : 'border-primary/30 hover:border-yellow-400'
          }`}
          onClick={() => setSelectedMethod('mercadopago')}
        >
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="h-6 w-6 text-yellow-600" />
            <div>
              <div className="font-bold text-yellow-900">Cartao MP</div>
              <div className="text-xs text-yellow-700">Mercado Pago</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Visa, Mastercard, Amex
          </div>
        </Card>

        {/* Razorpay Option - Only for India */}
        {isIndia && (
          <Card
            className={`p-4 cursor-pointer border-2 transition-all ${
              selectedMethod === 'razorpay'
                ? 'border-blue-500 bg-blue-50'
                : 'border-primary/30 hover:border-blue-400'
            }`}
            onClick={() => setSelectedMethod('razorpay')}
          >
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-6 w-6 text-blue-600" />
              <div>
                <div className="font-bold text-blue-900">Razorpay</div>
                <div className="text-xs text-blue-700">India</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Card, UPI, Net Banking
            </div>
            <div className="mt-2 inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
              Recomendado
            </div>
          </Card>
        )}

        {/* Stripe Option - Temporarily Disabled */}
        <Card
          className={`p-4 border-2 transition-all opacity-60 cursor-not-allowed border-gray-300 bg-gray-50`}
          title="Stripe esta temporariamente indisponivel"
        >
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="h-6 w-6 text-gray-400" />
            <div>
              <div className="font-bold text-gray-600">Stripe</div>
              <div className="text-xs text-gray-500">Internacional</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Visa, Mastercard, Amex
          </div>
          <div className="mt-2 inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
            Em Manutencao
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {selectedMethod === 'pix' && (
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

        {selectedMethod === 'mercadopago' && (
          <Button
            className="w-full py-6 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-lg font-bold"
            onClick={onMercadoPagoClick}
            disabled={mercadoPagoLoading}
          >
            {mercadoPagoLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Preparando Cartao...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Continuar com Cartao
              </>
            )}
          </Button>
        )}

        {selectedMethod === 'razorpay' && (
          <RazorpayCheckout
            orderId={razorpayOrderId || ''}
            amount={Math.round(price * 100)}
            currency="INR"
            email={userEmail || ''}
            phone=""
            name=""
            onSuccess={(paymentId) => {
              // Handle success
            }}
            onError={(error) => {
              // Handle error
            }}
          />
        )}

        {selectedMethod === 'stripe' && (
          <StripeCheckout
            diagnosticPublicId={diagnosticPublicId}
            plan={planMap[plan]}
            countryCode={countryCode}
            userEmail={userEmail}
            amount={Math.round(price * 100)}
            currency={countryCode === 'BR' ? 'R$' : 'USD'}
          />
        )}

        {!selectedMethod && (
          <div className="text-center text-sm text-muted-foreground py-4">
            Selecione um metodo de pagamento acima
          </div>
        )}
      </div>

      {/* Stripe Suspension Warning */}
      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-900">
        <strong>Aviso:</strong> Stripe esta temporariamente indisponivel devido a manutencao na conta. Use Pix (Brasil), Razorpay (India) ou Mercado Pago (America Latina) por enquanto. Stripe sera reativado em breve!
      </div>

      {/* Info */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
        <strong>Seguranca:</strong> Todos os metodos sao criptografados e seguros. Escolha o que preferir!
      </div>

      {/* Mercado Libre Footer */}
      <MercadoLibreCountriesFooter />
    </div>
  );
}

/**
 * Mercado Libre Countries Footer
 */
export function MercadoLibreCountriesFooter() {
  const countries = [
    'Argentina',
    'Brasil',
    'Chile',
    'Colombia',
    'Costa Rica',
    'Equador',
    'Mexico',
    'Panama',
    'Peru',
    'Uruguai',
  ];

  return (
    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
      <strong>Mercado Pago disponivel em:</strong> {countries.join(', ')}
    </div>
  );
}
