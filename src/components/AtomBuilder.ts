export interface Answer {
  protons: number;
  neutrons: number;
  electrons: number;
}

export interface Task {
  name: string;
  symbol: string;
  protons: number;
  massNumber: number;
}

/** The elements 1 to 10 with the mass number of their most common isotope (Wikipedia, infobox of each element). */
const ELEMENTS: readonly Task[] = [
  { name: "Wasserstoff", symbol: "H", protons: 1, massNumber: 1 },
  { name: "Helium", symbol: "He", protons: 2, massNumber: 4 },
  { name: "Lithium", symbol: "Li", protons: 3, massNumber: 7 },
  { name: "Beryllium", symbol: "Be", protons: 4, massNumber: 9 },
  { name: "Bor", symbol: "B", protons: 5, massNumber: 11 },
  { name: "Kohlenstoff", symbol: "C", protons: 6, massNumber: 12 },
  { name: "Stickstoff", symbol: "N", protons: 7, massNumber: 14 },
  { name: "Sauerstoff", symbol: "O", protons: 8, massNumber: 16 },
  { name: "Fluor", symbol: "F", protons: 9, massNumber: 19 },
  { name: "Neon", symbol: "Ne", protons: 10, massNumber: 20 },
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
export function reason(task: Task, answer: Answer): string {
  if (check(task, answer)) return "";
  if (answer.protons !== task.protons) {
    return `Die Protonenzahl ist die Ordnungszahl. ${task.name} hat ${task.protons} Protonen.`;
  }
  if (answer.electrons !== answer.protons) {
    return "Ein Atom ist neutral: Es hat gleich viele Elektronen wie Protonen.";
  }
  return `Die Neutronenzahl ist die Massenzahl minus die Protonenzahl: ${task.massNumber} − ${task.protons} = ${neutronsOf(task)}.`;
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

export function describe(task: Task): { task: string; solution: string } {
  return {
    task: `Baue ein neutrales Atom von ${task.name} (${task.symbol}) mit der Massenzahl ${task.massNumber}. Stelle die Zahl der Protonen, Neutronen und Elektronen ein.`,
    solution: `${task.name} hat ${task.protons} Protonen, ${neutronsOf(task)} Neutronen und ${task.protons} Elektronen.`,
  };
}

export const about = {
  task: "Die Lernenden stellen für ein gegebenes Element mit Plus- und Minus-Tasten die Zahl der Protonen, Neutronen und Elektronen ein und prüfen ihr Atom.",
  answer: "Drei ganze Zahlen: Protonen, Neutronen, Elektronen.",
  correct:
    "Die Protonenzahl ist die Ordnungszahl, die Elektronenzahl ist gleich der Protonenzahl (neutrales Atom), die Neutronenzahl ist Massenzahl minus Protonenzahl.",
  mistakes: [
    "Die Elektronenzahl weicht von der Protonenzahl ab, das Atom wäre geladen.",
    "Die Massenzahl wird als Neutronenzahl eingetragen.",
    "Die Protonenzahl passt nicht zur Ordnungszahl des Elements.",
  ],
};
