import { ArrowUpRight, Trophy } from "lucide-react";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { BrandLogo } from "@/components/brand/BrandLogo";

interface AchievementModalProps {
  open: boolean;
  onClose: () => void;
  kind: "personal-best" | "home-row-master";
  wpm?: number;
}

export function AchievementModal({ open, onClose, kind, wpm }: AchievementModalProps) {
  const personalBest = kind === "personal-best";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={personalBest ? "New Personal Best" : "Home Row Mastered"}
      description={personalBest ? "Your typing speed just moved upward." : "A flawless Home Row exercise deserves a victory lap."}
      className="overflow-hidden border-white/10 bg-[#0b131a] text-white [&_h2]:text-white [&_p]:text-white/55 [&_button]:text-white/60"
    >
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center sm:p-6">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-24 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="achievement-logo-rise relative mx-auto h-32 w-28 sm:h-40 sm:w-36">
          <BrandLogo decorative className="h-full w-full" />
        </div>

        <div className="relative mt-2 flex items-center justify-center gap-2 text-brand-300">
          <Trophy size={16} aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">
            {personalBest ? "Speed breakthrough" : "Perfect form"}
          </span>
        </div>

        {personalBest && wpm !== undefined && (
          <p className="numeric mt-3 text-3xl font-extrabold text-white">{Math.round(wpm)} WPM</p>
        )}

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/55">
          {personalBest
            ? "Keep climbing — the upward arrow is your reminder that consistent practice compounds."
            : "Your accuracy and home-row discipline were flawless. Carry that muscle memory into the next lesson."}
        </p>

        <Button
          type="button"
          size="md"
          className="mt-5"
          onClick={onClose}
        >
          Keep Learning <ArrowUpRight size={14} aria-hidden="true" />
        </Button>
      </div>
    </Modal>
  );
}
