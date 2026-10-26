import { describe, expect, it } from "vitest";
import {
  about,
  check,
  count,
  describe as describeTask,
  generate,
  mistakes,
  neutronsOf,
  params,
  reason,
  shells,
  show,
  solution,
  template,
  wrong,
} from "./AtomBuilder.ts";

describe("generate", () => {
  it("gives the same element for the same seed and a new one for each of the first ten", () => {
    expect(generate(3)).toEqual(generate(3));
    const names = new Set(Array.from({ length: 10 }, (_, i) => generate(i + 1).name.de));
    expect(names.size).toBe(10);
  });
});

describe("check", () => {
  const carbon = generate(6);

  it("accepts the neutral atom with the right counts", () => {
    expect(carbon.name.de).toBe("Kohlenstoff");
    expect(carbon.name.en).toBe("Carbon");
    expect(check(carbon, { protons: 6, neutrons: 6, electrons: 6 })).toBe(true);
    expect(check(carbon, solution(carbon))).toBe(true);
  });

  it("rejects the typical mistakes, each with its reason", () => {
    expect(check(carbon, { protons: 6, neutrons: 6, electrons: 7 })).toBe(false);
    expect(reason(carbon, { protons: 6, neutrons: 6, electrons: 7 }, {}, "de")).toContain("neutral");
    expect(check(carbon, { protons: 6, neutrons: 12, electrons: 6 })).toBe(false);
    expect(reason(carbon, { protons: 6, neutrons: 12, electrons: 6 }, {}, "de")).toContain("12 − 6 = 6");
    expect(reason(carbon, { protons: 5, neutrons: 6, electrons: 5 }, {}, "de")).toContain("6 Protonen");
    expect(check(carbon, wrong(carbon))).toBe(false);
  });

  it("has no reason for a right answer", () => {
    expect(reason(carbon, solution(carbon), {}, "de")).toBeUndefined();
  });
});

describe("count", () => {
  it("uses the singular for exactly one and the plural otherwise", () => {
    expect(count("de", 1, "proton")).toBe("1 Proton");
    expect(count("de", 0, "neutron")).toBe("0 Neutronen");
    expect(count("de", 2, "electron")).toBe("2 Elektronen");
    expect(count("en", 1, "electron")).toBe("1 electron");
    expect(count("en", 0, "neutron")).toBe("0 neutrons");
  });

  it("writes hydrogen without a plural error", () => {
    const hydrogen = generate(1);
    expect(describeTask(hydrogen, {}, "de").solution).toBe("Wasserstoff hat 1 Proton, 0 Neutronen und 1 Elektron.");
    expect(describeTask(hydrogen, {}, "en").solution).toBe("Hydrogen has 1 proton, 0 neutrons and 1 electron.");
    expect(reason(hydrogen, { protons: 2, neutrons: 0, electrons: 2 }, {}, "de")).toContain("hat 1 Proton.");
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
    const described = describeTask(generate(2), {}, "de");
    expect(described.task).toContain("Helium");
    expect(described.solution).toContain("2 Protonen, 2 Neutronen und 2 Elektronen");
    const english = describeTask(generate(6), {}, "en");
    expect(english.task).toContain("Carbon");
    expect(english.solution).toBe("Carbon has 6 protons, 6 neutrons and 6 electrons.");
    expect(reason(generate(6), { protons: 6, neutrons: 6, electrons: 7 }, {}, "en")).toContain("neutral");
    expect(about.mistakes.length).toBeGreaterThan(0);
    expect(about.task.en).not.toBe("");
  });
});

describe("for a tutor", () => {
  it("gives the task once, with what sets it, and the atomic number hidden", () => {
    for (const lang of ["de", "en"]) {
      for (let seed = 1; seed <= 10; seed++) {
        const task = generate(seed);
        let text = template({}, lang);
        const values = params(task, {}, lang);
        for (const [name, value] of Object.entries(values)) text = text.replace(`{${name}}`, String(value));
        expect(text).toBe(describeTask(task, {}, lang).task);
        expect(template({}, lang)).not.toContain("{Z}");
        expect(values["Z"]).toBe(task.protons);
      }
    }
  });

  it("has one answer per typical mistake, each rejected, and the mass number as neutrons among them", () => {
    for (let seed = 1; seed <= 10; seed++) {
      const task = generate(seed);
      const answers = mistakes(task);
      expect(answers).toHaveLength(about.mistakes.length);
      for (const answer of answers) if (answer !== undefined) expect(check(task, answer)).toBe(false);
    }
    expect(mistakes(generate(6))[1]).toEqual({ protons: 6, neutrons: 12, electrons: 6 });
  });

  it("shows an answer as the learner says it", () => {
    expect(show({ protons: 6, neutrons: 6, electrons: 7 }, generate(6), {}, "de")).toBe(
      "6 Protonen, 6 Neutronen, 7 Elektronen",
    );
    expect(show({ protons: 1, neutrons: 0, electrons: 1 }, generate(1), {}, "en")).toBe(
      "1 proton, 0 neutrons, 1 electron",
    );
  });
});
