import { Check, Plus } from "lucide-react";
import { useProfiles } from "@/features/profiles/context/ProfileContext";
import { ProfileAvatar } from "@/features/profiles/components/ProfileAvatar";
import { cn } from "@/lib/cn";

interface ProfileSelectorProps {
  /** Called after a profile is selected — e.g. to close a menu. */
  onSelect?: (id: string) => void;
  /** Shows a "Create new profile" row when provided. */
  onCreateNew?: () => void;
  className?: string;
}

/**
 * Lists every local profile with the active one clearly indicated,
 * and lets the user switch between them. Reused as-is inside the
 * navbar's compact profile menu and on the full-width Profile page —
 * both just render this inside their own container.
 */
export function ProfileSelector({ onSelect, onCreateNew, className }: ProfileSelectorProps) {
  const { profiles, activeProfile, selectProfile } = useProfiles();

  return (
    <div className={cn("space-y-1", className)}>
      {profiles.map((profile) => {
        const isActive = profile.id === activeProfile?.id;
        return (
          <button
            key={profile.id}
            type="button"
            aria-current={isActive || undefined}
            onClick={() => {
              selectProfile(profile.id);
              onSelect?.(profile.id);
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-sm px-3 py-2 text-start text-sm transition-colors",
              isActive ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-paper",
            )}
          >
            <ProfileAvatar name={profile.name} avatarId={profile.avatarId} seed={profile.id} size="sm" />
            <span className="flex-1 truncate font-medium">{profile.name}</span>
            {isActive && <Check size={16} aria-hidden="true" className="shrink-0" />}
          </button>
        );
      })}

      {onCreateNew && (
        <button
          type="button"
          onClick={onCreateNew}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-start text-sm font-medium text-brand-600 hover:bg-brand-50"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dashed border-border-strong">
            <Plus size={15} aria-hidden="true" />
          </span>
          Create new profile
        </button>
      )}
    </div>
  );
}
