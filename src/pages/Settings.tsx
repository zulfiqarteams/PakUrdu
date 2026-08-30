import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { GraduationCap, Keyboard, Palette, UserCircle } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Toggle } from "@/components/Toggle";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useSEO } from "@/hooks/useSEO";
import { useProfiles } from "@/features/profiles/context/ProfileContext";
import { useSettings } from "@/features/settings";
import type { SettingsState } from "@/features/settings";
import { AvatarPicker } from "@/features/profiles/components/AvatarPicker";
import { DEFAULT_AVATAR_ID } from "@/features/profiles/utils/avatars";
import { PROFILE_NAME_MAX_LENGTH } from "@/features/profiles/services/profileStorage";

interface SettingRow {
  label: string;
  description: string;
}

interface SettingsGroup {
  id: string;
  title: string;
  icon: LucideIcon;
  rows: SettingRow[];
}

const groups: SettingsGroup[] = [
  {
    id: "appearance",
    title: "Appearance",
    icon: Palette,
    rows: [
      { label: "Theme", description: "Switch between the light and dark theme." },
      { label: "Interface preferences", description: "Use a larger interface text scale." },
    ],
  },
  {
    id: "typing",
    title: "Typing",
    icon: Keyboard,
    rows: [
      { label: "Keyboard preferences", description: "Show or hide the on-screen keyboard during practice." },
      { label: "Typing behavior", description: "Show or hide typing key feedback and error highlighting." },
      { label: "Typing sounds", description: "Play subtle key, error, and result sounds while typing." },
    ],
  },
  {
    id: "learning",
    title: "Learning",
    icon: GraduationCap,
    rows: [
      { label: "Learning preferences", description: "Save or stop saving lesson progress to this browser." },
    ],
  },
];

/**
 * Editable display name + avatar for the active local profile. This
 * is the one settings group that's actually functional right now —
 * everything below it stays visual-only per the Part 4 scope.
 */
function ProfileSettingsCard() {
  const { activeProfile, updateProfile } = useProfiles();
  const [name, setName] = useState(activeProfile?.name ?? "");
  const [avatarId, setAvatarId] = useState(activeProfile?.avatarId ?? DEFAULT_AVATAR_ID);
  const [saved, setSaved] = useState(false);

  // Re-sync the form whenever the active profile itself changes
  // (switched profiles, or was edited elsewhere e.g. the navbar).
  useEffect(() => {
    setName(activeProfile?.name ?? "");
    setAvatarId(activeProfile?.avatarId ?? DEFAULT_AVATAR_ID);
    setSaved(false);
  }, [activeProfile?.id, activeProfile?.name, activeProfile?.avatarId]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!activeProfile || trimmed.length === 0) return;
    updateProfile(activeProfile.id, { name: trimmed, avatarId });
    setSaved(true);
  }

  return (
    <Card className="sm:col-span-2 lg:col-span-3">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-50 text-brand-600">
          <UserCircle size={16} aria-hidden="true" />
        </span>
        <h2 className="text-sm font-semibold">Profile</h2>
      </div>

      {!activeProfile ? (
        <p className="text-sm text-ink-soft">
          No local profile is selected yet.{" "}
          <Link to="/profile" className="font-medium text-brand-600 hover:underline">
            Create one
          </Link>{" "}
          to edit your name and avatar here.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Display name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setSaved(false);
            }}
            maxLength={PROFILE_NAME_MAX_LENGTH}
          />
          <div>
            <p className="mb-2 text-sm font-medium text-ink">Avatar</p>
            <AvatarPicker
              name={name || activeProfile.name}
              value={avatarId}
              onChange={(id) => {
                setAvatarId(id);
                setSaved(false);
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" size="sm">
              Save changes
            </Button>
            {saved && <span className="text-xs font-medium text-success-600">Saved</span>}
          </div>
          <p className="border-t border-border pt-4 text-xs text-ink-faint">
            Stored locally in this browser. Not sent to any server.
          </p>
        </form>
      )}
    </Card>
  );
}

export default function Settings() {
  useSEO({ title: "Settings", noIndex: true });
  const { darkTheme, largeInterface, showKeyboard, typingFeedback, soundEnabled, saveLearningProgress, setSetting } = useSettings();

  const values: Record<string, boolean> = {
    Theme: darkTheme,
    "Interface preferences": largeInterface,
    "Keyboard preferences": showKeyboard,
    "Typing behavior": typingFeedback,
    "Typing sounds": soundEnabled,
    "Learning preferences": saveLearningProgress,
  };

  const settingKeys: Record<string, keyof SettingsState> = {
    Theme: "darkTheme",
    "Interface preferences": "largeInterface",
    "Keyboard preferences": "showKeyboard",
    "Typing behavior": "typingFeedback",
    "Typing sounds": "soundEnabled",
    "Learning preferences": "saveLearningProgress",
  };

  function handleToggle(label: string, checked: boolean) {
    const key = settingKeys[label];
    if (key) setSetting(key, checked);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Customize your appearance, typing, and learning preferences."
      />

      <div className="grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <ProfileSettingsCard />
        {groups.map((group) => (
          <Card key={group.id}>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-50 text-brand-600">
                <group.icon size={16} aria-hidden="true" />
              </span>
              <h2 className="text-sm font-semibold">{group.title}</h2>
            </div>

            <ul className="space-y-4">
              {group.rows.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between gap-4 border-t border-border pt-4 first:border-t-0 first:pt-0"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">{row.label}</p>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      {row.description}
                    </p>
                  </div>
                  <Toggle
                    label={row.label}
                    labelHidden
                    checked={values[row.label] ?? false}
                    onChange={(event) => handleToggle(row.label, event.currentTarget.checked)}
                  />
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
