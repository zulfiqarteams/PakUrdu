import { useCallback, useEffect, useState } from "react";

const PROGRESS_KEY = "urduTypingTutorial:readingProgress";
// Fired whenever this tab writes a new value, since the native
// `storage` event only fires in *other* tabs — the Reading page (which
// marks a topic visited) and ContentSidebar (which shows the
// checkmark) are siblings in the same tab and need to stay in sync
// live, not just after a reload.
const PROGRESS_EVENT = "urduTypingTutorial:readingProgressChange";

function readVisited(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

/**
 * Tracks which "Learn About Phonetic Keyboard" topics the learner has opened, for
 * the chapter progress bar and the sidebar's read/unread checkmarks.
 * Persisted to localStorage, shared live between any components that
 * use this hook in the same tab.
 */
export function useReadingProgress() {
  const [visited, setVisited] = useState<Set<string>>(() => readVisited());

  useEffect(() => {
    const sync = () => setVisited(readVisited());
    window.addEventListener(PROGRESS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const markVisited = useCallback((id: string) => {
    const next = readVisited();
    if (next.has(id)) return;
    next.add(id);
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(Array.from(next)));
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  }, []);

  return { visited, markVisited };
}
