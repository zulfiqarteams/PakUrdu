import { Gamepad2, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { GameGrid } from "@/features/games/components/GameGrid";
import { getDailyChallenge } from "@/features/games/data/gameContent";
import { gameDefinitions } from "@/features/games/data/gameDefinitions";
import { getGameHistory } from "@/features/games/services/gameStorage";
import { useLanguage } from "@/i18n/useLanguage";
import { useSEO } from "@/hooks/useSEO";

export default function Games() {
  const { t } = useLanguage();
  const daily = getDailyChallenge();
  const history = getGameHistory();
  useSEO({ title: t.games.title, description: t.games.description });
  return <PageContainer>
    <PageHeader title={t.games.title} description={t.games.description} />
    <Card className="mb-6 flex flex-col gap-4 border-brand-200 bg-brand-50/50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white"><Gamepad2 size={20}/></span><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{t.games.dailyChallenge}</p><p className="mt-1 text-sm text-ink-soft">{t.games.dailyChallengeDescription}</p></div></div>
      <Link to={`/games/${daily.gameId}`} className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-brand-700">{t.games.playImproveMaster}</Link>
    </Card>
    <GameGrid />
    {history.length > 0 && <Card className="mt-6"><div className="flex items-center gap-2"><Trophy size={17} className="text-brand-600"/><h2 className="font-display text-lg font-bold text-ink">{t.games.history}</h2></div><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{history.slice(0, 6).map((entry) => <div key={entry.id} className="min-w-0 rounded-lg border border-border p-3"><div className="truncate text-sm font-semibold text-ink">{t.games[gameDefinitions.find((g) => g.id === entry.gameId)?.titleKey as keyof typeof t.games] ?? entry.gameId}</div><div className="mt-1 text-xs text-ink-faint">{t.games.score}: {entry.score} · {t.games.wpm}: {Math.round(entry.wpm)} · {Math.round(entry.accuracy)}%</div></div>)}</div></Card>}
  </PageContainer>;
}
