export interface AvatarOption {
  id: string;
  /** Emoji glyph, or `null` for the "use my initials" option. */
  emoji: string | null;
  /** Accessible name announced for this option — avatars must never
   *  be distinguishable by color alone. */
  label: string;
}

export const DEFAULT_AVATAR_ID = "initials";

/**
 * Fixed set of avatar choices. Deliberately not arbitrary image
 * uploads (out of scope for this part, and it would mean storing
 * image data in localStorage) — a predefined set keeps every avatar
 * lightweight, private, and instant to render.
 */
export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: "initials", emoji: null, label: "Initials" },
  { id: "star", emoji: "⭐", label: "Star" },
  { id: "book", emoji: "📘", label: "Book" },
  { id: "feather", emoji: "🪶", label: "Feather" },
  { id: "leaf", emoji: "🌿", label: "Leaf" },
  { id: "keyboard", emoji: "⌨️", label: "Keyboard" },
  { id: "moon", emoji: "🌙", label: "Moon" },
  { id: "sun", emoji: "☀️", label: "Sun" },
  { id: "compass", emoji: "🧭", label: "Compass" },
  { id: "spark", emoji: "✨", label: "Spark" },
];

/** Resolves an avatar id to its option, falling back to the default
 *  (initials) if the stored id is unrecognized — e.g. corrupted data
 *  or an option removed in a future version. */
export function getAvatarOption(avatarId: string): AvatarOption {
  return (
    AVATAR_OPTIONS.find((option) => option.id === avatarId) ??
    AVATAR_OPTIONS[0]
  );
}

/** Up to two initials derived from a profile name, used by the
 *  "initials" avatar and as a visual fallback anywhere an emoji
 *  can't render. */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
