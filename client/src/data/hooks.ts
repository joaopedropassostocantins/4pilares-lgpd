// Motor de Ganchos — Versão Hipnótica com Detalhes Únicos
export interface Hook {
  id: number;
  categoria: string;
  compat: { sexo: string[]; faixas: string[] };
  a: string;
  b: string;
  d: string[];
  t: string[];
}

export const HOOKS: Hook[] = [
  {
    id: 1,
    categoria: "RELACOES",
    compat: { sexo: ["Any"], faixas: ["25-34", "35-44", "45-54", "55+"] },
    a: "Você tem uma frase que repete: 'nunca mais confio em ninguém'. Ela veio depois de uma traição que você nunca contou abertamente — foi há uns 3 ou 4 anos. Se eu estiver certo, essa mágoa ainda drena sua energia em novos relacionamentos. E tem alguém no seu trabalho que sente inveja do que você conquistou; você sente quando ela entra na sala. É isso ou você acha que é só impressão?",
    b: "Aquela escolha que você fez no passado — a que te custou dinheiro e autoestima — ainda ecoa nas suas decisões hoje. Você carrega um medo de repetir o erro, e isso te trava. Se você vem sentindo cansaço extremo ao pensar em mudar de emprego, pode ser mais do que só cansaço. Vale investigar se não há uma influência externa te sugando.",
    d: ["Padrão observado, não é diagnóstico."],
    t: ["traicao", "inveja", "trabalho", "palavra-chave"],
  },
  {
    id: 2,
    categoria: "ESPIRITUAL",
    compat: { sexo: ["Any"], faixas: ["25-34", "35-44", "45-54", "55+"] },
    a: "Sua família carrega uma história de abandono que se repete — seus avós, seus pais, e agora você. É como se uma 'maldição' silenciosa passasse de geração em geração. Se você sente pesos estranhos no peito à noite, ou acorda entre 3h e 4h da manhã, pode haver uma presença que se alimenta da sua energia. E seu dinheiro? Ele some com contas pequenas que somam muito, como se houvesse um ralo invisível. Quer entender de onde vem isso?",
    b: "Alguém na sua árvore fez um pacto silencioso — talvez um negócio escuso, uma traição grave — e você herdou o preço emocional. Isso se manifesta como bloqueios financeiros e relacionamentos que nunca dão certo. Se você tem filhos, observe se um deles tem medo do escuro sem motivo; às vezes eles veem o que a gente não quer ver.",
    d: ["Não é diagnóstico, é padrão geracional."],
    t: ["maldicao", "espiritos", "financas", "familia"],
  },
  {
    id: 3,
    categoria: "TRABALHO",
    compat: { sexo: ["Any"], faixas: ["35-44", "45-54", "55+"] },
    a: "Você já percebeu que, toda vez que está perto de uma conquista no trabalho, algo dá errado? Pode ser inveja de alguém próximo — um colega que sorri na sua frente mas torce contra você. Isso não é paranoia. E mais: às vezes você sente uma voz interna que te diz 'você não vai conseguir'. Essa voz não é sua. Se ela aparece mais à noite, pode ser algo que se aproveita da sua fragilidade. Quer saber como identificar e cortar?",
    b: "Aquela oportunidade de trabalho que parecia perfeita e desandou — não foi acaso. Tem uma energia estranha ligada a esse ambiente. Se você sente um peso nas costas ao entrar no escritório, seu corpo está captando algo. Essa semana, uma nova chance vai aparecer disfarçada de problema. Você tem 3 dias para reconhecer.",
    d: ["Não é diagnóstico."],
    t: ["inveja", "trabalho", "possessao"],
  },
  {
    id: 4,
    categoria: "RELACIONAMENTO",
    compat: { sexo: ["Any"], faixas: ["25-34", "35-44", "45-54", "55+"] },
    a: "Você já foi traído por alguém que amava, e desde então carrega uma couraça. Mas o que você não sabe é que, às vezes, a pessoa que te traiu também carrega um espírito obsessor que a empurrou para isso. Pode parecer loucura, mas certas traições têm origem além do físico. Se você vive repetindo o padrão de parceiros que somem emocionalmente, talvez não seja só má sorte. Essa semana, uma pessoa do passado vai reaparecer. O que você vai fazer?",
    b: "Há uma escolha que você precisa fazer nos próximos 7 dias — envolve alguém que te deve satisfações. Se você não agir, a energia de cobrança vai se voltar contra você. E se sentir uma presença estranha perto de você enquanto lê isso, não é coincidência. Quer entender o que está em jogo?",
    d: ["Não é diagnóstico."],
    t: ["traicao", "espiritos", "escolha"],
  },
  {
    id: 5,
    categoria: "FINANCAS",
    compat: { sexo: ["Any"], faixas: ["25-34", "35-44", "45-54", "55+"] },
    a: "Tem uma história na sua família de dinheiro que entra e some — como se houvesse uma 'maldição' de desperdício. Pode ser alguém que fez um negócio errado no passado e deixou essa energia. E hoje, você sente que, quando guarda dinheiro, surge uma despesa inesperada que leva tudo. Isso tem nome: olho grande. Alguém próximo sente inveja da sua capacidade de ganhar dinheiro, e isso bloqueia sua prosperidade. Se você quer saber como se proteger e romper esse ciclo, precisa agir agora.",
    b: "Nos próximos 3 dias, um 'milagre' financeiro pode acontecer — um dinheiro que você não esperava. Mas se você não estiver atento, ele vai escorrer pelos dedos. Tem uma presença que quer te impedir de reter. Quer saber como segurar?",
    d: ["Não é consultoria financeira."],
    t: ["maldicao", "inveja", "financas"],
  },
];

export function calcFaixa(idade: number): string {
  if (idade < 16) return "BLOQUEADO";
  if (idade <= 24) return "16-24";
  if (idade <= 34) return "25-34";
  if (idade <= 44) return "35-44";
  if (idade <= 54) return "45-54";
  return "55+";
}

export function selectHook(
  idade: number,
  sexo: string,
  categoria?: string | null
): { id: number; categoria: string; text: string; disclaimers: string[]; tags: string[] } | null {
  const faixa = calcFaixa(idade);
  if (faixa === "BLOQUEADO") return null;

  const sexoNorm = sexo && sexo !== "" ? sexo.toUpperCase() : "NA";

  const candidatos = HOOKS.filter((h) => {
    const faixaOk = h.compat.faixas.includes(faixa);
    const sexoOk =
      h.compat.sexo.includes("Any") ||
      (sexoNorm !== "NA" && h.compat.sexo.includes(sexoNorm));
    const catOk = !categoria || h.categoria === categoria;
    return faixaOk && sexoOk && catOk;
  });

  if (!candidatos.length) return null;

  const escolhido = candidatos[Math.floor(Math.random() * candidatos.length)];
  const texto = Math.random() > 0.5 ? escolhido.a : escolhido.b;

  return {
    id: escolhido.id,
    categoria: escolhido.categoria,
    text: texto,
    disclaimers: escolhido.d,
    tags: escolhido.t,
  };
}
