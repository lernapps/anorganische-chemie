import { describe, expect, it } from "vitest";
import {
  COLORS,
  EDGE_COLOR,
  GROUPS,
  TEXT_COLOR,
  columnOf,
  contrast,
  matrix,
  move,
  shellPicture,
  shellsOf,
  subscript,
  type Profile,
} from "./PeriodicTable.ts";

const profile = (symbol: string, number: number, group: number, period: number, shells: string): Profile => ({
  symbol,
  name: symbol,
  number,
  group,
  period,
  kind: "x",
  shells,
  compounds: [],
  uses: [],
  fact: "",
});

const sample = [
  profile("H", 1, 1, 1, "1"),
  profile("He", 2, 18, 1, "2"),
  profile("Li", 3, 1, 2, "2, 1"),
  profile("Be", 4, 2, 2, "2, 2"),
  profile("Na", 11, 1, 3, "2, 8, 1"),
];

describe("columns and colours", () => {
  it("puts the eight main groups into eight columns", () => {
    expect(GROUPS.map(columnOf)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(() => columnOf(5)).toThrow();
  });

  it("has dark text with enough contrast on every fill, and an edge that is clearly visible on white", () => {
    expect(COLORS).toHaveLength(8);
    for (const fill of COLORS) expect(contrast(fill, TEXT_COLOR)).toBeGreaterThanOrEqual(7);
    expect(contrast(EDGE_COLOR, "#ffffff")).toBeGreaterThanOrEqual(3);
  });
});

describe("matrix", () => {
  it("places every element at its period and group", () => {
    const grid = matrix(sample);
    expect(grid).toHaveLength(3);
    expect(grid[0]?.[0]?.symbol).toBe("H");
    expect(grid[0]?.[7]?.symbol).toBe("He");
    expect(grid[1]?.[1]?.symbol).toBe("Be");
    expect(grid[0]?.[3]).toBeUndefined();
  });

  it("refuses two elements at one place", () => {
    expect(() => matrix([profile("A", 1, 1, 1, "1"), profile("B", 2, 1, 1, "1")])).toThrow();
  });
});

describe("move", () => {
  const grid = matrix(sample);

  it("jumps over empty places to the next element in the direction", () => {
    expect(move(grid, { row: 0, column: 0 }, "ArrowRight")).toEqual({ row: 0, column: 7 });
    expect(move(grid, { row: 0, column: 0 }, "ArrowDown")).toEqual({ row: 1, column: 0 });
    expect(move(grid, { row: 1, column: 1 }, "ArrowLeft")).toEqual({ row: 1, column: 0 });
  });

  it("stays where it is at the edge", () => {
    expect(move(grid, { row: 0, column: 0 }, "ArrowUp")).toEqual({ row: 0, column: 0 });
    expect(move(grid, { row: 0, column: 7 }, "ArrowRight")).toEqual({ row: 0, column: 7 });
  });

  it("goes to the first and last element of a row", () => {
    expect(move(grid, { row: 0, column: 7 }, "Home")).toEqual({ row: 0, column: 0 });
    expect(move(grid, { row: 0, column: 0 }, "End")).toEqual({ row: 0, column: 7 });
  });
});

describe("shells", () => {
  it("reads the shell text and draws one dot per electron", () => {
    expect(shellsOf("2, 8, 18, 18, 5")).toEqual([2, 8, 18, 18, 5]);
    const picture = shellPicture(shellsOf("2, 8, 18, 18, 5"));
    expect(picture.radii).toHaveLength(5);
    expect(picture.dots).toHaveLength(51);
  });

  it("fits the largest atom of the table into the picture", () => {
    const picture = shellPicture(shellsOf("2, 8, 18, 32, 18, 8, 1"));
    expect(picture.dots).toHaveLength(87);
    for (const dot of picture.dots) {
      expect(dot.x).toBeGreaterThan(0);
      expect(dot.x).toBeLessThan(120);
      expect(dot.y).toBeGreaterThan(0);
      expect(dot.y).toBeLessThan(120);
    }
  });
});

describe("subscript", () => {
  it("writes indices as subscripts", () => {
    expect(subscript("H2O")).toBe("H₂O");
    expect(subscript("Ca3(PO4)2")).toBe("Ca₃(PO₄)₂");
    expect(subscript("NaCl")).toBe("NaCl");
  });
});
