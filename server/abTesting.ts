import { router, adminProcedure } from "./_core/trpc";
import { getAllDiagnostics } from "./db";
import type { Diagnostic } from "../drizzle/schema";

// ============================================================================
// A/B TESTING ENGINE INTEGRATION
// ============================================================================

export type ABTestVariant = "A" | "B" | "C" | "D";

interface ABTestSession {
  sessionId: string;
  variant: ABTestVariant;
  keyword: string;
  createdAt: Date;
  pageViews: number;
  scrollDepth: number;
  timeOnPage: number;
  formStarted: boolean;
  formCompleted: boolean;
  converted: boolean;
  conversionValue: number;
}

// In-memory store (replace with database in production)
const abTestSessions: Map<string, ABTestSession> = new Map();

/**
 * Estratégia de distribuição de variantes
 * - Variante A (25%): Dor Emocional + Urgência
 * - Variante B (25%): Credibilidade + Especificidade
 * - Variante C (25%): Quiz Interativo
 * - Variante D (25%): Storytelling
 */
export function getVariantForSession(keyword: string): ABTestVariant {
  const variants: ABTestVariant[] = ["A", "B", "C", "D"];
  
  // Usar hash do keyword para distribuição consistente
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) {
    const char = keyword.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  const index = Math.abs(hash) % variants.length;
  return variants[index];
}

/**
 * Criar nova sessão de A/B test
 */
export function createABTestSession(
  sessionId: string,
  keyword: string,
  variant?: ABTestVariant
): ABTestSession {
  const assignedVariant = variant || getVariantForSession(keyword);
  
  const session: ABTestSession = {
    sessionId,
    variant: assignedVariant,
    keyword,
    createdAt: new Date(),
    pageViews: 1,
    scrollDepth: 0,
    timeOnPage: 0,
    formStarted: false,
    formCompleted: false,
    converted: false,
    conversionValue: 0,
  };
  
  abTestSessions.set(sessionId, session);
  console.log(`🧪 A/B Test Session Created: ${sessionId} → Variant ${assignedVariant}`);
  return session;
}

/**
 * Rastrear eventos de A/B test
 */
export function trackPageView(sessionId: string): void {
  const session = abTestSessions.get(sessionId);
  if (!session) return;
  session.pageViews += 1;
}

export function trackScrollDepth(sessionId: string, depth: number): void {
  const session = abTestSessions.get(sessionId);
  if (!session) return;
  session.scrollDepth = Math.max(session.scrollDepth, depth);
}

export function trackTimeOnPage(sessionId: string, seconds: number): void {
  const session = abTestSessions.get(sessionId);
  if (!session) return;
  session.timeOnPage = seconds;
}

export function trackFormStart(sessionId: string): void {
  const session = abTestSessions.get(sessionId);
  if (!session) return;
  session.formStarted = true;
}

export function trackFormCompletion(sessionId: string): void {
  const session = abTestSessions.get(sessionId);
  if (!session) return;
  session.formCompleted = true;
}

export function trackConversion(sessionId: string, value: number): void {
  const session = abTestSessions.get(sessionId);
  if (!session) return;
  session.converted = true;
  session.conversionValue = value;
  console.log(`✅ Conversion Tracked: ${sessionId} → Variant ${session.variant} → R$ ${value}`);
}

/**
 * Calcular métricas de A/B test
 */
export function calculateABTestMetrics() {
  const variants: Record<ABTestVariant, {
    sessions: number;
    conversions: number;
    conversionRate: number;
    avgScrollDepth: number;
    avgTimeOnPage: number;
    totalRevenue: number;
  }> = {
    A: { sessions: 0, conversions: 0, conversionRate: 0, avgScrollDepth: 0, avgTimeOnPage: 0, totalRevenue: 0 },
    B: { sessions: 0, conversions: 0, conversionRate: 0, avgScrollDepth: 0, avgTimeOnPage: 0, totalRevenue: 0 },
    C: { sessions: 0, conversions: 0, conversionRate: 0, avgScrollDepth: 0, avgTimeOnPage: 0, totalRevenue: 0 },
    D: { sessions: 0, conversions: 0, conversionRate: 0, avgScrollDepth: 0, avgTimeOnPage: 0, totalRevenue: 0 },
  };
  
  abTestSessions.forEach((session) => {
    const variant = session.variant;
    const metrics = variants[variant];
    metrics.sessions += 1;
    metrics.avgScrollDepth += session.scrollDepth;
    metrics.avgTimeOnPage += session.timeOnPage;
    if (session.converted) {
      metrics.conversions += 1;
      metrics.totalRevenue += session.conversionValue;
    }
  });
  
  for (const variant of Object.keys(variants) as ABTestVariant[]) {
    const metrics = variants[variant];
    if (metrics.sessions > 0) {
      metrics.conversionRate = (metrics.conversions / metrics.sessions) * 100;
      metrics.avgScrollDepth = metrics.avgScrollDepth / metrics.sessions;
      metrics.avgTimeOnPage = metrics.avgTimeOnPage / metrics.sessions;
    }
  }
  
  return variants;
}

/**
 * Determinar variante vencedora
 */
export function getWinnerVariant(): ABTestVariant | null {
  const metrics = calculateABTestMetrics();
  let winner: ABTestVariant | null = null;
  let highestConversionRate = 0;
  
  for (const variant of Object.keys(metrics) as ABTestVariant[]) {
    if (metrics[variant].conversionRate > highestConversionRate) {
      highestConversionRate = metrics[variant].conversionRate;
      winner = variant;
    }
  }
  
  return winner;
}

// ============================================================================

export const abTestingRouter = router({
  // Estatísticas de A/B test (4 variantes)
  stats: adminProcedure.query(async () => {
    const allDiagnostics = await getAllDiagnostics(10000, 0);
    
    const variantA = allDiagnostics.filter((d: Diagnostic) => d.abTestVariant === "A");
    const variantB = allDiagnostics.filter((d: Diagnostic) => d.abTestVariant === "B");
    const variantC = allDiagnostics.filter((d: Diagnostic) => d.abTestVariant === "C");
    const variantD = allDiagnostics.filter((d: Diagnostic) => d.abTestVariant === "D");
    
    const variantAConversions = variantA.filter((d: Diagnostic) => d.paymentStatus === "paid").length;
    const variantBConversions = variantB.filter((d: Diagnostic) => d.paymentStatus === "paid").length;
    const variantCConversions = variantC.filter((d: Diagnostic) => d.paymentStatus === "paid").length;
    const variantDConversions = variantD.filter((d: Diagnostic) => d.paymentStatus === "paid").length;
    
    const variantARate = variantA.length > 0 ? (variantAConversions / variantA.length) * 100 : 0;
    const variantBRate = variantB.length > 0 ? (variantBConversions / variantB.length) * 100 : 0;
    const variantCRate = variantC.length > 0 ? (variantCConversions / variantC.length) * 100 : 0;
    const variantDRate = variantD.length > 0 ? (variantDConversions / variantD.length) * 100 : 0;
    
    const rates = [variantARate, variantBRate, variantCRate, variantDRate];
    const maxRate = Math.max(...rates);
    let winner: ABTestVariant = "A";
    if (maxRate === variantBRate) winner = "B";
    else if (maxRate === variantCRate) winner = "C";
    else if (maxRate === variantDRate) winner = "D";
    
    return {
      variantA: { total: variantA.length, conversions: variantAConversions, conversionRate: parseFloat(variantARate.toFixed(2)) },
      variantB: { total: variantB.length, conversions: variantBConversions, conversionRate: parseFloat(variantBRate.toFixed(2)) },
      variantC: { total: variantC.length, conversions: variantCConversions, conversionRate: parseFloat(variantCRate.toFixed(2)) },
      variantD: { total: variantD.length, conversions: variantDConversions, conversionRate: parseFloat(variantDRate.toFixed(2)) },
      winner,
    };
  }),

  // Distribuição de planos de pagamento
  planDistribution: adminProcedure.query(async () => {
    const allDiagnostics = await getAllDiagnostics(10000, 0);
    
    const promo = allDiagnostics.filter((d: Diagnostic) => d.selectedPlan === "promo").length;
    const normal = allDiagnostics.filter((d: Diagnostic) => d.selectedPlan === "normal").length;
    const lifetime = allDiagnostics.filter((d: Diagnostic) => d.selectedPlan === "lifetime").length;
    const unselected = allDiagnostics.filter((d: Diagnostic) => !d.selectedPlan).length;
    
    const total = allDiagnostics.length;
    
    return {
      promo: { count: promo, percentage: total > 0 ? parseFloat(((promo / total) * 100).toFixed(2)) : 0 },
      normal: { count: normal, percentage: total > 0 ? parseFloat(((normal / total) * 100).toFixed(2)) : 0 },
      lifetime: { count: lifetime, percentage: total > 0 ? parseFloat(((lifetime / total) * 100).toFixed(2)) : 0 },
      unselected: { count: unselected, percentage: total > 0 ? parseFloat(((unselected / total) * 100).toFixed(2)) : 0 },
      total,
    };
  }),
});
