import type { GameId, GameRecord } from "../core/gameTypes";

const KEY = "pakurdu_game_records_v2";
const HISTORY_KEY = "pakurdu_game_history_v1";

export interface GameHistoryEntry {
  id: string;
  gameId: GameId;
  score: number;
  wpm: number;
  cpm: number;
  accuracy: number;
  streak: number;
  durationSeconds: number;
  playedAt: string;
}

const emptyRecord = (): GameRecord => ({ bestScore: 0, gamesPlayed: 0, bestWpm: 0, bestAccuracy: 0, bestStreak: 0, updatedAt: "" });
function read<T>(key: string, fallback: T): T { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)) as T; } catch { return fallback; } }
function write<T>(key: string, value: T) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* browser storage can be unavailable */ } }

export function getGameRecord(id: GameId): GameRecord {
  const all = read<Record<string, GameRecord>>(KEY, {});
  return all[id] ?? emptyRecord();
}

export function saveGameRecord(id: GameId, result: { score: number; wpm: number; accuracy: number; streak: number; cpm?: number; durationSeconds?: number }) {
  const all = read<Record<string, GameRecord>>(KEY, {});
  const old = all[id] ?? emptyRecord();
  all[id] = { bestScore: Math.max(old.bestScore, result.score), gamesPlayed: old.gamesPlayed + 1, bestWpm: Math.max(old.bestWpm, result.wpm), bestAccuracy: Math.max(old.bestAccuracy, result.accuracy), bestStreak: Math.max(old.bestStreak, result.streak), updatedAt: new Date().toISOString() };
  write(KEY, all);
  const history = read<GameHistoryEntry[]>(HISTORY_KEY, []);
  history.unshift({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, gameId: id, score: result.score, wpm: result.wpm, cpm: result.cpm ?? 0, accuracy: result.accuracy, streak: result.streak, durationSeconds: result.durationSeconds ?? 0, playedAt: new Date().toISOString() });
  write(HISTORY_KEY, history.slice(0, 50));
  return all[id];
}

export function getGameHistory(id?: GameId): GameHistoryEntry[] {
  const history = read<GameHistoryEntry[]>(HISTORY_KEY, []);
  return id ? history.filter((entry) => entry.gameId === id) : history;
}
