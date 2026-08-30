const BOOKMARKS_KEY = "pakurdu_bookmarks_v1";
const SAVED_LATER_KEY = "pakurdu_saved_later_v1";

function readIds(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: string[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify([...new Set(ids)]));
  } catch {
    // Storage may be unavailable; keep the in-memory UI responsive.
  }
}

function toggleId(key: string, id: string): boolean {
  const ids = readIds(key);
  const next = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
  writeIds(key, next);
  return next.includes(id);
}

export function loadBookmarkIds(): string[] {
  return readIds(BOOKMARKS_KEY);
}

export function isBookmarked(id: string): boolean {
  return loadBookmarkIds().includes(id);
}

export function toggleBookmark(id: string): boolean {
  return toggleId(BOOKMARKS_KEY, id);
}

export function loadSavedLaterIds(): string[] {
  return readIds(SAVED_LATER_KEY);
}

export function isSavedLater(id: string): boolean {
  return loadSavedLaterIds().includes(id);
}

export function toggleSavedLater(id: string): boolean {
  return toggleId(SAVED_LATER_KEY, id);
}
