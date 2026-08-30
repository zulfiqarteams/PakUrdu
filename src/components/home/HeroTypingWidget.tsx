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

export function HeroTypingWidget() {
  const { t } = useLanguage();
  const { showKeyboard } = useSettings();
  const [seconds, setSeconds] = useState(30);
  const [attempt, setAttempt] = useState(0);
  const targetText = useMemo(() => buildInstantUrduPassage(seconds, attempt), [seconds, attempt]);
  const session = useTypingSession({ targetText, resetKey: `${seconds}-${attempt}`, durationMs: seconds * 1000 });

  const restart = (nextSeconds = seconds) => {
    setSeconds(nextSeconds);
    setAttempt((value) => value + 1);
  };

  return (
    <section aria-label="Try the Urdu typing test" className="hero-typing-height relative overflow-hidden border-b border-border/50 bg-paper dark:bg-transparent">
      <PageContainer className="py-3 sm:py-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Badge tone="brand" className="inline-flex items-center gap-1.5"><Keyboard size={12} />{t.home.instantTypingTest}</Badge>
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Test duration">
            {durations.map((value) => (
              <button key={value} type="button" role="radio" aria-checked={seconds === value} onClick={() => restart(value)} className={cn("rounded-full border px-2.5 py-1 text-xs font-medium transition-colors", seconds === value ? "border-brand-500 bg-brand-50 text-brand-700" : "border-border text-ink-soft hover:border-border-strong")}>
                {value}s
              </button>
            ))}
            <Button size="sm" variant="ghost" onClick={() => restart()} aria-label="Restart typing test"><RotateCcw size={13} /></Button>
          </div>
        </div>

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
