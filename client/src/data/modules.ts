/*
 * modules.ts — 4 Pilares LGPD
 * Os 4 módulos/pilares do programa de adequação LGPD
 */

export const modules = [
  {
    id: "a",
    slug: "lei",
    title: "📜 Pilar da Lei",
    shortDescription: "Entenda a LGPD a fundo: bases legais, obrigações e penalidades.",
    icon: "📜",
    status: "✦ Módulo disponível",
    colorClass: "module-lei",
    accentColor: "#1D4ED8",
    paymentSlug: "pilar-lei",
    fullDescription: `Compreensão completa da Lei Geral de Proteção de Dados

## O QUE COBRE ESTE MÓDULO

A Lei 13.709/2018 (LGPD) estabelece regras claras sobre coleta, armazenamento, tratamento e compartilhamento de dados pessoais. Empresas que ignoram a lei estão sujeitas a multas de até R$ 50 milhões por infração.

## CONTEÚDO

- Estrutura e princípios da LGPD
- 10 bases legais para tratamento de dados
- Dados sensíveis: regras especiais
- Papel da ANPD: fiscalização e sanções
- Obrigações do controlador e operador
- Incidentes de segurança: prazos e notificações`,
    tastingIncludes: [
      "Resumo estruturado da LGPD",
      "Mapa das 10 bases legais com exemplos práticos",
      "Lista de dados sensíveis e suas restrições",
      "Tabela de sanções e critérios da ANPD",
      "Checklist de obrigações do controlador"
    ],
    exampleQuestions: [
      "Minha empresa precisa de consentimento para tratar dados de clientes?",
      "Quais dados são considerados sensíveis pela LGPD?",
      "Quais as penalidades para quem descumpre a lei?",
      "O que é a ANPD e como ela fiscaliza?",
      "Minha empresa é controladora ou operadora de dados?"
    ],
    faq: [
      {
        question: "A LGPD se aplica a empresas de qualquer porte?",
        answer: "Sim. A LGPD se aplica a qualquer empresa que trate dados pessoais de pessoas físicas localizadas no Brasil, independente do porte ou setor."
      },
      {
        question: "Microempresas têm tratamento diferenciado?",
        answer: "A lei prevê tratamento diferenciado para startups e microempresas em relação a algumas obrigações, mas não as isenta das sanções por vazamentos ou uso indevido de dados."
      }
    ],
    disclaimers: [
      "Este módulo é de caráter educativo e informativo.",
      "Para situações jurídicas específicas, consulte um advogado especializado em proteção de dados."
    ]
  },
  {
    id: "b",
    slug: "regras",
    title: "📋 Pilar das Regras",
    shortDescription: "Políticas internas, documentação e normas da ANPD aplicadas à sua empresa.",
    icon: "📋",
    status: "✦ Módulo disponível",
    colorClass: "module-regras",
    accentColor: "#059669",
    paymentSlug: "pilar-regras",
    fullDescription: `Estruturação das políticas e regras internas de privacidade

## O QUE COBRE ESTE MÓDULO

Toda empresa que trata dados pessoais precisa de documentação adequada: políticas de privacidade, termos de uso, contratos com operadores e registros de atividades de tratamento (ROPA).

## CONTEÚDO

- Política de Privacidade: o que deve conter
- Aviso de cookies e consentimento digital
- ROPA: Registro de Operações de Processamento
- Contratos com operadores e suboperadores
- Política de retenção e descarte de dados
- Treinamento e cultura de privacidade`,
    tastingIncludes: [
      "Modelo de Política de Privacidade adaptável",
      "Template de aviso de cookies LGPD-compliant",
      "Planilha ROPA com campos obrigatórios",
      "Checklist de cláusulas em contratos com fornecedores",
      "Roteiro de treinamento para equipes"
    ],
    exampleQuestions: [
      "O que uma Política de Privacidade precisa ter pela LGPD?",
      "Como estruturar o registro de atividades de tratamento (ROPA)?",
      "O que incluir nos contratos com fornecedores que acessam dados?",
      "Por quanto tempo posso guardar dados de clientes?",
      "Como treinar minha equipe sobre proteção de dados?"
    ],
    faq: [
      {
        question: "Preciso de Política de Privacidade mesmo sendo pequena empresa?",
        answer: "Sim. Qualquer empresa que coleta dados de clientes, funcionários ou parceiros precisa ter uma Política de Privacidade clara e acessível."
      },
      {
        question: "O ROPA é obrigatório para todos?",
        answer: "É obrigatório para controladores e operadores que realizam tratamento de alto risco ou em larga escala. Para empresas menores é altamente recomendado como boa prática."
      }
    ],
    disclaimers: [
      "Os modelos fornecidos são ponto de partida e devem ser adaptados pela equipe jurídica da empresa.",
      "A adequação final deve ser validada por profissional especializado em LGPD."
    ]
  },
  {
    id: "c",
    slug: "conformidade",
    title: "🛡️ Pilar da Conformidade",
    shortDescription: "Diagnóstico, plano de adequação e implementação técnica e jurídica.",
    icon: "🛡️",
    status: "✦ Módulo disponível",
    colorClass: "module-conformidade",
    accentColor: "#EA580C",
    paymentSlug: "pilar-conformidade",
    fullDescription: `Processo completo de adequação à LGPD

## O QUE COBRE ESTE MÓDULO

Adequar-se à LGPD não é um evento único — é um processo contínuo. Este módulo cobre o ciclo completo: diagnóstico do estado atual, identificação de gaps, plano de ação prioritizado e implementação das medidas necessárias.

## CONTEÚDO

- Diagnóstico de maturidade em privacidade
- Mapeamento de fluxo de dados (data mapping)
- Avaliação de Impacto à Proteção de Dados (DPIA)
- Plano de adequação com prioridades e prazos
- Segurança da informação: medidas técnicas
- Gestão de incidentes: plano de resposta`,
    tastingIncludes: [
      "Questionário de diagnóstico de maturidade",
      "Template de mapeamento de dados (data flow)",
      "Modelo de DPIA simplificada",
      "Plano de adequação em fases com roadmap",
      "Checklist de medidas de segurança técnica",
      "Plano de resposta a incidentes de segurança"
    ],
    exampleQuestions: [
      "Como saber se minha empresa está em conformidade com a LGPD?",
      "O que é uma DPIA e quando é obrigatória?",
      "Por onde começar a adequação se nunca foi feita?",
      "Quais medidas técnicas de segurança a LGPD exige?",
      "Como estruturar um plano de resposta a vazamentos de dados?"
    ],
    faq: [
      {
        question: "Em quanto tempo uma empresa consegue se adequar à LGPD?",
        answer: "Depende do porte e complexidade da empresa. Microempresas podem implementar o essencial em 30-60 dias. Empresas médias e grandes tipicamente levam de 3 a 12 meses para uma adequação completa."
      },
      {
        question: "O que acontece se houver um vazamento de dados?",
        answer: "A empresa deve notificar a ANPD e os titulares afetados em prazo razoável. Ter um plano de resposta a incidentes reduz os riscos de sanção."
      }
    ],
    disclaimers: [
      "O diagnóstico inicial não substitui uma auditoria jurídica completa.",
      "Implantações críticas devem ser supervisionadas por DPO ou advogado especializado."
    ]
  },
  {
    id: "d",
    slug: "titular",
    title: "👤 Pilar do Titular",
    shortDescription: "Gestão dos direitos dos titulares: acesso, correção, exclusão e portabilidade.",
    icon: "👤",
    status: "✦ Módulo disponível",
    colorClass: "module-titular",
    accentColor: "#7C3AED",
    paymentSlug: "pilar-titular",
    fullDescription: `Canal e processos para atendimento aos direitos dos titulares

## O QUE COBRE ESTE MÓDULO

A LGPD garante aos titulares de dados um conjunto de direitos que as empresas são obrigadas a respeitar e facilitar. Este módulo cobre a estruturação do canal de atendimento e os fluxos internos para responder adequadamente.

## CONTEÚDO

- Os 9 direitos do titular previstos na LGPD
- Estruturação do canal de atendimento ao titular
- Fluxo de resposta e prazos legais
- Autenticação do solicitante: como verificar
- Portabilidade de dados: como implementar
- Exclusão e anonimização: quando e como`,
    tastingIncludes: [
      "Guia dos 9 direitos do titular com exemplos",
      "Modelo de formulário de solicitação de direitos",
      "Fluxo de atendimento com prazos ANPD",
      "Procedimento de verificação de identidade",
      "Template de resposta para cada tipo de solicitação",
      "Política de retenção vs. direito ao esquecimento"
    ],
    exampleQuestions: [
      "Quais são os direitos dos meus clientes em relação aos dados que tenho deles?",
      "Em quanto tempo preciso responder a uma solicitação de exclusão de dados?",
      "Como verificar se quem pediu os dados é realmente o titular?",
      "O que é portabilidade de dados e como implementar?",
      "Posso recusar uma solicitação de exclusão de dados?"
    ],
    faq: [
      {
        question: "Qual é o prazo para responder solicitações de titulares?",
        answer: "A LGPD não define prazo fixo, mas a ANPD orienta que as respostas sejam dadas em prazo razoável. O mercado adota como referência 15 dias úteis."
      },
      {
        question: "Toda empresa precisa de um DPO (Encarregado de Dados)?",
        answer: "Formalmente sim, mas a ANPD sinalizou flexibilidade para microempresas. O importante é ter um ponto de contato claro para receber solicitações e comunicar-se com a ANPD."
      }
    ],
    disclaimers: [
      "Os fluxos sugeridos são referência e devem ser adaptados ao contexto jurídico e operacional de cada empresa.",
      "A definição de prazos vinculantes deve ser validada com assessoria jurídica especializada."
    ]
  }
];
