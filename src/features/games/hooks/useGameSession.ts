import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTypingSession } from "@/features/typing/hooks/useTypingSession";
import { calculateCPM, calculateWPM } from "@/features/statistics";
import { getGameRecord, saveGameRecord } from "../services/gameStorage";
import { scoreTyping } from "../core/scoring";
import type { GameId } from "../core/gameTypes";

interface Options {
  id: GameId;
  targetText: string;
  durationSeconds: number;
  round: number;
  paused: boolean;
  onRoundComplete?: () => void;
  onGameOver?: () => void;
}

export function useGameSession({ id, targetText, durationSeconds, round, paused, onRoundComplete, onGameOver }: Options) {
  const [gameOver, setGameOver] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [started, setStarted] = useState(false);
  const [best, setBest] = useState(false);
  const [aggregate, setAggregate] = useState({ typed: 0, correct: 0, incorrect: 0, score: 0, streak: 0 });
  const startedAtRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const pausedTotalRef = useRef(0);
  const completionRef = useRef(false);

  const session = useTypingSession({ targetText, resetKey: `${id}-${round}`, autoStart: false, isLocked: paused || gameOver });

  useEffect(() => {
    if (session.typing.sessionKeystrokes > 0 && !started) {
      setStarted(true);
      startedAtRef.current = performance.now();
    }
  }, [session.typing.sessionKeystrokes, started]);

  useEffect(() => {
    if (paused && started && !pausedAtRef.current) pausedAtRef.current = performance.now();
    if (!paused && pausedAtRef.current) { pausedTotalRef.current += performance.now() - pausedAtRef.current; pausedAtRef.current = null; }
  }, [paused, started]);

  useEffect(() => {
    if (!started || gameOver) return;
    const tick = () => {
      if (paused || !startedAtRef.current) return;
      const now = performance.now();
      const value = Math.max(0, now - startedAtRef.current - pausedTotalRef.current);
      setElapsedMs(Math.min(value, durationSeconds * 1000));
      if (value >= durationSeconds * 1000) {
        setGameOver(true);
        onGameOver?.();
      }
    };
    tick();
    const timer = window.setInterval(tick, 100);
    return () => window.clearInterval(timer);
  }, [durationSeconds, gameOver, onGameOver, paused, started]);

  useEffect(() => {
    if (!session.typing.isComplete || completionRef.current || gameOver) return;
    completionRef.current = true;
    const correct = session.typing.sessionCorrectKeystrokes;
    const incorrect = session.typing.sessionKeystrokes - correct;
    const roundScore = scoreTyping({ gameId: id, correct, incorrect, completed: 1, streak: aggregate.streak + 1, elapsedMs: Math.max(1, elapsedMs) });
    setAggregate((value) => ({ typed: value.typed + session.typing.sessionKeystrokes, correct: value.correct + correct, incorrect: value.incorrect + incorrect, score: value.score + roundScore, streak: value.streak + 1 }));
    onRoundComplete?.();
  }, [aggregate.streak, elapsedMs, gameOver, id, onRoundComplete, session.typing.isComplete, session.typing.sessionCorrectKeystrokes, session.typing.sessionKeystrokes]);

  useEffect(() => { completionRef.current = false; }, [targetText, round]);

  const accuracy = aggregate.typed > 0 ? (aggregate.correct / aggregate.typed) * 100 : 0;
  const wpm = calculateWPM(aggregate.typed, elapsedMs);
  const cpm = calculateCPM(aggregate.typed, elapsedMs);

  const finish = useCallback(() => {
    if (!gameOver) setGameOver(true);
  }, [gameOver]);

  const finalize = useCallback(() => {
    if (!gameOver) return;
    const record = getGameRecord(id);
    const next = saveGameRecord(id, { score: aggregate.score, wpm, cpm, accuracy, streak: aggregate.streak, durationSeconds });
    setBest(aggregate.score > record.bestScore && next.bestScore === aggregate.score);
  }, [accuracy, aggregate, cpm, durationSeconds, gameOver, id, wpm]);

  useEffect(() => { if (gameOver) finalize(); }, [finalize, gameOver]);

  const restart = useCallback(() => {
    setGameOver(false); setElapsedMs(0); setStarted(false); setBest(false); setAggregate({ typed: 0, correct: 0, incorrect: 0, score: 0, streak: 0 });
    startedAtRef.current = null; pausedAtRef.current = null; pausedTotalRef.current = 0; completionRef.current = false; session.reset();
  }, [session.reset]);

  const timer = useMemo(() => ({ canAcceptInput: () => !paused && !gameOver && elapsedMs < durationSeconds * 1000 }), [durationSeconds, elapsedMs, gameOver, paused]);
  const view = useMemo(() => ({ ...session, elapsedMs, remainingMs: Math.max(durationSeconds * 1000 - elapsedMs, 0), wpm, cpm, ended: gameOver || paused, expired: gameOver, timer, sessionResetKey: `${id}-${durationSeconds}-${round}`, typing: session.typing, keyboardTap: session.keyboardTap }), [cpm, durationSeconds, elapsedMs, gameOver, id, paused, round, session, timer, wpm]);

  return { session: view, gameOver, best, aggregate, accuracy, wpm, cpm, started, finish, restart, remainingMs: Math.max(durationSeconds * 1000 - elapsedMs, 0) };
}
