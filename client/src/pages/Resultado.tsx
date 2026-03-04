import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, Copy, Check, CreditCard, MessageCircle, ChevronDown, ChevronUp, Share2, Facebook, Twitter, Gift } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect, ReactNode } from "react";
import { useRoute } from "wouter";
import { PaymentMethodSelector } from "@/components/PaymentMethodSelector";
import PostTastingQuestionnaire from "@/components/PostTastingQuestionnaire";

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

interface Hook {
  id: string;
  category: string;
  title: string;
  pain: string;
  data: string;
  question: string;
  variants: { a: string; b: string };
  compatibility: { gender: string[]; ageMin: number; ageMax: number };
  disclaimer: string;
  tags: string[];
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
  const [selectedPlan, setSelectedPlan] = useState<"normal" | "lifetime">("normal");
  const [copied, setCopied] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; finalPrice: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  const { data: diagnosticRaw, isLoading, error, refetch } = trpc.diagnostic.getByPublicId.useQuery(
    { publicId },
    { enabled: !!publicId }
  );

  // Cast to typed diagnostic to fix TS2322
  const diagnostic = diagnosticRaw as (typeof diagnosticRaw & {
    consultantName: string | null;
    selectedHooks: Hook[] | null;
    selectedVariants: Record<string, string> | null;
    pillarsData: PillarsData | null;
    tastingAnalysis: string | null;
    basicAnalysis: string | null;
    fullAnalysis: string | null;
    email: string | null;
    publicId: string;
    paymentStatus: string;
    abTestVariant: string;
    selectedPlan: string | null;
  }) | undefined;

  const createPreference = trpc.payment.createPreference.useMutation();
  const applyCouponMutation = trpc.payment.applyCoupon.useMutation({
    onSuccess: (result) => {
      if (result.valid && result.finalPrice) {
        setAppliedCoupon({ code: couponCode, finalPrice: result.finalPrice });
        setCouponError("");
        toast.success(`Cupom ${couponCode} aplicado! Novo preco: R$ ${result.finalPrice.toFixed(2)}`);
      } else {
        setCouponError(result.reason || "Cupom invalido");
        setAppliedCoupon(null);
      }
    },
    onError: () => {
      setCouponError("Erro ao aplicar cupom");
      setAppliedCoupon(null);
    },
  });

  const isPaid = diagnostic?.paymentStatus === "paid";
  const pillarsData: PillarsData | null | undefined = diagnostic?.pillarsData as unknown as PillarsData | null | undefined;

  // Plan prices
  const plans = {
    normal: { price: 29.99, label: "Normal", description: "Acesso 1x à análise completa" },
    lifetime: { price: 299.90, label: "Vitalicio", description: "Acesso ilimitado + atualizações" },
  };

  const currentPrice = appliedCoupon ? appliedCoupon.finalPrice : plans[selectedPlan].price;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Digite um cupom");
      return;
    }
    setCouponError("");
    applyCouponMutation.mutate({
      diagnosticPublicId: publicId,
      couponCode: couponCode.toUpperCase(),
    });
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
    // Immediately trigger preference creation
    createPreference.mutate({
      diagnosticPublicId: publicId,
      amount: plans[selectedPlan].price,
      returnUrl: window.location.origin,
    });
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

        {/* ── DETECTED PATTERNS (HOOKS) SECTION ── */}
        {diagnostic?.selectedHooks && Array.isArray(diagnostic.selectedHooks) && diagnostic.selectedHooks.length > 0 && !isPaid && (
          <Card className="bg-card/60 border-primary/30">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Padrões Detectados nos Seus Pilares</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Insights específicos que podem estar afetando sua vida</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {(diagnostic.selectedHooks as Hook[]).map((hook: Hook) => {
                const variantKey = (diagnostic.selectedVariants as Record<string, string>)?.[hook.id] || 'a';
                const selectedText = hook.variants[variantKey as keyof typeof hook.variants];
                return (
                  <div key={hook.id} className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">⚡</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-primary mb-1">{hook.title}</h4>
                        <p className="text-sm text-foreground mb-2">{hook.pain}</p>
                        <p className="text-xs text-muted-foreground italic mb-2">"{selectedText}"</p>
                        <p className="text-xs text-primary/70 font-medium">{hook.data}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Lock Button Section */}
              <div id="lock-container" className="mt-8 pt-6 border-t-2 border-dashed border-[#d4af37]">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center p-4 rounded-full bg-[#d4af37]/20">
                    <Lock className="h-8 w-8 text-[#d4af37]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#d4af37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    3 Padrões Graves Detectados
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Seus Pilares revelaram padrões urgentes que precisam de atenção imediata. Desbloqueie agora para ver o que está escondido.
                  </p>
                  <button
                    id="btn-unlock"
                    className="btn-unlock w-full py-4 px-6 rounded-full text-lg font-bold bg-gradient-to-r from-[#d4af37] to-[#e68c0f] text-black shadow-lg hover:shadow-xl transition-all"
                    onClick={() => {
                      const paymentSection = document.getElementById('payment-options');
                      if (paymentSection) {
                        paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    <Lock className="inline mr-2 h-5 w-5" />
                    DESBLOQUEIE A ANÁLISE COMPLETA AGORA
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── 4 PILLARS GRID ── */}
        {pillarsData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PILLAR_TITLES.map(({ key, title }) => {
              const pillarValue = (pillarsData as unknown as PillarsData)[key as keyof PillarsData] as Pillar;
              return pillarValue ? <PillarCard key={key} title={title} pillar={pillarValue} /> : null;
            })}
          </div>
        )}

        {/* ── ANALYSIS SECTION ── */}
        <Card className="bg-card/60 border-primary/30">
          <CardHeader>
            <CardTitle className="text-xl text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>Análise de Degustação</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Revelação ancestral dos seus Pilares</p>
          </CardHeader>
          <CardContent>
            {(() => {
              const fullText = isPaid
                ? (diagnostic.basicAnalysis || diagnostic.tastingAnalysis || "Análise em processamento...")
                : (diagnostic.tastingAnalysis || "Análise em processamento...");

              const formatHtml = (text: string) => text
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/\*([^*]+)\*/g, '<em>$1</em>');

              // Split at the ===CORTE_AQUI=== marker
              const parts = fullText.split('===CORTE_AQUI===');
              const visiblePart = parts[0] || fullText;
              const hiddenPart = parts.length > 1 ? parts[1] : '';

              return (
                <div className="prose-mystic">
                  {/* VISIBLE PART - always shown */}
                  <div
                    className="text-foreground whitespace-pre-wrap text-base leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatHtml(visiblePart) }}
                  />

                  {/* HIDDEN PART - blur/lock if not paid */}
                  {hiddenPart && !isPaid && (
                    <div className="relative mt-6">
                      {/* Blurred content */}
                      <div
                        className="text-foreground whitespace-pre-wrap text-base leading-relaxed select-none"
                        style={{ filter: 'blur(8px)', WebkitFilter: 'blur(8px)', userSelect: 'none', pointerEvents: 'none' }}
                        dangerouslySetInnerHTML={{ __html: formatHtml(hiddenPart) }}
                      />
                      {/* Lock overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm rounded-lg">
                        <div className="text-center p-6 max-w-md">
                          <Lock className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
                          <h3 className="text-xl font-bold text-primary mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                            3 Padrões Graves Detectados
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Seus Pilares revelaram padrões urgentes que precisam de atenção imediata.
                            Desbloqueie agora para ver o que está escondido.
                          </p>
                          <Button
                            className="w-full py-4 text-lg font-bold rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black shadow-lg"
                            onClick={handleUnlock}
                          >
                            <Lock className="mr-2 h-5 w-5" />
                            Desbloquear Análise Completa
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* HIDDEN PART - shown if paid */}
                  {hiddenPart && isPaid && (
                    <div
                      className="text-foreground whitespace-pre-wrap text-base leading-relaxed mt-6 pt-6 border-t border-primary/30"
                      dangerouslySetInnerHTML={{ __html: formatHtml(hiddenPart) }}
                    />
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>



        {/* ── POST-TASTING QUESTIONNAIRE — módulo ideal ── */}
        {!isPaid && (
          <PostTastingQuestionnaire
            consultantName={diagnostic.consultantName}
            onUnlock={() => {
              const el = document.getElementById('payment-options');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              setShowPayment(true);
            }}
          />
        )}

        {/* -- PAYMENT SECTION (PROMINENT & VISIBLE) -- */}
        {!isPaid && (
          <Card id="payment-options" className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/50 mb-8 shadow-lg scroll-mt-8">
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
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPlan === planKey
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
                    </div>
                  )
                )}
              </div>

              {/* Coupon Code Input */}
              <div className="space-y-2 p-4 bg-amber-50/10 border border-amber-500/20 rounded-lg">
                <label className="text-sm font-semibold text-amber-100">Tem um cupom? Aplique aqui:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: PRIMEIRAS100"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError("");
                    }}
                    disabled={appliedCoupon !== null}
                    className="flex-1 px-3 py-2 bg-background border border-amber-500/30 rounded text-sm text-foreground disabled:opacity-50"
                  />
                  {!appliedCoupon ? (
                    <button
                      onClick={handleApplyCoupon}
                      disabled={applyCouponMutation.isPending}
                      className="px-4 py-2 bg-amber-500 text-amber-950 font-semibold rounded hover:bg-amber-600 disabled:opacity-50 transition-colors"
                    >
                      {applyCouponMutation.isPending ? "Aplicando..." : "Aplicar"}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponCode("");
                        setCouponError("");
                      }}
                      className="px-4 py-2 bg-primary/30 text-primary font-semibold rounded hover:bg-primary/50 transition-colors"
                    >
                      Remover
                    </button>
                  )}
                </div>
                {couponError && <p className="text-xs text-red-400">{couponError}</p>}
                {appliedCoupon && (
                  <div className="text-xs text-amber-100 font-semibold">
                    ✓ Cupom {appliedCoupon.code} aplicado! Novo preço: R$ {appliedCoupon.finalPrice.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Current Price Display */}
              <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Preço {appliedCoupon ? "com cupom" : "do plano"}</p>
                <p className="text-3xl font-bold text-primary">R$ {currentPrice.toFixed(2)}</p>
              </div>

              {/* Mercado Pago Button - Prominent */}
              {showPayment ? (
                <PaymentMethodSelector
                  diagnosticPublicId={publicId}
                  plan={selectedPlan}
                  price={currentPrice}
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
