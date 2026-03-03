import { Card } from '@/components/ui/card';
import { QrCode, Copy, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface PixDirectoProps {
  price: number;
  diagnosticPublicId: string;
}

/**
 * Generate EMV PIX payload (copia e cola) locally
 * Format: 00020126580014br.gov.bcb.pix...
 */
function generatePixPayload(amount: number, txid: string): string {
  // Simplified EMV PIX payload generation
  // In production, use a proper EMV library
  const pixKey = "05e5bf85-4484-4b81-9bdf-fc66b6024984"; // Chave PIX do proprietário
  const merchant = "FUSION SAJO";
  const city = "SAO PAULO";
  
  // Build basic EMV structure (simplified)
  const payload = `00020126580014br.gov.bcb.pix0136${pixKey}520400005303986540${String(amount).padStart(5, '0')}5802BR5913${merchant}6009${city}62${String(txid).length.toString().padStart(2, '0')}${txid}63041D3D`;
  return payload;
}

export function PixDirecto({ price, diagnosticPublicId }: PixDirectoProps) {
  const [copied, setCopied] = useState(false);
  
  // Generate PIX payload locally
  const txid = `${diagnosticPublicId.slice(0, 8)}${Date.now().toString().slice(-8)}`;
  const pixPayload = generatePixPayload(price, txid);

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
            <span className="text-muted-foreground">Transação:</span>
            <span className="font-mono text-xs text-foreground/70">{txid}</span>
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
          Seu pagamento será confirmado automaticamente. Análise liberada em segundos!
        </div>
      </div>
    </Card>
  );
}
