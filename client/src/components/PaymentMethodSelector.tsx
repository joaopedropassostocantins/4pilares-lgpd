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
  const [selectedMethod, setSelectedMethod] = useState<'pix' | 'mercadopago' | 'stripe' | null>(null);

  const planMap = {
    promo: 'promotional',
    normal: 'normal',
    lifetime: 'lifetime',
  } as const;

  const isBrazil = countryCode === 'BR';

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

        {/* Stripe Option - Temporarily Disabled */}
        <Card
          className={`p-4 border-2 transition-all opacity-60 cursor-not-allowed border-gray-300 bg-gray-50`}
          title="Stripe está temporariamente indisponível"
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
            Em Manutenção
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
        <strong>⚠️ Aviso:</strong> Stripe está temporariamente indisponível devido a manutenção na conta. Use Pix (Brasil) ou Mercado Pago (América Latina) por enquanto. Stripe será reativado em breve!
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
    'Venezuela',
    'Paraguai',
    'Bolivia',
    'Guatemala',
    'Honduras',
    'Nicaragua',
    'El Salvador',
    'Republica Dominicana',
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border/40 text-xs text-muted-foreground">
      <p className="font-semibold mb-3 text-foreground">Opcoes de Pagamento por Pais:</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        <div className="p-2 bg-green-50 border border-green-200 rounded">
          <strong className="text-green-900">Pix (Brasil)</strong>
          <p className="text-xs mt-1">Disponivel apenas no Brasil</p>
        </div>
        
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
          <strong className="text-yellow-900">Mercado Pago</strong>
          <p className="text-xs mt-1">18 paises da America Latina</p>
        </div>
        
        <div className="p-2 bg-gray-50 border border-gray-200 rounded opacity-60">
          <strong className="text-gray-600">Stripe</strong>
          <p className="text-xs mt-1">195+ paises (em manutenção)</p>
        </div>
      </div>

      <p className="font-semibold mb-2 text-foreground">Paises com Mercado Pago:</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 p-3 bg-muted/30 rounded">
        {countries.map((country) => (
          <div key={country} className="text-center text-xs">
            {country}
          </div>
        ))}
      </div>
      
      <p className="mt-3 text-xs text-muted-foreground/70 italic">
        Stripe esta disponivel em 195+ paises. Mercado Pago em 18 paises da America Latina. Pix apenas no Brasil.
      </p>
    </div>
  );
}
