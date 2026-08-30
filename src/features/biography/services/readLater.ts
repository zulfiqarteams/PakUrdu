const KEY = "pakurdu_read_later_v1";

function readIds(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  try { localStorage.setItem(KEY, JSON.stringify([...new Set(ids)])); } catch { /* storage can be unavailable */ }
}

export function loadReadLaterIds(): string[] { return readIds(); }

export function isReadLater(id: string): boolean { return readIds().includes(id); }

export function toggleReadLater(id: string): boolean {
  const ids = readIds();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  writeIds(next);
  return next.includes(id);
}

export function removeReadLater(id: string) { writeIds(readIds().filter((x) => x !== id)); }
