import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QrCode, MessageCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PixDirectoProps {
  price: number;
  diagnosticPublicId: string;
}

export function PixDirecto({ price, diagnosticPublicId }: PixDirectoProps) {
  const [copied, setCopied] = useState(false);

  // Dados reais do PIX
  const pixData = {
    qrCode: 'https://cdn.jsdelivr.net/gh/fusion-sajo/assets/pix-qr-code.png',
    copiaCola: '00020126580014br.gov.bcb.pix013605e5bf85-4484-4b81-9bdf-fc66b6024984520400005303986540529.995802BR5919joao Pedro p passos6009Sao Paulo62230519daqr240523153705498630450E3',
    favorecido: 'Joao Pedro P Passos',
    valor: price,
    whatsappLink: `https://wa.me/5563984381782?text=Olá!%20Fiz%20o%20PIX%20de%20R$${price.toFixed(2)}.%20Segue%20o%20comprovante%20para%20liberação%20da%20minha%20leitura.`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pixData.copiaCola);
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
            <div className="font-bold text-lg text-primary">⚡ Liberação Imediata via PIX Direto</div>
            <div className="text-xs text-muted-foreground">Sem cadastro, sem burocracia</div>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg border border-primary/20">
            <img 
              src={pixData.qrCode} 
              alt="QR Code PIX" 
              className="w-48 h-48 object-contain"
              onError={(e) => {
                // Fallback se a imagem não carregar
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Dados do PIX */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Valor:</span>
            <span className="font-bold text-primary">R$ {pixData.valor.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Favorecido:</span>
            <span className="font-bold text-foreground">{pixData.favorecido}</span>
          </div>
        </div>

        {/* Copia e Cola */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">Código PIX (Copia e Cola):</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={pixData.copiaCola}
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

        {/* WhatsApp Button */}
        <Button
          className="w-full py-6 bg-green-600 hover:bg-green-700 text-white rounded-lg text-lg font-bold"
          onClick={() => window.open(pixData.whatsappLink, '_blank')}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Enviar Comprovante via WhatsApp
        </Button>

        {/* Info */}
        <div className="p-3 bg-primary/5 border border-primary/20 rounded text-xs text-muted-foreground">
          <strong>Como funciona:</strong> Escaneie o QR code ou copie o código PIX, faça a transferência e envie o comprovante via WhatsApp. Sua análise será liberada em segundos!
        </div>
      </div>
    </Card>
  );
}
