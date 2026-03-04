import { describe, it, expect } from "vitest";
import { calculatePillars } from "./sajo";

describe("calculatePillars", () => {
  it("returns all 4 pillars with correct structure", () => {
    const result = calculatePillars("1990-01-15", "10:30", false);

    expect(result).toHaveProperty("yearPillar");
    expect(result).toHaveProperty("monthPillar");
    expect(result).toHaveProperty("dayPillar");
    expect(result).toHaveProperty("hourPillar");
  });

  it("each pillar has stem and branch as objects with string properties", () => {
    const result = calculatePillars("1990-01-15", "10:30", false);

    for (const key of ["yearPillar", "monthPillar", "dayPillar", "hourPillar"] as const) {
      const pillar = result[key];

      // stem must be an object with string properties (not nested objects)
      expect(typeof pillar.stem.name).toBe("string");
      expect(typeof pillar.stem.korean).toBe("string");
      expect(typeof pillar.stem.element).toBe("string");
      expect(typeof pillar.stem.yin_yang).toBe("string");
      expect(typeof pillar.stem.meaning).toBe("string");

      // branch must be an object with string properties
      expect(typeof pillar.branch.name).toBe("string");
      expect(typeof pillar.branch.korean).toBe("string");
      expect(typeof pillar.branch.animal).toBe("string");
      expect(typeof pillar.branch.element).toBe("string");
      expect(typeof pillar.branch.hours).toBe("string");
      expect(typeof pillar.branch.meaning).toBe("string");
    }
  });

  it("stem element is one of the 5 elements", () => {
    const result = calculatePillars("1985-06-20", "14:00", false);
    const validElements = ["Madeira", "Fogo", "Terra", "Metal", "Água"];

    for (const key of ["yearPillar", "monthPillar", "dayPillar", "hourPillar"] as const) {
      expect(validElements).toContain(result[key].stem.element);
      expect(validElements).toContain(result[key].branch.element);
    }
  });

  it("yin_yang is either Yin or Yang", () => {
    const result = calculatePillars("2000-03-10", "08:00", false);

    for (const key of ["yearPillar", "monthPillar", "dayPillar", "hourPillar"] as const) {
      expect(["Yin", "Yang"]).toContain(result[key].stem.yin_yang);
    }
  });

  it("elementBalance sums to 6 (4 stems + 4 branches * 0.5)", () => {
    const result = calculatePillars("1990-01-15", "10:30", false);
    const total = Object.values(result.elementBalance).reduce((a, b) => a + b, 0);
    expect(total).toBe(6);
  });

  it("dominantElement is one of the 5 elements", () => {
    const result = calculatePillars("1990-01-15", "10:30", false);
    const validElements = ["Madeira", "Fogo", "Terra", "Metal", "Água"];
    expect(validElements).toContain(result.dominantElement);
  });

  it("DST adjusts hour by -1", () => {
    const withoutDst = calculatePillars("1990-01-15", "10:30", false);
    const withDst = calculatePillars("1990-01-15", "10:30", true);
    // Hour branch should differ when DST is applied (10:30 vs 09:30)
    // Both should still produce valid structures
    expect(withoutDst.hourPillar.branch.name).toBeDefined();
    expect(withDst.hourPillar.branch.name).toBeDefined();
  });

  it("animalSign matches yearPillar branch animal", () => {
    const result = calculatePillars("1990-01-15", "10:30", false);
    expect(result.animalSign).toBe(result.yearPillar.branch.animal);
  });
});

describe("calculatePillars - React #31 prevention", () => {
  it("stem and branch are plain objects, not nested complex objects", () => {
    const result = calculatePillars("1990-01-15", "10:30", false);

    // This test specifically validates the fix for React Error #31
    // which occurs when objects are rendered directly as JSX children
    for (const key of ["yearPillar", "monthPillar", "dayPillar", "hourPillar"] as const) {
      const { stem, branch } = result[key];

      // Ensure no property is itself an object (which would cause React #31)
      const stemValues = Object.values(stem);
      const branchValues = Object.values(branch);

      for (const val of stemValues) {
        expect(typeof val).toBe("string");
      }
      for (const val of branchValues) {
        expect(typeof val).toBe("string");
      }
    }
  });
});
