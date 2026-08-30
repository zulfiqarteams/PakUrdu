const KEY = "pakurdu-biography-progress-v1";
export interface BiographyProgressItem { viewed?: boolean; completedChapters: string[]; typingCompleted: string[]; quizCorrect: number; quizAttempts: number; lastSeen: number; }
export interface BiographyProgress { items: Record<string, BiographyProgressItem>; xp: number; streak: number; lastDay: string; bookmarks: string[]; }
const fresh = (): BiographyProgress => ({ items: {}, xp: 0, streak: 0, lastDay: "", bookmarks: [] });
export function loadBiographyProgress(): BiographyProgress { try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : fresh(); } catch { return fresh(); } }
function save(value: BiographyProgress) { try { localStorage.setItem(KEY, JSON.stringify(value)); } catch { /* ignore storage failures */ } }
function today() { return new Date().toISOString().slice(0, 10); }
function touch(p: BiographyProgress) { const day = today(); if (p.lastDay === day) return; const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10); p.streak = p.lastDay === yesterday ? p.streak + 1 : 1; p.lastDay = day; }
function item(p: BiographyProgress, id: string) { return p.items[id] ?? (p.items[id] = { completedChapters: [], typingCompleted: [], quizCorrect: 0, quizAttempts: 0, lastSeen: Date.now() }); }
export function markBiographyViewed(id: string) { const p = loadBiographyProgress(); touch(p); item(p, id).viewed = true; item(p, id).lastSeen = Date.now(); save(p); }
export function markChapterComplete(id: string, chapterId: string) { const p = loadBiographyProgress(); touch(p); const x = item(p, id); if (!x.completedChapters.includes(chapterId)) { x.completedChapters.push(chapterId); p.xp += 10; } x.lastSeen = Date.now(); save(p); }
export function markTypingComplete(id: string, chapterId: string) { const p = loadBiographyProgress(); touch(p); const x = item(p, id); if (!x.typingCompleted.includes(chapterId)) { x.typingCompleted.push(chapterId); p.xp += 20; } x.lastSeen = Date.now(); save(p); }
export function recordBiographyQuiz(id: string, correct: boolean) { const p = loadBiographyProgress(); touch(p); const x = item(p, id); x.quizAttempts += 1; if (correct) { x.quizCorrect += 1; p.xp += 15; } x.lastSeen = Date.now(); save(p); }
export function toggleBookmark(id: string) { const p = loadBiographyProgress(); p.bookmarks = p.bookmarks.includes(id) ? p.bookmarks.filter((x) => x !== id) : [...p.bookmarks, id]; save(p); return p.bookmarks.includes(id); }
