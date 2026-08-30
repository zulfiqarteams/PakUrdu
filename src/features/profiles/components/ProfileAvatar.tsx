import { getAvatarOption, getInitials } from "@/features/profiles/utils/avatars";
import { cn } from "@/lib/cn";

const PALETTE = [
  "bg-brand-500",
  "bg-gold-500",
  "bg-info-500",
  "bg-success-500",
  "bg-error-500",
  "bg-brand-300",
] as const;

/** Deterministic (not random) so a profile's color stays stable
 *  across reloads without needing to store it. */
function paletteIndex(seed: string): number {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash % PALETTE.length;
}

interface ProfileAvatarProps {
  name: string;
  avatarId: string;
  /** Stabilizes the color assignment (normally the profile id) even
   *  if the display name later changes; falls back to `name`. */
  seed?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses: Record<NonNullable<ProfileAvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-base",
  lg: "h-20 w-20 text-2xl",
};

/**
 * Renders a profile's avatar as a colored circle containing either
 * its chosen emoji or the learner's initials. Color is decorative
 * only — the emoji/initials (which differ per avatar choice and per
 * name) are what actually distinguish profiles, so this stays
 * accessible without relying on color alone.
 */
export function ProfileAvatar({ name, avatarId, seed, size = "md", className }: ProfileAvatarProps) {
  const option = getAvatarOption(avatarId);
  const colorClass = PALETTE[paletteIndex(seed ?? name)];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-white",
        sizeClasses[size],
        colorClass,
        className,
      )}
    >
      {option.emoji ?? getInitials(name)}
    </span>
  );
}
