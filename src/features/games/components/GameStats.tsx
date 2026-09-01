import { useLanguage } from "@/i18n/useLanguage";
interface Props { score: number; wpm: number; cpm: number; accuracy: number; streak: number; timeLeft: number; lives?: number; }
export function GameStats({ score, wpm, cpm, accuracy, streak, timeLeft, lives }: Props) {
  const { t } = useLanguage();
  const items = [[t.games.score, score], [t.games.wpm, Math.round(wpm)], [t.games.cpm, Math.round(cpm)], [t.games.accuracy, `${Math.round(accuracy)}%`], [t.games.streak, streak], ...(typeof lives === "number" ? [[t.games.lives, lives]] : []), [t.games.time, `${Math.ceil(timeLeft)}s`]];
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-7">{items.map(([label, value]) => <div key={String(label)} className="rounded-lg border border-border bg-surface p-3 text-center"><div className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">{label}</div><div className="mt-1 text-lg font-bold text-ink">{value}</div></div>)}</div>;
}
