/**
 * SAJO (사주) — Cálculo dos 4 Pilares do Destino (사주팔자)
 * Baseado no calendário lunar chinês e na tradição coreana.
 */

export interface StemInfo {
  name: string;
  korean: string;
  element: string;
  yin_yang: string;
  meaning: string;
}

export interface BranchInfo {
  name: string;
  korean: string;
  animal: string;
  element: string;
  hours: string;
  meaning: string;
}

export interface Pillar {
  stem: StemInfo;
  branch: BranchInfo;
  label: string;
}

export interface PillarsData {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  dominantElement: string;
  elementBalance: Record<string, number>;
  yinYangBalance: { yin: number; yang: number };
  animalSign: string;
  personalityTraits: string[];
  strengths: string[];
  challenges: string[];
  compatibleSigns: string[];
  luckyDirections: string[];
  healthFocus: string[];
}

const STEMS: StemInfo[] = [
  { name: "甲 (Gap)", korean: "갑", element: "Madeira", yin_yang: "Yang", meaning: "Árvore grande, crescimento, liderança pioneira" },
  { name: "乙 (Eul)", korean: "을", element: "Madeira", yin_yang: "Yin", meaning: "Planta flexível, adaptação, criatividade" },
  { name: "丙 (Byeong)", korean: "병", element: "Fogo", yin_yang: "Yang", meaning: "Sol radiante, carisma, expressão vibrante" },
  { name: "丁 (Jeong)", korean: "정", element: "Fogo", yin_yang: "Yin", meaning: "Vela suave, intuição, sensibilidade" },
  { name: "戊 (Mu)", korean: "무", element: "Terra", yin_yang: "Yang", meaning: "Montanha sólida, estabilidade, proteção" },
  { name: "己 (Gi)", korean: "기", element: "Terra", yin_yang: "Yin", meaning: "Campo fértil, nutrição, receptividade" },
  { name: "庚 (Gyeong)", korean: "경", element: "Metal", yin_yang: "Yang", meaning: "Espada afiada, justiça, determinação" },
  { name: "辛 (Sin)", korean: "신", element: "Metal", yin_yang: "Yin", meaning: "Joia polida, refinamento, beleza" },
  { name: "壬 (Im)", korean: "임", element: "Água", yin_yang: "Yang", meaning: "Rio caudaloso, sabedoria, fluxo vital" },
  { name: "癸 (Gye)", korean: "계", element: "Água", yin_yang: "Yin", meaning: "Chuva suave, intuição profunda, mistério" },
];

const BRANCHES: BranchInfo[] = [
  { name: "子 (Ja)", korean: "자", animal: "Rato", element: "Água", hours: "23:00-01:00", meaning: "Inteligência, adaptabilidade, início de ciclo" },
  { name: "丑 (Chuk)", korean: "축", animal: "Boi", element: "Terra", hours: "01:00-03:00", meaning: "Perseverança, paciência, força interior" },
  { name: "寅 (In)", korean: "인", animal: "Tigre", element: "Madeira", hours: "03:00-05:00", meaning: "Coragem, ambição, poder natural" },
  { name: "卯 (Myo)", korean: "묘", animal: "Coelho", element: "Madeira", hours: "05:00-07:00", meaning: "Gentileza, diplomacia, paz interior" },
  { name: "辰 (Jin)", korean: "진", animal: "Dragão", element: "Terra", hours: "07:00-09:00", meaning: "Poder cósmico, transformação, destino" },
  { name: "巳 (Sa)", korean: "사", animal: "Serpente", element: "Fogo", hours: "09:00-11:00", meaning: "Sabedoria oculta, mistério, cura" },
  { name: "午 (O)", korean: "오", animal: "Cavalo", element: "Fogo", hours: "11:00-13:00", meaning: "Liberdade, energia vital, aventura" },
  { name: "未 (Mi)", korean: "미", animal: "Cabra", element: "Terra", hours: "13:00-15:00", meaning: "Arte, sensibilidade, harmonia" },
  { name: "申 (Sin)", korean: "신", animal: "Macaco", element: "Metal", hours: "15:00-17:00", meaning: "Inteligência ágil, versatilidade, inovação" },
  { name: "酉 (Yu)", korean: "유", animal: "Galo", element: "Metal", hours: "17:00-19:00", meaning: "Precisão, elegância, pontualidade" },
  { name: "戌 (Sul)", korean: "술", animal: "Cão", element: "Terra", hours: "19:00-21:00", meaning: "Lealdade, proteção, fidelidade" },
  { name: "亥 (Hae)", korean: "해", animal: "Porco", element: "Água", hours: "21:00-23:00", meaning: "Generosidade, sinceridade, abundância" },
];

const ELEMENT_WEIGHTS: Record<string, number> = {
  "Madeira": 1, "Fogo": 1, "Terra": 1, "Metal": 1, "Água": 1,
};

const COMPATIBLE_SIGNS: Record<string, string[]> = {
  "Rato": ["Dragão", "Macaco", "Boi"],
  "Boi": ["Serpente", "Galo", "Rato"],
  "Tigre": ["Cavalo", "Cão", "Coelho"],
  "Coelho": ["Cabra", "Porco", "Tigre"],
  "Dragão": ["Rato", "Macaco", "Galo"],
  "Serpente": ["Galo", "Boi", "Macaco"],
  "Cavalo": ["Tigre", "Cão", "Cabra"],
  "Cabra": ["Coelho", "Porco", "Cavalo"],
  "Macaco": ["Dragão", "Rato", "Serpente"],
  "Galo": ["Dragão", "Serpente", "Boi"],
  "Cão": ["Cavalo", "Tigre", "Coelho"],
  "Porco": ["Coelho", "Cabra", "Tigre"],
};

const HEALTH_FOCUS: Record<string, string[]> = {
  "Madeira": ["Fígado", "Visão/Criatividade"],
  "Fogo": ["Coração", "Alegria/Ansiedade"],
  "Terra": ["Baço/Estômago", "Preocupação/Nutrição"],
  "Metal": ["Pulmão", "Tristeza/Coragem"],
  "Água": ["Rins", "Medo/Sabedoria"],
};

const LUCKY_DIRECTIONS: Record<string, string[]> = {
  "Madeira": ["Leste"],
  "Fogo": ["Sul"],
  "Terra": ["Centro"],
  "Metal": ["Oeste"],
  "Água": ["Norte"],
};

function getYearStem(year: number): StemInfo {
  return STEMS[((year - 4) % 10 + 10) % 10];
}

function getYearBranch(year: number): BranchInfo {
  return BRANCHES[((year - 4) % 12 + 12) % 12];
}

function getMonthStem(year: number, month: number): StemInfo {
  const yearStemIdx = ((year - 4) % 10 + 10) % 10;
  const baseIdx = (yearStemIdx % 5) * 2;
  return STEMS[(baseIdx + month - 1) % 10];
}

function getMonthBranch(month: number): BranchInfo {
  // Month branches start at Tiger (index 2) for month 1
  return BRANCHES[(month + 1) % 12];
}

function getDayStem(year: number, month: number, day: number): StemInfo {
  // Simplified calculation based on Julian Day Number
  const a = Math.floor((14 - month) / 12);
  const y = year - a;
  const m = month + 12 * a - 2;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  return STEMS[((jdn % 10) + 10) % 10];
}

function getDayBranch(year: number, month: number, day: number): BranchInfo {
  const a = Math.floor((14 - month) / 12);
  const y = year - a;
  const m = month + 12 * a - 2;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  return BRANCHES[((jdn % 12) + 12) % 12];
}

function getHourStem(dayStemIdx: number, hour: number): StemInfo {
  const hourIdx = Math.floor(((hour + 1) % 24) / 2);
  return STEMS[(dayStemIdx * 2 + hourIdx) % 10];
}

function getHourBranch(hour: number): BranchInfo {
  const idx = Math.floor(((hour + 1) % 24) / 2);
  return BRANCHES[idx];
}

export function calculatePillars(
  birthDate: string,
  birthTime: string,
  hasDst: boolean
): PillarsData {
  const [yearStr, monthStr, dayStr] = birthDate.split("-");
  const year = parseInt(yearStr);
  const month = parseInt(monthStr);
  const day = parseInt(dayStr);
  const [hourStr, minStr] = birthTime.split(":");
  let hour = parseInt(hourStr);
  if (hasDst) hour = Math.max(0, hour - 1);

  const yearStemIdx = ((year - 4) % 10 + 10) % 10;
  const dayStemIdx = (() => {
    const a = Math.floor((14 - month) / 12);
    const y = year - a;
    const m = month + 12 * a - 2;
    const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    return ((jdn % 10) + 10) % 10;
  })();

  const yearStem = getYearStem(year);
  const yearBranch = getYearBranch(year);
  const monthStem = getMonthStem(year, month);
  const monthBranch = getMonthBranch(month);
  const dayStem = getDayStem(year, month, day);
  const dayBranch = getDayBranch(year, month, day);
  const hourStem = getHourStem(dayStemIdx, hour);
  const hourBranch = getHourBranch(hour);

  const yearPillar: Pillar = {
    stem: yearStem,
    branch: yearBranch,
    label: "Pilar do Ano (년주) — Ancestralidade e Raízes",
  };
  const monthPillar: Pillar = {
    stem: monthStem,
    branch: monthBranch,
    label: "Pilar do Mês (월주) — Pais e Juventude",
  };
  const dayPillar: Pillar = {
    stem: dayStem,
    branch: dayBranch,
    label: "Pilar do Dia (일주) — Eu Interior e Essência",
  };
  const hourPillar: Pillar = {
    stem: hourStem,
    branch: hourBranch,
    label: "Pilar da Hora (시주) — Filhos e Futuro",
  };

  // Element balance
  const elementBalance: Record<string, number> = { Madeira: 0, Fogo: 0, Terra: 0, Metal: 0, Água: 0 };
  const allPillars = [yearPillar, monthPillar, dayPillar, hourPillar];
  for (const p of allPillars) {
    elementBalance[p.stem.element] = (elementBalance[p.stem.element] || 0) + 1;
    elementBalance[p.branch.element] = (elementBalance[p.branch.element] || 0) + 0.5;
  }

  // Dominant element
  const dominantElement = Object.entries(elementBalance).sort((a, b) => b[1] - a[1])[0][0];

  // Yin/Yang balance
  const yinYangBalance = { yin: 0, yang: 0 };
  for (const p of allPillars) {
    if (p.stem.yin_yang === "Yin") yinYangBalance.yin++;
    else yinYangBalance.yang++;
  }

  const animalSign = yearBranch.animal;

  const personalityTraits = [
    dayStem.meaning,
    dayStem.yin_yang === "Yang" ? "Disciplinado(a) e organizado(a)" : "Intuitivo(a) e sensível",
    dominantElement === "Metal" ? "Senso estético apurado" : dominantElement === "Madeira" ? "Criativo(a) e visionário(a)" : dominantElement === "Fogo" ? "Carismático(a) e expressivo(a)" : dominantElement === "Terra" ? "Estável e confiável" : "Sábio(a) e adaptável",
    "Determinação inabalável",
    "Busca pela perfeição",
  ];

  const strengths = [
    dominantElement === "Metal" ? "Foco e disciplina excepcionais" : dominantElement === "Madeira" ? "Visão de longo prazo" : dominantElement === "Fogo" ? "Liderança natural" : dominantElement === "Terra" ? "Confiabilidade e constância" : "Sabedoria e intuição",
    "Capacidade de tomar decisões difíceis",
    "Integridade e honra",
  ];

  const challenges = [
    "Perfeccionismo paralisante",
    "Dificuldade em expressar emoções",
    "Tendência ao isolamento",
  ];

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dominantElement,
    elementBalance,
    yinYangBalance,
    animalSign,
    personalityTraits,
    strengths,
    challenges,
    compatibleSigns: COMPATIBLE_SIGNS[animalSign] || [],
    luckyDirections: LUCKY_DIRECTIONS[dominantElement] || [],
    healthFocus: HEALTH_FOCUS[dominantElement] || [],
  };
}
