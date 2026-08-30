import { Modal } from "@/components/Modal";
import { ProfileForm } from "@/features/profiles/components/ProfileForm";
import { useProfiles } from "@/features/profiles/context/ProfileContext";
import type { Profile } from "@/features/profiles/types";

interface ProfileFormModalProps {
  open: boolean;
  onClose: () => void;
  /** When set, the modal edits this profile instead of creating a new one. */
  profile?: Profile | null;
}

/** Wraps ProfileForm in a Modal, wiring it to create or update
 *  through the profile context depending on whether a profile was
 *  passed in. One component so callers (navbar, onboarding, profile
 *  page) don't each re-implement the create-vs-edit branching. */
export function ProfileFormModal({ open, onClose, profile = null }: ProfileFormModalProps) {
  const { createProfile, updateProfile } = useProfiles();
  const isEditing = profile !== null;

  function handleSubmit(values: { name: string; avatarId: string }) {
    if (profile) {
      updateProfile(profile.id, values);
    } else {
      createProfile(values);
    }
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit profile" : "Create a local profile"}
      description={isEditing ? undefined : "No account required — this stays on your device."}
    >
      <ProfileForm
        key={profile?.id ?? "new"}
        initialName={profile?.name}
        initialAvatarId={profile?.avatarId}
        submitLabel={isEditing ? "Save changes" : "Create profile"}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
