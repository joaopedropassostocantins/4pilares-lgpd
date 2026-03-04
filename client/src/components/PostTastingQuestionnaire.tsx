import { useState, useMemo } from "react";
import {
    QUESTIONNAIRES,
    MODULES,
    computeSignals,
    selectModules,
    getModuleHooks,
    type ModuleCode,
    type HookVariant,
} from "@/data/postTastingHooks";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const LIKERT_LABELS = ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"];

function LikertRow({
    questionKey,
    text,
    value,
    onChange,
    hasCVV,
}: {
    questionKey: string;
    text: string;
    value: number;
    onChange: (v: number) => void;
    hasCVV?: boolean;
}) {
    return (
        <div className="mb-5">
            <p className="text-sm text-foreground mb-2 leading-relaxed">
                {text}
                {hasCVV && (
                    <span className="ml-2 text-xs text-amber-400 font-semibold">
                        (Se necessário: CVV 188 — ligação gratuita 24h)
                    </span>
                )}
            </p>
            <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5].map((v) => (
                    <button
                        key={v}
                        type="button"
                        title={LIKERT_LABELS[v - 1]}
                        onClick={() => onChange(v)}
                        className={`
              w-10 h-10 rounded-full border-2 text-sm font-bold transition-all
              ${value === v
                                ? "border-gold bg-gold text-black scale-110 shadow-lg"
                                : "border-border/50 text-muted-foreground hover:border-gold/60 hover:text-gold"
                            }
            `}
                    >
                        {v}
                    </button>
                ))}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1">
                <span>Discordo</span>
                <span>Concordo</span>
            </div>
        </div>
    );
}

// ─── Hook Result Card ─────────────────────────────────────────────────────────

function HookResultCard({
    hook,
    moduleCode,
    onUnlock,
}: {
    hook: HookVariant;
    moduleCode: ModuleCode;
    onUnlock: () => void;
}) {
    const mod = MODULES[moduleCode];
    // Parse bold **text**
    const formatHook = (text: string) =>
        text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
            part.startsWith("**") ? (
                <strong key={i} className="text-gold">
                    {part.slice(2, -2)}
                </strong>
            ) : (
                part
            )
        );

    return (
        <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur p-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Module badge */}
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{mod.emoji}</span>
                <span className="text-xs font-bold tracking-widest uppercase text-gold/70">
                    {mod.name}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                {hook.title}
            </h3>

            {/* Hook text */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {formatHook(hook.hook)}
            </p>

            {/* CTA */}
            <button
                onClick={onUnlock}
                className="w-full py-4 rounded-full font-bold text-base bg-gradient-to-r from-gold to-amber-500 text-black shadow-lg hover:opacity-90 transition-all active:scale-95"
            >
                🔓 {hook.button}
            </button>

            {/* Disclaimer */}
            <p className="text-[11px] text-muted-foreground text-center mt-3 leading-relaxed">
                {hook.disclaimer}
            </p>

            {/* CVV Resource */}
            {hook.showCVV && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
                    <p className="text-xs text-amber-200">
                        🛡️ Se você está passando por momentos muito difíceis:{" "}
                        <a
                            href="tel:188"
                            className="font-bold underline hover:text-amber-100"
                        >
                            CVV 188
                        </a>{" "}
                        — ligação gratuita, 24 horas, confidencial.
                    </p>
                </div>
            )}
        </div>
    );
}

// ─── Variant Selector ─────────────────────────────────────────────────────────

const VARIANT_LABELS: Record<string, string> = {
    A: "🔥 Direto",
    B: "🧠 Racional",
    C: "💛 Emocional",
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface PostTastingQuestionnaireProps {
    consultantName?: string | null;
    onUnlock: () => void; // callback para rolar/abrir pagamento
}

export default function PostTastingQuestionnaire({
    consultantName,
    onUnlock,
}: PostTastingQuestionnaireProps) {
    const name = consultantName || "você";

    // All questions flat list — we show ALL modules' questions in one step
    // This creates a comprehensive signal
    const allQuestions = useMemo(() => {
        const modules: ModuleCode[] = ["A", "B", "C", "D", "E", "F"];
        return modules.flatMap((mod) =>
            QUESTIONNAIRES[mod].map((q) => ({ ...q, module: mod }))
        );
    }, []);

    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<"A" | "B" | "C">("A");
    const [isExpanded, setIsExpanded] = useState(false);

    // Compute result
    const result = useMemo(() => {
        if (!submitted) return null;
        const signals = computeSignals(answers);
        const { primary, secondary } = selectModules(signals);
        const hooks = getModuleHooks(primary);
        return { primary, secondary, signals, hooks };
    }, [submitted, answers]);

    const answeredCount = Object.keys(answers).length;
    const totalQuestions = allQuestions.length;
    const progress = Math.round((answeredCount / totalQuestions) * 100);
    const canSubmit = answeredCount >= Math.ceil(totalQuestions * 0.6); // ≥60% respondidas

    const handleSubmit = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setSubmitted(true);
            setIsExpanded(true);
            setTimeout(() => {
                const el = document.getElementById("post-tasting-result");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 200);
        }, 1600);
    };

    const currentHook = result?.hooks.find((h) => h.id === selectedVariant) || result?.hooks[0];

    return (
        <div className="bg-card/60 backdrop-blur border border-border/50 rounded-2xl overflow-hidden">
            {/* ── Header (always visible, acts as accordion trigger) ── */}
            <button
                type="button"
                onClick={() => setIsExpanded((v) => !v)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-purple/5 transition-colors"
            >
                <div>
                    <p className="text-gold/70 text-xs tracking-widest uppercase mb-1">Passo 2 de 2</p>
                    <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Qual área da vida de {name} pede atenção agora?
                    </h2>
                    {!submitted && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Responda e descubra qual módulo SAJO é certo para você
                        </p>
                    )}
                    {submitted && result && (
                        <p className="text-xs text-gold mt-1 font-semibold">
                            ✦ Módulo identificado: {MODULES[result.primary].name}
                        </p>
                    )}
                </div>
                <span className="text-muted-foreground text-xl">
                    {isExpanded ? "▲" : "▼"}
                </span>
            </button>

            {/* ── Body ── */}
            {isExpanded && (
                <div className="px-6 pb-6">
                    {!submitted ? (
                        <>
                            {/* Progress bar */}
                            <div className="mb-6">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>{answeredCount} de {totalQuestions} respondidas</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple to-gold transition-all duration-300 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Module sections */}
                            {(["A", "B", "C", "D", "E", "F"] as ModuleCode[]).map((mod) => (
                                <div key={mod} className="mb-8">
                                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/30">
                                        <span className="text-lg">{MODULES[mod].emoji}</span>
                                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                            {MODULES[mod].name}
                                        </span>
                                    </div>
                                    {QUESTIONNAIRES[mod].map((q) => (
                                        <LikertRow
                                            key={q.key}
                                            questionKey={q.key}
                                            text={q.text}
                                            value={answers[q.key] ?? 0}
                                            onChange={(v) =>
                                                setAnswers((prev) => ({ ...prev, [q.key]: v }))
                                            }
                                            hasCVV={(q as any).hasCVVNote}
                                        />
                                    ))}
                                </div>
                            ))}

                            {/* Submit */}
                            {isAnalyzing ? (
                                <div className="w-full py-4 rounded-full font-bold text-base bg-gradient-to-r from-purple to-purple-light text-white shadow-lg flex items-center justify-center gap-3">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analisando seus padrões...
                                </div>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!canSubmit}
                                    className="w-full py-4 rounded-full font-bold text-base bg-gradient-to-r from-purple to-purple-light text-white shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all active:scale-95"
                                >
                                    {canSubmit
                                        ? "✦ Revelar meu módulo ideal agora"
                                        : `Responda mais ${Math.ceil(totalQuestions * 0.6) - answeredCount} perguntas para continuar`}
                                </button>
                            )}
                        </>
                    ) : (
                        result && currentHook && (
                            <div id="post-tasting-result">
                                {/* Module info */}
                                <div className="mb-4 text-center">
                                    <p className="text-muted-foreground text-sm">
                                        Com base nas suas respostas, o módulo que mais se alinha ao seu momento é:
                                    </p>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <span className="text-3xl">{MODULES[result.primary].emoji}</span>
                                        <span
                                            className="text-xl font-bold shimmer-gold"
                                            style={{ fontFamily: "'Playfair Display', serif" }}
                                        >
                                            {MODULES[result.primary].name}
                                        </span>
                                    </div>
                                    {result.secondary && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Módulo secundário: {MODULES[result.secondary].emoji} {MODULES[result.secondary].name}
                                        </p>
                                    )}
                                </div>

                                {/* Variant selector */}
                                <div className="flex gap-2 mb-4 justify-center">
                                    {(["A", "B", "C"] as const).map((v) => (
                                        <button
                                            key={v}
                                            type="button"
                                            onClick={() => setSelectedVariant(v)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selectedVariant === v
                                                ? "border-gold bg-gold/20 text-gold"
                                                : "border-border/40 text-muted-foreground hover:border-gold/40"
                                                }`}
                                        >
                                            {VARIANT_LABELS[v]}
                                        </button>
                                    ))}
                                </div>

                                {/* Hook result card */}
                                <HookResultCard
                                    hook={currentHook}
                                    moduleCode={result.primary}
                                    onUnlock={onUnlock}
                                />

                                {/* Redo questionnaire */}
                                <button
                                    onClick={() => {
                                        setSubmitted(false);
                                        setAnswers({});
                                    }}
                                    className="w-full mt-4 text-xs text-muted-foreground underline hover:text-foreground transition-colors"
                                >
                                    Refazer questionário
                                </button>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
