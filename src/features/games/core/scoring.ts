import type { GameId } from "./gameTypes";

export interface GameScoreParams {
  gameId: GameId;
  correct: number;
  incorrect: number;
  completed: number;
  streak: number;
  elapsedMs: number;
}

/** Game-specific scoring keeps speed, accuracy, completion and streak rewards distinct. */
export function scoreTyping(params: GameScoreParams): number {
  const safeElapsed = Math.max(1, params.elapsedMs);
  const speed = Math.min(300, Math.round((params.correct / (safeElapsed / 1000)) * 2));
  const accuracy = params.correct + params.incorrect > 0
    ? params.correct / (params.correct + params.incorrect)
    : 0;

  switch (params.gameId) {
    case "letter-hunter":
      return Math.max(0, params.correct * 12 + params.completed * 35 + Math.round(accuracy * 20) - params.incorrect * 5);
    case "word-rush":
      return Math.max(0, params.correct * 8 + params.completed * 80 + params.streak * 12 + speed - params.incorrect * 4);
    case "combo-master":
      return Math.max(0, params.correct * 14 + params.completed * 65 + params.streak * 8 + Math.round(accuracy * 25) - params.incorrect * 2);
    case "typing-sprint":
      return Math.max(0, params.correct * 7 + speed * 2 + Math.round(accuracy * 30) - params.incorrect * 3);
    case "urdu-survival":
      return Math.max(0, params.correct * 10 + params.completed * 55 + params.streak * 18 + speed - params.incorrect * 6);
    default:
      return Math.max(0, params.correct * 10 + params.completed * 50 + params.streak * 5 + speed - params.incorrect * 3);
  }
}
