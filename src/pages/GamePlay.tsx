import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageContainer } from "@/components/PageContainer";
import { useLanguage } from "@/i18n/useLanguage";
import { useSettings } from "@/features/settings";
import { TypingWorkspace } from "@/features/typing";
import { useGameSession } from "@/features/games/hooks/useGameSession";
import { gameDefinitions } from "@/features/games/data/gameDefinitions";
import { getComboTarget, getLetterTarget, getSprintTarget, getSurvivalTarget, getWordTarget } from "@/features/games/data/gameContent";
import { GameStats } from "@/features/games/components/GameStats";
import { GameResult } from "@/features/games/components/GameResult";
import { getFeedback } from "@/features/results/core/feedback";
import type { GameId } from "@/features/games/core/gameTypes";

function targetFor(id: GameId, round: number, duration: number) {
  if (id === "letter-hunter") return getLetterTarget(round);
  if (id === "word-rush") return getWordTarget(round);
  if (id === "combo-master") return getComboTarget(round);
  if (id === "typing-sprint") return getSprintTarget(duration);
  return getSurvivalTarget(round);
}

export default function GamePlay() {
  const { t } = useLanguage();
  const { showKeyboard } = useSettings();
  const rawId = window.location.pathname.split("/").filter(Boolean).pop() as GameId;
  const game = gameDefinitions.find((item) => item.id === rawId) ?? gameDefinitions[0];
  const [duration, setDuration] = useState(game.defaultDuration);
  const [customDuration, setCustomDuration] = useState(game.defaultDuration);
  const [round, setRound] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lives, setLives] = useState(3);
  const [mistakesSeen, setMistakesSeen] = useState(0);

  const target = useMemo(() => targetFor(game.id, round, duration), [game.id, round, duration]);
  const handleRoundComplete = () => {
    if (game.id !== "typing-sprint") setRound((value) => value + 1);
  };
  const handleGameOver = () => setPaused(false);
  const gameSession = useGameSession({ id: game.id, targetText: target, durationSeconds: duration, round, paused, onRoundComplete: handleRoundComplete, onGameOver: handleGameOver });
  const { session, gameOver, best, aggregate, accuracy, wpm, cpm, restart, remainingMs, finish } = gameSession;

  useEffect(() => { setRound(0); setPaused(false); setLives(3); setMistakesSeen(0); }, [game.id]);

  useEffect(() => {
    if (game.id !== "urdu-survival" || gameOver) return;
    const mistakes = aggregate.incorrect;
    if (mistakes >= mistakesSeen + 2) {
      const lost = Math.floor((mistakes - mistakesSeen) / 2);
      setMistakesSeen((value) => value + lost * 2);
      setLives((value) => { const next = Math.max(0, value - lost); if (next === 0) finish(); return next; });
    }
  }, [aggregate.incorrect, finish, game.id, gameOver, mistakesSeen]);

  const feedback = gameOver ? getFeedback({ accuracy, wpm, isPersonalBest: best }) : null;

  return <PageContainer>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <Button variant="ghost" size="sm" to="/games"><ArrowLeft size={15}/>{t.games.backToGames}</Button>
      <div className="flex max-w-full flex-wrap items-center justify-end gap-2">
        {game.id === "typing-sprint" && <>
          {game.durationOptions.map((seconds) => <button key={seconds} type="button" onClick={() => !gameSession.started && !gameOver && setDuration(seconds)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${duration === seconds ? "border-brand-500 bg-brand-50 text-brand-700" : "border-border text-ink-soft"}`}>{seconds}s</button>)}
          <input aria-label={t.home.customTiming} type="number" min={5} max={300} value={customDuration} onChange={(e) => { const next = Math.max(5, Math.min(300, Number(e.target.value) || 5)); setCustomDuration(next); setDuration(next); }} className="w-20 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-ink" />
        </>}
        {!gameOver && <Button variant="secondary" size="sm" onClick={() => setPaused((value) => !value)}>{paused ? <Play size={14}/> : <Pause size={14}/>} {paused ? t.games.resume : t.games.pause}</Button>}
        <Button variant="secondary" size="sm" onClick={restart}><RotateCcw size={14}/>{t.games.restart}</Button>
      </div>
    </div>

    <Card className="mb-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{t.games.round} {round + 1}</p><h1 className="mt-1 break-words font-display text-2xl font-bold text-ink">{t.games[game.titleKey as keyof typeof t.games]}</h1></div><p className="max-w-xl text-sm leading-6 text-ink-soft">{t.games[game.descriptionKey as keyof typeof t.games]}</p></div></Card>
    <GameStats score={aggregate.score} wpm={wpm} cpm={cpm} accuracy={accuracy} streak={aggregate.streak} timeLeft={remainingMs / 1000} lives={game.id === "urdu-survival" ? lives : undefined} />
    {paused && !gameOver && <div className="mt-4 rounded-lg border border-brand-200 bg-brand-50 p-3 text-center text-sm font-medium text-brand-700">{t.games.paused}</div>}
    <div className="mt-5">{gameOver ? <GameResult score={aggregate.score} wpm={wpm} cpm={cpm} accuracy={accuracy} streak={aggregate.streak} best={best} feedback={feedback?.message} onReplay={restart}/> : <TypingWorkspace session={session} showKeyboard={showKeyboard} keyboardTitle={t.games.keyboard} showFingerGuide={true} showReset={false} sizeVariant="compact" />}</div>
  </PageContainer>;
}
