import { useParams, Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

const MODULE_INFO: Record<string, {
    title: string;
    emoji: string;
    color: string;
    colorClass: string;
    description: string;
}> = {
    "oraculo-investimentos": {
        title: "Oráculo dos Investimentos",
        emoji: "💰",
        color: "#D06B5C",
        colorClass: "module-fire",
        description: "Desbloqueie os padrões financeiros que regem suas decisões — e veja onde o dinheiro realmente escoa.",
    },
    "conselheiro-judicial": {
        title: "Conselheiro Judicial",
        emoji: "⚖️",
        color: "#7FB7B2",
        colorClass: "module-wood",
        description: "Estratégia e timing correto para disputas, contratos e decisões jurídicas sensíveis.",
    },
    "navegador-conflitos": {
        title: "Navegador de Conflitos",
        emoji: "🌪️",
        color: "#C6A24A",
        colorClass: "module-earth",
        description: "Quebre ciclos de tensão e aprenda o plano exato para resolver conflitos de forma definitiva.",
    },
    "oraculo-amor": {
        title: "Oráculo do Amor",
        emoji: "❤️",
        color: "#4A90B8",
        colorClass: "module-water",
        description: "Identifique o padrão que se repete nos seus relacionamentos e rompa o ciclo de uma vez.",
    },
    "caminho-saida": {
        title: "Caminho de Saída",
        emoji: "🚪",
        color: "#A98DC0",
        colorClass: "module-fire-wood",
        description: "Encontre o portal exato de interrupção de padrões ancestrais que travam sua vida.",
    },
    "conexao-quem-partiu": {
        title: "Conexão com Quem Partiu",
        emoji: "🕊️",
        color: "#6EA8A3",
        colorClass: "module-earth-water",
        description: "Transforme a dor do luto em presença — feche o ciclo que ficou em aberto.",
    },
};

const DEFAULT_MODULE = {
    title: "Módulo",
    emoji: "✦",
    color: "#C9A84C",
    colorClass: "",
    description: "Libere seu acesso completo a este módulo e inicie sua análise personalizada.",
};

export default function CheckoutPage() {
    const params = useParams<{ module: string }>();
    const [, navigate] = useLocation();
    const slug = params?.module ?? "";
    const mod = MODULE_INFO[slug] ?? DEFAULT_MODULE;
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isWebview, setIsWebview] = useState(false);
    
    useEffect(() => {
      const ua = navigator.userAgent || "";
      const detected = ua.includes("FBAN") || ua.includes("FBAV") || ua.includes("Instagram") || ua.includes("TikTok") || ua.includes("BytedanceWebview") || (ua.includes("wv") && ua.includes("Android"));
      setIsWebview(detected);
    }, []);

    const createModulePayment = trpc.payment.createModulePayment.useMutation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [slug]);

    const handlePayment = async () => {
        if (!email || !name) {
            alert("Por favor, preencha email e nome");
            return;
        }

        setLoading(true);
        try {
            const result = await createModulePayment.mutateAsync({
                module: slug,
                userEmail: email,
                userName: name,
                returnUrl: window.location.origin + "/",
            });

            if (result.initPoint) {
                // Redirect to Mercado Pago checkout
                window.location.href = result.initPoint;
            } else {
                alert("Erro ao criar pagamento. Tente novamente.");
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Erro ao processar pagamento. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen bg-gradient-to-b from-background via-background to-primary/5 ${mod.colorClass}`}>
            <div className="checkout-container">
                {/* Voltar */}
                <div className="w-full max-w-xl mb-6 text-left px-2">
                    <Link href="/">
                        <span className="text-muted-foreground text-sm hover:text-foreground transition-colors cursor-pointer">
                            ← Voltar ao início
                        </span>
                    </Link>
                </div>

                <div className="checkout-card" style={{ borderColor: mod.color }}>
                    {/* Ícone do módulo */}
                    <div
                        className="text-6xl mb-4 bg-opacity-20 rounded-full w-24 h-24 flex items-center justify-center mx-auto"
                        style={{ background: `${mod.color}22` }}
                    >
                        {mod.emoji}
                    </div>

                    {/* Badge */}
                    <div
                        className="module-badge mx-auto mb-4"
                        style={{
                            color: mod.color,
                            borderColor: mod.color,
                            background: `${mod.color}18`,
                        }}
                    >
                        ✦ Acesso por análise
                    </div>

                    {/* Título */}
                    <h1
                        className="text-2xl font-bold mb-3"
                        style={{ fontFamily: "'Cinzel', serif", color: mod.color }}
                    >
                        Pagamento do módulo
                    </h1>
                    <p className="text-xl font-bold text-foreground mb-2">{mod.title}</p>
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                        {mod.description}
                    </p>

                    {isWebview && (
                      <div className="w-full max-w-xl mb-4 px-2 rounded-xl p-4 text-center" style={{ background: "rgba(255,165,0,0.12)", border: "1px solid rgba(255,165,0,0.5)" }}>
                        <p className="text-sm font-bold mb-1" style={{ color: "#ffa500" }}>⚠️ Para garantir sua compra, abra no Chrome ou Safari</p>
                        <p className="text-xs text-muted-foreground mb-3">Navegadores internos de apps (TikTok, Instagram) podem bloquear o pagamento.</p>
                        <button onClick={() => window.open(window.location.href, "_blank")} className="text-xs font-bold px-4 py-2 rounded-full" style={{ background: "rgba(255,165,0,0.2)", color: "#ffa500", border: "1px solid #ffa500" }}>Abrir no navegador →</button>
                      </div>
                    )}

                    {/* O QUE ESTÁ INCLUÍDO */}
                    <div className="rounded-xl p-5 mb-6 text-left" style={{ background: `${mod.color}10`, border: `1px solid ${mod.color}40` }}>
                      <p className="font-bold text-sm mb-3" style={{ color: mod.color }}>✦ O que você recebe:</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex gap-2"><span style={{ color: mod.color }} className="flex-shrink-0">✓</span>Análise completa e personalizada deste módulo</li>
                        <li className="flex gap-2"><span style={{ color: mod.color }} className="flex-shrink-0">✓</span>1 videochamada por semana durante 90 dias</li>
                        <li className="flex gap-2"><span style={{ color: mod.color }} className="flex-shrink-0">✓</span>Acompanhamento ao vivo com o Xamã</li>
                        <li className="flex gap-2"><span style={{ color: mod.color }} className="flex-shrink-0">✓</span>Garantia total de devolução - sem perguntas</li>
                      </ul>
                    </div>

                    {/* Formulário */}
                    <div className="mb-6 space-y-3">
                        <input
                            type="email"
                            placeholder="Seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ fontSize: "16px", minHeight: "52px" }}
                            className="w-full px-4 py-4 rounded-xl bg-background/50 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60"
                        />
                        <input
                            type="text"
                            placeholder="Seu nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ fontSize: "16px", minHeight: "52px" }}
                            className="w-full px-4 py-4 rounded-xl bg-background/50 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60"
                        />
                    </div>

                    {/* Preço + Botão */}
                    <div className="mb-4">
                        <p className="text-4xl font-bold mb-1" style={{ color: mod.color, fontFamily: "'Cinzel', serif" }}>
                            R$ 299
                        </p>
                        <p className="text-xs text-muted-foreground mb-5">Pagamento único · Cartão de crédito via Mercado Pago</p>
                        <Link href="/garantia"><span className="text-xs text-gold underline cursor-pointer hover:text-gold/80 mb-3 inline-block">🛡️ Garantia total de devolução</span></Link>

                        <button
                            className="btn-module-checkout w-full text-white font-bold py-4 text-lg rounded-full disabled:opacity-50"
                            style={{ background: mod.color }}
                            onClick={handlePayment}
                            disabled={loading}
                        >
                            {loading ? "Processando..." : "💳 Pagar R$ 299"}
                        </button>
                    </div>

                    {/* Garantia */}
                    <p className="text-xs text-muted-foreground/60 mt-4">
                        🔒 Pagamento seguro · Acesso imediato após aprovação
                    </p>
                </div>
            </div>
        </div>
    );
}
