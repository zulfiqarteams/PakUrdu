interface LessonExplanationProps {
  explanation: string;
}

/** The short educational explanation shown before any practice. */
export function LessonExplanation({ explanation }: LessonExplanationProps) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
        Explanation
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink">{explanation}</p>
    </div>
  );
}
