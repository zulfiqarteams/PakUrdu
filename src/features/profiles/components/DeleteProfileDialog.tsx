import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { ProfileAvatar } from "@/features/profiles/components/ProfileAvatar";
import type { Profile } from "@/features/profiles/types";

interface DeleteProfileDialogProps {
  /** The profile pending deletion, or null when the dialog is closed. */
  profile: Profile | null;
  onCancel: () => void;
  onConfirm: (id: string) => void;
}

/**
 * Requires an explicit confirmation click before a profile is
 * removed — deletion can't happen accidentally from a single click
 * anywhere else in the UI. Wording is written to hold up once
 * progress/lesson state exists for a profile, not just for what's
 * stored today.
 */
export function DeleteProfileDialog({ profile, onCancel, onConfirm }: DeleteProfileDialogProps) {
  return (
    <Modal
      open={profile !== null}
      onClose={onCancel}
      title="Delete this local profile?"
      description="This removes the profile and everything stored for it in this browser. This can't be undone."
    >
      {profile && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-sm border border-border bg-paper p-3">
            <ProfileAvatar name={profile.name} avatarId={profile.avatarId} seed={profile.id} />
            <p className="text-sm font-medium text-ink">{profile.name}</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => onConfirm(profile.id)}>
              Delete profile
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
