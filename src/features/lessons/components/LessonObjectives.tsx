import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/Card";
import { useLanguage } from "@/i18n/useLanguage";

interface LessonObjectivesProps {
  objectives: string[];
}

/** "What you will learn" — the short list of objectives a lesson sets out. */
export function LessonObjectives({ objectives }: LessonObjectivesProps) {
  const { text } = useLanguage();
  if (objectives.length === 0) return null;

  return (
    <Card>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
        {text("What you will learn")}
      </h2>
      <ul className="mt-4 space-y-3">
        {objectives.map((objective) => (
          <li key={objective} className="flex items-start gap-2.5 text-sm text-ink-soft">
            <CheckCircle2
              size={16}
              className="mt-0.5 shrink-0 text-brand-500"
              aria-hidden="true"
            />
            <span>{text(objective)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
