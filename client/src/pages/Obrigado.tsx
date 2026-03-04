import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoute } from "wouter";
import { useState, useEffect } from "react";
import { Copy, Check, Share2, Gift, MessageCircle, Facebook, Twitter } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Obrigado() {
  const [, params] = useRoute("/obrigado/:publicId");
  const publicId = params?.publicId || "";

  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");

  const { data: diagnostic, isLoading, error } = trpc.diagnostic.getByPublicId.useQuery(
    { publicId },
    { enabled: !!publicId }
  );

  // Generate referral link
  useEffect(() => {
    if (publicId && typeof window !== "undefined") {
      const link = `${window.location.origin}?ref=${publicId}`;
      setReferralLink(link);
    }
  }, [publicId]);

  const handleCopyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Link copiado!", {
        description: "Compartilhe com seus amigos e ganhe R$ 9,99 de desconto.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `Descobri meu destino com FUSION-SAJO! 🔮 Análise dos 4 Pilares SAJO revelou meu potencial em amor, carreira e saúde. Vem descobrir o seu também! ${referralLink}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      "_blank"
    );
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `Descobri meu destino com FUSION-SAJO! 🔮 Análise dos 4 Pilares SAJO revelou meu potencial. Vem descobrir o seu também! ${referralLink}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="mystic-gradient min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !diagnostic) {
    return (
      <div className="mystic-gradient min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Página não encontrada</p>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mystic-gradient min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* ── HEADER ── */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            Obrigado, {diagnostic.consultantName}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Sua análise completa dos 4 Pilares SAJO foi desbloqueada com sucesso
          </p>
        </div>

        {/* ── CONFIRMATION CARD ── */}
        <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">✦ Análise Completa Desbloqueada ✦</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-card/60 rounded-lg p-6 border border-primary/30">
              <p className="text-center text-foreground mb-4">
                Sua análise completa foi enviada para:
              </p>
              <p className="text-center font-bold text-primary text-lg">{diagnostic.email || diagnostic.whatsappPhone}</p>
              {diagnostic.whatsappPhone && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Você também receberá via WhatsApp: {diagnostic.whatsappPhone}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Verifique seu email e WhatsApp para a análise completa com:
              </p>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Previsões detalhadas para amor (próximos 12 meses)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Previsões para carreira e finanças
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Ciclos de sorte e períodos críticos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span> Rituais e ações corretivas ancestrais
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* ── REFERRAL PROGRAM ── */}
        <Card className="bg-card/60 border-primary/30">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Programa de Referral
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Compartilhe seu destino e ganhe R$ 9,99 de desconto para cada amigo que se inscrever
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Referral Link */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Seu link de referral:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-4 py-2 bg-background border border-primary/30 rounded-lg text-sm text-foreground"
                />
                <Button
                  onClick={handleCopyReferralLink}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  size="sm"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Compartilhe em:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  onClick={handleShareWhatsApp}
                  variant="outline"
                  className="gap-2 border-primary/30 hover:bg-primary/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button
                  onClick={handleShareFacebook}
                  variant="outline"
                  className="gap-2 border-primary/30 hover:bg-primary/10"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Button>
                <Button
                  onClick={handleShareTwitter}
                  variant="outline"
                  className="gap-2 border-primary/30 hover:bg-primary/10"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Button>
                <Button
                  onClick={handleCopyReferralLink}
                  variant="outline"
                  className="gap-2 border-primary/30 hover:bg-primary/10"
                >
                  <Share2 className="h-4 w-4" />
                  Copiar
                </Button>
              </div>
            </div>

            {/* Referral Benefits */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
              <p className="text-sm font-medium text-primary mb-2">Como funciona:</p>
              <ul className="space-y-1 text-sm text-foreground">
                <li>• Seu amigo usa seu link e faz uma análise</li>
                <li>• Quando ele compra, você ganha R$ 9,99 de desconto</li>
                <li>• Sem limite de referrals - quanto mais amigos, mais desconto!</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* ── CTA BUTTONS ── */}
        <div className="space-y-3">
          <Button
            className="w-full py-6 bg-primary text-primary-foreground rounded-full text-lg font-bold hover:bg-primary/90"
            onClick={() => (window.location.href = "/")}
          >
            Voltar ao Início
          </Button>
          <Button
            variant="outline"
            className="w-full py-6 border-primary/30 hover:bg-primary/10"
            onClick={() => (window.location.href = `/resultado/${publicId}`)}
          >
            Ver Minha Análise Novamente
          </Button>
        </div>

        {/* ── FOOTER NOTE ── */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Dúvidas? Confira nossa <a href="/#faq" className="text-primary hover:underline">FAQ</a> ou entre em contato.
          </p>
        </div>
      </div>
    </div>
  );
}
