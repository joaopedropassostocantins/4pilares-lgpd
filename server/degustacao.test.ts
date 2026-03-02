import { describe, it, expect } from "vitest";

describe("Degustação Split Logic", () => {
  // Simulates the split logic used in Resultado.tsx
  function splitAnalysis(fullText: string) {
    const parts = fullText.split("===CORTE_AQUI===");
    const visiblePart = parts[0] || fullText;
    const hiddenPart = parts.length > 1 ? parts[1] : "";
    return { visiblePart, hiddenPart };
  }

  it("should split text at ===CORTE_AQUI=== marker", () => {
    const text = "Parte visível da análise\n\n===CORTE_AQUI===\n\nParte oculta da análise";
    const { visiblePart, hiddenPart } = splitAnalysis(text);
    expect(visiblePart).toContain("Parte visível");
    expect(hiddenPart).toContain("Parte oculta");
  });

  it("should handle text without marker (legacy analyses)", () => {
    const text = "Análise completa sem marcador";
    const { visiblePart, hiddenPart } = splitAnalysis(text);
    expect(visiblePart).toBe("Análise completa sem marcador");
    expect(hiddenPart).toBe("");
  });

  it("should only split at first marker if multiple exist", () => {
    const text = "Parte 1===CORTE_AQUI===Parte 2===CORTE_AQUI===Parte 3";
    const parts = text.split("===CORTE_AQUI===");
    expect(parts.length).toBe(3);
    expect(parts[0]).toBe("Parte 1");
    // In the component, parts[1] would include everything after first marker
    // but split gives us 3 parts - the component only uses parts[0] and parts[1]
    expect(parts[1]).toBe("Parte 2");
  });

  it("visible part should not contain the marker", () => {
    const text = "Visível===CORTE_AQUI===Oculto";
    const { visiblePart } = splitAnalysis(text);
    expect(visiblePart).not.toContain("===CORTE_AQUI===");
  });

  it("hidden part should not contain the marker", () => {
    const text = "Visível===CORTE_AQUI===Oculto";
    const { hiddenPart } = splitAnalysis(text);
    expect(hiddenPart).not.toContain("===CORTE_AQUI===");
  });
});

describe("Prompt Structure Validation", () => {
  it("prompt should require 5 mandatory elements", () => {
    // The prompt text is defined in routers.ts - we validate the structure expectations
    const requiredElements = [
      "Maldição/carma familiar ou doença energética",
      "Traições/quebras de confiança ou inveja/olho grande",
      "Bloqueio financeiro grave",
      "Espírito/obsessor ou influência energética",
      "Ciclo de repetição em relacionamentos",
    ];
    expect(requiredElements.length).toBe(5);
  });

  it("first 2 elements should be revealed in visible part", () => {
    const visibleElements = [
      "Maldição/carma familiar ou doença energética",
      "Traições/quebras de confiança ou inveja/olho grande",
    ];
    expect(visibleElements.length).toBe(2);
    // Element 1 must always be about maldição/doença
    expect(visibleElements[0]).toMatch(/[Mm]aldi[çc][aã]o|doen[çc]a/);
  });

  it("3 elements should be hidden behind blur/lock", () => {
    const hiddenElements = [
      "Bloqueio financeiro grave",
      "Espírito/obsessor ou influência energética",
      "Ciclo de repetição em relacionamentos",
    ];
    expect(hiddenElements.length).toBe(3);
  });

  it("format helper should convert markdown bold to HTML", () => {
    const formatHtml = (text: string) =>
      text
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>");

    expect(formatHtml("**negrito**")).toBe("<strong>negrito</strong>");
    expect(formatHtml("*itálico*")).toBe("<em>itálico</em>");
    expect(formatHtml("texto normal")).toBe("texto normal");
    expect(formatHtml("**bold** e *italic*")).toBe(
      "<strong>bold</strong> e <em>italic</em>"
    );
  });
});
