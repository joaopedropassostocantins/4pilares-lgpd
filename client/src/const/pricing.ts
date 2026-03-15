/*
 * pricing.ts — 4 Pilares LGPD
 * Constantes de preços e planos
 */

export const PLANOS = {
  BASICO_ANPD: {
    id: "basico-anpd",
    nome: "Básico ANPD",
    tagline: "Conformidade ANPD com desconto especial",
    precoNormal: 29900, // R$ 299/mês em centavos
    precoPromocional: 15000, // R$ 150/mês em centavos
    desconto: "50%",
    mesesPromocao: 12,
    precoAposPromocao: 29900,
    color: "#1D4ED8",
    bgLight: "#EFF6FF",
    highlight: true,
    features: [
      "Diagnóstico inicial",
      "Política de Privacidade",
      "Aviso de Cookies",
      "Canal do Titular (Básico)",
      "Treinamento (1 sessão)",
    ],
    cta: "Contratar agora",
    badge: "50% OFF por 12 meses",
  },
  ESSENCIAL_COMPLETO: {
    id: "essencial-completo",
    nome: "Essencial Completo",
    tagline: "Para pequenas empresas",
    precoNormal: 99700, // R$ 997/mês em centavos
    precoPromocional: null,
    desconto: null,
    mesesPromocao: null,
    precoAposPromocao: null,
    color: "#059669",
    bgLight: "#ECFDF5",
    highlight: false,
    features: [
      "Tudo do Básico ANPD",
      "Mapeamento de dados (ROPA)",
      "Contratos com fornecedores",
      "Treinamento ilimitado",
      "Suporte por e-mail",
    ],
    cta: "Contratar agora",
    badge: null,
  },
  PROFISSIONAL: {
    id: "profissional",
    nome: "Profissional",
    tagline: "Para PMEs com fluxo complexo",
    precoNormal: 199700, // R$ 1.997/mês em centavos
    precoPromocional: null,
    desconto: null,
    mesesPromocao: null,
    precoAposPromocao: null,
    color: "#EA580C",
    bgLight: "#FFF7ED",
    highlight: false,
    features: [
      "Tudo do Essencial Completo",
      "DPO as a Service",
      "Relatório de Impacto (RIPD)",
      "Canal do Titular (Completo)",
      "Suporte prioritário",
    ],
    cta: "Contratar agora",
    badge: null,
  },
  EMPRESARIAL: {
    id: "empresarial",
    nome: "Empresarial",
    tagline: "Para governança avançada",
    precoNormal: 399700, // R$ 3.997/mês em centavos
    precoPromocional: null,
    desconto: null,
    mesesPromocao: null,
    precoAposPromocao: null,
    color: "#7C3AED",
    bgLight: "#F5F3FF",
    highlight: false,
    features: [
      "Tudo do Profissional",
      "Programa de governança",
      "Auditorias periódicas",
      "Gestão de incidentes",
      "Painel de monitoramento",
      "Suporte 24/7",
    ],
    cta: "Contratar agora",
    badge: null,
  },
  ENTERPRISE: {
    id: "enterprise",
    nome: "Enterprise",
    tagline: "Solução customizada para sua empresa",
    precoNormal: null,
    precoPromocional: null,
    desconto: null,
    mesesPromocao: null,
    precoAposPromocao: null,
    color: "#6B21A8",
    bgLight: "#F3E8FF",
    highlight: false,
    features: [
      "Tudo do Empresarial",
      "Customizações ilimitadas",
      "Integração com sistemas",
      "Consultoria dedicada",
      "SLA garantido",
    ],
    cta: "Falar com especialista",
    badge: null,
  },
} as const;

export const PLANOS_ARRAY = Object.values(PLANOS);

export type PlanoId = keyof typeof PLANOS;

export function getPlanoById(id: string) {
  return PLANOS_ARRAY.find((p) => p.id === id) || PLANOS.PROFISSIONAL;
}

export function formatarPreco(centavos: number | null): string {
  if (centavos === null) return "Sob consulta";
  return `R$ ${(centavos / 100).toFixed(2).replace(".", ",")}`;
}

export function formatarPrecoSimples(centavos: number | null): string {
  if (centavos === null) return "Sob consulta";
  return `R$ ${(centavos / 100).toFixed(0)}`;
}
