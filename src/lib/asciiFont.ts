// Minimal 5-row block font — just enough glyphs to banner short project codes.
// Not exhaustive on purpose: this powers a background flourish, not a full figlet port.
const GLYPHS: Record<string, string[]> = {
  A: ["#####", "#...#", "#####", "#...#", "#...#"],
  C: ["#####", "#....", "#....", "#....", "#####"],
  E: ["#####", "#....", "###..", "#....", "#####"],
  F: ["#####", "#....", "###..", "#....", "#...."],
  G: ["#####", "#....", "#.###", "#...#", "#####"],
  I: ["#####", "..#..", "..#..", "..#..", "#####"],
  L: ["#....", "#....", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#...#", "#...#"],
  N: ["#...#", "##..#", "#.#.#", "#..##", "#...#"],
  O: ["#####", "#...#", "#...#", "#...#", "#####"],
  R: ["#####", "#...#", "#####", "#..#.", "#...#"],
  S: ["#####", "#....", "#####", "....#", "#####"],
  T: ["#####", "..#..", "..#..", "..#..", "..#.."],
  V: ["#...#", "#...#", "#...#", ".#.#.", "..#.."],
  Y: ["#...#", ".#.#.", "..#..", "..#..", "..#.."],
  " ": [".....", ".....", ".....", ".....", "....."],
};

export function renderAsciiBanner(word: string): string {
  const chars = word.toUpperCase().split("").map((c) => GLYPHS[c] ?? GLYPHS[" "]);
  const rows: string[] = [];
  for (let r = 0; r < 5; r++) {
    rows.push(chars.map((glyph) => glyph[r]).join(" "));
  }
  return rows.join("\n").replace(/#/g, "█").replace(/\./g, " ");
}
