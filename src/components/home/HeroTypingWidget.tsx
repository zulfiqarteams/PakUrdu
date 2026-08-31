import { useMemo, useState } from "react";
import { ArrowRight, Keyboard, RotateCcw } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/i18n/useLanguage";
import { useSettings } from "@/features/settings";
import { TypingWorkspace, useTypingSession } from "@/features/typing";
import { buildInstantUrduPassage } from "@/features/typing/data/instantUrduPassages";

const durations = [15, 30, 60] as const;
const CUSTOM_MIN_MINUTES = 1;
const CUSTOM_MAX_MINUTES = 30;

export function HeroTypingWidget() {
  const { t } = useLanguage();
  const { showKeyboard } = useSettings();
  const [seconds, setSeconds] = useState(30);
  const [customMinutes, setCustomMinutes] = useState(2);
  const [customSelected, setCustomSelected] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const targetText = useMemo(() => buildInstantUrduPassage(seconds, attempt), [seconds, attempt]);
  const session = useTypingSession({ targetText, resetKey: `${seconds}-${attempt}`, durationMs: seconds * 1000 });

  const restart = (nextSeconds = seconds) => {
    setSeconds(nextSeconds);
    setCustomSelected(false);
    setAttempt((value) => value + 1);
  };

  const selectCustom = () => {
    const nextSeconds = Math.min(Math.max(customMinutes, CUSTOM_MIN_MINUTES), CUSTOM_MAX_MINUTES) * 60;
    setSeconds(nextSeconds);
    setCustomSelected(true);
    setAttempt((value) => value + 1);
  };

  return (
    <section aria-label="Try the Urdu typing test" className="hero-typing-height relative overflow-hidden border-b border-border/50 bg-paper dark:bg-transparent">
      <PageContainer className="py-3 sm:py-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Badge tone="brand" className="inline-flex items-center gap-1.5"><Keyboard size={12} />{t.home.instantTypingTest}</Badge>
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Test duration">
            {durations.map((value) => (
              <button key={value} type="button" role="radio" aria-checked={!customSelected && seconds === value} onClick={() => restart(value)} className={cn("rounded-full border px-2.5 py-1 text-xs font-medium transition-colors", !customSelected && seconds === value ? "border-brand-500 bg-brand-50 text-brand-700" : "border-border text-ink-soft hover:border-border-strong")}>
                {value}s
              </button>
            ))}
            <button type="button" role="radio" aria-checked={customSelected} onClick={selectCustom} className={cn("rounded-full border px-2.5 py-1 text-xs font-medium transition-colors", customSelected ? "border-brand-500 bg-brand-50 text-brand-700" : "border-border text-ink-soft hover:border-border-strong")}>
              Custom
            </button>
            <Button size="sm" variant="ghost" onClick={() => restart()} aria-label="Restart typing test"><RotateCcw size={13} /></Button>
          </div>
        </div>

        {customSelected && (
          <div className="mb-3 flex items-center gap-3 rounded-lg border border-border/60 bg-surface/50 px-3 py-2">
            <label htmlFor="hero-custom-duration" className="text-xs font-medium text-ink-soft">Custom minutes</label>
            <input
              id="hero-custom-duration"
              type="range"
              min={1}
              max={30}
              step={1}
              value={customMinutes}
              onChange={(event) => {
                const minutes = Math.min(Math.max(Number(event.target.value) || CUSTOM_MIN_MINUTES, CUSTOM_MIN_MINUTES), CUSTOM_MAX_MINUTES);
                setCustomMinutes(minutes);
                setSeconds(minutes * 60);
              }}
              className="min-w-0 flex-1 accent-brand-500"
            />
            <span className="w-12 text-right text-xs font-semibold text-brand-700">{customMinutes}m</span>
          </div>
        )}

        <TypingWorkspace
          session={session}
          showKeyboard={showKeyboard}
          sizeVariant="compact"
          keyboardTitle={t.keyboard.keyboard}
          statusSummary={session.ended ? t.home.timeUp : undefined}
          footer={
            <Button to="/test" variant="primary" size="sm">
              {t.home.fullTypingTest} <ArrowRight size={14} />
            </Button>
          }
        />
      </PageContainer>
    </section>
  );
}
