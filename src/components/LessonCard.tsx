import { CheckCircle2, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { ProgressBar } from "@/components/ProgressBar";
import { cn } from "@/lib/cn";
import type { LessonDifficulty, LessonStatus } from "@/types";

interface LessonCardProps {
  index: number;
  title: string;
  description: string;
  difficulty?: LessonDifficulty;
  /** Explicit status. If omitted, falls back to `locked` for
   *  backward compatibility (available/locked only). */
  status?: LessonStatus;
  /** 0–100. Only shown when `status` is "current". Supplied by the
   *  future lesson engine — this component never computes it. */
  progress?: number;
  /** @deprecated prefer `status="locked"` */
  locked?: boolean;
  to?: string;
}

const difficultyTone: Record<LessonDifficulty, "brand" | "gold" | "neutral"> = {
  Beginner: "brand",
  Intermediate: "gold",
  Professional: "neutral",
};

/**
 * A single lesson entry inside a learning-path tier. Visual only —
 * `status`/`progress` are supplied by the caller so the future
 * lesson engine can drive this component without it knowing
 * anything about lesson persistence or progress calculation.
 */
export function LessonCard({
  index,
  title,
  description,
  difficulty,
  status,
  progress,
  locked = false,
  to,
}: LessonCardProps) {
  const resolvedStatus: LessonStatus = status ?? (locked ? "locked" : "available");
  const isLocked = resolvedStatus === "locked";
  const isCompleted = resolvedStatus === "completed";
  const isCurrent = resolvedStatus === "current";

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="numeric text-xs font-semibold text-ink-faint">
          {String(index).padStart(2, "0")}
        </span>
        {isLocked ? (
          <Lock size={16} className="text-ink-faint" aria-hidden="true" />
        ) : isCompleted ? (
          <CheckCircle2 size={16} className="text-success-500" aria-hidden="true" />
        ) : (
          <ArrowRight
            className="directional-icon text-brand-500 opacity-0 transition-opacity group-hover:opacity-100"
            size={16}
            aria-hidden="true"
          />
        )}
      </div>

      <h3
        dir="ltr"
        className={cn(
          "mt-3 text-start text-sm font-semibold [unicode-bidi:isolate]",
          isLocked ? "text-ink-faint" : "text-ink",
        )}
      >
        {title}
      </h3>
      <p dir="ltr" className="mt-1.5 text-start text-sm leading-relaxed text-ink-soft [unicode-bidi:isolate]">
        {description}
      </p>

      {(difficulty || isCompleted) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {difficulty && <Badge tone={difficultyTone[difficulty]}>{difficulty}</Badge>}
          {isCompleted && <Badge tone="success">Completed</Badge>}
        </div>
      )}

      {isCurrent && typeof progress === "number" && (
        <ProgressBar
          value={progress}
          label={`${title} progress`}
          showLabel
          className="mt-4"
        />
      )}
    </>
  );

  if (isLocked || !to) {
    return (
      <Card className="cursor-not-allowed select-none bg-paper opacity-70">
        {content}
      </Card>
    );
  }

  return (
    <Link to={to} className="group block" aria-current={isCurrent ? "step" : undefined}>
      <Card hover>{content}</Card>
    </Link>
  );
}
