import { Link } from "react-router-dom";
import type { GameDefinition } from "../core/gameTypes";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/Card";
import { useLanguage } from "@/i18n/useLanguage";
export function GameCard({ game, icon: Icon }: { game: GameDefinition; icon: LucideIcon }) {
  const { t } = useLanguage(); const g = t.games;
  return <Link to={`/games/${game.id}`} className="block min-w-0"><Card hover className="h-full"><div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Icon size={20}/></span><ArrowRight size={17} className="mt-1 text-ink-faint"/></div><h3 className="mt-4 font-display text-lg font-bold text-ink">{g[game.titleKey as keyof typeof g]}</h3><p className="mt-1 text-sm leading-6 text-ink-soft">{g[game.descriptionKey as keyof typeof g]}</p></Card></Link>;
}
