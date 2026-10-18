export type TaskType = "name" | "number" | "position" | "group" | "outer" | "kind";

export interface Element {
  symbol: string;
  name: string;
  number: number;
  group: number;
  period: number;
  outer: number;
  kindId: string;
  kind: string;
}

export interface GroupInfo {
  group: number;
  roman: string;
  name: string;
}

export interface Labels {
  promptName: string;
  promptNumber: string;
  promptPosition: string;
  promptGroup: string;
  promptOuter: string;
  promptKind: string;
  reasonName: string;
  reasonNumber: string;
  reasonPosition: string;
  reasonOuter: string;
  reasonPeriod: string;
  reasonKind: string;
  reasonGroup: string;
  solutionOne: string;
  solutionSome: string;
  solutionAll: string;
  kindMetal: string;
  kindNonmetal: string;
  check: string;
  right: string;
}

export interface Props {
  seed: number;
  language: string;
  labels: Labels;
  elements: Element[];
  groups: GroupInfo[];
  types: TaskType[];
}

export interface Task {
  type: TaskType;
  /** Every symbol that counts as right; the learner marks all of them (multi) or any one of them. */
  target: string[];
  multi: boolean;
  /** A symbol that is not right, for `wrong`. */
  wrongSymbol: string;
  /** What the task asks for: the element, number, period, group, outer electrons or kind. */
  symbol?: string;
  n?: number;
  period?: number;
  group?: number;
  kindId?: string;
}

/** The kinds a task may ask for; borderline cases are never an answer because the sources disagree about them. */
const ASKED_KINDS = ["metall", "nichtmetall"] as const;

const fill = (template: string, values: Readonly<Record<string, string | number>>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));

const byNumber = (elements: readonly Element[]) => [...elements].sort((a, b) => a.number - b.number);

function need<T>(value: T | undefined, what: string): T {
  if (value === undefined) throw new Error(`no ${what}`);
  return value;
}

function symbolsWhere(elements: readonly Element[], test: (element: Element) => boolean): string[] {
  return byNumber(elements)
    .filter(test)
    .map((element) => element.symbol);
}

/** A symbol outside `target`, starting the search at a place that depends on the pick. */
function wrongFor(elements: readonly Element[], target: readonly string[], start: number): string {
  const all = byNumber(elements);
  for (let step = 0; step < all.length; step++) {
    const candidate = all[(start + step) % all.length];
    if (candidate && !target.includes(candidate.symbol)) return candidate.symbol;
  }
  throw new Error("every element is a right answer");
}

/** The task of a seed: the types in turn, each with another element, group, number or period. */
export function generate(seed: number, props: Pick<Props, "elements" | "types">): Task {
  const { elements, types } = props;
  const typeIndex = (seed - 1) % types.length;
  const round = Math.floor((seed - 1) / types.length);
  const type = need(types[typeIndex], "task type");
  const sorted = byNumber(elements);
  const pick = (length: number) => (round * 7 + typeIndex * 5) % length;

  if (type === "group") {
    const groups = [...new Set(sorted.map((element) => element.group))].sort((a, b) => a - b);
    const group = need(groups[pick(groups.length)], "group");
    const target = symbolsWhere(elements, (element) => element.group === group);
    return { type, multi: true, target, group, wrongSymbol: wrongFor(elements, target, round + 3) };
  }
  if (type === "outer") {
    const values = [...new Set(sorted.map((element) => element.outer))].sort((a, b) => a - b);
    const n = need(values[pick(values.length)], "number of outer electrons");
    const target = symbolsWhere(elements, (element) => element.outer === n);
    return { type, multi: false, target, n, wrongSymbol: wrongFor(elements, target, round + 5) };
  }
  if (type === "kind") {
    const pairs: { kindId: string; period: number }[] = [];
    for (const kindId of ASKED_KINDS) {
      for (const period of [...new Set(sorted.map((element) => element.period))].sort((a, b) => a - b)) {
        if (elements.some((element) => element.kindId === kindId && element.period === period))
          pairs.push({ kindId, period });
      }
    }
    const { kindId, period } = need(pairs[pick(pairs.length)], "kind and period");
    const target = symbolsWhere(elements, (element) => element.kindId === kindId && element.period === period);
    return { type, multi: false, target, kindId, period, wrongSymbol: wrongFor(elements, target, round + 7) };
  }
  const element = need(sorted[pick(sorted.length)], "element");
  const target = [element.symbol];
  return {
    type,
    multi: false,
    target,
    symbol: element.symbol,
    n: element.number,
    period: element.period,
    group: element.group,
    wrongSymbol: wrongFor(elements, target, element.number + 9),
  };
}

/** Right is what the task asks for: the marked symbols are all right (multi) or any one right symbol (single). */
export function check(task: Task, answer: readonly string[]): boolean {
  if (task.multi) {
    return answer.length === task.target.length && task.target.every((symbol) => answer.includes(symbol));
  }
  const [only] = answer;
  return answer.length === 1 && only !== undefined && task.target.includes(only);
}

export function solution(task: Task): string[] {
  return task.multi ? [...task.target] : [need(task.target[0], "right answer")];
}

export function wrong(task: Task): string[] {
  return [task.wrongSymbol];
}

const roman = (groups: readonly GroupInfo[], group: number) =>
  groups.find((info) => info.group === group)?.roman ?? String(group);
const groupName = (groups: readonly GroupInfo[], group: number) =>
  groups.find((info) => info.group === group)?.name ?? "";
const find = (elements: readonly Element[], symbol: string) => elements.find((element) => element.symbol === symbol);

/** The task as the learner reads it. */
export function taskText(task: Task, props: Pick<Props, "elements" | "groups" | "labels">): string {
  const { labels, elements, groups } = props;
  const target = find(elements, need(task.target[0], "right answer"));
  switch (task.type) {
    case "name":
      return fill(labels.promptName, { name: target?.name ?? "" });
    case "number":
      return fill(labels.promptNumber, { n: need(task.n, "number") });
    case "position":
      return fill(labels.promptPosition, {
        period: need(task.period, "period"),
        group: roman(groups, need(task.group, "group")),
      });
    case "group": {
      const group = need(task.group, "group");
      return fill(labels.promptGroup, { group: roman(groups, group), groupName: groupName(groups, group) });
    }
    case "outer":
      return fill(labels.promptOuter, { n: need(task.n, "number of outer electrons") });
    case "kind":
      return fill(labels.promptKind, {
        kind: task.kindId === "metall" ? labels.kindMetal : labels.kindNonmetal,
        period: need(task.period, "period"),
      });
  }
}

/** Why an answer is wrong, the most specific reason first; empty when it is right. */
export function reason(
  task: Task,
  answer: readonly string[],
  props: Pick<Props, "elements" | "groups" | "labels">,
): string {
  if (check(task, answer)) return "";
  const { labels, elements, groups } = props;
  const names = (symbols: readonly string[]) =>
    symbols.map((symbol) => find(elements, symbol)?.name ?? symbol).join(", ");
  if (task.type === "group") {
    const extra = answer.filter((symbol) => !task.target.includes(symbol));
    const missing = task.target.filter((symbol) => !answer.includes(symbol));
    return fill(labels.reasonGroup, {
      extra: extra.length === 0 ? "–" : names(extra),
      missing: missing.length === 0 ? "–" : names(missing),
    });
  }
  const tapped = find(elements, answer[0] ?? "");
  if (answer.length !== 1 || tapped === undefined)
    return fill(labels.reasonGroup, { extra: names(answer), missing: names(solution(task)) });
  const values = {
    name: tapped.name,
    symbol: tapped.symbol,
    n: tapped.number,
    period: tapped.period,
    group: roman(groups, tapped.group),
    outer: tapped.outer,
    kind: tapped.kind,
    wantedN: task.n ?? "",
    wantedPeriod: task.period ?? "",
    wantedGroup: task.group === undefined ? "" : roman(groups, task.group),
    wantedName: find(elements, task.symbol ?? "")?.name ?? "",
    wantedKind: task.kindId === "metall" ? labels.kindMetal : labels.kindNonmetal,
  };
  switch (task.type) {
    case "name":
      return fill(labels.reasonName, values);
    case "number":
      return fill(labels.reasonNumber, values);
    case "position":
      return fill(labels.reasonPosition, values);
    case "outer":
      return fill(labels.reasonOuter, values);
    case "kind":
      return tapped.period !== task.period ? fill(labels.reasonPeriod, values) : fill(labels.reasonKind, values);
  }
}

export function describe(task: Task, props: Props, _lang: string): { task: string; solution: string } {
  const names = task.target
    .map((symbol) => find(props.elements, symbol))
    .filter((element): element is Element => element !== undefined)
    .map((element) => `${element.name} (${element.symbol})`);
  const shown = names.length > 5 && !task.multi ? `${names.slice(0, 5).join(", ")}, …` : names.join(", ");
  const template = task.multi
    ? props.labels.solutionAll
    : task.target.length > 1
      ? props.labels.solutionSome
      : props.labels.solutionOne;
  return { task: taskText(task, props), solution: fill(template, { names: shown }) };
}

export const about = {
  task: {
    de: "Die Lernenden sehen eine Karte der Elemente der acht Hauptgruppen und tippen das Element oder die Elemente an, die zur Aufgabe passen: nach Name, Ordnungszahl, Periode und Hauptgruppe, alle Elemente einer Hauptgruppe, Außenelektronen oder Art (Metall, Nichtmetall) in einer Periode. Dann prüfen sie.",
    en: "Learners see a map of the elements of the eight main groups and tap the element or elements that fit the task: by name, atomic number, period and main group, all elements of one main group, outer electrons, or kind (metal, non-metal) in one period. Then they check.",
  },
  answer: {
    de: "Eine Auswahl von Feldern der Karte: ein Element, oder bei der Aufgabe zu einer Hauptgruppe alle Elemente dieser Gruppe.",
    en: "A selection of cells of the map: one element, or all elements of the group when the task asks for a main group.",
  },
  correct: {
    de: "Das angetippte Element passt zur Eigenschaft der Aufgabe (bei Außenelektronen oder Art genügt irgendein passendes Element). Bei einer Hauptgruppe müssen genau alle ihre Elemente markiert sein.",
    en: "The tapped element fits the property of the task (for outer electrons or kind any fitting element is enough). For a main group exactly all of its elements must be marked.",
  },
  mistakes: [
    {
      de: "Ein Element mit der falschen Ordnungszahl, Periode oder Hauptgruppe wird angetippt.",
      en: "An element with the wrong atomic number, period or main group is tapped.",
    },
    {
      de: "Bei der Hauptgruppe fehlen Elemente oder es sind Elemente anderer Gruppen markiert.",
      en: "For a main group some elements are missing or elements of other groups are marked.",
    },
    {
      de: "Gruppennummer (1 bis 18) und Hauptgruppe (I bis VIII) werden verwechselt.",
      en: "The group number (1 to 18) and the main group (I to VIII) are mixed up.",
    },
  ],
};
