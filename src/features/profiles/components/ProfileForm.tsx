import { useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { AvatarPicker } from "@/features/profiles/components/AvatarPicker";
import { DEFAULT_AVATAR_ID } from "@/features/profiles/utils/avatars";
import { PROFILE_NAME_MAX_LENGTH } from "@/features/profiles/services/profileStorage";

interface ProfileFormProps {
  initialName?: string;
  initialAvatarId?: string;
  submitLabel: string;
  onSubmit: (values: { name: string; avatarId: string }) => void;
  onCancel: () => void;
}

/**
 * Name + avatar fields shared by profile creation and editing.
 * Deliberately asks for nothing else — no email, no password, no
 * personal details — per the "local display name only" requirement.
 */
export function ProfileForm({
  initialName = "",
  initialAvatarId = DEFAULT_AVATAR_ID,
  submitLabel,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [avatarId, setAvatarId] = useState(initialAvatarId);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setError("Enter a name to continue.");
      return;
    }
    onSubmit({ name: trimmed, avatarId });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Input
        label="Display name"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          if (error) setError(null);
        }}
        maxLength={PROFILE_NAME_MAX_LENGTH}
        placeholder="e.g. Ali"
        error={error ?? undefined}
        autoFocus
      />

      <div>
        <p className="mb-2 text-sm font-medium text-ink">Avatar</p>
        <AvatarPicker name={name} value={avatarId} onChange={setAvatarId} />
      </div>

      <p className="text-xs leading-relaxed text-ink-faint">
        Your profile is stored only in this browser. No account is required.
      </p>

      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
