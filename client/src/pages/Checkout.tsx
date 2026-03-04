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

                    {/* Instruções de pagamento */}
                    <div
                        className="rounded-xl p-5 mb-6 text-left"
                        style={{ background: `${mod.color}10`, border: `1px solid ${mod.color}40` }}
                    >
                        <p className="text-foreground font-medium mb-2 text-sm">
                            📋 Este módulo será desbloqueado após confirmação de pagamento.
                        </p>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Integração com <strong>PIX</strong> e <strong>Mercado Pago</strong> será realizada automaticamente após o seu pagamento ser aprovado.
                        </p>
                    </div>

                    {/* Formulário */}
                    <div className="mb-6 space-y-3">
                        <input
                            type="email"
                            placeholder="Seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border text-foreground placeholder-muted-foreground"
                        />
                        <input
                            type="text"
                            placeholder="Seu nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-background/50 border border-border text-foreground placeholder-muted-foreground"
                        />
                    </div>

                    {/* Preço + Botão */}
                    <div className="mb-4">
                        <p className="text-4xl font-bold mb-1" style={{ color: mod.color, fontFamily: "'Cinzel', serif" }}>
                            R$ 14,99
                        </p>
                        <p className="text-xs text-muted-foreground mb-5">Acesso único · Sem mensalidade</p>

                        <button
                            className="btn-module-checkout w-full text-white font-bold py-4 text-lg rounded-full disabled:opacity-50"
                            style={{ background: mod.color }}
                            onClick={handlePayment}
                            disabled={loading}
                        >
                            {loading ? "Processando..." : "💳 Pagar R$ 14,99"}
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
