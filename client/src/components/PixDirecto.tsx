import { Card } from '@/components/ui/card';
import { QrCode, Copy, Check, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { generatePixPayload } from '@/lib/pixGenerator';

interface PixDirectoProps {
  price: number;
  diagnosticPublicId: string;
}

export function PixDirecto({ price, diagnosticPublicId }: PixDirectoProps) {
  const [copied, setCopied] = useState(false);

  // Generate PIX payload dynamically based on price
  const pixPayload = useMemo(() => {
    return generatePixPayload({
      amount: price,
      pixKey: "05e5bf85-4484-4b81-9bdf-fc66b6024984",
      merchantName: "JOAO PEDRO P PASSOS",
      merchantCity: "SAO PAULO",
      txId: `${diagnosticPublicId.slice(0, 8)}${Date.now().toString().slice(-8)}`,
    });
  }, [price, diagnosticPublicId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    toast.success('Código PIX copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="pix-direto-card border-2 border-[#d4af37] bg-[rgba(212,175,55,0.05)] rounded-lg p-5 mb-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-[#d4af37]/20">
            <QrCode className="h-6 w-6 text-[#d4af37]" />
          </div>
          <div>
            <div className="font-bold text-lg text-primary">⚡ PIX Direto</div>
            <div className="text-xs text-muted-foreground">Pagamento instantâneo</div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="space-y-2 text-sm bg-primary/5 p-3 rounded-lg border border-primary/20">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Valor:</span>
            <span className="font-bold text-primary">R$ {price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Diagnóstico:</span>
            <span className="font-mono text-xs text-foreground/70">{diagnosticPublicId}</span>
          </div>
        </div>

        {/* Copy and Paste Code */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">Código PIX (Copia e Cola):</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={pixPayload}
              readOnly
              className="flex-1 px-3 py-2 bg-background border border-primary/20 rounded text-xs font-mono text-muted-foreground overflow-hidden"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 space-y-2">
          <div className="flex gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Como pagar:</strong>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Abra seu app de banco</li>
                <li>Selecione "PIX" → "Copia e Cola"</li>
                <li>Cole o código acima</li>
                <li>Confirme o pagamento</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-2 bg-primary/5 border border-primary/20 rounded text-xs text-muted-foreground">
          ⏱️ Seu pagamento será confirmado em até 5 minutos. Análise liberada automaticamente!
        </div>
      </div>
    </Card>
  );
}
