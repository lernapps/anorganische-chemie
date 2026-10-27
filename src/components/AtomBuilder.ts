export interface Answer {
  protons: number;
  neutrons: number;
  electrons: number;
}

export type Language = "de" | "en";

export interface Task {
  name: Record<Language, string>;
  symbol: string;
  protons: number;
  massNumber: number;
}

/** The elements 1 to 10 with the mass number of their most common isotope (Wikipedia, infobox of each element). */
const ELEMENTS: readonly Task[] = [
  { name: { de: "Wasserstoff", en: "Hydrogen" }, symbol: "H", protons: 1, massNumber: 1 },
  { name: { de: "Helium", en: "Helium" }, symbol: "He", protons: 2, massNumber: 4 },
  { name: { de: "Lithium", en: "Lithium" }, symbol: "Li", protons: 3, massNumber: 7 },
  { name: { de: "Beryllium", en: "Beryllium" }, symbol: "Be", protons: 4, massNumber: 9 },
  { name: { de: "Bor", en: "Boron" }, symbol: "B", protons: 5, massNumber: 11 },
  { name: { de: "Kohlenstoff", en: "Carbon" }, symbol: "C", protons: 6, massNumber: 12 },
  { name: { de: "Stickstoff", en: "Nitrogen" }, symbol: "N", protons: 7, massNumber: 14 },
  { name: { de: "Sauerstoff", en: "Oxygen" }, symbol: "O", protons: 8, massNumber: 16 },
  { name: { de: "Fluor", en: "Fluorine" }, symbol: "F", protons: 9, massNumber: 19 },
  { name: { de: "Neon", en: "Neon" }, symbol: "Ne", protons: 10, massNumber: 20 },
];

/** How many particles of each kind a learner may set at most. */
export const MAXIMUM = 24;

/** The task of a seed: the elements in turn, so that every task number is a different element. */
export function generate(seed: number): Task {
  const element = ELEMENTS[(seed - 1) % ELEMENTS.length];
  if (element === undefined) throw new Error(`no element for seed ${seed}`);
  return element;
}

export const neutronsOf = (task: Task): number => task.massNumber - task.protons;

/** Right is the atom of this element that is neutral: any answer with the right counts, nothing else. */
export function check(task: Task, answer: Answer): boolean {
  return answer.protons === task.protons && answer.electrons === task.protons && answer.neutrons === neutronsOf(task);
}

export function solution(task: Task): Answer {
  return { protons: task.protons, neutrons: neutronsOf(task), electrons: task.protons };
}

/** A typical mistake: one electron too many, so the atom is not neutral. */
export function wrong(task: Task): Answer {
  return { ...solution(task), electrons: task.protons + 1 };
}

const NOUNS = {
  de: { proton: ["Proton", "Protonen"], neutron: ["Neutron", "Neutronen"], electron: ["Elektron", "Elektronen"] },
  en: { proton: ["proton", "protons"], neutron: ["neutron", "neutrons"], electron: ["electron", "electrons"] },
} as const;

/** A count with its noun in the right number: 1 Proton, 0 Neutronen, 2 protons. */
export function count(language: Language, n: number, kind: keyof (typeof NOUNS)["de"]): string {
  const [one, many] = NOUNS[language][kind];
  return `${n} ${n === 1 ? one : many}`;
}

const languageOf = (lang: string): Language => (lang === "en" ? "en" : "de");

/** The app's message for a wrong answer, the most specific reason first; undefined for a right one. */
export function reason(task: Task, answer: Answer, _props: unknown, lang: string): string | undefined {
  if (check(task, answer)) return undefined;
  const language = languageOf(lang);
  const name = task.name[language];
  // what does not fit and where to find it, never the number itself: the solution comes after the answer
  if (answer.protons !== task.protons) {
    return language === "en"
      ? `The number of protons is the atomic number. Look up the atomic number of ${name} in the periodic table.`
      : `Die Protonenzahl ist die Ordnungszahl. Schau im Periodensystem nach, welche Ordnungszahl ${name} hat.`;
  }
  if (answer.electrons !== answer.protons) {
    return language === "en"
      ? "An atom is neutral: it has as many electrons as protons."
      : "Ein Atom ist neutral: Es hat gleich viele Elektronen wie Protonen.";
  }
  if (answer.neutrons === task.massNumber) {
    return language === "en"
      ? "The mass number counts protons and neutrons together. Take the protons away from it."
      : "Die Massenzahl zählt Protonen und Neutronen zusammen. Zieh die Protonen davon ab.";
  }
  return language === "en"
    ? "The number of neutrons is the mass number minus the number of protons. Work it out again."
    : "Die Neutronenzahl ist die Massenzahl minus die Protonenzahl. Rechne noch einmal nach.";
}

/** How the electrons fill the shells K, L, M and N: 2, 8, 8, then 2 more. */
export function shells(electrons: number): number[] {
  const sizes = [2, 8, 8, 2];
  const counts: number[] = [];
  let rest = electrons;
  for (const size of sizes) {
    counts.push(Math.min(size, Math.max(rest, 0)));
    rest -= size;
  }
  return counts;
}

const fill = (template: string, values: Readonly<Record<string, string | number>>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));

/** The task as a learner reads it, for a tutor, with {name}, {symbol} and {A} for the element and its mass number. */
export function template(_props: unknown, lang: string): string {
  return languageOf(lang) === "en"
    ? "Build a neutral atom of {name} ({symbol}) with mass number {A}. Set the number of protons, neutrons and electrons."
    : "Baue ein neutrales Atom von {name} ({symbol}) mit der Massenzahl {A}. Stelle die Zahl der Protonen, Neutronen und Elektronen ein.";
}

/**
 * What sets a task: the element, its symbol and mass number, and its atomic number Z, which the task does not show
 * (the learner looks it up), so that a tutor knows it.
 */
export function params(task: Task, _props: unknown, lang: string): Record<string, string | number> {
  return { name: task.name[languageOf(lang)], symbol: task.symbol, A: task.massNumber, Z: task.protons };
}

/**
 * The answer of each typical mistake of about.mistakes, for a tutor: the mass number entered as the number of
 * neutrons; a charged atom and a wrong number of protons are each many answers.
 */
export function mistakes(task: Task, _props?: unknown): (Answer | undefined)[] {
  return [undefined, { ...solution(task), neutrons: task.massNumber }, undefined];
}

/** An answer as the learner gives it: "6 Protonen, 6 Neutronen, 6 Elektronen". */
export function show(answer: Answer, _task: Task, _props: unknown, lang: string): string {
  const language = languageOf(lang);
  return [
    count(language, answer.protons, "proton"),
    count(language, answer.neutrons, "neutron"),
    count(language, answer.electrons, "electron"),
  ].join(", ");
}

export function describe(task: Task, props: unknown, lang: string): { task: string; solution: string } {
  const language = languageOf(lang);
  const name = task.name[language];
  const neutrons = neutronsOf(task);
  return {
    task: fill(template(props, lang), params(task, props, lang)),
    solution:
      language === "en"
        ? `${name} has ${count("en", task.protons, "proton")}, ${count("en", neutrons, "neutron")} and ${count("en", task.protons, "electron")}.`
        : `${name} hat ${count("de", task.protons, "proton")}, ${count("de", neutrons, "neutron")} und ${count("de", task.protons, "electron")}.`,
  };
}

export const about = {
  task: {
    de: "Die Lernenden stellen für ein gegebenes Element mit Plus- und Minus-Tasten die Zahl der Protonen, Neutronen und Elektronen ein und sehen ihr Atom als Bild.",
    en: "Learners set the number of protons, neutrons and electrons for a given element with plus and minus buttons and see their atom as a picture.",
  },
  answer: {
    de: "Drei ganze Zahlen, mit Plus und Minus eingestellt: Protonen, Neutronen, Elektronen; dann „Prüfen“ unter der Komponente.",
    en: "Three whole numbers, set with plus and minus: protons, neutrons, electrons; then “Check” below the component.",
  },
  correct: {
    de: "Die Protonenzahl ist die Ordnungszahl, die Elektronenzahl ist gleich der Protonenzahl (neutrales Atom), die Neutronenzahl ist Massenzahl minus Protonenzahl.",
    en: "The number of protons is the atomic number, the number of electrons equals the number of protons (neutral atom), the number of neutrons is the mass number minus the number of protons.",
  },
  mistakes: [
    {
      de: "Die Elektronenzahl weicht von der Protonenzahl ab, das Atom wäre geladen.",
      en: "The number of electrons differs from the number of protons, so the atom would be charged.",
    },
    {
      de: "Die Massenzahl wird als Neutronenzahl eingetragen.",
      en: "The mass number is entered as the number of neutrons.",
    },
    {
      de: "Die Protonenzahl passt nicht zur Ordnungszahl des Elements.",
      en: "The number of protons does not match the atomic number of the element.",
    },
  ],
};
