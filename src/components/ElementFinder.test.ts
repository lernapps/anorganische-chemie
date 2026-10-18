import { describe, expect, it } from "vitest";
import {
  about,
  check,
  describe as describeTask,
  generate,
  taskText,
  reason,
  solution,
  wrong,
  type Element,
  type GroupInfo,
  type Labels,
  type Props,
  type TaskType,
} from "./ElementFinder.ts";

const KINDS: Record<string, string> = { metall: "Metall", nichtmetall: "Nichtmetall", grenzfall: "Grenzfall" };

const table: [string, string, number, number, number, number, string][] = [
  ["H", "Wasserstoff", 1, 1, 1, 1, "nichtmetall"],
  ["He", "Helium", 2, 18, 1, 2, "nichtmetall"],
  ["Li", "Lithium", 3, 1, 2, 1, "metall"],
  ["Be", "Beryllium", 4, 2, 2, 2, "metall"],
  ["B", "Bor", 5, 13, 2, 3, "grenzfall"],
  ["C", "Kohlenstoff", 6, 14, 2, 4, "nichtmetall"],
  ["N", "Stickstoff", 7, 15, 2, 5, "nichtmetall"],
  ["O", "Sauerstoff", 8, 16, 2, 6, "nichtmetall"],
  ["F", "Fluor", 9, 17, 2, 7, "nichtmetall"],
  ["Ne", "Neon", 10, 18, 2, 8, "nichtmetall"],
  ["Na", "Natrium", 11, 1, 3, 1, "metall"],
  ["Mg", "Magnesium", 12, 2, 3, 2, "metall"],
  ["Al", "Aluminium", 13, 13, 3, 3, "metall"],
  ["Si", "Silicium", 14, 14, 3, 4, "grenzfall"],
  ["P", "Phosphor", 15, 15, 3, 5, "nichtmetall"],
  ["S", "Schwefel", 16, 16, 3, 6, "nichtmetall"],
  ["Cl", "Chlor", 17, 17, 3, 7, "nichtmetall"],
  ["Ar", "Argon", 18, 18, 3, 8, "nichtmetall"],
  ["K", "Kalium", 19, 1, 4, 1, "metall"],
  ["Ca", "Calcium", 20, 2, 4, 2, "metall"],
  ["Ga", "Gallium", 31, 13, 4, 3, "metall"],
  ["Ge", "Germanium", 32, 14, 4, 4, "grenzfall"],
  ["As", "Arsen", 33, 15, 4, 5, "grenzfall"],
  ["Se", "Selen", 34, 16, 4, 6, "grenzfall"],
  ["Br", "Brom", 35, 17, 4, 7, "nichtmetall"],
  ["Kr", "Krypton", 36, 18, 4, 8, "nichtmetall"],
  ["Rb", "Rubidium", 37, 1, 5, 1, "metall"],
  ["Sr", "Strontium", 38, 2, 5, 2, "metall"],
  ["In", "Indium", 49, 13, 5, 3, "metall"],
  ["Sn", "Zinn", 50, 14, 5, 4, "metall"],
  ["Sb", "Antimon", 51, 15, 5, 5, "grenzfall"],
  ["Te", "Tellur", 52, 16, 5, 6, "grenzfall"],
  ["I", "Iod", 53, 17, 5, 7, "nichtmetall"],
  ["Xe", "Xenon", 54, 18, 5, 8, "nichtmetall"],
  ["Cs", "Caesium", 55, 1, 6, 1, "metall"],
  ["Ba", "Barium", 56, 2, 6, 2, "metall"],
  ["Tl", "Thallium", 81, 13, 6, 3, "metall"],
  ["Pb", "Blei", 82, 14, 6, 4, "metall"],
  ["Bi", "Bismut", 83, 15, 6, 5, "grenzfall"],
  ["Po", "Polonium", 84, 16, 6, 6, "grenzfall"],
  ["At", "Astat", 85, 17, 6, 7, "grenzfall"],
  ["Rn", "Radon", 86, 18, 6, 8, "nichtmetall"],
  ["Fr", "Francium", 87, 1, 7, 1, "metall"],
  ["Ra", "Radium", 88, 2, 7, 2, "metall"],
];

const elements: Element[] = table.map(([symbol, name, number, group, period, outer, kindId]) => ({
  symbol,
  name,
  number,
  group,
  period,
  outer,
  kindId,
  kind: KINDS[kindId] ?? kindId,
}));

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const groups: GroupInfo[] = [1, 2, 13, 14, 15, 16, 17, 18].map((group, index) => ({
  group,
  roman: ROMAN[index] ?? "",
  name: "Gruppe " + group,
}));

const labels: Labels = {
  promptName: "Tippe auf {name}.",
  promptNumber: "Tippe auf das Element mit der Ordnungszahl {n}.",
  promptPosition: "Tippe auf das Element in Periode {period} und Hauptgruppe {group}.",
  promptGroup: "Tippe auf alle Elemente der Hauptgruppe {group} ({groupName}).",
  promptOuter: "Tippe auf ein Element mit {n} Außenelektronen.",
  promptKind: "Tippe auf ein {kind} der Periode {period}.",
  reasonName: "Das ist {name} ({symbol}). Gesucht ist {wantedName}.",
  reasonNumber: "{name} hat die Ordnungszahl {n}. Gesucht ist die Ordnungszahl {wantedN}.",
  reasonPosition:
    "{name} steht in Periode {period} und Hauptgruppe {group}. Gesucht ist Periode {wantedPeriod}, Hauptgruppe {wantedGroup}.",
  reasonOuter: "{name} hat {outer} Außenelektronen. Gesucht sind {wantedN}.",
  reasonPeriod: "{name} steht in Periode {period}. Gesucht ist Periode {wantedPeriod}.",
  reasonKind: "{name} ist ein {kind}. Gesucht ist ein {wantedKind}.",
  reasonGroup: "Zu viel markiert: {extra}. Es fehlen: {missing}.",
  solutionOne: "Richtig ist: {names}.",
  solutionSome: "Richtig sind zum Beispiel: {names}.",
  solutionAll: "Richtig sind: {names}.",
  kindMetal: "Metall",
  kindNonmetal: "Nichtmetall",
  check: "Prüfen",
  right: "Richtig!",
};

const types: TaskType[] = ["name", "number", "position", "group", "outer", "kind"];
const props = { elements, types, groups, labels };
const fullProps: Props = { seed: 1, language: "de", ...props };
const SEEDS = Array.from({ length: 67 }, (_, index) => index + 1);

describe("generate", () => {
  it("gives the same task for the same seed", () => {
    for (const seed of SEEDS) expect(generate(seed, props)).toEqual(generate(seed, props));
  });

  it("uses every task type in turn", () => {
    expect(SEEDS.slice(0, 6).map((seed) => generate(seed, props).type)).toEqual(types);
  });

  it("gives many different tasks", () => {
    const tasks = new Set(SEEDS.map((seed) => JSON.stringify(generate(seed, props))));
    expect(tasks.size).toBeGreaterThanOrEqual(60);
  });

  it("always has a right answer, a wrong symbol that is not right, and never asks for a borderline case", () => {
    for (const seed of SEEDS) {
      const task = generate(seed, props);
      expect(task.target.length).toBeGreaterThan(0);
      expect(task.target).not.toContain(task.wrongSymbol);
      for (const symbol of task.target) {
        const element = elements.find((candidate) => candidate.symbol === symbol);
        expect(element).toBeDefined();
        if (task.type === "kind") expect(element?.kindId).not.toBe("grenzfall");
      }
    }
  });
});

describe("check", () => {
  it("accepts the solution and rejects the wrong answer for every seed", () => {
    for (const seed of SEEDS) {
      const task = generate(seed, props);
      expect(check(task, solution(task))).toBe(true);
      expect(check(task, wrong(task))).toBe(false);
    }
  });

  it("accepts any element that has the asked property", () => {
    const task = generate(5, props);
    expect(task.type).toBe("outer");
    for (const symbol of task.target) expect(check(task, [symbol])).toBe(true);
    expect(check(task, [])).toBe(false);
    expect(check(task, [...task.target, task.wrongSymbol])).toBe(task.target.length === 0);
  });

  it("wants exactly all elements of a main group", () => {
    const task = generate(4, props);
    expect(task.type).toBe("group");
    expect(task.multi).toBe(true);
    expect(check(task, [...task.target].reverse())).toBe(true);
    expect(check(task, task.target.slice(1))).toBe(false);
    expect(check(task, [...task.target, task.wrongSymbol])).toBe(false);
  });
});

describe("prompt, reason and describe", () => {
  it("states each task type in plain words", () => {
    const texts = types.map((_type, index) => taskText(generate(index + 1, props), props));
    expect(texts[0]).toMatch(/^Tippe auf [A-Za-zäöü]+\.$/);
    expect(texts[1]).toContain("Ordnungszahl");
    expect(texts[2]).toContain("Periode");
    expect(texts[3]).toContain("alle Elemente der Hauptgruppe");
    expect(texts[4]).toContain("Außenelektronen");
    expect(texts[5]).toContain("der Periode");
    for (const text of texts) expect(text).not.toMatch(/[{}]/);
  });

  it("has no reason for a right answer and a filled-in one for a wrong answer", () => {
    for (const seed of SEEDS) {
      const task = generate(seed, props);
      expect(reason(task, solution(task), props)).toBe("");
      const why = reason(task, wrong(task), props);
      expect(why).not.toBe("");
      expect(why).not.toMatch(/[{}]/);
    }
  });

  it("names the tapped element and what was asked", () => {
    const number = generate(2, props);
    const why = reason(number, [number.wrongSymbol], props);
    expect(why).toContain("hat die Ordnungszahl");
    expect(why).toContain(String(number.n));
  });

  it("tells a wrong period before a wrong kind", () => {
    const task = generate(6, props);
    expect(task.type).toBe("kind");
    const samePeriodWrongKind = elements.find(
      (element) => element.period === task.period && element.kindId !== task.kindId && element.kindId !== "grenzfall",
    );
    if (samePeriodWrongKind) expect(reason(task, [samePeriodWrongKind.symbol], props)).toContain("ist ein");
    const otherPeriod = elements.find((element) => element.period !== task.period);
    expect(reason(task, [otherPeriod?.symbol ?? ""], props)).toContain("steht in Periode");
  });

  it("lists what is wrong in a main group answer", () => {
    const task = generate(4, props);
    const why = reason(task, [task.wrongSymbol], props);
    expect(why).toContain("Zu viel markiert");
    expect(why).toContain("Es fehlen");
  });

  it("describes the task and its solution for the no-JavaScript page", () => {
    const one = describeTask(generate(1, props), fullProps, "de");
    expect(one.task).toMatch(/^Tippe auf /);
    expect(one.solution).toMatch(/^Richtig ist: .+\(.+\)\.$/);
    const all = describeTask(generate(4, props), fullProps, "de");
    expect(all.solution).toMatch(/^Richtig sind: /);
    const some = describeTask(generate(5, props), fullProps, "de");
    expect(some.solution).toMatch(/^Richtig sind zum Beispiel: /);
  });
});

describe("about", () => {
  it("says what the exercise is in both languages", () => {
    for (const text of [about.task, about.answer, about.correct, ...about.mistakes]) {
      expect(text.de.length).toBeGreaterThan(10);
      expect(text.en.length).toBeGreaterThan(10);
    }
  });
});
