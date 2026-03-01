import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, Copy, Check, CreditCard, MessageCircle, ChevronDown, ChevronUp, Share2, Facebook, Twitter, Gift } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { PaymentMethodSelector } from "@/components/PaymentMethodSelector";

// ─── Type definitions ─────────────────────────────────────────────────────────
interface StemInfo {
  name: string;
  korean: string;
  element: string;
  yin_yang: string;
  meaning: string;
}

interface BranchInfo {
  name: string;
  korean: string;
  animal: string;
  element: string;
  hours: string;
  meaning: string;
}

interface Pillar {
  stem: StemInfo;
  branch: BranchInfo;
  label: string;
}

interface PillarsData {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  dominantElement: string;
  elementBalance: Record<string, number>;
  yinYangBalance: { yin: number; yang: number };
  animalSign: string;
  personalityTraits: string[];
  strengths: string[];
  challenges: string[];
  compatibleSigns: string[];
  luckyDirections: string[];
  healthFocus: string[];
}

// ─── Element color helper ─────────────────────────────────────────────────────
function elementClass(element: string): string {
  const map: Record<string, string> = {
    Madeira: "element-Madeira",
    Fogo: "element-Fogo",
    Terra: "element-Terra",
    Metal: "element-Metal",
    Água: "element-Água",
  };
  return map[element] || "element-Metal";
}

// ─── Pillar Card ──────────────────────────────────────────────────────────────
function PillarCard({ title, pillar }: { title: string; pillar: Pillar }) {
  const stemName = pillar.stem?.name ?? "";
  const stemKorean = pillar.stem?.korean ?? "";
  const stemElement = pillar.stem?.element ?? "";
  const stemYinYang = pillar.stem?.yin_yang ?? "";

  const branchName = pillar.branch?.name ?? "";
  const branchKorean = pillar.branch?.korean ?? "";
  const branchAnimal = pillar.branch?.animal ?? "";
  const branchElement = pillar.branch?.element ?? "";

  return (
    <Card className="bg-card/60 border-primary/30 text-center">
      <CardContent className="pt-5 pb-4 px-3">
        <div className="text-xs text-primary/60 tracking-widest mb-2 uppercase">{title}</div>

        {/* Stem (Tronco Celestial) */}
        <div className="mb-3">
          <div className="text-2xl font-bold text-primary mb-0.5" style={{ fontFamily: "'Cinzel', serif" }}>
            {stemKorean}
          </div>
          <div className="text-xs text-foreground/70 font-medium">{stemName}</div>
          <span className={`element-badge mt-1 ${elementClass(stemElement)}`}>{stemElement}</span>
          <div className="text-xs text-muted-foreground mt-1">
            {stemYinYang === "Yang" ? "☀️ Yang" : "🌙 Yin"}
          </div>
        </div>

        <div className="w-full h-px bg-border/40 my-2" />

        {/* Branch (Ramo Terrestre) */}
        <div>
          <div className="text-2xl font-bold text-primary/80 mb-0.5" style={{ fontFamily: "'Cinzel', serif" }}>
            {branchKorean}
          </div>
          <div className="text-xs text-foreground/70 font-medium">{branchName}</div>
          <div className="text-xs text-muted-foreground mt-1">{branchAnimal}</div>
          <span className={`element-badge mt-1 ${elementClass(branchElement)}`}>{branchElement}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Resultado() {
  const [, params] = useRoute("/resultado/:publicId");
  const publicId = params?.publicId || "";

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"promo" | "normal" | "lifetime">("promo");
  const [copied, setCopied] = useState(false);

  const { data: diagnostic, isLoading, error, refetch } = trpc.diagnostic.getByPublicId.useQuery(
    { publicId },
    { enabled: !!publicId }
  );

  const createPreference = trpc.payment.createPreference.useMutation();

  const isPaid = diagnostic?.paymentStatus === "paid";
  const pillarsData = diagnostic?.pillarsData as PillarsData | null | undefined;

  // Plan prices
  const plans = {
    promo: { price: 14.99, label: "Promoção", description: "Acesso 1x à análise completa" },
    normal: { price: 29.99, label: "Normal", description: "Acesso 1x à análise completa" },
    lifetime: { price: 299.90, label: "Vitalício", description: "Acesso ilimitado + atualizações" },
  };

  // Track conversion when payment is completed and redirect to thank you page
  useEffect(() => {
    if (isPaid && diagnostic?.publicId && typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          'send_to': 'AW-17943086003/ealSCPLWzYAcELOH9-tC',
          'transaction_id': diagnostic.publicId,
        });
      }
      const timer = setTimeout(() => {
        window.location.href = `/obrigado/${diagnostic.publicId}`;
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isPaid, diagnostic?.publicId]);

  // Auto-create Mercado Pago preference when payment section is shown
  useEffect(() => {
    if (showPayment && !createPreference.data && !createPreference.isPending && diagnostic) {
      createPreference.mutate({
        diagnosticPublicId: publicId,
        amount: plans[selectedPlan].price,
        returnUrl: window.location.origin,
      });
    }
  }, [showPayment, selectedPlan, diagnostic, publicId, createPreference]);

  // Auto-detect payment completion by polling
  useEffect(() => {
    if (!isPaid && showPayment) {
      const interval = setInterval(() => {
        refetch();
      }, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [isPaid, showPayment, refetch]);

  const handleUnlock = () => {
    setShowPayment(true);
    toast.info("✦ Gerando dados de pagamento...", {
      description: "Opções de Pix e Cartão estarão disponíveis em segundos.",
    });
  };

  const handleShareCopy = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copiado para a área de transferência!');
  };

  const handleConfirmPayment = async () => {
    toast.info("Verificando pagamento...", {
      description: "Atualizando página em 3 segundos.",
    });
    setTimeout(() => refetch(), 3000);
  };

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="mystic-gradient min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Os ancestrais estão consultando os astros...</p>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error || !diagnostic) {
    return (
      <div className="mystic-gradient min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Diagnóstico não encontrado</p>
          <Button variant="outline" onClick={() => window.location.href = "/"}>Voltar ao Início</Button>
        </div>
      </div>
    );
  }

  const PILLAR_TITLES = [
    { key: "yearPillar" as const, title: "Pilar do Ano" },
    { key: "monthPillar" as const, title: "Pilar do Mês" },
    { key: "dayPillar" as const, title: "Pilar do Dia" },
    { key: "hourPillar" as const, title: "Pilar da Hora" },
  ];

  return (
    <div className="mystic-gradient min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ── HEADER ── */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            Seus 4 Pilares SAJO
          </h1>
          <p className="text-muted-foreground">Revelação ancestral para {diagnostic.consultantName}</p>
        </div>

        {/* ── 4 PILLARS GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PILLAR_TITLES.map(({ key, title }) => (
            <PillarCard key={key} title={title} pillar={pillarsData?.[key] as Pillar} />
          ))}
        </div>

        {/* ── ANALYSIS SECTION ── */}
        <Card className="bg-card/60 border-primary/30">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Análise de Degustação</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Revelação gratuita do seu destino</p>
            {diagnostic.tastingAnalysis && (
              <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-sm font-semibold text-red-900">
                  Sei que me procurou por...
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className={`prose-mystic`}>
              <div 
                className="text-black whitespace-pre-wrap text-base leading-relaxed font-bold"
                dangerouslySetInnerHTML={{
                  __html: (isPaid
                    ? (diagnostic.basicAnalysis || diagnostic.tastingAnalysis || "Análise em processamento...")
                    : (diagnostic.tastingAnalysis || "Análise em processamento..."))
                    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* -- URGENCY BADGE -- */}
        {!isPaid && (
          <div className="mb-6 p-4 bg-destructive/15 border-2 border-destructive/50 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-lg">⏰</span>
              <span className="font-bold text-destructive">OFERTA COM PRAZO LIMITADO</span>
            </div>
            <p className="text-sm text-destructive/90">
              Promocao valida apenas ate <strong>01/marco as 23:59</strong> — depois o valor volta ao normal (R$ 29,99)
            </p>
          </div>
        )}

        {/* -- PAYMENT SECTION (PROMINENT & VISIBLE) -- */}
        {!isPaid && (
          <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/50 mb-8 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle
                className="text-2xl mystic-glow"
                style={{ fontFamily: "'Cinzel Decorative', serif" }}
              >
                ✦ Desbloqueie a Análise Completa ✦
              </CardTitle>
              <p className="text-primary/80 text-sm mt-2">Escolha seu plano</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.entries(plans) as [keyof typeof plans, typeof plans[keyof typeof plans]][]).map(
                  ([planKey, plan]) => (
                    <div
                      key={planKey}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPlan === planKey
                          ? "border-primary bg-primary/10"
                          : "border-primary/30 bg-card/40 hover:border-primary/50"
                      }`}
                      onClick={() => {
                        setSelectedPlan(planKey);
                        createPreference.reset();
                        // Trigger new preference creation with updated plan
                        if (showPayment) {
                          createPreference.mutate({
                            diagnosticPublicId: publicId,
                            amount: plans[planKey].price,
                            returnUrl: window.location.origin,
                          });
                        }
                      }}
                    >
                      <div className="text-lg font-bold text-primary mb-1">{plan.label}</div>
                      <div className="text-2xl font-bold text-primary mb-2">R$ {plan.price.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">{plan.description}</div>
                      {planKey === "promo" && (
                        <div className="mt-2 inline-block px-2 py-1 bg-destructive/20 text-destructive text-xs rounded">
                          Promoção Limitada
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Mercado Pago Button - Prominent */}
              {showPayment ? (
                <PaymentMethodSelector
                  diagnosticPublicId={publicId}
                  plan={selectedPlan}
                  price={plans[selectedPlan].price}
                  countryCode="BR"
                  userEmail={diagnostic?.email || undefined}
                  onMercadoPagoClick={() => {
                    if (createPreference.data?.preferenceId) {
                      window.open(
                        `https://mercadopago.com.br/checkout/v1/redirect?pref_id=${createPreference.data.preferenceId}`,
                        '_blank'
                      );
                    } else {
                      createPreference.mutate({
                        diagnosticPublicId: publicId,
                        amount: plans[selectedPlan].price,
                        returnUrl: window.location.origin,
                      });
                    }
                  }}
                  mercadoPagoLoading={createPreference.isPending}
                  mercadoPagoReady={!!createPreference.data?.preferenceId}
                />
              ) : (
                <div className="text-center space-y-4">
                  <Button
                    className="w-full py-6 bg-primary text-primary-foreground rounded-full text-lg font-bold hover:bg-primary/90"
                    onClick={handleUnlock}
                  >
                    <CreditCard className="mr-3 h-6 w-6" />
                    Desbloquear Análise Completa
                  </Button>
                </div>
              )}

              {/* Confirm button */}
              {!createPreference.data?.preferenceId && (
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Apos realizar o Pix, clique no botao abaixo para liberar sua analise:
                  </p>
                  <Button
                    className="w-full py-5 bg-primary text-primary-foreground rounded-full text-lg"
                    onClick={handleConfirmPayment}
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Ja Paguei — Liberar Analise
                  </Button>
                </div>
              )}

              {/* GUARANTEE SECTION */}
              <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <p className="font-bold text-green-900 mb-1">Garantia de 30 Dias</p>
                    <p className="text-sm text-green-800">
                      Se a analise nao corresponder as suas expectativas, devolvemos 100% do seu dinheiro. Sem perguntas.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── SHARE SECTION ── */}
        <Card className="bg-card/60 border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg">Compartilhe seu Destino</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  toast.success('Link copiado!');
                }}
              >
                <Share2 className="h-4 w-4" />
                Copiar Link
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => {
                  const url = window.location.href;
                  const text = encodeURIComponent(`Descobri meu destino com SAJO! Veja meus 4 Pilares: ${url}`);
                  window.open(`https://wa.me/?text=${text}`, '_blank');
                }}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => {
                  const url = window.location.href;
                  const text = encodeURIComponent('Descobri meu destino com SAJO!');
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${text}`, '_blank');
                }}
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => {
                  const url = window.location.href;
                  const text = encodeURIComponent('Descobri meu destino com SAJO!');
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`, '_blank');
                }}
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Compartilhe e ganhe R$ 9,99 de desconto na próxima análise!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
