import { CompassIcon } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

interface LessonNotFoundProps {
  /** When set, this was a data problem (bad references, missing
   *  content) rather than a plain unknown id. Shown as a plainer,
   *  learner-safe message — never the raw internal reason. */
  malformed?: boolean;
}

/**
 * Friendly not-found state for `/lesson/:id`. Covers both an id that
 * doesn't match any lesson and a lesson whose data is malformed —
 * either way the learner sees the same calm message, never a crash
 * or a raw error.
 */
export function LessonNotFound({ malformed = false }: LessonNotFoundProps) {
  return (
    <div className="py-10">
      <EmptyState
        icon={CompassIcon}
        title={malformed ? "This lesson can't be shown right now" : "Lesson not found"}
        description={
          malformed
            ? "Something's off with this lesson's content. Please pick another lesson from the learning path."
            : "We couldn't find a lesson with that id. It may have moved — check the learning path for the current list."
        }
        action={{ label: "Back to Learning Path", to: "/learn" }}
      />
    </div>
  );
}
