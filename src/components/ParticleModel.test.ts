import { describe, expect, it } from "vitest";
import { COLUMNS, HEIGHT, ROWS, WIDTH, positions, stateOf } from "./ParticleModel.ts";

describe("stateOf", () => {
  it("is solid when cold, liquid in the middle, gas when hot", () => {
    expect(stateOf(0)).toBe("solid");
    expect(stateOf(33)).toBe("solid");
    expect(stateOf(34)).toBe("liquid");
    expect(stateOf(66)).toBe("liquid");
    expect(stateOf(67)).toBe("gas");
    expect(stateOf(100)).toBe("gas");
  });
});

describe("positions", () => {
  it("gives every particle a place inside the box at every temperature", () => {
    for (const temperature of [0, 20, 50, 80, 100]) {
      for (const tick of [0, 1, 7]) {
        const points = positions(temperature, tick);
        expect(points).toHaveLength(COLUMNS * ROWS);
        for (const point of points) {
          expect(point.x).toBeGreaterThanOrEqual(0);
          expect(point.x).toBeLessThanOrEqual(WIDTH);
          expect(point.y).toBeGreaterThanOrEqual(0);
          expect(point.y).toBeLessThanOrEqual(HEIGHT);
        }
      }
    }
  });

  it("gives the same picture for the same temperature and tick", () => {
    expect(positions(50, 3)).toEqual(positions(50, 3));
  });

  it("spreads a gas wider than a solid", () => {
    const spread = (temperature: number) => {
      const xs = positions(temperature, 0).map((point) => point.x);
      return Math.max(...xs) - Math.min(...xs);
    };
    expect(spread(90)).toBeGreaterThan(spread(10));
  });
});
