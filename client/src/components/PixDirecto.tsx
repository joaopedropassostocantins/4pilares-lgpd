import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QrCode, MessageCircle, Copy, Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface PixDirectoProps {
  price: number;
  diagnosticPublicId: string;
}

export function PixDirecto({ price, diagnosticPublicId }: PixDirectoProps) {
  const [copied, setCopied] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Call tRPC to create PIX payment and get QR code
  const createPixMutation = trpc.payment.createPixPayment.useMutation({
    onSuccess: (data) => {
      console.log('[PixDirecto] PIX payment created:', data);
      setPixData(data);
      setLoading(false);
      setError(null);
    },
    onError: (err) => {
      console.error('[PixDirecto] Error creating PIX payment:', err);
      setError('Erro ao gerar QR code. Tente novamente.');
      setLoading(false);
      toast.error('Erro ao gerar QR code PIX');
    },
  });

  // Generate QR code on component mount
  useEffect(() => {
    setLoading(true);
    createPixMutation.mutate({
      diagnosticPublicId,
      amount: price,
    });
  }, [diagnosticPublicId, price]);

  const handleCopy = () => {
    if (pixData?.copyAndPaste) {
      navigator.clipboard.writeText(pixData.copyAndPaste);
      setCopied(true);
      toast.success('Código PIX copiado!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const message = `Olá! Fiz o PIX de R$${price.toFixed(2)} para a análise FUSION-SAJO. Segue o comprovante para liberação. ID: ${diagnosticPublicId}`;
    const whatsappLink = `https://wa.me/5563984381782?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  if (loading) {
    return (
      <Card className="pix-direto-card border-2 border-[#d4af37] bg-[rgba(212,175,55,0.05)] rounded-lg p-5 mb-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 text-[#d4af37] animate-spin mr-2" />
          <span className="text-muted-foreground">Gerando QR code...</span>
        </div>
      </Card>
    );
  }

  if (error || !pixData) {
    return (
      <Card className="pix-direto-card border-2 border-red-500 bg-red-50 rounded-lg p-5 mb-4">
        <div className="text-red-600 text-sm font-semibold">
          {error || 'Erro ao gerar QR code PIX'}
        </div>
        <Button
          size="sm"
          className="mt-3"
          onClick={() => {
            setLoading(true);
            createPixMutation.mutate({
              diagnosticPublicId,
              amount: price,
            });
          }}
        >
          Tentar Novamente
        </Button>
      </Card>
    );
  }

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
        {pixData.qrCodeUrl && (
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg border border-primary/20">
              <img 
                src={pixData.qrCodeUrl} 
                alt="QR Code PIX" 
                className="w-48 h-48 object-contain"
                onError={(e) => {
                  console.warn('[PixDirecto] QR code image failed to load');
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Dados do PIX */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Valor:</span>
            <span className="font-bold text-primary">R$ {pixData.amount?.toFixed(2) || price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-bold text-primary capitalize">{pixData.status || 'pending'}</span>
          </div>
        </div>

        {/* Copia e Cola */}
        {pixData.copyAndPaste && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Código PIX (Copia e Cola):</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pixData.copyAndPaste}
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
        )}

        {/* WhatsApp Button */}
        <Button
          className="w-full py-6 bg-green-600 hover:bg-green-700 text-white rounded-lg text-lg font-bold"
          onClick={handleWhatsApp}
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
