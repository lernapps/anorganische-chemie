export interface Profile {
  symbol: string;
  name: string;
  number: number;
  group: number;
  period: number;
  kind: string;
  shells: string;
  compounds: { formula: string; text: string }[];
  uses: string[];
  fact: string;
  note?: string;
}

export interface GroupInfo {
  group: number;
  roman: string;
  name: string;
  text: string;
}

/** The IUPAC groups of the eight main groups, left to right. */
export const GROUPS = [1, 2, 13, 14, 15, 16, 17, 18] as const;

/** Light fills, one per main group; the text on them is dark. */
export const COLORS = ["#f4b6b6", "#f7cf9b", "#f1e48c", "#bfe3a3", "#a3e0d0", "#a8d3f3", "#c9bbf0", "#f1b8dc"] as const;
export const TEXT_COLOR = "#111111";
export const EDGE_COLOR = "#374151";

/** The column of a group, 0 to 7. */
export function columnOf(group: number): number {
  const column = GROUPS.indexOf(group as (typeof GROUPS)[number]);
  if (column < 0) throw new Error(`group ${group} is no main group`);
  return column;
}

export const colorOf = (group: number): string => COLORS[columnOf(group)] ?? COLORS[0];

export interface Place {
  row: number;
  column: number;
}

export const placeOf = (profile: Profile): Place => ({ row: profile.period - 1, column: columnOf(profile.group) });

/** The table as rows (periods) of cells (columns), empty places undefined. */
export function matrix(profiles: readonly Profile[]): (Profile | undefined)[][] {
  const rows = Math.max(...profiles.map((profile) => profile.period));
  const grid: (Profile | undefined)[][] = Array.from({ length: rows }, () =>
    Array.from({ length: GROUPS.length }, () => undefined),
  );
  for (const profile of profiles) {
    const { row, column } = placeOf(profile);
    if (grid[row]?.[column] !== undefined)
      throw new Error(`two elements at period ${profile.period}, group ${profile.group}`);
    const line = grid[row];
    if (line) line[column] = profile;
  }
  return grid;
}

export type Direction = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown" | "Home" | "End";

/** Where an arrow key leads from a place: the next element in that direction, or the same place at the edge. */
export function move(grid: readonly (Profile | undefined)[][], from: Place, key: Direction): Place {
  const rows = grid.length;
  const columns = GROUPS.length;
  const filled = (row: number, column: number) => grid[row]?.[column] !== undefined;
  if (key === "Home" || key === "End") {
    const range = Array.from({ length: columns }, (_, column) => column);
    const order = key === "Home" ? range : range.reverse();
    const column = order.find((candidate) => filled(from.row, candidate));
    return column === undefined ? from : { row: from.row, column };
  }
  const stepRow = key === "ArrowUp" ? -1 : key === "ArrowDown" ? 1 : 0;
  const stepColumn = key === "ArrowLeft" ? -1 : key === "ArrowRight" ? 1 : 0;
  let row = from.row + stepRow;
  let column = from.column + stepColumn;
  while (row >= 0 && row < rows && column >= 0 && column < columns) {
    if (filled(row, column)) return { row, column };
    row += stepRow;
    column += stepColumn;
  }
  return from;
}

export function shellsOf(text: string): number[] {
  return text
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((count) => Number.isInteger(count) && count > 0);
}

export interface Dot {
  x: number;
  y: number;
}

export interface ShellPicture {
  radii: number[];
  dots: Dot[];
}

export const CENTER = 60;

/** Rings and electrons of a shell model: ring i holds shells[i] electrons spread evenly. */
export function shellPicture(shells: readonly number[]): ShellPicture {
  const radii = shells.map((_, index) => 14 + index * 6.5);
  const dots: Dot[] = [];
  shells.forEach((count, index) => {
    const radius = radii[index] ?? 14;
    for (let step = 0; step < count; step++) {
      const angle = (step / count) * 2 * Math.PI - Math.PI / 2 + index * 0.4;
      dots.push({ x: CENTER + radius * Math.cos(angle), y: CENTER + radius * Math.sin(angle) });
    }
  });
  return { radii, dots };
}

const SUBSCRIPTS = "₀₁₂₃₄₅₆₇₈₉";

/** A formula written with plain digits, shown with subscript indices: H2O becomes H₂O. */
export function subscript(formula: string): string {
  return formula.replace(/\d/g, (digit) => SUBSCRIPTS[Number(digit)] ?? digit);
}

/** The relative luminance and contrast of two hex colours, as in WCAG. */
function luminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (channels[0] ?? 0) + 0.7152 * (channels[1] ?? 0) + 0.0722 * (channels[2] ?? 0);
}

export function contrast(first: string, second: string): number {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
}
