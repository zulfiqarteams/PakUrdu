import { RotateCcw } from "lucide-react";
import { Button } from "@/components/Button";
import { useLanguage } from "@/i18n/useLanguage";
export function GameResult({ score, wpm, cpm, accuracy, streak, best, feedback, onReplay }: { score:number; wpm:number; cpm:number; accuracy:number; streak:number; best:boolean; feedback?:string; onReplay:()=>void }) {
 const {t}=useLanguage(); return <div className="rounded-xl border border-brand-300 bg-brand-50 p-5 text-center"><h2 className="font-display text-xl font-bold text-brand-700">{best ? t.games.newRecord : t.games.gameOver}</h2>{feedback && <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ink-soft">{feedback}</p>}<div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">{[[t.games.score,score],[t.games.wpm,Math.round(wpm)],[t.games.cpm,Math.round(cpm)],[t.games.accuracy,`${Math.round(accuracy)}%`],[t.games.streak,streak]].map(([k,v])=><div key={String(k)}><div className="text-xs text-ink-faint">{k}</div><div className="font-bold text-ink">{v}</div></div>)}</div><Button className="mt-5" onClick={onReplay}><RotateCcw size={15}/>{t.games.tryAgain}</Button></div>;
}
