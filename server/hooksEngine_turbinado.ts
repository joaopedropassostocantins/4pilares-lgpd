import hooksData from "../public/hooks_turbinado.json";

export interface Hook {
  id: string;
  category: string;
  title: string;
  pain: string;
  data: string;
  question: string;
  variants: {
    a: string;
    b: string;
  };
  compatibility: {
    gender: string[];
    ageMin: number;
    ageMax: number;
  };
  disclaimer: string;
  tags: string[];
}

export interface SelectedHooks {
  hooks: Hook[];
  selectedVariants: Record<string, "a" | "b">;
  riskFreeMessage: string;
}

/**
 * Seleciona 3-5 ganchos compatíveis com o usuário
 * Prioriza ganchos que combinam com dados demográficos
 */
export function selectHooks(
  gender: "male" | "female" | "other" | "",
  birthDate: string,
  count: number = 4
): SelectedHooks {
  // Calcular idade
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  // Filtrar ganchos compatíveis
  const compatibleHooks = hooksData.hooks.filter((hook) => {
    const genderMatch = !gender || hook.compatibility.gender.includes(gender);
    const ageMatch = age >= hook.compatibility.ageMin && age <= hook.compatibility.ageMax;
    return genderMatch && ageMatch;
  });

  // Embaralhar e selecionar
  const shuffled = [...compatibleHooks].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  // Selecionar variantes aleatoriamente
  const selectedVariants: Record<string, "a" | "b"> = {};
  selected.forEach((hook) => {
    selectedVariants[hook.id] = Math.random() > 0.5 ? "a" : "b";
  });

  // Mensagem de aposta de risco zero
  const riskFreeMessage = `Se eu não acertar em pelo menos 2 de ${selected.length} padrões, não paga nada. Aposta de risco zero.`;

  return {
    hooks: selected,
    selectedVariants,
    riskFreeMessage,
  };
}

/**
 * Seleciona ganchos por categoria específica
 */
export function selectHooksByCategory(
  category: string,
  gender: "male" | "female" | "other" | "",
  birthDate: string,
  count: number = 2
): SelectedHooks {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  const compatibleHooks = hooksData.hooks.filter((hook) => {
    const categoryMatch = hook.category === category;
    const genderMatch = !gender || hook.compatibility.gender.includes(gender);
    const ageMatch = age >= hook.compatibility.ageMin && age <= hook.compatibility.ageMax;
    return categoryMatch && genderMatch && ageMatch;
  });

  const shuffled = [...compatibleHooks].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  const selectedVariants: Record<string, "a" | "b"> = {};
  selected.forEach((hook) => {
    selectedVariants[hook.id] = Math.random() > 0.5 ? "a" : "b";
  });

  const riskFreeMessage = `Se eu não acertar em pelo menos 1 de ${selected.length} padrões de ${category}, não paga nada.`;

  return {
    hooks: selected,
    selectedVariants,
    riskFreeMessage,
  };
}

/**
 * Retorna todas as categorias disponíveis
 */
export function getCategories(): string[] {
  const categories = new Set(hooksData.hooks.map((hook) => hook.category));
  return Array.from(categories).sort();
}

/**
 * Busca um gancho específico por ID
 */
export function getHookById(id: string): Hook | undefined {
  return hooksData.hooks.find((hook) => hook.id === id);
}

/**
 * Retorna estatísticas dos ganchos
 */
export function getHooksStats() {
  return {
    totalHooks: hooksData.hooks.length,
    categories: getCategories(),
    categoryCount: Object.fromEntries(
      getCategories().map((cat) => [
        cat,
        hooksData.hooks.filter((h) => h.category === cat).length,
      ])
    ),
  };
}

/**
 * Valida se um gancho é apropriado para a idade do usuário
 */
export function isHookAppropriateForAge(hookId: string, birthDate: string): boolean {
  const hook = getHookById(hookId);
  if (!hook) return false;

  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= hook.compatibility.ageMin && age <= hook.compatibility.ageMax;
}

/**
 * Retorna a mensagem de dor específica para um gancho
 */
export function getHookPainMessage(hookId: string): string {
  const hook = getHookById(hookId);
  return hook?.pain || "";
}

/**
 * Retorna a pergunta de gatilho para um gancho
 */
export function getHookTriggerQuestion(hookId: string): string {
  const hook = getHookById(hookId);
  return hook?.question || "";
}
