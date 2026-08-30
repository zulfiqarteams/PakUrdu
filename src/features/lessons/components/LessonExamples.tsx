import { Card } from "@/components/Card";
import type { LessonExample } from "@/features/lessons/types";

interface LessonExamplesProps {
  examples: LessonExample[];
}

/**
 * Shows a lesson's worked examples — Urdu text (rendered RTL via
 * `.urdu-text`) alongside its optional transliteration and meaning.
 */
export function LessonExamples({ examples }: LessonExamplesProps) {
  if (examples.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">Examples</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {examples.map((example, index) => (
          <Card key={`${example.urdu}-${index}`} className="text-center">
            <p className="urdu-text text-3xl">{example.urdu}</p>
            {(example.transliteration || example.meaning) && (
              <p className="mt-2 text-sm text-ink-soft">
                {example.transliteration}
                {example.transliteration && example.meaning ? " — " : ""}
                {example.meaning}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
