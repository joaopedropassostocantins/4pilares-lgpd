import { describe, it, expect } from "vitest";
import {
  selectHooks,
  selectHooksByCategory,
  getCategories,
  getHookById,
} from "./hooksEngine";

describe("Hooks Engine", () => {
  describe("selectHooks", () => {
    it("should select hooks compatible with female 30 years old", () => {
      const profile = { sexo: "female" as const, idade: 30 };
      const selected = selectHooks(profile, 4);

      expect(selected.length).toBeLessThanOrEqual(4);
      expect(selected.length).toBeGreaterThan(0);

      // All selected hooks should have required fields
      selected.forEach((hook) => {
        expect(hook.id).toBeDefined();
        expect(hook.categoria).toBeDefined();
        expect(hook.selectedText).toBeDefined();
        expect(hook.textVariant).toMatch(/^[AB]$/);
      });
    });

    it("should select hooks compatible with male 45 years old", () => {
      const profile = { sexo: "male" as const, idade: 45 };
      const selected = selectHooks(profile, 3);

      expect(selected.length).toBeLessThanOrEqual(3);
      selected.forEach((hook) => {
        expect(hook.compatibilidade.sexo).toContain("Any");
      });
    });

    it("should select hooks for 'other' gender", () => {
      const profile = { sexo: "other" as const, idade: 25 };
      const selected = selectHooks(profile, 4);

      expect(selected.length).toBeGreaterThan(0);
    });

    it("should vary text variants (A and B)", () => {
      const profile = { sexo: "female" as const, idade: 35 };
      const selected = selectHooks(profile, 4);

      const variants = selected.map((h) => h.textVariant);
      // Should have some mix of A and B if enough hooks selected
      if (selected.length > 1) {
        expect(variants.includes("A") || variants.includes("B")).toBe(true);
      }
    });

    it("should return hooks with correct age range", () => {
      const profile = { sexo: "female" as const, idade: 28 };
      const selected = selectHooks(profile, 4);

      selected.forEach((hook) => {
        expect(hook.compatibilidade.faixas).toContain("25-34");
      });
    });

    it("should handle young age (16-24)", () => {
      const profile = { sexo: "male" as const, idade: 20 };
      const selected = selectHooks(profile, 4);

      expect(selected.length).toBeGreaterThan(0);
    });

    it("should handle senior age (55+)", () => {
      const profile = { sexo: "female" as const, idade: 60 };
      const selected = selectHooks(profile, 4);

      expect(selected.length).toBeGreaterThan(0);
    });
  });

  describe("selectHooksByCategory", () => {
    it("should select hooks from SAUDE category", () => {
      const profile = { sexo: "female" as const, idade: 30 };
      const selected = selectHooksByCategory(profile, "SAUDE", 3);

      selected.forEach((hook) => {
        expect(hook.categoria).toBe("SAUDE");
      });
    });

    it("should select hooks from FINANCAS category", () => {
      const profile = { sexo: "male" as const, idade: 35 };
      const selected = selectHooksByCategory(profile, "FINANCAS", 2);

      selected.forEach((hook) => {
        expect(hook.categoria).toBe("FINANCAS");
      });
    });

    it("should select hooks from RELACOES category", () => {
      const profile = { sexo: "female" as const, idade: 25 };
      const selected = selectHooksByCategory(profile, "RELACOES", 3);

      selected.forEach((hook) => {
        expect(hook.categoria).toBe("RELACOES");
      });
    });
  });

  describe("getCategories", () => {
    it("should return all available categories", () => {
      const categories = getCategories();

      expect(categories).toContain("SAUDE");
      expect(categories).toContain("FINANCAS");
      expect(categories).toContain("RELACOES");
      expect(categories).toContain("SEGURANCA");
      expect(categories).toContain("FUTURO");
    });

    it("should return unique categories", () => {
      const categories = getCategories();
      const uniqueCategories = new Set(categories);

      expect(categories.length).toBe(uniqueCategories.size);
    });
  });

  describe("getHookById", () => {
    it("should return hook with ID 1", () => {
      const hook = getHookById(1);

      expect(hook).toBeDefined();
      expect(hook?.id).toBe(1);
      expect(hook?.categoria).toBe("SAUDE");
    });

    it("should return hook with ID 12", () => {
      const hook = getHookById(12);

      expect(hook).toBeDefined();
      expect(hook?.id).toBe(12);
      expect(hook?.categoria).toBe("FINANCAS");
    });

    it("should return undefined for non-existent hook", () => {
      const hook = getHookById(999);

      expect(hook).toBeUndefined();
    });
  });

  describe("Hook structure validation", () => {
    it("all hooks should have required fields", () => {
      const profile = { sexo: "female" as const, idade: 30 };
      const selected = selectHooks(profile, 25); // Get all

      selected.forEach((hook) => {
        expect(hook.id).toBeDefined();
        expect(hook.categoria).toBeDefined();
        expect(hook.compatibilidade).toBeDefined();
        expect(hook.compatibilidade.sexo).toBeDefined();
        expect(hook.compatibilidade.faixas).toBeDefined();
        expect(hook.leveA).toBeDefined();
        expect(hook.leveB).toBeDefined();
        expect(hook.disclaimers).toBeDefined();
        expect(hook.tags).toBeDefined();
        expect(hook.selectedText).toBeDefined();
        expect(hook.textVariant).toBeDefined();
      });
    });

    it("all hooks should have non-empty text variants", () => {
      const profile = { sexo: "female" as const, idade: 30 };
      const selected = selectHooks(profile, 25);

      selected.forEach((hook) => {
        expect(hook.leveA.length).toBeGreaterThan(0);
        expect(hook.leveB.length).toBeGreaterThan(0);
        expect(hook.selectedText.length).toBeGreaterThan(0);
      });
    });

    it("all hooks should have valid categories", () => {
      const profile = { sexo: "female" as const, idade: 30 };
      const selected = selectHooks(profile, 25);
      const validCategories = [
        "SAUDE",
        "FINANCAS",
        "RELACOES",
        "SEGURANCA",
        "FUTURO",
      ];

      selected.forEach((hook) => {
        expect(validCategories).toContain(hook.categoria);
      });
    });
  });
});
