import { describe, expect, it } from "vitest";
import {
  about,
  check,
  describe as describeTask,
  generate,
  neutronsOf,
  reason,
  shells,
  solution,
  wrong,
} from "./AtomBuilder.ts";

describe("generate", () => {
  it("gives the same element for the same seed and a new one for each of the first ten", () => {
    expect(generate(3)).toEqual(generate(3));
    const names = new Set(Array.from({ length: 10 }, (_, i) => generate(i + 1).name));
    expect(names.size).toBe(10);
  });
});

describe("check", () => {
  const carbon = generate(6);

  it("accepts the neutral atom with the right counts", () => {
    expect(carbon.name).toBe("Kohlenstoff");
    expect(check(carbon, { protons: 6, neutrons: 6, electrons: 6 })).toBe(true);
    expect(check(carbon, solution(carbon))).toBe(true);
  });

  it("rejects the typical mistakes, each with its reason", () => {
    expect(check(carbon, { protons: 6, neutrons: 6, electrons: 7 })).toBe(false);
    expect(reason(carbon, { protons: 6, neutrons: 6, electrons: 7 })).toContain("neutral");
    expect(check(carbon, { protons: 6, neutrons: 12, electrons: 6 })).toBe(false);
    expect(reason(carbon, { protons: 6, neutrons: 12, electrons: 6 })).toContain("12 − 6 = 6");
    expect(reason(carbon, { protons: 5, neutrons: 6, electrons: 5 })).toContain("6 Protonen");
    expect(check(carbon, wrong(carbon))).toBe(false);
  });

  it("has no reason for a right answer", () => {
    expect(reason(carbon, solution(carbon))).toBe("");
  });
});

describe("neutronsOf", () => {
  it("is the mass number minus the protons", () => {
    expect(neutronsOf(generate(1))).toBe(0);
    expect(neutronsOf(generate(10))).toBe(10);
  });
});

describe("shells", () => {
  it("fills K, L, M and N in turn", () => {
    expect(shells(1)).toEqual([1, 0, 0, 0]);
    expect(shells(10)).toEqual([2, 8, 0, 0]);
    expect(shells(11)).toEqual([2, 8, 1, 0]);
  });
});

describe("describe and about", () => {
  it("states the task and the solution for a seed", () => {
    const described = describeTask(generate(2));
    expect(described.task).toContain("Helium");
    expect(described.solution).toContain("2 Protonen, 2 Neutronen und 2 Elektronen");
    expect(about.mistakes.length).toBeGreaterThan(0);
  });
});
