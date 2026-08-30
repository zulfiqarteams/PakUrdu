import { AVATAR_OPTIONS, getInitials } from "@/features/profiles/utils/avatars";
import { cn } from "@/lib/cn";

interface AvatarPickerProps {
  /** Current display name, used to preview initials on that option. */
  name: string;
  value: string;
  onChange: (avatarId: string) => void;
}

/**
 * Keyboard- and screen-reader-accessible grid of the predefined
 * avatar choices. Each option has its own accessible name — avatars
 * are never distinguished by color alone.
 */
export function AvatarPicker({ name, value, onChange }: AvatarPickerProps) {
  const initials = getInitials(name || "?");

  return (
    <div role="radiogroup" aria-label="Avatar" className="grid grid-cols-5 gap-2.5">
      {AVATAR_OPTIONS.map((option) => {
        const isSelected = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={option.emoji === null ? `Initials (${initials})` : option.label}
            title={option.label}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border-2 bg-surface text-lg text-ink transition-colors",
              isSelected ? "border-brand-500" : "border-transparent hover:border-border-strong",
            )}
          >
            {option.emoji ?? (
              <span className="font-display text-sm font-semibold text-ink-soft">{initials}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
