import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, Copy, Check, CreditCard, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

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
  // IMPORTANT FIX: stem and branch are objects — extract string properties explicitly
  const stemName = pillar.stem?.name ?? "";
  const stemKorean = pillar.stem?.korean ?? "";
  const stemElement = pillar.stem?.element ?? "";
  const stemYinYang = pillar.stem?.yin_yang ?? "";
  const stemMeaning = pillar.stem?.meaning ?? "";

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

        {/* Tooltip on hover */}
        <div className="mt-3 text-xs text-muted-foreground/60 italic leading-tight hidden md:block">
          {stemMeaning}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Element Balance Bar ──────────────────────────────────────────────────────
function ElementBalance({ balance }: { balance: Record<string, number> }) {
  const total = Object.values(balance).reduce((a, b) => a + b, 0) || 1;
  const elements = [
    { name: "Madeira", korean: "木", color: "bg-green-500" },
    { name: "Fogo", korean: "火", color: "bg-red-500" },
    { name: "Terra", korean: "土", color: "bg-amber-500" },
    { name: "Metal", korean: "金", color: "bg-gray-400" },
    { name: "Água", korean: "水", color: "bg-blue-500" },
  ];

  return (
    <div className="space-y-2">
      {elements.map((el) => {
        const val = balance[el.name] ?? 0;
        const pct = Math.round((val / total) * 100);
        return (
          <div key={el.name} className="flex items-center gap-3">
            <span className="w-6 text-center text-sm">{el.korean}</span>
            <div className="flex-1 bg-muted/40 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${el.color} transition-all duration-700`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Resultado() {
  const params = useParams<{ publicId: string }>();
  const [, navigate] = useLocation();
  const publicId = params.publicId || "";

  const [showPayment, setShowPayment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  const { data: diagnostic, isLoading, error, refetch } = trpc.diagnostic.getByPublicId.useQuery(
    { publicId },
    { enabled: !!publicId }
  );

  const createPix = trpc.payment.createPix.useMutation();
  const confirmPayment = trpc.payment.confirm.useMutation();
  const unlockDiagnostic = trpc.diagnostic.unlock.useMutation();

  const isPaid = diagnostic?.paymentStatus === "paid";
  const pillarsData = diagnostic?.pillarsData as PillarsData | null | undefined;

  const handleUnlock = () => {
    setShowPayment(true);
    createPix.mutate({ diagnosticId: publicId });
    toast.info("✦ Gerando dados de pagamento...", {
      description: "Chave Pix e QR code estarão disponíveis em segundos.",
    });
  };

  const handleConfirmPayment = async () => {
    try {
      await confirmPayment.mutateAsync({ diagnosticId: publicId, paymentMethod: "pix" });
      toast.success("✦ Pagamento confirmado! Processando...", {
        description: "Gerando análise completa com sabedoria ancestral...",
      });
      await unlockDiagnostic.mutateAsync({ publicId });
      toast.success("☯ Análise Completa Desbloqueada!", {
        description: "Os ancestrais revelam seu destino completo. Missão de vida, saúde, finanças e guia xamânico.",
      });
      refetch();
    } catch (err) {
      toast.error("Erro ao confirmar pagamento. Tente novamente.");
    }
  };

  const copyPixKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    toast.success("Chave Pix copiada!", {
      description: "Cole no seu app de banco para completar o pagamento.",
    });
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
          <Button variant="outline" onClick={() => navigate("/")}>Voltar ao Início</Button>
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
    <div className="mystic-gradient min-h-screen">
      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 backdrop-blur-md bg-background/60">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">☯</span>
            <span
              className="text-xl font-bold shimmer-text"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              FUSION-SAJO
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Voltar
          </Button>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto pt-24 pb-12 px-4">
        {/* ── Greeting ── */}
        {diagnostic.consultantName && (
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-sm tracking-widest uppercase mb-1">Diagnóstico de</p>
            <h1
              className="text-3xl font-bold mystic-glow"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              {diagnostic.consultantName}
            </h1>
          </div>
        )}

        {/* ── 4 Pillars Grid ── */}
        {pillarsData && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {PILLAR_TITLES.map(({ key, title }) =>
                pillarsData[key] ? (
                  <PillarCard key={key} title={title} pillar={pillarsData[key]} />
                ) : null
              )}
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <Card className="bg-card/40 border-primary/20 text-center p-3">
                <div className="text-xs text-muted-foreground mb-1">Signo Animal</div>
                <div className="text-sm font-bold text-primary">{pillarsData.animalSign}</div>
              </Card>
              <Card className="bg-card/40 border-primary/20 text-center p-3">
                <div className="text-xs text-muted-foreground mb-1">Elemento Dom.</div>
                <div className={`element-badge mx-auto ${elementClass(pillarsData.dominantElement)}`}>
                  {pillarsData.dominantElement}
                </div>
              </Card>
              <Card className="bg-card/40 border-primary/20 text-center p-3">
                <div className="text-xs text-muted-foreground mb-1">Yin / Yang</div>
                <div className="text-sm font-bold text-foreground">
                  🌙 {pillarsData.yinYangBalance.yin} · ☀️ {pillarsData.yinYangBalance.yang}
                </div>
              </Card>
              <Card className="bg-card/40 border-primary/20 text-center p-3">
                <div className="text-xs text-muted-foreground mb-1">Compatíveis</div>
                <div className="text-xs text-foreground/80">
                  {pillarsData.compatibleSigns?.slice(0, 2).join(", ")}
                </div>
              </Card>
            </div>

            {/* ── Element Balance ── */}
            <Card className="bg-card/60 border-primary/30 mb-8">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground tracking-widest uppercase">
                  Equilíbrio dos 5 Elementos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ElementBalance balance={pillarsData.elementBalance} />
              </CardContent>
            </Card>
          </>
        )}

        {/* ── Tasting Analysis (always visible) ── */}
        <Card className="bg-card/60 border-primary/30 mb-8">
          <CardHeader>
            <div className="ornamental-divider mb-4">
              <span className="text-primary">✦</span>
            </div>
            <CardTitle
              className="text-center text-2xl mystic-glow"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              {isPaid ? "Análise Básica dos 4 Pilares" : "Análise de Degustação"}
            </CardTitle>
            <p className="text-center text-primary/60 text-sm tracking-widest">
              {isPaid ? "DESBLOQUEADA" : "PRÉVIA GRATUITA"}
            </p>
          </CardHeader>
          <CardContent>
            <div className={`prose-mystic ${!isPaid ? "relative" : ""}`}>
              {!isPaid && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background/95 z-10 pointer-events-none rounded-b-lg" />
              )}
              <Streamdown>
                {isPaid
                  ? (diagnostic.basicAnalysis || diagnostic.tastingAnalysis || "Análise em processamento...")
                  : (diagnostic.tastingAnalysis || "Análise em processamento...")}
              </Streamdown>
            </div>
          </CardContent>
        </Card>

        {/* ── Paid: Full Analysis ── */}
        {isPaid && diagnostic.fullAnalysis && (
          <Card className="bg-card/60 border-primary/30 mb-8">
            <CardHeader>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between p-0 h-auto"
                onClick={() => setShowFullAnalysis(!showFullAnalysis)}
              >
                <div>
                  <CardTitle
                    className="text-xl mystic-glow text-left"
                    style={{ fontFamily: "'Cinzel Decorative', serif" }}
                  >
                    Análise Completa Profunda
                  </CardTitle>
                  <p className="text-primary/60 text-sm tracking-widest text-left">RELATÓRIO PREMIUM</p>
                </div>
                {showFullAnalysis ? (
                  <ChevronUp className="h-5 w-5 text-primary" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-primary" />
                )}
              </Button>
            </CardHeader>
            {showFullAnalysis && (
              <CardContent>
                <div className="prose-mystic">
                  <Streamdown>{diagnostic.fullAnalysis}</Streamdown>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* ── Paid: WhatsApp CTA ── */}
        {isPaid && (
          <Card className="bg-primary/10 border-primary/30 mb-8">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Dúvidas sobre sua análise?</strong> Fale com nossos mestres SAJO para aconselhamento personalizado.
              </p>
              <a
                href="https://wa.me/5563984381782?text=Olá%20FUSION-SAJO%2C%20tenho%20dúvidas%20sobre%20minha%20análise%20e%20gostaria%20de%20aconselhamento."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                Consultar via WhatsApp
              </a>
            </CardContent>
          </Card>
        )}

        {/* ── Not Paid: Unlock CTA ── */}
        {!isPaid && (
          <>
            {/* Locked overlay card */}
            <Card className="bg-card/60 border-primary/30 mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <div className="text-center px-6">
                  <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Análise Completa Bloqueada</h3>
                  <p className="text-muted-foreground mb-6 max-w-xs text-sm">
                    Desbloqueie a análise profunda dos 4 Pilares, saúde, finanças, relacionamentos e guia xamânico.
                  </p>
                  <Button
                    className="bg-primary text-primary-foreground rounded-full px-8 py-3 hover:bg-primary/90"
                    onClick={handleUnlock}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Desbloquear — R$ 20,00
                  </Button>
                </div>
              </div>
              <CardContent className="pt-6 blur-sm select-none pointer-events-none">
                <p className="text-muted-foreground">
                  Sua missão de vida, saúde, finanças, relacionamentos e guia xamânico personalizado aguardam...
                  Os ancestrais têm muito mais a revelar sobre os ciclos que moldam sua jornada.
                </p>
              </CardContent>
            </Card>

            {/* Payment section */}
            {showPayment && (
              <Card className="bg-card/80 border-primary/30 mb-8">
                <CardHeader>
                  <CardTitle
                    className="text-center text-xl"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Pagamento — R$ 20,00
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* PIX Key */}
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">Chave Pix (Telefone)</p>
                    <div className="flex items-center justify-center gap-2">
                      <code className="text-lg text-primary font-mono bg-background/50 px-4 py-2 rounded">
                        {createPix.data?.pixKey || "55 63 98438-1782"}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyPixKey(createPix.data?.pixKey || "55 63 98438-1782")}
                        className="border-primary/40 hover:border-primary"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Valor: <strong className="text-primary">R$ 20,00</strong>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Beneficiário: {createPix.data?.beneficiary || "FUSION-SAJO Diagnósticos Ancestrais"}
                    </p>
                  </div>

                  {/* Confirm button */}
                  <div className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Após realizar o Pix, clique no botão abaixo para liberar sua análise:
                    </p>
                    <Button
                      className="w-full py-5 bg-primary text-primary-foreground rounded-full text-lg"
                      onClick={handleConfirmPayment}
                      disabled={confirmPayment.isPending || unlockDiagnostic.isPending}
                    >
                      {confirmPayment.isPending || unlockDiagnostic.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Gerando sua análise completa...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-5 w-5" />
                          Já Paguei — Liberar Análise
                        </>
                      )}
                    </Button>
                  </div>

                  {/* WhatsApp */}
                  <div className="border-t border-border/30 pt-4 text-center">
                    <p className="text-xs text-muted-foreground mb-3">
                      <strong>✨ Consultas Virtuais Sem Compromisso</strong>
                    </p>
                    <a
                      href="https://wa.me/5563984381782?text=Olá%20FUSION-SAJO%2C%20gostaria%20de%20agendar%20uma%20consulta%20virtual%20sem%20compromisso."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp: 55 63 98438-1782
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
