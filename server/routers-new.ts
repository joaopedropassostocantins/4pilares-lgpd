// DORES ALEATORIAS PARA FECHAMENTO PERSUASIVO - DIRETO E POPULAR
// ============================================================================
const SPECIFIC_PAINS = [
  // CANSACO E ESGOTAMENTO
  {
    category: "Cansaco",
    pains: [
      "esse cansaco que voce sente todo dia, aquele que nem dormindo resolve",
      "aquele esgotamento profissional que voce nao consegue desligar, nem no fim de semana",
      "a sensacao de estar sempre cansado, sem energia pra nada, nem pra viver",
      "aquele cansaco mental que te deixa vazio, sem vontade de fazer nada",
      "o cansaco que vem de trabalhar demais e ganhar pouco, aquele que corroi a alma",
    ]
  },
  // ANSIEDADE E MEDO
  {
    category: "Ansiedade",
    pains: [
      "aquela ansiedade que nao deixa voce dormir, que te acorda no meio da noite com o peito acelerado",
      "o medo constante de que algo ruim vai acontecer, mesmo quando tudo esta bem",
      "aquela preocupacao que nao sai da sua cabeca, que te consome o tempo todo",
      "o panico que vem do nada e te paralisa, deixando voce sem ar",
      "aquele medo de nao ser bom o suficiente, de fracassar em tudo que tenta",
    ]
  },
  // RELACIONAMENTOS E SOLIDAO
  {
    category: "Relacionamentos",
    pains: [
      "aquela solidao que voce sente mesmo estando rodeado de gente",
      "o fim de um relacionamento que ainda doi, que deixou cicatrizes profundas",
      "a dificuldade de encontrar alguem que realmente te entenda e te ame de verdade",
      "os conflitos constantes com pessoas que voce ama, aqueles que machucam fundo",
      "o medo de ficar sozinho para o resto da vida, de morrer sem ter alguem do lado",
    ]
  },
  // DINHEIRO E CARREIRA
  {
    category: "Dinheiro",
    pains: [
      "aquele aperto no peito quando chega a conta, quando o dinheiro nao e suficiente",
      "a sensacao de estar preso numa carreira que nao te realiza, que te sufoca",
      "as brigas sobre dinheiro que estao destruindo seu relacionamento",
      "o medo de nao conseguir pagar as contas, de ficar na rua",
      "aquela divida que cresce todo mes e voce nao consegue pagar, que te sufoca",
    ]
  },
  // SAUDE E CORPO
  {
    category: "Saude",
    pains: [
      "aquele medo silencioso de ter uma doenca grave, de receber uma noticia ruim do medico",
      "o peso que voce carrega no corpo e que afeta sua autoestima todos os dias",
      "os sintomas fisicos do estresse que os medicos nao conseguem explicar",
      "aquela pressao alta, aquele coracao acelerado, aquele mal-estar constante",
      "a falta de energia, aquele corpo pesado que nao responde mais como antes",
    ]
  },
];

const EMOTIONAL_PAINS = SPECIFIC_PAINS.flatMap(cat => cat.pains);

let lastSelectedPain: string | null = null;

function getRandomPain(): string {
  let selectedPain: string;
  do {
    selectedPain = EMOTIONAL_PAINS[Math.floor(Math.random() * EMOTIONAL_PAINS.length)];
  } while (selectedPain === lastSelectedPain);
  lastSelectedPain = selectedPain;
  return selectedPain;
}
