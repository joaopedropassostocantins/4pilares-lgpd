import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { trackDiagnosticCreated, trackPageView } from "@/lib/tracking";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ModuleCard from "@/components/ModuleCard";
import { modules } from "@/data/modules";
import { selectHook, calcFaixa } from "@/data/hooks";
import ZodiacGrid from "@/components/ZodiacGrid";
import {
  Loader2,
  Search,
  Sparkles,
  Star,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Lock,
  Shield,
  Clock,
  Eye,
} from "lucide-react";
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

// ─── WhatsApp validation ───────────────────────────────────────────────────
function validateWhatsApp(phone: string): boolean {
  if (!phone) return true;
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10;
}

// ─── Countdown Hook ───────────────────────────────────────────────────
function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const STORAGE_KEY = "fusion_sajo_countdown_end";
    let endTime = localStorage.getItem(STORAGE_KEY);

    if (!endTime || Number(endTime) < Date.now()) {
      const newEnd = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, String(newEnd));
      endTime = String(newEnd);
    }

    const tick = () => {
      const diff = Math.max(0, Number(endTime) - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ hours: h, minutes: m, seconds: s });

      if (diff <= 0) {
        const newEnd = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, String(newEnd));
        endTime = String(newEnd);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

// ─── FAQ Item ───────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-lg overflow-hidden transition-all hover:border-gold/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-purple/10 transition-colors"
      >
        <span className="font-semibold text-foreground">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gold flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-border/30 bg-card/40">
          <p className="text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

// ─── Archetypes ──────────────────────────────────────────────────────
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

// ─── Testimonials (suavizados, sem valores forçados) ─────────────────
const TESTIMONIALS = [
  {
    initials: "MS",
    name: "Marina S.",
    city: "São Paulo, SP",
    timeAgo: "há 3 dias",
    text: "Meus relacionamentos sempre terminavam do mesmo jeito. Depois que vi o padrão, consegui sair do ciclo. Não acreditei quando li — parecia que alguém tinha escrito sobre a minha vida.",
    rating: 5,
    color: "bg-purple",
  },
  {
    initials: "CM",
    name: "Carlos M.",
    city: "Rio de Janeiro, RJ",
    timeAgo: "há 5 dias",
    text: "Descobri que meu problema com dinheiro não é acaso — tem padrão. Já evitei duas decisões erradas que iam me custar caro. Quem me dera ter visto isso antes.",
    rating: 5,
    color: "bg-purple-light",
  },
  {
    initials: "JC",
    name: "Juliana C.",
    city: "Belo Horizonte, MG",
    timeAgo: "há 1 semana",
    text: "Finalmente entendi por que sempre caio na mesma armadilha. Achava que era azar, mas tem uma lógica por trás. Agora sei o que observar antes de decidir.",
    rating: 5,
    color: "bg-gold-dark",
  },
  {
    initials: "AP",
    name: "Ana P.",
    city: "Curitiba, PR",
    timeAgo: "há 2 semanas",
    text: "Meu cansaço crônico não era só falta de sono — era um padrão de como eu lidava com pressão. Mudei a forma de encarar e melhorou. A análise foi certeira.",
    rating: 5,
    color: "bg-purple",
  },
  {
    initials: "RS",
    name: "Roberto S.",
    city: "Salvador, BA",
    timeAgo: "há 4 dias",
    text: "Paguei pouco e evitei uma decisão que ia me custar muito mais. Se eu soubesse disso antes, teria economizado anos de frustração.",
    rating: 5,
    color: "bg-gold-dark",
  },
];

// ─── How It Works ────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Informe sua data",
    desc: "Seu nascimento carrega padrões que se repetem. Precisamos só dos dados certos para mapear.",
  },
  {
    step: "02",
    title: "Análise em 30 segundos",
    desc: "O sistema cruza seus dados com padrões ancestrais coreanos. Sem enrolação, sem mistério.",
  },
  {
    step: "03",
    title: "Veja o que está escondido",
    desc: "Receba os padrões que explicam por que você repete os mesmos erros — em dinheiro, amor e carreira.",
  },
];

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function Home() {
  const [, navigate] = useLocation();
  const formRef = useRef<HTMLDivElement>(null);
  const countdown = useCountdown();

  // ─── Form State ─────────────────────────────────────────────────────
  const [formStep, setFormStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [hasDst, setHasDst] = useState(false);
  const [cepQuery, setCepQuery] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [selectedArchetype, setSelectedArchetype] = useState<string>("");
  const [headlineVariant] = useState<"a" | "b">(() =>
    Math.random() > 0.5 ? "a" : "b"
  );

  // ─── Hook Engine State ──────────────────────────────────────────────
  const [hookText, setHookText] = useState<string | null>(null);
  const [hookDisclaimer, setHookDisclaimer] = useState<string[]>([]);

  // ─── Validation ─────────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track page view
  useEffect(() => {
    trackPageView("Home", headlineVariant === "a" ? "A" : "B");
  }, [headlineVariant]);

  // ─── Auto-scroll ao formulário via ?scroll=form ──────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("scroll") === "form" && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    }
  }, []);

  const createDiagnostic = trpc.diagnostic.create.useMutation({
    onSuccess: (data) => {
      toast.success("Análise pronta. Veja os padrões do seu momento atual.", {
        description: "Desbloqueie a análise completa.",
      });
      trackDiagnosticCreated({
        publicId: data.publicId,
        abTestVariant: headlineVariant === "a" ? "A" : "B",
        archetype: selectedArchetype,
      });
      setTimeout(() => {
        navigate(`/resultado/${data.publicId}`);
      }, 500);
    },
    onError: (err) => {
      console.error("Diagnostic creation error:", err);
      toast.error("Erro ao criar análise", {
        description: err.message || "Tente novamente em alguns momentos",
      });
      setIsSubmitting(false);
    },
  });

  // ─── CEP Lookup ─────────────────────────────────────────────────────
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

  // ─── Step 1 Validation (Hero) ───────────────────────────────────────
  const handleStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!birthDate) {
      newErrors.birthDate = "Data de nascimento é obrigatória";
    } else {
      const selectedDate = new Date(birthDate);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.birthDate = "A data não pode ser no futuro";
      } else {
        const age =
          today.getFullYear() -
          selectedDate.getFullYear() -
          (today.getMonth() < selectedDate.getMonth() ||
            (today.getMonth() === selectedDate.getMonth() &&
              today.getDate() < selectedDate.getDate())
            ? 1
            : 0);
        if (age < 16) {
          newErrors.birthDate = "Este conteúdo é para maiores de 16 anos.";
        }
        if (age > 120) {
          newErrors.birthDate = "Data de nascimento inválida";
        }
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    // Execute hook engine after step 1
    const selectedDate = new Date(birthDate);
    const today = new Date();
    const age =
      today.getFullYear() -
      selectedDate.getFullYear() -
      (today.getMonth() < selectedDate.getMonth() ||
        (today.getMonth() === selectedDate.getMonth() &&
          today.getDate() < selectedDate.getDate())
        ? 1
        : 0);
    const sexoStr = gender === "male" ? "M" : gender === "female" ? "F" : "";
    const hookResult = selectHook(age, sexoStr);
    if (hookResult) {
      setHookText(hookResult.text);
      setHookDisclaimer(hookResult.disclaimers);
    } else {
      setHookText(
        "Há padrões no seu momento atual que valem atenção. Quer ver o que aparece?"
      );
      setHookDisclaimer([]);
    }

    setFormStep(2);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // ─── Step 2 Validation ──────────────────────────────────────────────
  const handleStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    if (whatsapp && !validateWhatsApp(whatsapp)) {
      newErrors.whatsapp = "WhatsApp inválido. Use formato: +55 11 99999-9999";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setFormStep(3);
  };

  // ─── Final Submit ───────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || createDiagnostic.isPending) return;
    setIsSubmitting(true);
    createDiagnostic.mutate({
      consultantName: name,
      email: email || undefined,
      whatsappPhone: whatsapp || undefined,
      birthDate,
      birthTime: birthTime || undefined,
      birthPlace: birthPlace || undefined,
      hasDst,
      gender: (gender || undefined) as "male" | "female" | "other" | undefined,
      archetype: selectedArchetype || undefined,
      abTestVariant: headlineVariant === "a" ? "A" : "B",
    });
  };

  // ─── Pad numbers ────────────────────────────────────────────────────
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════ STICKY URGENCY BANNER ═══════ */}
      <div className="sticky-banner flex items-center justify-center gap-3 flex-wrap">
        <span>Análise disponível hoje</span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span className="countdown-digit">{pad(countdown.hours)}</span>:
          <span className="countdown-digit">{pad(countdown.minutes)}</span>:
          <span className="countdown-digit">{pad(countdown.seconds)}</span>
        </span>
        <button
          onClick={() =>
            formRef.current?.scrollIntoView({ behavior: "smooth" })
          }
          className="underline text-gold text-xs font-bold"
        >
          Garantir Agora
        </button>
      </div>

      {/* ═══════ HEADER ═══════ */}
      <header className="bg-background/80 backdrop-blur border-b border-border/30 sticky top-[36px] z-40">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-gold" />
            <span className="text-xl font-bold shimmer-gold" style={{ fontFamily: "'Playfair Display', serif" }}>
              FUSION-SAJO
            </span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#como-funciona" className="text-muted-foreground hover:text-gold transition-colors">
              Como Funciona
            </a>
            <a href="#depoimentos" className="text-muted-foreground hover:text-gold transition-colors">
              Depoimentos
            </a>
            <a href="#formulario" className="text-muted-foreground hover:text-gold transition-colors">
              Começar
            </a>
          </nav>
        </div>
      </header>

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative overflow-hidden">
        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="particle absolute top-[10%] left-[15%] w-1 h-1 rounded-full bg-gold/40" />
          <div className="particle absolute top-[20%] right-[20%] w-1.5 h-1.5 rounded-full bg-purple-light/30" />
          <div className="particle absolute top-[40%] left-[60%] w-1 h-1 rounded-full bg-gold/30" />
          <div className="particle absolute top-[60%] left-[30%] w-1.5 h-1.5 rounded-full bg-purple/40" />
          <div className="particle absolute top-[80%] right-[40%] w-1 h-1 rounded-full bg-gold/20" />
        </div>

        <div className="max-w-3xl mx-auto px-5 py-16 md:py-24 text-center relative z-10">
          <p className="text-gold/70 text-sm tracking-[0.3em] uppercase mb-6">
            Astrologia Ancestral Coreana
          </p>

          {headlineVariant === "a" ? (
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="shimmer-gold">Você repete os mesmos erros</span>
              <br />
              <span className="text-foreground">e ainda não sabe por quê.</span>
            </h1>
          ) : (
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="shimmer-gold">Aquela sensação de 'não vou dar conta'</span>
              <br />
              <span className="text-foreground">tem um padrão. Quer ver?</span>
            </h1>
          )}

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Aquela escolha que você fez há algum tempo e ainda pesa. O dinheiro que some sem explicação.
            O relacionamento que sempre termina do mesmo jeito. Tem um padrão por trás — e ele aparece
            nos seus dados de nascimento. Em 30 segundos, você vai ver.
          </p>

          {/* ─── STEP 1: Birth Date Only ─── */}
          {formStep === 1 && (
            <div className="max-w-md mx-auto">
              <div className="bg-card/60 backdrop-blur border border-border/50 rounded-2xl p-6 md:p-8">
                <Label className="text-gold text-sm font-bold tracking-wide uppercase block mb-3">
                  Sua Data de Nascimento
                </Label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value);
                    if (errors.birthDate) setErrors({});
                  }}
                  className={`mb-4 text-center text-lg ${errors.birthDate ? "!border-red-500" : ""}`}
                />
                {errors.birthDate && (
                  <div className="flex items-center gap-2 mb-4 text-red-400 text-sm justify-center">
                    <AlertCircle className="h-4 w-4" />
                    {errors.birthDate}
                  </div>
                )}
                <button
                  onClick={handleStep1}
                  className="btn-gold btn-gold-pulse w-full"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Eye className="h-5 w-5" />
                    Revelar Meu Padrão Agora
                  </span>
                </button>
              </div>

              {/* Social Proof */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-gold" />
                  +12.400 análises
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-gold fill-gold" />
                  4.9/5
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-gold" />
                  Dados protegidos
                </span>
              </div>
            </div>
          )}

          {/* ─── Hook Display (after step 1) ─── */}
          {formStep >= 2 && hookText && (
            <div className="max-w-2xl mx-auto mb-8 bg-card/60 backdrop-blur border border-gold/20 rounded-2xl p-6">
              <p className="text-foreground text-base md:text-lg leading-relaxed italic" id="gancho-display">
                "{hookText}"
              </p>
              {hookDisclaimer.length > 0 && (
                <p className="text-xs text-muted-foreground mt-3" id="gancho-disclaimer">
                  {hookDisclaimer.join(" ")}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ═══════ PROGRESS BAR (visible after step 1) ═══════ */}
      {formStep >= 2 && (
        <div className="max-w-md mx-auto px-5 mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step < formStep
                    ? "progress-step completed"
                    : step === formStep
                      ? "progress-step active"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {step < formStep ? "✓" : step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-0.5 ${step < formStep ? "bg-purple" : "bg-muted"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            Passo {formStep} de 3
          </p>
        </div>
      )}

      {/* ═══════ PIX PAYMENT INFO BANNER ═══════ */}
      {formStep >= 2 && (
        <div className="max-w-2xl mx-auto px-5 mb-8">
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <h4 className="font-bold text-amber-100">⏱️ Pagamento PIX — Confirmação em 5 minutos</h4>
                <p className="text-sm text-amber-50/80">
                  Após enviar o PIX, sua análise será liberada automaticamente em até 5 minutos. Se não receber neste período:
                </p>
                <ol className="text-sm text-amber-50/80 list-decimal list-inside space-y-1 ml-2">
                  <li><strong>Envie seu comprovante via WhatsApp</strong> para liberação imediata</li>
                  <li><strong>Verifique seu email</strong> (spam/promoções) para a análise completa</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ MULTI-STEP FORM (Steps 2 & 3) ═══════ */}
      {formStep >= 2 && (
        <section id="formulario" ref={formRef} className="max-w-lg mx-auto px-5 pb-16">
          <div className="bg-card/60 backdrop-blur border border-border/50 rounded-2xl p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {/* ─── STEP 2: Name + Email + WhatsApp ─── */}
              {formStep === 2 && (
                <div className="space-y-5">
                  <h3
                    className="text-xl font-bold text-center shimmer-gold mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Quase lá — quem é você?
                  </h3>
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    Sem spam. Seus dados são usados apenas para a análise.
                  </p>

                  <div>
                    <Label className="text-gold text-sm">Seu Nome *</Label>
                    <Input
                      type="text"
                      placeholder="Ex: Marina Silva"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      className={`mt-1 ${errors.name ? "!border-red-500" : ""}`}
                      required
                    />
                    {errors.name && (
                      <div className="flex items-center gap-2 mt-1 text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-gold text-sm">Email (opcional)</Label>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-gold text-sm flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp (opcional)
                    </Label>
                    <Input
                      type="tel"
                      placeholder="+55 11 99999-9999"
                      value={whatsapp}
                      onChange={(e) => {
                        setWhatsapp(e.target.value);
                        if (errors.whatsapp) setErrors({ ...errors, whatsapp: "" });
                      }}
                      className={`mt-1 ${errors.whatsapp ? "!border-red-500" : ""}`}
                    />
                    {errors.whatsapp && (
                      <div className="flex items-center gap-2 mt-1 text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.whatsapp}
                      </div>
                    )}
                    {whatsapp && !errors.whatsapp && validateWhatsApp(whatsapp) && (
                      <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Você receberá a análise por WhatsApp
                      </p>
                    )}
                  </div>

                  <button type="button" onClick={handleStep2} className="btn-gold w-full">
                    Continuar →
                  </button>
                </div>
              )}

              {/* ─── STEP 3: Advanced + Submit ─── */}
              {formStep === 3 && (
                <div className="space-y-5">
                  <h3
                    className="text-xl font-bold text-center shimmer-gold mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Dados opcionais (mais precisão)
                  </h3>
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    Quanto mais dados, mais precisa a análise. Mas pode pular.
                  </p>

                  {/* Birth Time */}
                  <div>
                    <Label className="text-gold text-sm">Hora de Nascimento</Label>
                    <Input
                      type="time"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* CEP Lookup */}
                  <div>
                    <Label className="text-gold text-sm">Cidade de Nascimento</Label>
                    <div className="mt-1 flex gap-2">
                      <Input
                        type="text"
                        placeholder="Digite seu CEP"
                        value={cepQuery}
                        onChange={(e) => setCepQuery(e.target.value)}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleCepLookup}
                        disabled={cepLoading}
                        className="px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:border-gold/50 transition-colors"
                      >
                        {cepLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {birthPlace && (
                      <p className="text-xs text-gold/60 mt-1">📍 {birthPlace}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <Label className="text-gold text-sm">Gênero</Label>
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
                            onChange={(e) => setGender(e.target.value as "male" | "female" | "other")}
                            className="w-4 h-4 accent-[#C9A84C]"
                          />
                          <span className="text-sm text-muted-foreground">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Archetype */}
                  <div>
                    <Label className="text-gold text-sm">Qual tipo de pessoa você é?</Label>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-2">
                      {ARCHETYPES.map((arch) => (
                        <button
                          key={arch.id}
                          type="button"
                          onClick={() =>
                            setSelectedArchetype(
                              selectedArchetype === arch.id ? "" : arch.id
                            )
                          }
                          className={`archetype-card p-2.5 rounded-lg text-xs font-medium ${selectedArchetype === arch.id ? "selected" : ""
                            }`}
                          title={arch.desc}
                        >
                          {arch.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* DST */}
                  <div className="flex items-center justify-between py-2">
                    <Label className="text-gold text-sm">Horário de Verão</Label>
                    <Switch checked={hasDst} onCheckedChange={setHasDst} />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={createDiagnostic.isPending || isSubmitting}
                    className="btn-gold btn-gold-pulse w-full disabled:opacity-50"
                  >
                    {createDiagnostic.isPending || isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Ver Meu Padrão Agora
                      </span>
                    )}
                  </button>

                  {/* Skip optional */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitting(true);
                      createDiagnostic.mutate({
                        consultantName: name,
                        email: email || undefined,
                        whatsappPhone: whatsapp || undefined,
                        birthDate,
                        abTestVariant: headlineVariant === "a" ? "A" : "B",
                      });
                    }}
                    disabled={createDiagnostic.isPending || isSubmitting}
                    className="w-full text-center text-sm text-muted-foreground underline hover:text-gold transition-colors"
                  >
                    Pular e ver resultado agora
                  </button>
                </div>
              )}
            </form>
          </div>
        </section>
      )}

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="como-funciona" className="max-w-6xl mx-auto px-5 py-16">
        <div className="ornamental-divider mb-12">
          <h2
            className="text-3xl font-bold shimmer-gold whitespace-nowrap"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Como Funciona
          </h2>
        </div>
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          3 passos. Sem enrolação. Resultado em 30 segundos.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.step}
              className="module-card text-center"
            >
              <div className="text-5xl font-bold text-gold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ PREVIEW DA ANÁLISE (BLUR) ═══════ */}
      <section className="max-w-3xl mx-auto px-5 py-16">
        <div className="ornamental-divider mb-12">
          <h2
            className="text-3xl font-bold shimmer-gold whitespace-nowrap"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Veja Como É Uma Análise
          </h2>
        </div>

        <div className="relative bg-card/60 border border-border/50 rounded-2xl p-6 md:p-8 overflow-hidden">
          {/* Blurred preview content */}
          <div className="blur-preview space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple flex items-center justify-center text-white font-bold text-sm">
                MS
              </div>
              <div>
                <p className="font-bold text-foreground">Marina Silva</p>
                <p className="text-xs text-muted-foreground">15/03/1988 · São Paulo, SP</p>
              </div>
            </div>
            <h4 className="text-lg font-bold text-gold">Pilar do Dia: Água Yang (壬)</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Seu elemento principal é Água Yang — profunda, adaptável, mas com tendência a acumular
              tensões emocionais sem perceber. O padrão que mais se repete na sua vida é o ciclo de
              confiança-traição: você entrega tudo a alguém e depois descobre que essa pessoa não
              merecia. Isso não é azar — é uma configuração do seu Pilar do Dia que atrai esse tipo
              de dinâmica. O Elemento de Riqueza está em conflito com o Oficial Severo, o que explica
              por que seu dinheiro parece ter um "ralo invisível". Nos próximos 3 meses, o ciclo
              Se-Un ativa seu elemento de poder — é a janela para romper esse padrão.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-gold font-bold">Elemento Dominante</p>
                <p className="text-sm text-foreground">Água Yang (壬)</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-xs text-gold font-bold">Ciclo Atual</p>
                <p className="text-sm text-foreground">Expansão (Se-Un 2026)</p>
              </div>
            </div>
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background/90 flex flex-col items-center justify-end pb-8">
            <Lock className="h-8 w-8 text-gold mb-3" />
            <p className="text-foreground font-bold text-lg mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Sua análise está pronta para ser revelada
            </p>
            <button
              onClick={() => {
                if (formStep === 1) {
                  document.querySelector<HTMLInputElement>('input[type="date"]')?.focus();
                } else {
                  formRef.current?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="btn-gold"
            >
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Desbloquear Minha Análise
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section id="depoimentos" className="max-w-6xl mx-auto px-5 py-16">
        <div className="ornamental-divider mb-12">
          <h2
            className="text-3xl font-bold shimmer-gold whitespace-nowrap"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Quem Já Viu o Padrão
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="module-card"
            >
              <div className="star-rating mb-3 text-sm">
                {"★".repeat(t.rating)}
              </div>
              <p className="text-muted-foreground mb-4 italic leading-relaxed text-sm">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.city} · {t.timeAgo}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ SECOND CTA (for those who scrolled) ═══════ */}
      {formStep === 1 && (
        <section className="max-w-xl mx-auto px-5 py-16 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="shimmer-gold">O padrão está lá.</span>{" "}
            <span className="text-foreground">Você só precisa ver.</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Se você chegou até aqui, é porque algo ressoou. Aquela sensação de "isso parece comigo"
            não é coincidência. Nos próximos 3 dias, uma janela se abre. Não deixe passar.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="btn-gold btn-gold-pulse"
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5" />
              Revelar Meu Padrão Agora
            </span>
          </button>
        </section>
      )}

      {/* ═══════ FAQ ═══════ */}
      <section id="faq" className="max-w-3xl mx-auto px-5 py-16">
        <div className="ornamental-divider mb-12">
          <h2
            className="text-3xl font-bold shimmer-gold whitespace-nowrap"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Perguntas Frequentes
          </h2>
        </div>
        <div className="space-y-3">
          <FAQItem
            question="O que é SAJO?"
            answer="SAJO é um sistema ancestral coreano que mapeia padrões recorrentes na sua vida a partir dos dados de nascimento. Não é diagnóstico nem previsão — é um guia para entender tendências e tomar decisões mais conscientes."
          />
          <FAQItem
            question="Como funciona a análise dos 4 Pilares?"
            answer="Cada pilar representa uma dimensão. O Ano mostra padrões de longo prazo, o Mês sua natureza emocional, o Dia suas características principais, e a Hora fatores de timing. Juntos, formam um mapa de padrões pessoais."
          />
          <FAQItem
            question="Preciso saber a hora exata do meu nascimento?"
            answer="A hora aumenta a precisão, mas não é obrigatória. Mesmo sem ela, a análise dos outros 3 pilares já entrega insights que a maioria das pessoas reconhece como certeiros."
          />
          <FAQItem
            question="A análise é confiável?"
            answer="Nenhuma análise é infalível. Baseamos em padrões observados, não em certezas. Se você não reconhecer nenhum dos padrões identificados, reembolso total em 7 dias."
          />
          <FAQItem
            question="Meus dados são seguros?"
            answer="Sim. Usamos criptografia SSL e não compartilhamos seus dados com terceiros. Sua privacidade é prioridade."
          />
          <FAQItem
            question="Como recebo minha análise após o pagamento?"
            answer="Após confirmar o pagamento, você é redirecionado para a análise completa. Se forneceu email ou WhatsApp, recebe também por lá em até 5 minutos."
          />
        </div>
      </section>

      {/* ═══════ MODULES ═══════ */}
      <section id="modulos" className="max-w-6xl mx-auto px-5 py-16">
        <div className="ornamental-divider mb-12">
          <h2
            className="text-3xl font-bold shimmer-gold whitespace-nowrap"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Módulos Especializados
          </h2>
        </div>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Escolha o módulo que mais ressoa com o que você está vivendo agora — e inicie sua análise personalizada.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      {/* ═══════ SIGNOS COREANOS ═══════ */}
      <ZodiacGrid />

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-border/30 mt-16 py-8 text-center text-muted-foreground text-sm">
        <p>© 2026 FUSION-SAJO. Astrologia Ancestral Coreana.</p>
        <p className="text-xs mt-2 text-muted-foreground/60">
          Este serviço oferece perspectiva simbólica e filosófica. Não substitui aconselhamento profissional.
        </p>
      </footer>
    </div>
  );
}
