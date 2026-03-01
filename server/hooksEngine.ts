import hooks from "./hooks.json";

export interface Hook {
  id: number;
  categoria: string;
  compatibilidade: {
    sexo: string[];
    faixas: string[];
  };
  leveA: string;
  leveB: string;
  disclaimers: string[];
  tags: string[];
}

export interface DiagnosticProfile {
  sexo?: "male" | "female" | "other";
  idade?: number;
  categoria?: string; // Filter by category if needed
}

/**
 * Calculate age from birth date
 */
function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Get age range string from age
 */
function getAgeRange(age: number): string {
  if (age < 16) return "16-24"; // Should not happen in normal flow
  if (age < 25) return "16-24";
  if (age < 35) return "25-34";
  if (age < 45) return "35-44";
  if (age < 55) return "45-54";
  return "55+";
}

/**
 * Map gender to hook compatibility format
 */
function mapGenderToHookFormat(sexo?: string): string {
  if (sexo === "male" || sexo === "female") return sexo;
  return "Any"; // 'other' or undefined maps to 'Any'
}

/**
 * Check if a hook is compatible with the user profile
 */
function isHookCompatible(hook: Hook, profile: DiagnosticProfile): boolean {
  // Check gender compatibility
  const genderForHook = mapGenderToHookFormat(profile.sexo);
  const genderCompatible =
    hook.compatibilidade.sexo.includes("Any") ||
    hook.compatibilidade.sexo.includes(genderForHook);

  if (!genderCompatible) return false;

  // Check age range compatibility
  if (profile.idade !== undefined) {
    const ageRange = getAgeRange(profile.idade);
    const ageCompatible = hook.compatibilidade.faixas.includes(ageRange);
    if (!ageCompatible) return false;
  }

  // Check category filter if provided
  if (profile.categoria && hook.categoria !== profile.categoria) {
    return false;
  }

  return true;
}

/**
 * Select hooks for a user profile
 * Returns 3-5 hooks that are compatible with the user
 * Varies the text variant (leveA/leveB) for diversity
 */
export function selectHooks(
  profile: DiagnosticProfile,
  count: number = 4
): Array<Hook & { selectedText: string; textVariant: "A" | "B" }> {
  // Filter compatible hooks
  const compatibleHooks = (hooks as Hook[]).filter((h) =>
    isHookCompatible(h, profile)
  );

  // If not enough compatible hooks, return all available
  if (compatibleHooks.length <= count) {
    return compatibleHooks.map((h, idx) => ({
      ...h,
      selectedText: idx % 2 === 0 ? h.leveA : h.leveB,
      textVariant: idx % 2 === 0 ? "A" : "B",
    }));
  }

  // Shuffle and select random hooks
  const shuffled = [...compatibleHooks].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  // Vary text variants
  return selected.map((h, idx) => ({
    ...h,
    selectedText: idx % 2 === 0 ? h.leveA : h.leveB,
    textVariant: idx % 2 === 0 ? "A" : "B",
  }));
}

/**
 * Select hooks by category
 * Useful for filtering specific types of hooks
 */
export function selectHooksByCategory(
  profile: DiagnosticProfile,
  category: string,
  count: number = 3
): Array<Hook & { selectedText: string; textVariant: "A" | "B" }> {
  return selectHooks({ ...profile, categoria: category }, count);
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
  const categories = new Set((hooks as Hook[]).map((h) => h.categoria));
  return Array.from(categories).sort();
}

/**
 * Get hook by ID
 */
export function getHookById(id: number): Hook | undefined {
  return (hooks as Hook[]).find((h) => h.id === id);
}

/**
 * Example usage:
 * const profile = { sexo: "female", idade: 32 };
 * const selectedHooks = selectHooks(profile, 4);
 * console.log(selectedHooks);
 */
