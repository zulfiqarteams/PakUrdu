import type { UrduWord } from "@/features/sahiUrdu/types";

export interface UrduWordProgress {
  viewed: boolean;
  practiceCount: number;
  correctPractice: number;
  quizCorrect: number;
  quizAttempts: number;
  mastered: boolean;
  lastSeen: number;
}

export interface SahiUrduProgress {
  words: Record<string, UrduWordProgress>;
  dailyDate: string;
  dailyCompleted: number;
  xp: number;
  streak: number;
  lastActiveDate?: string;
}

const STORAGE_KEY = "pakurdu:sahi-urdu-progress:v1";

function empty(): SahiUrduProgress {
  return { words: {}, dailyDate: "", dailyCompleted: 0, xp: 0, streak: 0 };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function loadSahiUrduProgress(): SahiUrduProgress {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as SahiUrduProgress;
    return { ...empty(), ...parsed, words: parsed.words ?? {} };
  } catch {
    return empty();
  }
}

function save(progress: SahiUrduProgress) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* graceful */ }
}

function touchDay(progress: SahiUrduProgress) {
  const today = todayKey();
  if (progress.dailyDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    progress.streak = progress.lastActiveDate === yesterday ? progress.streak + 1 : 1;
    progress.dailyDate = today;
    progress.dailyCompleted = 0;
  }
  progress.lastActiveDate = today;
}

function getWord(progress: SahiUrduProgress, wordId: string): UrduWordProgress {
  return progress.words[wordId] ?? {
    viewed: false,
    practiceCount: 0,
    correctPractice: 0,
    quizCorrect: 0,
    quizAttempts: 0,
    mastered: false,
    lastSeen: 0,
  };
}

export function markViewed(wordId: string) {
  const progress = loadSahiUrduProgress();
  touchDay(progress);
  const word = getWord(progress, wordId);
  word.viewed = true;
  word.lastSeen = Date.now();
  progress.words[wordId] = word;
  save(progress);
}

export function recordPractice(word: UrduWord, correct: boolean) {
  const progress = loadSahiUrduProgress();
  touchDay(progress);
  const state = getWord(progress, word.id);
  state.viewed = true;
  state.practiceCount += 1;
  if (correct) state.correctPractice += 1;
  state.lastSeen = Date.now();
  state.mastered = state.practiceCount >= 3 && state.correctPractice / state.practiceCount >= 0.8;
  progress.words[word.id] = state;
  progress.dailyCompleted += 1;
  progress.xp += correct ? 10 : 2;
  save(progress);
}

export function recordQuiz(wordId: string, correct: boolean) {
  const progress = loadSahiUrduProgress();
  touchDay(progress);
  const state = getWord(progress, wordId);
  state.viewed = true;
  state.quizAttempts += 1;
  if (correct) state.quizCorrect += 1;
  state.lastSeen = Date.now();
  state.mastered = state.mastered || (state.quizAttempts >= 3 && state.quizCorrect / state.quizAttempts >= 0.8);
  progress.words[wordId] = state;
  progress.dailyCompleted += 1;
  progress.xp += correct ? 15 : 2;
  save(progress);
}

export function getDailyWords(words: UrduWord[], count = 7) {
  const daySeed = Number(todayKey().replace(/-/g, ""));
  const sorted = [...words].sort((a, b) => ((hash(a.id) + daySeed) % 997) - ((hash(b.id) + daySeed) % 997));
  return sorted.slice(0, count);
}

function hash(value: string) {
  let h = 0;
  for (const char of value) h = (h * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(h);
}
