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

/** Why an answer is wrong, the most specific reason first; empty when it is right. */
export function reason(task: Task, answer: Answer, language: Language): string {
  if (check(task, answer)) return "";
  const name = task.name[language];
  if (answer.protons !== task.protons) {
    return language === "en"
      ? `The number of protons is the atomic number. ${name} has ${task.protons} protons.`
      : `Die Protonenzahl ist die Ordnungszahl. ${name} hat ${task.protons} Protonen.`;
  }
  if (answer.electrons !== answer.protons) {
    return language === "en"
      ? "An atom is neutral: it has as many electrons as protons."
      : "Ein Atom ist neutral: Es hat gleich viele Elektronen wie Protonen.";
  }
  const sum = `${task.massNumber} − ${task.protons} = ${neutronsOf(task)}`;
  return language === "en"
    ? `The number of neutrons is the mass number minus the number of protons: ${sum}.`
    : `Die Neutronenzahl ist die Massenzahl minus die Protonenzahl: ${sum}.`;
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

const languageOf = (lang: string): Language => (lang === "en" ? "en" : "de");

export function describe(task: Task, _props: unknown, lang: string): { task: string; solution: string } {
  const language = languageOf(lang);
  const name = task.name[language];
  const neutrons = neutronsOf(task);
  return language === "en"
    ? {
        task: `Build a neutral atom of ${name} (${task.symbol}) with mass number ${task.massNumber}. Set the number of protons, neutrons and electrons.`,
        solution: `${name} has ${task.protons} protons, ${neutrons} neutrons and ${task.protons} electrons.`,
      }
    : {
        task: `Baue ein neutrales Atom von ${name} (${task.symbol}) mit der Massenzahl ${task.massNumber}. Stelle die Zahl der Protonen, Neutronen und Elektronen ein.`,
        solution: `${name} hat ${task.protons} Protonen, ${neutrons} Neutronen und ${task.protons} Elektronen.`,
      };
}

export const about = {
  task: {
    de: "Die Lernenden stellen für ein gegebenes Element mit Plus- und Minus-Tasten die Zahl der Protonen, Neutronen und Elektronen ein und prüfen ihr Atom.",
    en: "Learners set the number of protons, neutrons and electrons for a given element with plus and minus buttons and check their atom.",
  },
  answer: {
    de: "Drei ganze Zahlen: Protonen, Neutronen, Elektronen.",
    en: "Three whole numbers: protons, neutrons, electrons.",
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
