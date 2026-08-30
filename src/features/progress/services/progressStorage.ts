import type { LessonProgress, ProfileProgress, ProgressStoreV1 } from "@/features/progress/types";

/**
 * Single namespaced storage strategy — same pattern as Part 4's
 * `profileStorage` (one prefixed key, one versioned JSON blob), kept
 * as its own key rather than crammed into the profiles store so the
 * two features can evolve independently.
 */
const PROGRESS_KEY = "urduTypingTutorial:progress";
const CURRENT_VERSION = 1;

/** Maximum recent attempts kept per lesson — see Part 9 spec §16. Older attempts are dropped, oldest first. */
export const MAX_RECENT_ATTEMPTS = 20;

function emptyStore(): ProgressStoreV1 {
  return { version: CURRENT_VERSION, progress: {} };
}

export function emptyProfileProgress(profileId: string): ProfileProgress {
  return {
    profileId,
    completedLessonIds: [],
    lessonProgress: {},
    currentLessonId: null,
    lastActivityAt: null,
  };
}

function isValidLessonProgress(value: unknown): value is LessonProgress {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.lessonId === "string" &&
    typeof candidate.status === "string" &&
    typeof candidate.attempts === "number" &&
    (candidate.bestAccuracy === null || typeof candidate.bestAccuracy === "number") &&
    (candidate.bestWpm === null || typeof candidate.bestWpm === "number") &&
    (candidate.lastAccuracy === null || typeof candidate.lastAccuracy === "number") &&
    (candidate.lastWpm === null || typeof candidate.lastWpm === "number") &&
    (candidate.completedAt === null || typeof candidate.completedAt === "string") &&
    typeof candidate.updatedAt === "string"
  );
}

/**
 * Validates one profile's progress blob, dropping anything malformed
 * rather than rejecting the whole profile — a single corrupted
 * lesson entry (e.g. from a future field that got written and later
 * removed) should not wipe out everything else this learner earned.
 */
function isValidProfileProgress(value: unknown): value is ProfileProgress {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.profileId === "string" &&
    Array.isArray(candidate.completedLessonIds) &&
    candidate.completedLessonIds.every((id) => typeof id === "string") &&
    typeof candidate.lessonProgress === "object" &&
    candidate.lessonProgress !== null &&
    (candidate.currentLessonId === null || typeof candidate.currentLessonId === "string") &&
    (candidate.lastActivityAt === null || typeof candidate.lastActivityAt === "string")
  );
}

function sanitizeProfileProgress(profileId: string, value: unknown): ProfileProgress {
  if (!isValidProfileProgress(value)) return emptyProfileProgress(profileId);

  const sanitizedLessonProgress: Record<string, LessonProgress> = {};
  for (const [lessonId, entry] of Object.entries(value.lessonProgress)) {
    if (isValidLessonProgress(entry) && entry.lessonId === lessonId) {
      sanitizedLessonProgress[lessonId] = entry;
    }
  }

  // Only trust completedLessonIds entries that also have a matching,
  // genuinely-completed lesson record — prevents a corrupted or
  // hand-edited id list from claiming completions that don't exist.
  const completedLessonIds = value.completedLessonIds.filter(
    (id) => sanitizedLessonProgress[id]?.status === "completed",
  );

  return {
    profileId,
    completedLessonIds,
    lessonProgress: sanitizedLessonProgress,
    currentLessonId: value.currentLessonId,
    lastActivityAt: value.lastActivityAt,
  };
}

/**
 * Reads and validates the whole progress store from localStorage.
 * Never throws — missing, corrupted, or unrecognized-version data is
 * treated as "no progress yet" rather than crashing the app.
 */
function readStore(): ProgressStoreV1 {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(PROGRESS_KEY);
  } catch {
    // localStorage can throw in private-browsing / storage-blocked contexts.
    return emptyStore();
  }
  if (!raw) return emptyStore();

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return emptyStore();

    const candidate = parsed as Partial<ProgressStoreV1>;
    // No migrations exist yet (version 1 is the only version so
    // far); an unrecognized version falls back to empty rather than
    // risking a shape the rest of the app doesn't understand.
    if (candidate.version !== CURRENT_VERSION) return emptyStore();
    if (!candidate.progress || typeof candidate.progress !== "object") return emptyStore();

    const sanitized: Record<string, ProfileProgress> = {};
    for (const [profileId, entry] of Object.entries(candidate.progress)) {
      sanitized[profileId] = sanitizeProfileProgress(profileId, entry);
    }

    return { version: CURRENT_VERSION, progress: sanitized };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: ProgressStoreV1): void {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
  } catch {
    // Storage full, disabled, or unavailable — fail silently rather
    // than crash. The calling context still reflects the change for
    // the rest of this session even if it won't persist on reload.
  }
}

/** This profile's progress, or a fresh empty one if it has never been written. Never throws, never returns malformed data. */
export function getProfileProgress(profileId: string): ProfileProgress {
  const store = readStore();
  return store.progress[profileId] ?? emptyProfileProgress(profileId);
}

/** Overwrites one profile's progress. Other profiles' data in the same store is left untouched. */
export function saveProfileProgress(profileId: string, progress: ProfileProgress): void {
  const store = readStore();
  store.progress[profileId] = progress;
  writeStore(store);
}

/** A single lesson's progress for a profile, or `undefined` if that lesson has never been started. */
export function getLessonProgress(profileId: string, lessonId: string): LessonProgress | undefined {
  return getProfileProgress(profileId).lessonProgress[lessonId];
}

/** Deletes a profile's progress entirely — used when the profile itself is deleted (Part 9 §14). No-op if there was none. */
export function deleteProfileProgress(profileId: string): void {
  const store = readStore();
  if (!(profileId in store.progress)) return;
  delete store.progress[profileId];
  writeStore(store);
}
