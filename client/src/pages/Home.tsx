import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, MapPin, Sparkles, Star, Moon, Sun, ChevronDown, TrendingUp, Heart, Zap } from "lucide-react";
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
  { step: "01", title: "Informe sua data", desc: "Apenas sua data de nascimento revela seus 4 Pilares." },
  { step: "02", title: "Análise instantânea", desc: "Receba sua análise de degustação em 30 segundos." },
  { step: "03", title: "Desbloqueie tudo", desc: "Acesse previsões completas sobre amor, carreira e saúde." },
];

const TESTIMONIALS = [
  {
    name: "Marina Silva",
    city: "São Paulo, SP",
    text: "Descobri meu potencial em relacionamentos. As previsões foram 100% precisas!",
    rating: 5,
  },
  {
    name: "Carlos Mendes",
    city: "Rio de Janeiro, RJ",
    text: "A análise me ajudou a entender meu tipo de personalidade. Recomendo!",
    rating: 5,
  },
  {
    name: "Juliana Costa",
    city: "Belo Horizonte, MG",
    text: "Finalmente entendi por que tenho dificuldades em finanças. Muito revelador!",
    rating: 5,
  },
  {
    name: "Ana Paula",
    city: "Curitiba, PR",
    text: "As previsões de saúde e bem-estar foram incrivelmente precisas.",
    rating: 5,
  },
  {
    name: "Roberto Santos",
    city: "Salvador, BA",
    text: "Melhor investimento em autoconhecimento que já fiz. Vale cada centavo!",
    rating: 5,
  },
];

export default function Home() {
  const [, navigate] = useLocation();
  const formRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [hasDst, setHasDst] = useState(false);
  const [cepQuery, setCepQuery] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    if (!birthDate) {
      toast.error("Preencha a data de nascimento.");
      return;
    }
    createDiagnostic.mutate({
      email: email || undefined,
      consultantName: name || undefined,
      birthDate,
      birthTime: birthTime || undefined,
      birthPlace: birthPlace || undefined,
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
            <a href="#por-que" className="hover:text-primary transition-colors">Por Que SAJO</a>
            <a href="#como-funciona" className="hover:text-primary transition-colors">Como Funciona</a>
            <a href="#depoimentos" className="hover:text-primary transition-colors">Depoimentos</a>
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
            Astrologia Coreana Ancestral
          </p>
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 mystic-glow leading-tight"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Descubra Seu Destino<br />
            <span className="shimmer-text">em Amor, Carreira e Saúde</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Seus 4 Pilares revelam quem você realmente é. Saiba seu potencial em relacionamentos, finanças e bem-estar segundo a sabedoria ancestral coreana.
          </p>
          
          {/* Urgency Banner */}
          <div className="bg-primary/20 border border-primary/40 rounded-full px-6 py-3 inline-block mb-6">
            <p className="text-sm font-semibold text-primary">
              ⏰ Promoção: <span className="line-through text-muted-foreground">R$ 14,99</span> → <span className="text-primary font-bold">R$ 9,99</span> para quem compartilhar
            </p>
          </div>

          <Button
            onClick={scrollToForm}
            className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full px-12 py-7 text-xl font-bold hover:shadow-2xl hover:shadow-primary/50 shadow-xl shadow-primary/40 transition-all duration-300 transform hover:scale-105"
          >
            <Sparkles className="mr-3 h-6 w-6" />
            Descobrir GRÁTIS em 30 Segundos
          </Button>
          <p className="mt-4 text-xs text-muted-foreground/60">
            ✓ Análise gratuita · ✓ Sem cadastro · ✓ Resultado instantâneo
          </p>

          {/* Social Proof */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="text-center">
              <p className="font-bold text-primary text-lg">5.234+</p>
              <p className="text-xs">Pessoas descobriram</p>
            </div>
            <div className="w-px h-8 bg-border/30"></div>
            <div className="text-center">
              <p className="font-bold text-primary text-lg">4.9★</p>
              <p className="text-xs">Avaliação média</p>
            </div>
          </div>
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
                Seus 4 Pilares Revelados
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-2">
                Apenas 2 informações para começar
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground/80">Seu Nome <span className="text-muted-foreground/60">(opcional)</span></Label>
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
                  <Label htmlFor="email" className="text-foreground/80">Seu Email <span className="text-muted-foreground/60">(para receber análise completa)</span></Label>
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

                {/* Advanced Options Toggle */}
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1 mt-4"
                >
                  <ChevronDown className={`h-3 w-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                  Adicionar hora e local (aumenta precisão)
                </button>

                {/* Advanced Fields */}
                {showAdvanced && (
                  <div className="space-y-4 pt-4 border-t border-border/30">
                    {/* Birth Time */}
                    <div className="space-y-2">
                      <Label htmlFor="birthTime" className="text-foreground/80">
                        Hora de Nascimento <span className="text-muted-foreground/60">(opcional)</span>
                      </Label>
                      <Input
                        id="birthTime"
                        type="time"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="bg-input/50 border-border/50 focus:border-primary/60"
                      />
                    </div>

                    {/* Birth Place with CEP search */}
                    <div className="space-y-2">
                      <Label htmlFor="birthPlace" className="text-foreground/80">
                        Local de Nascimento <span className="text-muted-foreground/60">(opcional)</span>
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
                        className="bg-input/50 border-border/50 focus:border-primary/60"
                      />
                    </div>

                    {/* DST toggle */}
                    <div className="flex items-center justify-between py-2 border-t border-border/30">
                      <div>
                        <Label htmlFor="dst" className="text-foreground/80 text-sm">
                          Havia horário de verão?
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
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={createDiagnostic.isPending}
                  className="w-full py-6 bg-primary text-primary-foreground rounded-full text-base font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 mt-6"
                >
                  {createDiagnostic.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Ver Meus 4 Pilares Agora
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Por Que SAJO ── */}
      <section id="por-que" className="py-20 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mystic-glow mb-4"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              Por Que SAJO é Diferente
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Astrologia coreana ancestral com 5.000 anos de precisão
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card/60 border border-primary/30 rounded-lg p-6 text-center">
              <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Amor & Relacionamentos</h3>
              <p className="text-sm text-muted-foreground">
                Descubra sua compatibilidade real e seu potencial em relacionamentos
              </p>
            </div>
            <div className="bg-card/60 border border-primary/30 rounded-lg p-6 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Carreira & Finanças</h3>
              <p className="text-sm text-muted-foreground">
                Identifique seu potencial profissional e ciclos de prosperidade
              </p>
            </div>
            <div className="bg-card/60 border border-primary/30 rounded-lg p-6 text-center">
              <Zap className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Saúde & Bem-estar</h3>
              <p className="text-sm text-muted-foreground">
                Entenda seu tipo de energia e como otimizar sua saúde
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Como Funciona ── */}
      <section id="como-funciona" className="py-20 px-4">
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
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl font-bold text-primary/40 mb-4">{item.step}</div>
                <h3 className="font-bold mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Depoimentos ── */}
      <section id="depoimentos" className="py-20 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mystic-glow mb-4"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}
            >
              Histórias de Transformação
            </h2>
            <p className="text-muted-foreground">
              Pessoas que descobriram seu destino através dos 4 Pilares
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div key={idx} className="bg-card/60 border border-primary/30 rounded-lg p-6">
                <div className="flex gap-1 mb-3">
                  {Array(testimonial.rating).fill(0).map((_, i) => (
                    <span key={i} className="text-primary">★</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t border-border/30 pt-3">
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl font-bold mystic-glow mb-6"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Sua Jornada Começa Agora
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Descubra os segredos dos seus 4 Pilares e desbloqueie seu potencial completo
          </p>
          <Button
            onClick={scrollToForm}
            className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-full px-12 py-7 text-lg font-bold hover:shadow-2xl hover:shadow-primary/50 shadow-xl shadow-primary/40"
          >
            <Sparkles className="mr-3 h-6 w-6" />
            Começar Análise Gratuita
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/30 py-8 px-4 text-center text-sm text-muted-foreground">
        <p>© 2026 FUSION-SAJO. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
