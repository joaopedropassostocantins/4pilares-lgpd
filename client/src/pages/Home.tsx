import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, MapPin, Sparkles, Star, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

// ─── CEP lookup via ViaCEP ───────────────────────────────────────────────────
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

// ─── Element display ─────────────────────────────────────────────────────────
const ELEMENTS = [
  { name: "Madeira", korean: "木", color: "text-green-400", desc: "Crescimento, visão, liderança" },
  { name: "Fogo", korean: "火", color: "text-red-400", desc: "Paixão, carisma, expressão" },
  { name: "Terra", korean: "土", color: "text-amber-400", desc: "Estabilidade, nutrição, centro" },
  { name: "Metal", korean: "金", color: "text-gray-300", desc: "Disciplina, justiça, refinamento" },
  { name: "Água", korean: "水", color: "text-blue-400", desc: "Sabedoria, intuição, fluidez" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Informe seus dados", desc: "Data, hora e local de nascimento são os pilares do cálculo ancestral." },
  { step: "02", title: "Os ancestrais calculam", desc: "O sistema SAJO mapeia seus 4 Pilares segundo o calendário lunar coreano." },
  { step: "03", title: "Receba sua análise", desc: "Uma prévia gratuita revela sua essência. A análise completa desvenda seu destino." },
];

export default function Home() {
  const [, navigate] = useLocation();
  const formRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [hasDst, setHasDst] = useState(false);
  const [cepQuery, setCepQuery] = useState("");
  const [cepLoading, setCepLoading] = useState(false);

  const createDiagnostic = trpc.diagnostic.create.useMutation({
    onSuccess: (data) => {
      toast.success("☯ Diagnóstico criado! Os ancestrais revelam seu destino...", {
        description: "Análise de degustação pronta. Desbloqueie a análise completa.",
      });
      navigate(`/resultado/${data.publicId}`);
    },
    onError: (err) => {
      toast.error("Erro ao consultar os ancestrais. Tente novamente.");
      console.error(err);
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
      toast.error("CEP não encontrado. Informe o local manualmente.");
    }
  };

  const handleCepKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCepSearch();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate || !birthTime || !birthPlace) {
      toast.error("Preencha data, hora e local de nascimento.");
      return;
    }
    createDiagnostic.mutate({
      consultantName: name || undefined,
      birthDate,
      birthTime,
      birthPlace,
      hasDst,
    });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="mystic-gradient text-foreground">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 backdrop-blur-md bg-background/60">
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
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#tradicao" className="hover:text-primary transition-colors">A Tradição</a>
            <a href="#como-funciona" className="hover:text-primary transition-colors">Como Funciona</a>
            <a href="#elementos" className="hover:text-primary transition-colors">5 Elementos</a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-4 text-center overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="particle absolute top-20 left-[10%] text-primary/30 text-4xl">☯</span>
          <span className="particle absolute top-32 right-[15%] text-primary/20 text-2xl">✦</span>
          <span className="particle absolute bottom-20 left-[20%] text-primary/20 text-3xl">木</span>
          <span className="particle absolute bottom-32 right-[10%] text-primary/20 text-2xl">水</span>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <p
            className="text-primary/60 text-xs tracking-[0.4em] mb-4 uppercase"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            사주팔자 · TRADIÇÃO ANCESTRAL DE 5.000 ANOS
          </p>
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 mystic-glow leading-tight"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Descubra Seu Destino<br />
            <span className="shimmer-text">Pelos 4 Pilares</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            O SAJO revela os padrões ancestrais que moldaram sua alma. Data, hora e local de nascimento
            desvendam os segredos do seu destino segundo a sabedoria milenar coreana.
          </p>
          <Button
            onClick={scrollToForm}
            className="bg-primary text-primary-foreground rounded-full px-10 py-6 text-lg font-semibold hover:bg-primary/90 shadow-lg shadow-primary/30"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Revelar Meu Destino
          </Button>
          <p className="mt-4 text-xs text-muted-foreground/60">
            ✦ Análise gratuita de degustação · Sem necessidade de cadastro ✦
          </p>
        </div>
      </section>

      {/* ── Form ── */}
      <section ref={formRef} className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          <Card className="bg-card/60 border-primary/30 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="ornamental-divider mb-4">
                <span className="text-primary">✦</span>
              </div>
              <CardTitle
                className="text-2xl mystic-glow"
                style={{ fontFamily: "'Cinzel Decorative', serif" }}
              >
                Os Ancestrais Aguardam
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-2">
                Informe os dados do seu nascimento para que os 4 Pilares sejam revelados
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground/80">Seu Nome (opcional)</Label>
                  <Input
                    id="name"
                    placeholder="Como deseja ser chamado(a)?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-input/50 border-border/50 focus:border-primary/60"
                  />
                </div>

                {/* Birth Date */}
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="text-foreground/80">
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

                {/* Birth Time */}
                <div className="space-y-2">
                  <Label htmlFor="birthTime" className="text-foreground/80">
                    Hora de Nascimento <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="birthTime"
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    required
                    className="bg-input/50 border-border/50 focus:border-primary/60"
                  />
                </div>

                {/* Birth Place with CEP search */}
                <div className="space-y-2">
                  <Label htmlFor="birthPlace" className="text-foreground/80">
                    Local de Nascimento <span className="text-primary">*</span>
                  </Label>

                  {/* CEP search row */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="CEP (ex: 01310-100)"
                        value={cepQuery}
                        onChange={(e) => setCepQuery(e.target.value)}
                        onKeyDown={handleCepKeyDown}
                        className="pl-9 bg-input/50 border-border/50 focus:border-primary/60"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCepSearch}
                      disabled={cepLoading}
                      className="border-primary/40 hover:border-primary/70 hover:bg-primary/10 shrink-0"
                      title="Buscar endereço pelo CEP"
                    >
                      {cepLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Manual address field */}
                  <Input
                    id="birthPlace"
                    placeholder="Cidade, estado e país (ex: São Paulo, SP, Brasil)"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    required
                    className="bg-input/50 border-border/50 focus:border-primary/60"
                  />
                  <p className="text-xs text-muted-foreground/60">
                    Digite o CEP e clique em buscar, ou informe o local manualmente.
                  </p>
                </div>

                {/* DST toggle */}
                <div className="flex items-center justify-between py-2 border-t border-border/30">
                  <div>
                    <Label htmlFor="dst" className="text-foreground/80 text-sm">
                      Havia horário de verão vigente?
                    </Label>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      Ative se nasceu durante o horário de verão
                    </p>
                  </div>
                  <Switch
                    id="dst"
                    checked={hasDst}
                    onCheckedChange={setHasDst}
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={createDiagnostic.isPending}
                  className="w-full py-6 bg-primary text-primary-foreground rounded-full text-base font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 mt-2"
                >
                  {createDiagnostic.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Os ancestrais estão consultando os astros...
                    </>
                  ) : (
                    <>
                      <Star className="mr-2 h-5 w-5" />
                      Descobrir Meu Destino Agora
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── A Tradição SAJO ── */}
      <section id="tradicao" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="ornamental-divider mb-6">
              <span className="text-primary text-xl">☯</span>
            </div>
            <h2
              className="text-3xl font-bold mystic-glow mb-4"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              A Tradição SAJO
            </h2>
            <p
              className="text-primary/60 text-sm tracking-widest"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              사주 · 5.000 ANOS DE SABEDORIA ANCESTRAL
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">SAJO (사주)</strong>, conhecido como <em>Saju Palja</em> (사주팔자),
                é o sistema de astrologia coreana baseado nos 4 Pilares do Destino — Ano, Mês, Dia e Hora de nascimento.
              </p>
              <p>
                Diferente da astrologia ocidental, o SAJO trabalha com os <strong className="text-primary">8 caracteres</strong> (팔자)
                que representam os ciclos cósmicos do momento do nascimento, revelando padrões de personalidade,
                saúde, relacionamentos e destino.
              </p>
              <p>
                Cada pilar é composto por um <strong className="text-foreground">Tronco Celestial</strong> (천간) e
                um <strong className="text-foreground">Ramo Terrestre</strong> (지지), interagindo segundo os
                5 Elementos e a dualidade Yin-Yang.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Pilar do Ano", korean: "년주", desc: "Ancestralidade e raízes" },
                { title: "Pilar do Mês", korean: "월주", desc: "Pais e juventude" },
                { title: "Pilar do Dia", korean: "일주", desc: "Eu interior e essência" },
                { title: "Pilar da Hora", korean: "시주", desc: "Filhos e futuro" },
              ].map((p) => (
                <Card key={p.korean} className="bg-card/40 border-primary/20 text-center p-4">
                  <div className="text-2xl text-primary mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                    {p.korean}
                  </div>
                  <div className="text-sm font-semibold text-foreground/80">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.desc}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Como Funciona ── */}
      <section id="como-funciona" className="py-20 px-4 bg-card/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mystic-glow mb-4"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              Como Funciona
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="text-center">
                <div
                  className="text-5xl font-bold text-primary/20 mb-4"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5 Elementos ── */}
      <section id="elementos" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mystic-glow mb-4"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              Os 5 Elementos
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Madeira, Fogo, Terra, Metal e Água formam o ciclo da vida. O equilíbrio entre eles revela seus dons e desafios.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {ELEMENTS.map((el) => (
              <Card key={el.name} className="bg-card/40 border-primary/10 hover:border-primary/30 transition-all text-center p-4">
                <div className={`text-4xl font-bold mb-2 ${el.color}`}>{el.korean}</div>
                <div className="text-sm font-semibold text-foreground/80 mb-1">{el.name}</div>
                <div className="text-xs text-muted-foreground">{el.desc}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="ornamental-divider mb-8">
            <span className="text-primary text-2xl">☯</span>
          </div>
          <h2
            className="text-3xl font-bold mystic-glow mb-6"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Os Ancestrais Aguardam
          </h2>
          <p className="text-muted-foreground mb-8">
            Sua jornada de autoconhecimento começa com um único passo. Descubra o que os astros traçaram para você.
          </p>
          <Button
            onClick={scrollToForm}
            className="bg-primary text-primary-foreground rounded-full px-10 py-6 text-lg font-semibold hover:bg-primary/90 shadow-lg shadow-primary/30"
          >
            <Moon className="mr-2 h-5 w-5" />
            Consultar os 4 Pilares
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/30 py-8 px-4 text-center text-muted-foreground/50 text-xs">
        <p>© 2025 FUSION-SAJO · Diagnósticos Astrológicos Ancestrais</p>
        <p className="mt-1">사주팔자 · 木火土金水 · Tradição Coreana dos 4 Pilares</p>
      </footer>
    </div>
  );
}
