import { CheckCircle2, Clock, Gauge, Target, XCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
// Imported directly from the statistics core (not the
// `@/features/statistics` barrel) to avoid a module import cycle —
// see the note in `statistics/core/statistics.ts`.
import { formatTime } from "@/features/statistics/core/statistics";

interface TypingStatsProps {
  accuracy: number;
  currentIndex: number;
  totalCharacters: number;
  incorrectCharacters: number;
  /** Unrounded WPM from the statistics engine (`@/features/statistics`) — rounded here at the point of display, nowhere else. */
  wpm: number;
  /** CPM from the shared statistics engine. */
  cpm?: number;
  /** Elapsed session time in ms, from the statistics engine's timer. */
  elapsedMs: number;
  /** Optional count of accepted typing attempts for a live session. */
  typedCharacters?: number;
  mode?: "full" | "header";
}

/**
 * WPM / Accuracy / Time / Characters / Errors.
 *
 * As of Part 8, WPM and Time come from the statistics engine
 * (`@/features/statistics`) rather than the typing engine — this
 * component stays a pure display and does no calculation of its own,
 * matching Part 7's split between engine and UI.
 */
export function TypingStats({
  accuracy,
  currentIndex,
  totalCharacters,
  incorrectCharacters,
  wpm,
  cpm,
  elapsedMs,
  typedCharacters,
  mode = "full",
}: TypingStatsProps) {
  if (mode === "header") {
    return (
      <div className="typing-stats-header grid grid-cols-3 gap-6 sm:gap-10">
        <StatCard icon={Gauge} label="WPM" value={`${Math.round(wpm)}`} />
        <StatCard icon={Gauge} label="CPM" value={`${Math.round(cpm ?? 0)}`} />
        <StatCard icon={Target} label="Accuracy" value={`${accuracy}%`} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:h-full lg:flex-col lg:justify-between">
      <StatCard icon={Gauge} label="WPM" value={`${Math.round(wpm)}`} />
      {cpm !== undefined && <StatCard icon={Gauge} label="CPM" value={`${Math.round(cpm)}`} />}
      <StatCard icon={Target} label="Accuracy" value={`${accuracy}%`} />
      <StatCard icon={Clock} label="Time" value={formatTime(elapsedMs)} />
      <StatCard
        icon={CheckCircle2}
        label="Characters"
        value={`${currentIndex}/${totalCharacters}`}
      />
      {typedCharacters !== undefined && (
        <StatCard icon={CheckCircle2} label="Typed" value={`${typedCharacters}`} />
      )}
      <StatCard icon={XCircle} label="Errors" value={`${incorrectCharacters}`} />
    </div>
  );
}
