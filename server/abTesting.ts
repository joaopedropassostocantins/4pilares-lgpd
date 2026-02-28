import { router, adminProcedure } from "./_core/trpc";
import { getAllDiagnostics } from "./db";
import type { Diagnostic } from "../drizzle/schema";

export const abTestingRouter = router({
  stats: adminProcedure.query(async () => {
    const allDiagnostics = await getAllDiagnostics(10000, 0);
    
    const variantA = allDiagnostics.filter((d: Diagnostic) => d.abTestVariant === "A");
    const variantB = allDiagnostics.filter((d: Diagnostic) => d.abTestVariant === "B");
    
    const variantAConversions = variantA.filter((d: Diagnostic) => d.paymentStatus === "paid").length;
    const variantBConversions = variantB.filter((d: Diagnostic) => d.paymentStatus === "paid").length;
    
    const variantARate = variantA.length > 0 ? (variantAConversions / variantA.length) * 100 : 0;
    const variantBRate = variantB.length > 0 ? (variantBConversions / variantB.length) * 100 : 0;
    
    return {
      variantA: {
        total: variantA.length,
        conversions: variantAConversions,
        conversionRate: parseFloat(variantARate.toFixed(2)),
      },
      variantB: {
        total: variantB.length,
        conversions: variantBConversions,
        conversionRate: parseFloat(variantBRate.toFixed(2)),
      },
      winner: variantARate > variantBRate ? "A" : variantBRate > variantARate ? "B" : "tie",
      difference: parseFloat(Math.abs(variantARate - variantBRate).toFixed(2)),
    };
  }),

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
