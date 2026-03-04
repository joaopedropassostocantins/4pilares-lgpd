// ============================================================================
// POST-TASTING HOOK SYSTEM — FUSION SAJO
// Ganchos pós-degustação + engine de scoring por módulo
// ============================================================================

export type ModuleCode = "A" | "B" | "C" | "D" | "E" | "F";

export interface ModuleInfo {
    code: ModuleCode;
    name: string;
    emoji: string;
    price: string;
    urlSlug: string;
}

export const MODULES: Record<ModuleCode, ModuleInfo> = {
    A: { code: "A", name: "Oráculo dos Investimentos", emoji: "💰", price: "9,99", urlSlug: "/modulo-a" },
    B: { code: "B", name: "Conselheiro Judicial", emoji: "⚖️", price: "9,99", urlSlug: "/modulo-b" },
    C: { code: "C", name: "Navegador de Conflitos", emoji: "🌪️", price: "9,99", urlSlug: "/modulo-c" },
    D: { code: "D", name: "Oráculo do Amor", emoji: "❤️", price: "9,99", urlSlug: "/modulo-d" },
    E: { code: "E", name: "Caminho de Saída", emoji: "🚪", price: "9,99", urlSlug: "/modulo-e" },
    F: { code: "F", name: "Conexão com Quem Partiu", emoji: "🕊️", price: "9,99", urlSlug: "/modulo-f" },
};

// ─── Sinais/Scores (0–100 em relevância) ────────────────────────────────────
export interface Signals {
    finance_pressure: number; // → A
    legal_dispute: number; // → B
    conflict_tension: number; // → C
    love_cycle: number; // → D
    crisis_addiction: number; // → E
    ancestral_pattern: number; // → E (secundário)
    grief_loss: number; // → F
}

// Mapeia sinal → módulo principal
const SIGNAL_MODULE_MAP: Record<keyof Signals, ModuleCode> = {
    finance_pressure: "A",
    legal_dispute: "B",
    conflict_tension: "C",
    love_cycle: "D",
    crisis_addiction: "E",
    ancestral_pattern: "E",
    grief_loss: "F",
};

// ─── HookVariant ─────────────────────────────────────────────────────────────
export interface HookVariant {
    id: "A" | "B" | "C";
    label: "pesado" | "racional" | "emocional";
    title: string;
    hook: string;
    button: string;
    disclaimer: string;
    showCVV?: boolean;  // true para módulos E e F com crise
}

export interface ModuleHook {
    moduleCode: ModuleCode;
    variants: HookVariant[];
}

// ─── 12 Ganchos prontos (3 variantes × 4 famílias temáticas) ─────────────────

const HOOKS: Record<ModuleCode, HookVariant[]> = {

    // ── MÓDULO A — Oráculo dos Investimentos ────────────────────────────────
    A: [
        {
            id: "A", label: "pesado",
            title: "Bloqueio financeiro detectado",
            hook: "Seus Pilares apontaram um padrão de travamento nas decisões com dinheiro. Se esse ciclo continuar como está, a tendência é você repetir o mesmo erro no próximo passo importante. Desbloqueie o **Oráculo dos Investimentos** por **R$ 9,99** para ver o mapa completo e as regras 'se/então' do seu padrão financeiro.",
            button: "Desbloquear R$ 9,99",
            disclaimer: "Leitura simbólica e filosófica — não substitui aconselhamento financeiro profissional.",
        },
        {
            id: "B", label: "racional",
            title: "Seu padrão com dinheiro tem uma lógica",
            hook: "A análise SAJO identificou um padrão recorrente nas suas decisões financeiras. Quem não conhece o padrão tende a repeti-lo — e o custo sobe a cada ciclo. O **Oráculo dos Investimentos** por **R$ 9,99** revela o timing certo e os gatilhos do seu comportamento com dinheiro.",
            button: "Ver meu padrão",
            disclaimer: "Leitura simbólica e filosófica — não substitui aconselhamento financeiro profissional.",
        },
        {
            id: "C", label: "emocional",
            title: "Por que o dinheiro some?",
            hook: "Não é má sorte. Os seus Pilares mostram uma raiz emocional por trás das suas decisões financeiras — e ela se repete em ciclos previsíveis. O **Oráculo dos Investimentos** por **R$ 9,99** entrega o plano para quebrar esse ciclo.",
            button: "Entender meu padrão",
            disclaimer: "Leitura simbólica e filosófica — não substitui aconselhamento financeiro profissional.",
        },
    ],

    // ── MÓDULO B — Conselheiro Judicial ─────────────────────────────────────
    B: [
        {
            id: "A", label: "pesado",
            title: "Tensão com autoridade detectada",
            hook: "A leitura SAJO identificou tensão em área de contratos ou disputas: quando você avança sem o timing certo, o custo sobe em tempo e dinheiro. Se errar agora, a decisão vira arrependimento caro. Desbloqueie o **Conselheiro Judicial** por **R$ 9,99** para ver o caminho certo e quando agir.",
            button: "Desbloquear R$ 9,99",
            disclaimer: "Leitura simbólica e filosófica — não substitui aconselhamento jurídico profissional.",
        },
        {
            id: "B", label: "racional",
            title: "Seu padrão em disputa tem um ciclo",
            hook: "Seu mapa indicou um padrão claro: ou você briga tarde demais, ou negocia cedo demais. Se repetir isso, a decisão vira arrependimento. O **Conselheiro Judicial** por **R$ 9,99** revela o timing e a estratégia certa para sua situação.",
            button: "Ver estratégia certa",
            disclaimer: "Leitura simbólica e filosófica — não substitui aconselhamento jurídico profissional.",
        },
        {
            id: "C", label: "emocional",
            title: "Alguém quebrou sua confiança",
            hook: "Quando confiamos e somos traídos, a dor fica — mas o padrão também se repete. A análise indicou que há um ponto de conflito que pode escalar se você insistir em força sem estratégia. O **Conselheiro Judicial** por **R$ 9,99** mostra qual é o caminho com clareza.",
            button: "Quero clareza agora",
            disclaimer: "Leitura simbólica e filosófica — não substitui aconselhamento jurídico profissional.",
        },
    ],

    // ── MÓDULO C — Navegador de Conflitos ───────────────────────────────────
    C: [
        {
            id: "A", label: "pesado",
            title: "Colisão de padrão detectada",
            hook: "Seu SAJO apontou colisão de padrão: você fala, a tensão volta do mesmo jeito. Se continuar, isso vira desgaste crônico e distância permanente. Desbloqueie o **Navegador de Conflitos** por **R$ 9,99** para ver a estratégia e o timing certo para quebrar esse ciclo.",
            button: "Desbloquear R$ 9,99",
            disclaimer: "Leitura simbólica e filosófica — não substitui acompanhamento psicológico profissional.",
        },
        {
            id: "B", label: "racional",
            title: "O conflito tem uma lógica — você pode aprendê-la",
            hook: "A leitura sugeriu um 'obstáculo' que não se resolve com força: precisa de estratégia e timing. Se insistir no método errado, a relação só endurece. O **Navegador de Conflitos** por **R$ 9,99** entrega o plano exato para sua situação.",
            button: "Ver o plano",
            disclaimer: "Leitura simbólica e filosófica — não substitui acompanhamento psicológico profissional.",
        },
        {
            id: "C", label: "emocional",
            title: "Cansado(a) de brigar do mesmo jeito?",
            hook: "Você está reagindo no automático — e o outro lado já sabe apertar o botão. Se não quebrar o ciclo agora, você perde energia, respeito e a relação. O **Navegador de Conflitos** por **R$ 9,99** revela o que está por trás do ciclo e como sair.",
            button: "Quero sair do ciclo",
            disclaimer: "Leitura simbólica e filosófica — não substitui acompanhamento psicológico profissional.",
        },
    ],

    // ── MÓDULO D — Oráculo do Amor ───────────────────────────────────────────
    D: [
        {
            id: "A", label: "pesado",
            title: "Ciclo de atração repetido detectado",
            hook: "Seus Pilares apontaram um padrão de atração que se repete em formas diferentes mas com o mesmo resultado. Se o ciclo não for interrompido, a tendência é atrair a mesma dinâmica novamente. Desbloqueie o **Oráculo do Amor** por **R$ 9,99** para ver o padrão completo e o que fazer.",
            button: "Desbloquear R$ 9,99",
            disclaimer: "Leitura simbólica e filosófica — não substitui acompanhamento psicológico profissional.",
        },
        {
            id: "B", label: "racional",
            title: "Relacionamentos têm padrão — o seu tem um nome",
            hook: "A análise SAJO identificou o padrão que está por trás das suas escolhas amorosas. Quem não conhece o padrão repete as mesmas escolhas esperando resultados diferentes. O **Oráculo do Amor** por **R$ 9,99** nomeia e mapeia esse padrão para você.",
            button: "Conhecer meu padrão",
            disclaimer: "Leitura simbólica e filosófica — não substitui acompanhamento psicológico profissional.",
        },
        {
            id: "C", label: "emocional",
            title: "Por que o amor parece mais difícil pra você?",
            hook: "Não é falta de sorte em amor. Seus Pilares mostram uma raiz que explica por que os relacionamentos terminam de formas parecidas. O **Oráculo do Amor** por **R$ 9,99** revela o que está operando por baixo e como mudar.",
            button: "Quero entender",
            disclaimer: "Leitura simbólica e filosófica — não substitui acompanhamento psicológico profissional.",
        },
    ],

    // ── MÓDULO E — Caminho de Saída ──────────────────────────────────────────
    E: [
        {
            id: "A", label: "pesado",
            title: "Padrão ancestral em loop detectado",
            hook: "A leitura SAJO identificou um padrão ancestral se repetindo como roteiro na sua vida. Se você não interromper agora, ele volta em decisões, relações e saúde. Desbloqueie o **Caminho de Saída** por **R$ 9,99** para ver o portal certo de interrupção.",
            button: "Desbloquear R$ 9,99",
            disclaimer: "Leitura simbólica — não substitui profissionais de saúde mental. Em crise: CVV 188.",
            showCVV: true,
        },
        {
            id: "B", label: "racional",
            title: "O ciclo de escape tem um custo crescente",
            hook: "O que apareceu nos seus Pilares é um ciclo: alívio rápido, prejuízo longo. Se continuar, você perde controle gradualmente e afeta suas bases — relacionamentos, finanças, saúde. O **Caminho de Saída** por **R$ 9,99** revela o ponto de virada.",
            button: "Ver ponto de virada",
            disclaimer: "Leitura simbólica — não substitui profissionais de saúde mental. Em crise: CVV 188.",
            showCVV: true,
        },
        {
            id: "C", label: "emocional",
            title: "Existe uma saída — você ainda não viu ela",
            hook: "A leitura não te condena — ela mostra o portal certo. Há um padrão operando que explica o peso que você carrega. Se ignorar, a crise vira padrão permanente. O **Caminho de Saída** por **R$ 9,99** aponta onde é a porta.",
            button: "Quero encontrar a saída",
            disclaimer: "Leitura simbólica — não substitui profissionais de saúde mental. Em crise: CVV 188.",
            showCVV: true,
        },
    ],

    // ── MÓDULO F — Conexão com Quem Partiu ──────────────────────────────────
    F: [
        {
            id: "A", label: "pesado",
            title: "Luto antes da conclusão detectado",
            hook: "Seu mapa sugeriu um luto que ficou 'antes da conclusão'. Se você não fechar o ciclo, a vida vira espera — e a dor reaparece em datas, lugares e gatilhos inesperados. Desbloqueie **Conexão com Quem Partiu** por **R$ 9,99** para ver como transformar o vínculo.",
            button: "Desbloquear R$ 9,99",
            disclaimer: "Leitura simbólica e filosófica — não substitui acompanhamento psicológico. Em luto intenso: CVV 188.",
            showCVV: true,
        },
        {
            id: "B", label: "racional",
            title: "Algo não foi dito — isso cria um peso",
            hook: "A leitura apontou algo não resolvido com quem partiu. Isso não é fraqueza — é um vínculo que não mudou de forma. Se continuar, você carrega peso onde deveria haver memória. **Conexão com Quem Partiu** por **R$ 9,99** mapeia o caminho.",
            button: "Transformar o vínculo",
            disclaimer: "Leitura simbólica e filosófica — não substitui acompanhamento psicológico. Em luto intenso: CVV 188.",
            showCVV: true,
        },
        {
            id: "C", label: "emocional",
            title: "Você não precisa apagar quem partiu",
            hook: "Você não precisa 'superar' quem partiu — precisa mudar a forma do vínculo. Se não fizer isso, o luto te governa sem que vocë perceba. **Conexão com Quem Partiu** por **R$ 9,99** mostra como transformar dor em presença.",
            button: "Quero transformar",
            disclaimer: "Leitura simbólica e filosófica — não substitui acompanhamento psicológico. Em luto intenso: CVV 188.",
            showCVV: true,
        },
    ],
};

// ─── Engine de Scoring ────────────────────────────────────────────────────────

/** Converte respostas Likert (por módulo) em scores normalizados 0–100 */
export function computeSignals(answers: Record<string, number>): Signals {
    // Cada chave é "moduloX_q{n}" com valor 1–5
    const avg = (keys: string[]) => {
        const vals = keys.map(k => answers[k] ?? 3);
        return (vals.reduce((a, b) => a + b, 0) / vals.length - 1) / 4 * 100;
    };

    return {
        finance_pressure: avg(["A_q1", "A_q2", "A_q3", "A_q4", "A_q5", "A_q6"]),
        legal_dispute: avg(["B_q1", "B_q2", "B_q3", "B_q4", "B_q5", "B_q6"]),
        conflict_tension: avg(["C_q1", "C_q2", "C_q3", "C_q4", "C_q5"]),
        love_cycle: avg(["D_q1", "D_q2", "D_q3", "D_q4", "D_q5", "D_q6"]),
        crisis_addiction: avg(["E_q1", "E_q2", "E_q3", "E_q4", "E_q5", "E_q6"]),
        ancestral_pattern: avg(["E_q5", "E_q6", "A_q6"]),
        grief_loss: avg(["F_q1", "F_q2", "F_q3", "F_q4", "F_q5"]),
    };
}

/** Seleciona o módulo primário e secundário com base nos scores */
export function selectModules(signals: Signals): { primary: ModuleCode; secondary: ModuleCode } {
    // Score por módulo: E combina crisis_addiction + ancestral_pattern
    const moduleScores: Record<ModuleCode, number> = {
        A: signals.finance_pressure,
        B: signals.legal_dispute,
        C: signals.conflict_tension,
        D: signals.love_cycle,
        E: Math.max(signals.crisis_addiction, signals.ancestral_pattern),
        F: signals.grief_loss,
    };

    const sorted = (Object.entries(moduleScores) as [ModuleCode, number][])
        .sort(([, a], [, b]) => b - a);

    return {
        primary: sorted[0][0],
        secondary: sorted[1][0],
    };
}

/** Retorna os hooks (3 variantes) do módulo selecionado */
export function getModuleHooks(moduleCode: ModuleCode): HookVariant[] {
    return HOOKS[moduleCode];
}

/** Retorna um gancho específico por módulo + variante */
export function getHook(moduleCode: ModuleCode, variant: "A" | "B" | "C"): HookVariant {
    return HOOKS[moduleCode].find(h => h.id === variant) || HOOKS[moduleCode][0];
}

// ─── Questionários Likert por módulo ─────────────────────────────────────────

export interface LikertQuestion {
    key: string;
    text: string;
    hasCVVNote?: boolean; // sinaliza que a pergunta é sensível (usar nota de suporte)
}

export const QUESTIONNAIRES: Record<ModuleCode, LikertQuestion[]> = {
    A: [
        { key: "A_q1", text: "Tenho dificuldade de confiar no meu instinto na hora de investir ou gastar dinheiro." },
        { key: "A_q2", text: "Parece que meu dinheiro 'some' sem uma razão clara." },
        { key: "A_q3", text: "Já tomei decisões financeiras que me custaram caro e sinto que posso repetir o erro." },
        { key: "A_q4", text: "Me sinto paralisado(a) quando preciso decidir algo importante com dinheiro." },
        { key: "A_q5", text: "Tenho dívidas ou pressão financeira que me preocupam neste momento." },
        { key: "A_q6", text: "Percebo um padrão familiar de dificuldade com dinheiro que se repete em mim." },
    ],
    B: [
        { key: "B_q1", text: "Estou envolvido(a) em alguma disputa contratual, trabalhista ou jurídica." },
        { key: "B_q2", text: "Sinto que alguém me enganou ou não cumpriu um acordo comigo." },
        { key: "B_q3", text: "Tenho medo de fazer a escolha errada em uma situação com possíveis consequências legais." },
        { key: "B_q4", text: "Já avancei em uma negociação no momento errado e me arrependei." },
        { key: "B_q5", text: "Sinto tensão ou desconfiança em relações de trabalho ou negócio." },
        { key: "B_q6", text: "Existe uma 'conta a acertar' que ainda não foi resolvida com alguém." },
    ],
    C: [
        { key: "C_q1", text: "Há uma tensão recorrente com alguém que parece nunca se resolver de verdade." },
        { key: "C_q2", text: "Sinto que expresso o que sinto, mas a outra pessoa reage sempre do mesmo jeito negativo." },
        { key: "C_q3", text: "Conflitos em casa ou no trabalho me consomem energia mentalmente." },
        { key: "C_q4", text: "Tenho dificuldade de estabelecer limites sem que isso gere uma briga." },
        { key: "C_q5", text: "Me sinto 'preso(a)' em um ciclo de desentendimentos com uma pessoa específica." },
    ],
    D: [
        { key: "D_q1", text: "Sinto que me apaixono por pessoas que acabam me decepcionando de formas parecidas." },
        { key: "D_q2", text: "Tenho dificuldade de encontrar ou manter um relacionamento que me faça feliz." },
        { key: "D_q3", text: "Me pergunto por que o amor parece mais fácil para outras pessoas do que para mim." },
        { key: "D_q4", text: "Já terminei (ou quase terminei) um relacionamento importante recentemente." },
        { key: "D_q5", text: "Sinto que existe um padrão nos meus relacionamentos que não consigo mudar." },
        { key: "D_q6", text: "Me preocupo com a compatibilidade ou o futuro de uma relação atual ou futura." },
    ],
    E: [
        { key: "E_q1", text: "Sinto um peso que não consigo identificar, mas que me impede de avançar." },
        { key: "E_q2", text: "Às vezes uso algo (comida, álcool, trabalho, jogos, etc.) para aliviar um desconforto interno." },
        { key: "E_q3", text: "Carrego mágoa ou raiva de alguém que me feriu e não consigo soltar." },
        { key: "E_q4", text: "Sinto que decisões passadas criaram um padrão ou consequência que ainda me persegue." },
        { key: "E_q5", text: "Percebo comportamentos de pais ou avós se repetindo em mim, mesmo sem querer." },
        { key: "E_q6", text: "Tenho pensamentos muito pesados ou sensação de não ter saída.", hasCVWNote: true } as any,
    ],
    F: [
        { key: "F_q1", text: "Perdi alguém importante recentemente e ainda sinto a dor dessa perda." },
        { key: "F_q2", text: "Sinto que não tive a chance de me despedir ou dizer algo importante para quem partiu." },
        { key: "F_q3", text: "Há coisas não resolvidas com alguém que partiu que ainda me pesam." },
        { key: "F_q4", text: "Datas e lugares específicos me trazem uma tristeza que não consigo explicar." },
        { key: "F_q5", text: "Tenho sonhos intensos ou memórias marcantes de alguém que não está mais aqui." },
    ],
};

export default HOOKS;
