import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { SessionResult } from "@/features/results/types";

interface SessionResultContextValue {
  /** The most recently completed session, or `null` if nothing has completed yet this visit. */
  sessionResult: SessionResult | null;
  /** Stores a freshly built `SessionResult`, replacing whatever was there before. */
  recordSessionResult: (result: SessionResult) => void;
  /** Drops the current result — e.g. once the Results screen has been viewed and the learner moves on. */
  clearSessionResult: () => void;
}

const SessionResultContext = createContext<SessionResultContextValue | null>(null);

/**
 * Holds the last completed session's result in plain React state —
 * deliberately NOT written to localStorage or anywhere else durable.
 *
 * This is intentional, not a shortcut: a `SessionResult` is "what
 * just happened", not a fact worth persisting on its own (the
 * durable record is `ProfileProgress`, already owned by
 * `ProgressProvider`/`progressService`). Keeping it in-memory means a
 * page refresh naturally lands the Results screen in its graceful
 * "no session yet" fallback instead of resurrecting stale numbers
 * from a session that's no longer the one just typed.
 *
 * Must be mounted above any route that reads or writes it — see
 * `main.tsx`. Deliberately independent of `ProgressProvider`: it
 * doesn't need a profile to exist (a standalone Practice session has
 * no profile-scoped record at all) and doesn't read from it.
 */
export function SessionResultProvider({ children }: { children: ReactNode }) {
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);

  const recordSessionResult = useCallback((result: SessionResult) => {
    setSessionResult(result);
  }, []);

  const clearSessionResult = useCallback(() => {
    setSessionResult(null);
  }, []);

  const value = useMemo(
    () => ({ sessionResult, recordSessionResult, clearSessionResult }),
    [sessionResult, recordSessionResult, clearSessionResult],
  );

  return <SessionResultContext.Provider value={value}>{children}</SessionResultContext.Provider>;
}

export function useSessionResult(): SessionResultContextValue {
  const context = useContext(SessionResultContext);
  if (!context) {
    throw new Error("useSessionResult must be used within a SessionResultProvider");
  }
  return context;
}
