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

/**
 * The texts of a block. Each block has one task type and gives the texts it needs: the prompt and the reason of its
 * type, the solution texts, and for `kind` the names of the kinds; reasonGroup also serves as the message when a
 * single-element task gets no or several elements.
 */
export interface Labels {
  promptName?: string;
  promptNumber?: string;
  promptPosition?: string;
  promptGroup?: string;
  promptOuter?: string;
  promptKind?: string;
  reasonName?: string;
  reasonNumber?: string;
  reasonPosition?: string;
  reasonOuter?: string;
  reasonPeriod?: string;
  reasonKind?: string;
  reasonGroup?: string;
  solutionOne?: string;
  solutionSome?: string;
  solutionAll?: string;
  kindMetal?: string;
  kindNonmetal?: string;
}

export interface Props {
  seed?: number;
  language: string;
  labels: Labels;
  elements: Element[];
  groups: GroupInfo[];
  /** The one task type of the block. */
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

/**
 * Where the tasks of each type start, so that the blocks of one page start with different elements: the offsets the
 * types had when one block mixed them (5 for the second type of a page, 10 for the third).
 */
const START: Readonly<Record<TaskType, number>> = { name: 0, number: 5, position: 10, group: 0, outer: 5, kind: 0 };

/** The one task type of a block: its `types` must name exactly one, so that every task of the block reads alike. */
export function typeOf(props: Pick<Props, "types">): TaskType {
  const [type, ...more] = props.types;
  if (type === undefined || more.length > 0) {
    throw new Error(`ElementFinder takes exactly one task type in types, not ${JSON.stringify(props.types)}`);
  }
  return type;
}

/** A text of the block's labels, which its task type needs. */
function label(labels: Labels, key: keyof Labels): string {
  const text = labels[key];
  if (text === undefined || text.trim() === "") throw new Error(`the block's labels have no ${key}`);
  return text;
}

/** The task of a seed: another element, group, number or period of the block's task type for each seed. */
export function generate(seed: number, props: Pick<Props, "elements" | "types">): Task {
  const { elements } = props;
  const type = typeOf(props);
  const round = seed - 1;
  const sorted = byNumber(elements);
  // 7 has no factor in common with 44 elements, 8 groups, 8 numbers of outer electrons or 12 kinds and periods, so
  // the seeds go through all of them before one comes again; the task depends on the pick alone, so that a block has
  // as many task numbers as it has different tasks
  let index = 0;
  const pick = (length: number) => (index = (round * 7 + START[type]) % length);

  if (type === "group") {
    const groups = [...new Set(sorted.map((element) => element.group))].sort((a, b) => a - b);
    const group = need(groups[pick(groups.length)], "group");
    const target = symbolsWhere(elements, (element) => element.group === group);
    return { type, multi: true, target, group, wrongSymbol: wrongFor(elements, target, index + 3) };
  }
  if (type === "outer") {
    const values = [...new Set(sorted.map((element) => element.outer))].sort((a, b) => a - b);
    const n = need(values[pick(values.length)], "number of outer electrons");
    const target = symbolsWhere(elements, (element) => element.outer === n);
    return { type, multi: false, target, n, wrongSymbol: wrongFor(elements, target, index + 5) };
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
    return { type, multi: false, target, kindId, period, wrongSymbol: wrongFor(elements, target, index + 7) };
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

/** The props that the texts of a task need. */
type TextProps = Pick<Props, "elements" | "groups" | "labels" | "types">;

/** The prompt of each task type in the block's labels. */
const PROMPTS: Readonly<Record<TaskType, keyof Labels>> = {
  name: "promptName",
  number: "promptNumber",
  position: "promptPosition",
  group: "promptGroup",
  outer: "promptOuter",
  kind: "promptKind",
};

/** The name of the asked kind, as the block's labels give it. */
const kindName = (labels: Labels, kindId: string | undefined) =>
  label(labels, kindId === "metall" ? "kindMetal" : "kindNonmetal");

/**
 * The task as a learner reads it, for a tutor: the prompt of the block's one task type, with {name} for what sets a
 * task, which params gives.
 */
export function template(props: Pick<Props, "labels" | "types">, _lang?: string): string {
  return label(props.labels, PROMPTS[typeOf(props)]);
}

/**
 * What sets a task, by the names of the prompt's placeholders: the element's name, the atomic number, the period and
 * main group, the main group and its name, the number of outer electrons, or the kind and the period. The same names
 * for every task of a block, since a block has one task type.
 */
export function params(task: Task, props: TextProps, _lang?: string): Record<string, string | number> {
  const { labels, elements, groups } = props;
  switch (task.type) {
    case "name":
      return { name: need(find(elements, need(task.symbol, "element")), "element").name };
    case "number":
    case "outer":
      return { n: need(task.n, "number") };
    case "position":
      return { period: need(task.period, "period"), group: roman(groups, need(task.group, "group")) };
    case "group": {
      const group = need(task.group, "group");
      return { group: roman(groups, group), groupName: groupName(groups, group) };
    }
    case "kind":
      return { kind: kindName(labels, task.kindId), period: need(task.period, "period") };
  }
}

/** The task as the learner reads it. */
export function taskText(task: Task, props: TextProps): string {
  return fill(template(props), params(task, props));
}

/** The app's message for a wrong answer, the most specific reason first; undefined for a right one. */
export function reason(task: Task, answer: readonly string[], props: TextProps, _lang?: string): string | undefined {
  if (check(task, answer)) return undefined;
  const { labels, elements, groups } = props;
  const names = (symbols: readonly string[]) =>
    symbols.map((symbol) => find(elements, symbol)?.name ?? symbol).join(", ");
  const several = (extra: readonly string[], missing: readonly string[]) =>
    labels.reasonGroup === undefined
      ? undefined
      : fill(labels.reasonGroup, {
          extra: extra.length === 0 ? "–" : names(extra),
          missing: missing.length === 0 ? "–" : names(missing),
        });
  if (task.type === "group") {
    return several(
      answer.filter((symbol) => !task.target.includes(symbol)),
      task.target.filter((symbol) => !answer.includes(symbol)),
    );
  }
  const tapped = find(elements, answer[0] ?? "");
  if (answer.length !== 1 || tapped === undefined) return several(answer, solution(task));
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
    wantedKind: task.type === "kind" ? kindName(labels, task.kindId) : "",
  };
  switch (task.type) {
    case "name":
      return fill(label(labels, "reasonName"), values);
    case "number":
      return fill(label(labels, "reasonNumber"), values);
    case "position":
      return fill(label(labels, "reasonPosition"), values);
    case "outer":
      return fill(label(labels, "reasonOuter"), values);
    case "kind":
      return tapped.period !== task.period
        ? fill(label(labels, "reasonPeriod"), values)
        : fill(label(labels, "reasonKind"), values);
  }
}

/** Elements as the learner names them: "Kohlenstoff (C)", in the order of the symbols. */
function named(elements: readonly Element[], symbols: readonly string[]): string[] {
  return symbols
    .map((symbol) => find(elements, symbol))
    .filter((element): element is Element => element !== undefined)
    .map((element) => `${element.name} (${element.symbol})`);
}

export function describe(task: Task, props: Props, _lang: string): { task: string; solution: string } {
  const names = named(props.elements, task.target);
  const shown = names.length > 5 && !task.multi ? `${names.slice(0, 5).join(", ")}, …` : names.join(", ");
  const template = task.multi ? "solutionAll" : task.target.length > 1 ? "solutionSome" : "solutionOne";
  return { task: taskText(task, props), solution: fill(label(props.labels, template), { names: shown }) };
}

/**
 * The answer of each typical mistake of about.mistakes, for a tutor: none has one fixed answer (a wrong element, a
 * group with elements missing or too many, main group and group number mixed up are each many answers).
 */
export function mistakes(_task: Task, _props?: unknown): undefined[] {
  return about.mistakes.map(() => undefined);
}

/** An answer as the learner gives it: the elements tapped, "Kohlenstoff (C), Silicium (Si)"; "–" for none. */
export function show(answer: readonly string[], _task: Task, props: Pick<Props, "elements">, _lang?: string): string {
  const names = named(props.elements, answer);
  return names.length === 0 ? "–" : names.join(", ");
}

export const about = {
  task: {
    de: "Die Lernenden sehen eine Karte der Elemente der acht Hauptgruppen und tippen das Element oder die Elemente an, die zur Aufgabe passen: nach Name, Ordnungszahl, Periode und Hauptgruppe, alle Elemente einer Hauptgruppe, Außenelektronen oder Art (Metall, Nichtmetall) in einer Periode. Jede Übung fragt nach einer dieser Arten.",
    en: "Learners see a map of the elements of the eight main groups and tap the element or elements that fit the task: by name, atomic number, period and main group, all elements of one main group, outer electrons, or kind (metal, non-metal) in one period. Each exercise asks for one of these kinds of task.",
  },
  answer: {
    de: "Die Lernenden tippen auf der Karte ein Element an, bei der Aufgabe zu einer Hauptgruppe alle Elemente dieser Gruppe (ein zweites Tippen nimmt die Markierung zurück), und drücken dann „Prüfen“ unter der Karte.",
    en: "Learners tap one element on the map, or all elements of the group when the task asks for a main group (tapping again removes the mark), and then press “Check” below the map.",
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
