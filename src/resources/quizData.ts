// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductKey = "ERGA" | "ERLA" | "EPSKS" | "ERRA" | "EDLA" | "EPRA" | "EPSKA";

export type AnswerKey = "area" | "installation" | "year";

export interface QuizAnswers {
  area: number | null;
  installation: number | null;
  year: number | null;
}

export interface FilledQuizAnswers {
  area: number;
  installation: number;
  year: number;
}

export interface ProductLink {
  label: string;
  url: string;
}

export interface ProductInfo {
  name: string;
  links: ProductLink[];
}

export interface QuestionOption {
  label: string;
  value: number;
}

export interface Question {
  id: AnswerKey;
  question: string;
  hint: string;
  options: QuestionOption[];
}

// ─── Questions ────────────────────────────────────────────────────────────────

export const QUESTIONS: Question[] = [
  {
    id: "area",
    question: "Jaki jest metraż domu?",
    hint: "Podaj przybliżoną powierzchnię użytkową",
    options: [
      { label: "do 120 m²", value: 0 },
      { label: "121–150 m²", value: 1 },
      { label: "151–200 m²", value: 2 },
      { label: "od 201 m²", value: 3 },
    ],
  },
  {
    id: "installation",
    question: "Jaki rodzaj instalacji masz w domu?",
    hint: "Wybierz typ systemu grzewczego",
    options: [
      { label: "Ogrzewanie podłogowe", value: 0 },
      { label: "Grzejniki", value: 1 },
      { label: "Mieszane", value: 2 },
    ],
  },
  {
    id: "year",
    question: "Jaki jest rok budowy domu?",
    hint: "Rok budowy wpływa na standard izolacji termicznej",
    options: [
      { label: "do 1970", value: 0 },
      { label: "1971–1990", value: 1 },
      { label: "1991–2005", value: 2 },
      { label: "2006–2013", value: 3 },
      { label: "2014–2016", value: 4 },
      { label: "2017–2020", value: 5 },
      { label: "od 2021", value: 6 },
    ],
  },
];

export const ANSWER_KEYS: AnswerKey[] = ["area", "installation", "year"];

// ─── Products ─────────────────────────────────────────────────────────────────

export const PRODUCTS: Record<ProductKey, ProductInfo> = {
  ERGA: {
    name: "Altherma 3 R",
    links: [
      { label: "Altherma 3 R W",     url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-3-r-w" },
      { label: "Altherma 3 R ECH₂O", url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-3-r-ech2o" },
      { label: "Altherma 3 R F",     url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-3-r-f" },
    ],
  },
  ERLA: {
    name: "Altherma 3 R",
    links: [
      { label: "Altherma 3 R W",     url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-3-r-w" },
      { label: "Altherma 3 R ECH₂O", url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-3-r-ech2o" },
      { label: "Altherma 3 R F",     url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-3-r-f" },
    ],
  },
  EPSKS: {
    name: "EPSKS",
    links: [], // nowa, będzie później
  },
  ERRA: {
    name: "Altherma 3 R M/T",
    links: [
      { label: "Altherma 3 R M/T W", url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-3-r-m-t-w" },
      { label: "Altherma 3",         url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-3" },
      { label: "Altherma 3 R M/T F", url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-3-r-m-t-f" },
    ],
  },
  EDLA: {
    name: "Altherma 3 M",
    links: [
      { label: "Altherma 3 M", url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-3-m" },
    ],
  },
  EPRA: {
    name: "Altherma 3 H M/T",
    links: [
      { label: "Altherma 3 H M/T W",     url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-3-h-m-t-w" },
      { label: "Altherma 3 H M/T ECH₂O", url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-3-h-m-t-ech2o" },
      { label: "Altherma 3 H M/T F",     url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-3-h-m-t-f" },
    ],
  },
  EPSKA: {
    name: "Altherma 4 H",
    links: [
      { label: "Altherma 4 H W",   url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-4-h-w" },
      { label: "Altherma 4 ERGA",  url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-4-erga" },
      { label: "Altherma 4 H F",   url: "https://daikinkobierzyce.pl/pl/products/heat-pumps/altherma-4-h-f" },
    ],
  },
};

// ─── Result mapping (index 1–84) ──────────────────────────────────────────────
// Formula: area * 21 + installation * 7 + year + 1

export const INDEX_TO_RESULT: Record<number, ProductKey[]> = {
  1:  ["ERGA"],  2:  ["ERGA"],  3:  ["ERGA"],  4:  ["ERGA"],  5:  ["ERGA"],  6:  ["ERGA"],  7:  ["ERGA"],
  8:  ["EPSKS"], 9:  ["EPSKS"], 10: ["ERRA"],  11: ["ERRA"],  12: ["EDLA"],  13: ["EDLA"],  14: ["EDLA"],
  15: ["EPSKS", "ERGA"], 16: ["EPSKS", "ERGA"], 17: ["EPSKS", "ERGA"], 18: ["EPSKS", "ERGA"],
  19: ["EPSKS", "ERGA"], 20: ["EPSKS", "ERGA"], 21: ["ERGA"],
  22: ["ERRA"],  23: ["ERRA"],  24: ["ERRA"],  25: ["ERGA"],  26: ["ERGA"],  27: ["ERGA"],  28: ["ERGA"],
  29: ["EPSKS"], 30: ["EPSKS"], 31: ["ERRA"],  32: ["ERRA"],  33: ["EDLA"],  34: ["EDLA"],  35: ["EDLA"],
  36: ["EPRA"],  37: ["EPRA"],  38: ["EPRA"],  39: ["EPSKS"], 40: ["EPSKS"], 41: ["EPSKS"], 42: ["EPSKS"],
  43: ["ERRA"],  44: ["ERRA"],  45: ["ERRA"],  46: ["ERRA"],  47: ["ERRA"],  48: ["ERGA"],  49: ["ERGA"],
  50: ["EPSKS"], 51: ["EPSKS"], 52: ["EPSKS"], 53: ["EPSKS"], 54: ["EPSKS"], 55: ["EPSKS"],
  56: ["EPRA"],  57: ["EPSKA"], 58: ["EPSKA"], 59: ["EPSKS"], 60: ["EPSKS"], 61: ["EPSKS"],
  62: ["EPSKS"], 63: ["EPSKS"], 64: ["ERLA"],  65: ["ERLA"],  66: ["ERLA"],  67: ["ERLA"],
  68: ["ERLA"],  69: ["ERLA"],  70: ["ERLA"],  71: ["EPSKA"], 72: ["EPSKA"], 73: ["EPSKA"],
  74: ["EPSKA"], 75: ["EPSKA"], 76: ["EPSKA"], 77: ["EPSKA"], 78: ["EPSKA"], 79: ["EPSKA"],
  80: ["EPSKA"], 81: ["EPRA"],  82: ["EPRA"],  83: ["EPRA"],  84: ["EPRA"],
};

// ─── Helper ───────────────────────────────────────────────────────────────────

export function getResultKeys(answers: FilledQuizAnswers): ProductKey[] {
  const index = answers.area * 21 + answers.installation * 7 + answers.year + 1;
  return INDEX_TO_RESULT[index] ?? [];
}

export function isAnswersFilled(answers: QuizAnswers): answers is FilledQuizAnswers {
  return answers.area !== null && answers.installation !== null && answers.year !== null;
}