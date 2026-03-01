import { useRef, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { trackDiagnosticCreated, trackPageView } from "@/lib/tracking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, MapPin, Sparkles, Star, Moon, Sun, ChevronDown, TrendingUp, Heart, Zap, MessageCircle, ChevronUp } from "lucide-react";
import { toast } from "sonner";

// ─── FAQ Item Component ───────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card className="bg-card/40 border-primary/20 hover:border-primary/40 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-primary/5 transition-colors"
      >
        <span className="font-semibold text-foreground">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-primary/10 bg-primary/5">
          <p className="text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </Card>
  );
}

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

/// ─── 10 Archetypes (Xamanismo Coreano) ──────────────────────────────────────────────────────
const ARCHETYPES = [
  { id: "big_tree", name: "🌳 Árvore Sagrada", desc: "Força" },
  { id: "flower", name: "🌸 Flor Celestial", desc: "Beleza" },
  { id: "sun", name: "☀️ Sol Radiante", desc: "Energia" },
  { id: "candle", name: "🕯️ Chama Sagrada", desc: "Iluminação" },
  { id: "land", name: "🌍 Terra Mãe", desc: "Raízes" },
  { id: "fertile_soil", name: "🌱 Solo Fértil", desc: "Crescimento" },
  { id: "rock", name: "🪨 Pedra Ancestral", desc: "Solidez" },
  { id: "gemstone", name: "💎 Joia Rara", desc: "Raridade" },
  { id: "ocean", name: "🌊 Oceano Profundo", desc: "Profundidade" },
  { id: "stream", name: "💧 Riacho Fluido", desc: "Fluidez" },
];

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

// ─── A/B Test Headlines ──────────────────────────────────────────────────────
const HEADLINES = {
  a: "DESCUBRA SEU DESTINO EM AMOR, CARREIRA E SAÚDE",
  b: "SAIBA SEU FUTURO SEGUNDO A ASTROLOGIA COREANA ANCESTRAL",
};

export default function Home() {
  const [, navigate] = useLocation();
  const formRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [hasDst, setHasDst] = useState(false);
  const [cepQuery, setCepQuery] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [selectedArchetype, setSelectedArchetype] = useState<string>("");
  const [headlineVariant] = useState<"a" | "b">(() => (Math.random() > 0.5 ? "a" : "b") as "a" | "b");

  // Track page view on mount
  useEffect(() => {
    trackPageView("Home", headlineVariant === "a" ? "A" : "B");
  }, [headlineVariant]);

  const createDiagnostic = trpc.diagnostic.create.useMutation({
    onSuccess: (data) => {
      // Show success message
      toast.success("☯ Diagnóstico criado! Os ancestrais revelam seu destino...", {
        description: "Análise de degustação pronta. Desbloqueie a análise completa.",
      });
      
      // Track diagnostic creation
      trackDiagnosticCreated({
        publicId: data.publicId,
        abTestVariant: headlineVariant === "a" ? "A" : "B",
        archetype: selectedArchetype,
      });
      
      // Navigate to result page
      setTimeout(() => {
        navigate(`/resultado/${data.publicId}`);
      }, 500);
    },
    onError: (err) => {
      console.error("Diagnostic creation error:", err);
      toast.error("Erro ao criar diagnóstico", {
        description: err.message || "Tente novamente em alguns momentos",
      });
    },
  });

  const handleCepLookup = async () => {
    if (!cepQuery.trim()) {
      toast.error("Digite um CEP válido");
      return;
    }
    setCepLoading(true);
    try {
      const result = await fetchAddressByCep(cepQuery);
      if (result) {
        setBirthPlace(result);
        toast.success("Endereço encontrado!", { description: result });
      } else {
        toast.error("CEP não encontrado");
      }
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Name
    if (!name.trim()) {
      toast.error("Campo obrigatório", {
        description: "Por favor, preencha seu nome",
      });
      return;
    }
    
    // Validation: Birth Date
    if (!birthDate) {
      toast.error("Campo obrigatório", {
        description: "Por favor, preencha sua data de nascimento",
      });
      return;
    }
    
    // Validation: Date cannot be in the future
    const selectedDate = new Date(birthDate);
    const today = new Date();
    if (selectedDate > today) {
      toast.error("Data inválida", {
        description: "A data de nascimento não pode ser no futuro",
      });
      return;
    }
    
    // Validation: Age must be at least 13 years old
    const age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate()) ? age - 1 : age;
    if (actualAge < 13) {
      toast.error("Idade mínima", {
        description: "Você deve ter pelo menos 13 anos",
      });
      return;
    }

    createDiagnostic.mutate({
      consultantName: name,
      email: email || undefined,
      whatsappPhone: whatsapp || undefined,
      birthDate,
      birthTime: birthTime || undefined,
      birthPlace: birthPlace || undefined,
      hasDst: hasDst,
      gender: (gender || undefined) as "male" | "female" | "other" | undefined,
      archetype: selectedArchetype || undefined,
      abTestVariant: headlineVariant === "a" ? "A" : "B",
    });
  };

  return (
    <div className="mystic-gradient min-h-screen">
      {/* ── HEADER ── */}
      <header className="bg-background/50 backdrop-blur border-b border-primary/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary" style={{ fontFamily: "'Cinzel', serif" }}>
              FUSION-SAJO
            </span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#como-funciona" className="text-muted-foreground hover:text-primary">
              Como Funciona
            </a>
            <a href="#depoimentos" className="text-muted-foreground hover:text-primary">
              Depoimentos
            </a>
            <a href="#formulario" className="text-muted-foreground hover:text-primary">
              Começar
            </a>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
        <div className="mb-8">
          <p className="text-primary/60 text-sm tracking-widest uppercase mb-4">Astrologia Coreana Ancestral</p>
          <h1
            className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight"
            data-ab-test={headlineVariant}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {HEADLINES[headlineVariant]}
            <span className="text-xs text-muted-foreground ml-2">(Variant {headlineVariant.toUpperCase()})</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Seus 4 Pilares SAJO revelam quem você realmente é. Saiba seu potencial em relacionamentos, finanças, saúde e bem-estar.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground rounded-full px-8 py-6 text-lg font-bold hover:bg-primary/90"
              onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Descobrir GRÁTIS em 30 Segundos
            </Button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="como-funciona" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-primary mb-12" style={{ fontFamily: "'Cinzel', serif" }}>
          Como Funciona a Astrologia SAJO
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Entenda como a análise dos 4 Pilares SAJO (Ano, Mês, Dia e Hora) revela seu destino através da tradição milenar coreana
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((item) => (
            <Card key={item.step} className="bg-card/60 border-primary/30 text-center">
              <CardContent className="pt-8">
                <div className="text-5xl font-bold text-primary mb-4">{item.step}</div>
                <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── FORM ── */}
      <section id="formulario" ref={formRef} className="max-w-2xl mx-auto px-4 py-16">
        <Card className="bg-card/80 border-primary/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary" style={{ fontFamily: "'Cinzel', serif" }}>
              Revele Seus 4 Pilares
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Apenas nome e data de nascimento</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <Label className="text-primary">Seu Nome *</Label>
                <Input
                  type="text"
                  placeholder="Ex: Marina Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 bg-background/50 border-primary/30"
                  />
              </div>

              {/* Email */}
              <div>
                <Label className="text-primary">Email (opcional)</Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 bg-background/50 border-primary/30"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <Label className="text-primary flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp (opcional - receba análise completa por WhatsApp)
                </Label>
                <Input
                  type="tel"
                  placeholder="+55 11 99999-9999"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="mt-2 bg-background/50 border-primary/30"
                />
                {whatsapp && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    ✓ Você receberá a análise completa por WhatsApp
                  </p>
                )}
              </div>

              {/* Birth Date */}
              <div>
                <Label className="text-primary">Data de Nascimento *</Label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="mt-2 bg-background/50 border-primary/30"
                  />
              </div>

              {/* Gender */}
              <div>
                <Label className="text-primary">Gênero (opcional)</Label>
                <div className="mt-2 flex gap-4">
                  {[
                    { value: "male", label: "Masculino" },
                    { value: "female", label: "Feminino" },
                    { value: "other", label: "Outro" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={opt.value}
                        checked={gender === opt.value}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-muted-foreground">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Archetype Selection */}
              <div>
                <Label className="text-primary">Qual tipo de pessoa você é? (opcional)</Label>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-2">
                  {ARCHETYPES.map((arch) => (
                    <button
                      key={arch.id}
                      type="button"
                      onClick={() => setSelectedArchetype(selectedArchetype === arch.id ? "" : arch.id)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all border-2 ${
                        selectedArchetype === arch.id
                          ? "border-primary bg-primary/20"
                          : "border-primary/30 bg-card/40 hover:border-primary/50"
                      }`}
                      title={arch.desc}
                    >
                      {arch.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-primary text-sm font-medium hover:text-primary/80"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                  Opções Avançadas (hora, cidade)
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-4 p-4 bg-background/30 rounded-lg border border-primary/20">
                    {/* Birth Time */}
                    <div>
                      <Label className="text-primary text-sm">Hora de Nascimento (opcional)</Label>
                      <Input
                        type="time"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="mt-2 bg-background/50 border-primary/30"
                      />
                    </div>

                    {/* CEP Lookup */}
                    <div>
                      <Label className="text-primary text-sm">Cidade (opcional)</Label>
                      <div className="mt-2 flex gap-2">
                        <Input
                          type="text"
                          placeholder="Digite seu CEP"
                          value={cepQuery}
                          onChange={(e) => setCepQuery(e.target.value)}
                          className="bg-background/50 border-primary/30 flex-1"
                        />
                        <Button
                          type="button"
                          onClick={handleCepLookup}
                          disabled={cepLoading}
                          variant="outline"
                          className="border-primary/30"
                        >
                          {cepLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </Button>
                      </div>
                      {birthPlace && (
                        <p className="text-xs text-primary/60 mt-2">📍 {birthPlace}</p>
                      )}
                    </div>

                    {/* DST */}
                    <div className="flex items-center justify-between">
                      <Label className="text-primary text-sm">Horário de Verão</Label>
                      <Switch checked={hasDst} onCheckedChange={setHasDst} />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={createDiagnostic.isPending}
                className="w-full py-6 bg-primary text-primary-foreground rounded-full text-lg font-bold hover:bg-primary/90"
              >
                {createDiagnostic.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Gerando Análise...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Revelar Meus 4 Pilares
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="depoimentos" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-primary mb-12" style={{ fontFamily: "'Cinzel', serif" }}>
          Depoimentos - Transformações Reais com Astrologia SAJO
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Veja como a análise dos 4 Pilares SAJO ajudou milhares de pessoas a descobrir seu potencial em amor, carreira e saúde
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, idx) => (
            <Card key={idx} className="bg-card/60 border-primary/30">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-3">
                  {Array(testimonial.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-primary text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.city}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section id="faq" className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-primary mb-12" style={{ fontFamily: "'Cinzel', serif" }}>
          Perguntas Frequentes
        </h2>
        <div className="space-y-4">
          <FAQItem
            question="O que é SAJO?"
            answer="SAJO é um sistema ancestral coreano de astrologia que analisa os 4 Pilares do Destino (Ano, Mês, Dia e Hora de nascimento) para revelar sua personalidade, potencial e desafios em amor, carreira, saúde e bem-estar."
          />
          <FAQItem
            question="Como funciona a análise dos 4 Pilares?"
            answer="Cada pilar representa uma dimensão diferente do seu destino. O Ano revela sua missão de vida, o Mês sua natureza emocional, o Dia sua essência verdadeira, e a Hora seu potencial oculto. Juntos, formam um mapa completo do seu ser."
          />
          <FAQItem
            question="Preciso saber a hora exata do meu nascimento?"
            answer="Sim, a hora é importante para maior precisão. Se não souber, use a hora aproximada ou entre em contato com sua mãe/família. Mesmo sem a hora exata, a análise dos outros 3 pilares já fornece insights valiosos."
          />
          <FAQItem
            question="As previsões são 100% precisas?"
            answer="A astrologia SAJO oferece insights profundos baseados em padrões ancestrais. A precisão depende também de sua abertura para receber a mensagem. Use as previsões como guia para autoconhecimento e tomada de decisão consciente."
          />
          <FAQItem
            question="Qual é a diferença entre os planos?"
            answer="Promoção (R$ 14,99): Acesso único à análise completa. Normal (R$ 29,99): Acesso único com suporte. Vitalício (R$ 299,90): Acesso ilimitado, atualizações perpétuas e suporte prioritário."
          />
          <FAQItem
            question="Posso compartilhar meu link de referral?"
            answer="Sim! Cada amigo que se inscrever usando seu link de referral gera R$ 9,99 de desconto para você. Não há limite de referrals. Compartilhe em WhatsApp, Facebook, Twitter ou copie o link."
          />
          <FAQItem
            question="Como recebo minha análise após o pagamento?"
            answer="Após confirmar o pagamento, você é redirecionado para a página de agradecimento e a análise completa é enviada por email e WhatsApp (se fornecido) em até 5 minutos."
          />
          <FAQItem
            question="Há garantia de satisfação?"
            answer="Sim! Se não estiver satisfeito com a análise nos primeiros 7 dias, oferecemos reembolso total. Entre em contato conosco via WhatsApp ou email."
          />
          <FAQItem
            question="Meus dados são seguros?"
            answer="Sim. Usamos criptografia SSL e não compartilhamos seus dados com terceiros. Sua privacidade é nossa prioridade."
          />
          <FAQItem
            question="Como entro em contato com suporte?"
            answer="Você pode nos contatar via WhatsApp, email ou formulário de contato. Respondemos em até 24 horas. Clientes do plano Vitalício recebem suporte prioritário."
          />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-primary/20 mt-24 py-8 text-center text-muted-foreground text-sm">
        <p>© 2026 FUSION-SAJO. Astrologia Coreana Ancestral.</p>
      </footer>
    </div>
  );
}
