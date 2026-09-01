import { commonUrduWords } from "@/features/typing/data/commonUrduWords";
import { characterDefinitions, practiceWordBank } from "@/features/lessons/data/curriculum";

const unique = (items: string[]) => [...new Set(items.filter(Boolean))];
const letters = characterDefinitions.map((item) => item.character);
const combos = practiceWordBank.map((item) => item.urdu).filter((word) => word.length <= 4);

export function getLetterTarget(round: number): string { return letters[Math.abs(round * 7 + 3) % letters.length]; }
export function getWordTarget(round: number): string { return commonUrduWords[Math.abs(round * 13 + 5) % commonUrduWords.length] || "اردو"; }
export function getComboTarget(round: number): string {
  const source = unique(combos);
  return source[Math.abs(round * 11 + 2) % source.length] || "با";
}
export function getSurvivalTarget(round: number): string {
  const pool = round < 4 ? commonUrduWords : round < 8 ? unique(combos) : unique(commonUrduWords.filter((word) => word.length >= 5));
  return pool[Math.abs(round * 17 + 1) % pool.length] || "اردو ٹائپنگ";
}
export function getSprintTarget(durationSeconds: number): string {
  const count = Math.max(35, Math.ceil(durationSeconds * 2.5));
  return Array.from({ length: count }, (_, i) => getWordTarget(i + durationSeconds)).join(" ");
}


/** Stable, date-seeded daily challenge: everyone gets the same game and target for a UTC day. */
export function getDailyChallenge(date = new Date()): { gameId: import("../core/gameTypes").GameId; target: string } {
  const key = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
  let hash = 2166136261;
  for (const char of key) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  const index = Math.abs(hash) % 5;
  const gameId = (["letter-hunter", "word-rush", "combo-master", "typing-sprint", "urdu-survival"] as const)[index];
  const round = Math.abs(hash >>> 0) % 20;
  return { gameId, target: gameId === "letter-hunter" ? getLetterTarget(round) : gameId === "word-rush" ? getWordTarget(round) : gameId === "combo-master" ? getComboTarget(round) : gameId === "typing-sprint" ? getSprintTarget(30) : getSurvivalTarget(round) };
}
