import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";

async function fetchAddressByCep(cep: string): Promise<string | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;
    const parts: string[] = [];
    if (data.localidade) parts.push(data.localidade);
    if (data.uf) parts.push(data.uf);
    parts.push("Brasil");
    return parts.join(", ");
  } catch {
    return null;
  }
}

export default function Ads() {
  const [, navigate] = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [cepQuery, setCepQuery] = useState("");
  const [cepLoading, setCepLoading] = useState(false);

  const createDiagnostic = trpc.diagnostic.create.useMutation({
    onSuccess: (data) => {
      // Track conversion event
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "view_item", {
          value: 0,
          currency: "BRL",
          items: [{ item_id: data.publicId, item_name: "Análise SAJO" }],
        });
      }
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "ViewContent", {
          content_id: data.publicId,
          content_name: "Análise SAJO",
          content_type: "product",
          value: 0,
          currency: "BRL",
        });
      }

      toast.success("☯ Análise criada! Confira seus 4 Pilares...", {
        description: "Desbloqueie a análise completa por apenas R$ 9,99",
      });
      navigate(`/resultado/${data.publicId}`);
    },
    onError: () => {
      toast.error("Erro ao consultar os ancestrais. Tente novamente.");
    },
  });

  const handleCepSearch = async () => {
    if (!cepQuery.trim()) return;
    setCepLoading(true);
    const address = await fetchAddressByCep(cepQuery);
    setCepLoading(false);
    if (address) {
      setBirthPlace(address);
      toast.success(`Local encontrado: ${address}`);
    } else {
      toast.error("CEP não encontrado. Informe manualmente.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) {
      toast.error("Preencha a data de nascimento.");
      return;
    }
    createDiagnostic.mutate({
      consultantName: name || undefined,
      email: email || undefined,
      birthDate,
      birthPlace: birthPlace || undefined,
      hasDst: false,
    });
  };

  return (
    <div className="mystic-gradient text-foreground min-h-screen flex flex-col">
      {/* Logo */}
      <div className="pt-6 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">☯</span>
          <span className="text-lg font-bold shimmer-text" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
            FUSION-SAJO
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Hero Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 mystic-glow" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              Descubra Seu Destino
            </h1>
            <p className="text-lg text-primary mb-2 font-semibold">em Amor, Carreira e Saúde</p>
            <p className="text-muted-foreground mb-6">
              Análise SAJO completa em 30 segundos. Grátis.
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-4 text-sm mb-8">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-primary font-semibold">5.234+</span>
                <span className="text-muted-foreground">pessoas</span>
              </div>
              <div className="text-muted-foreground">•</div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-primary font-semibold">4.9★</span>
                <span className="text-muted-foreground">avaliação</span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-card/60 border border-primary/30 backdrop-blur-sm rounded-lg p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm text-foreground/80">
                  Seu Nome <span className="text-muted-foreground/60">(opcional)</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Como deseja ser chamado(a)?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-input/50 border-border/50 focus:border-primary/60 text-sm"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-foreground/80">
                  Seu Email <span className="text-muted-foreground/60">(para receber análise)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input/50 border-border/50 focus:border-primary/60 text-sm"
                />
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-sm text-foreground/80">
                  Data de Nascimento <span className="text-primary">*</span>
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  className="bg-input/50 border-border/50 focus:border-primary/60"
                />
              </div>

              {/* Birth Place */}
              <div className="space-y-2">
                <Label htmlFor="birthPlace" className="text-sm text-foreground/80">
                  Local de Nascimento <span className="text-muted-foreground/60">(opcional)</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="CEP (ex: 01310-100)"
                    value={cepQuery}
                    onChange={(e) => setCepQuery(e.target.value)}
                    className="flex-1 bg-input/50 border-border/50 focus:border-primary/60 text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCepSearch}
                    disabled={cepLoading}
                    className="px-3"
                  >
                    {cepLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
                  </Button>
                </div>
                {birthPlace && (
                  <p className="text-xs text-primary">{birthPlace}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={createDiagnostic.isPending}
                className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg py-6 text-lg font-bold hover:shadow-2xl hover:shadow-primary/50 shadow-xl shadow-primary/40 transition-all duration-300 transform hover:scale-105 mt-6"
              >
                {createDiagnostic.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Ver Meus 4 Pilares Grátis
                  </>
                )}
              </Button>

              {/* Trust Indicators */}
              <div className="text-center text-xs text-muted-foreground space-y-1 pt-2">
                <p>✓ Análise grátis · ✓ Sem cadastro · ✓ Resultado instantâneo</p>
              </div>
            </form>
          </div>

          {/* CTA for Full Analysis */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Desbloqueie análise completa por apenas
            </p>
            <div className="text-3xl font-bold text-primary mb-2">
              R$ <span className="text-primary">299,00</span>
            </div>
            <p className="text-xs text-muted-foreground">
              para quem compartilhar
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 px-4 text-xs text-muted-foreground border-t border-border/20">
        <p>© 2026 FUSION-SAJO | Diagnósticos Astrológicos Ancestrais</p>
      </div>
    </div>
  );
}
