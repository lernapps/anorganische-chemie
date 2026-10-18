export type State = "solid" | "liquid" | "gas";

export interface Point {
  x: number;
  y: number;
}

export const WIDTH = 120;
export const HEIGHT = 90;
export const COLUMNS = 6;
export const ROWS = 5;

/** The slider runs from 0 (cold) to 100 (hot); below 34 the stuff is solid, below 67 liquid, else gas. */
export function stateOf(temperature: number): State {
  if (temperature < 34) return "solid";
  return temperature < 67 ? "liquid" : "gas";
}

/** A number between -1 and 1 that depends only on the particle and the tick, so the picture is reproducible. */
function wobble(particle: number, tick: number, axis: number): number {
  const value = Math.sin(particle * 12.9898 + tick * 0.9 + axis * 78.233) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
}

/** Where the particles are at a temperature and tick: a tight grid, a loose grid, or scattered in the whole box. */
export function positions(temperature: number, tick: number): Point[] {
  const state = stateOf(temperature);
  const points: Point[] = [];
  for (let index = 0; index < COLUMNS * ROWS; index++) {
    const column = index % COLUMNS;
    const row = Math.floor(index / COLUMNS);
    if (state === "gas") {
      points.push({
        x: 8 + ((wobble(index, 0, 1) + 1) / 2) * (WIDTH - 16) + wobble(index, tick, 2) * 6,
        y: 8 + ((wobble(index, 0, 3) + 1) / 2) * (HEIGHT - 16) + wobble(index, tick, 4) * 6,
      });
      continue;
    }
    const spacing = state === "solid" ? 14 : 16;
    const gap = state === "solid" ? 14 : 12.8;
    const shake = state === "solid" ? 1 : 3.5;
    points.push({
      x: 20 + column * spacing + wobble(index, tick, 1) * shake,
      y: 16 + row * gap + wobble(index, tick, 2) * shake,
    });
  }
  return points;
}
