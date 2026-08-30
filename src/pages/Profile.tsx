import { useState } from "react";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { useSEO } from "@/hooks/useSEO";
import { useProfiles } from "@/features/profiles/context/ProfileContext";
import { ProfileAvatar } from "@/features/profiles/components/ProfileAvatar";
import { ProfileSelector } from "@/features/profiles/components/ProfileSelector";
import { ProfileFormModal } from "@/features/profiles/components/ProfileFormModal";
import { DeleteProfileDialog } from "@/features/profiles/components/DeleteProfileDialog";
import type { Profile } from "@/features/profiles/types";

function formatCreatedDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

interface FormModalState {
  open: boolean;
  profile: Profile | null;
}

export default function ProfilePage() {
  useSEO({ title: "Profile", noIndex: true });
  const { profiles, activeProfile, deleteProfile } = useProfiles();
  const [formModal, setFormModal] = useState<FormModalState>({ open: false, profile: null });
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);

  const closeFormModal = () => setFormModal({ open: false, profile: null });

  // First-time state: no local profiles exist on this browser at all.
  if (profiles.length === 0) {
    return (
      <PageContainer>
        <PageHeader
          title="Profile"
          description="Your local profile stays on this device — no account required."
        />
        <div className="py-10">
          <EmptyState
            icon={UserPlus}
            title="Welcome to Urdu Typing Tutorial"
            description="Create a local profile to start your learning journey. Your profile stays in this browser — no account is required."
          />
          <div className="mt-6 flex justify-center">
            <Button size="lg" onClick={() => setFormModal({ open: true, profile: null })}>
              Create Profile
            </Button>
          </div>
        </div>

        <ProfileFormModal open={formModal.open} profile={formModal.profile} onClose={closeFormModal} />
      </PageContainer>
    );
  }

  // Profiles exist on this browser, but none is currently active —
  // e.g. the previously active profile was deleted or its id is stale.
  if (!activeProfile) {
    return (
      <PageContainer>
        <PageHeader title="Profile" description="Choose a local profile to continue." />
        <Card className="my-10 max-w-md">
          <ProfileSelector onCreateNew={() => setFormModal({ open: true, profile: null })} />
        </Card>
        <ProfileFormModal open={formModal.open} profile={formModal.profile} onClose={closeFormModal} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Profile" description="Manage your local profile on this device." />

      <div className="grid gap-6 py-10 lg:grid-cols-3">
        <Card className="flex flex-col items-center text-center lg:col-span-1">
          <ProfileAvatar
            name={activeProfile.name}
            avatarId={activeProfile.avatarId}
            seed={activeProfile.id}
            size="lg"
          />
          <p className="mt-4 text-lg font-semibold text-ink">{activeProfile.name}</p>
          <p className="mt-1 text-xs text-ink-faint">
            Created {formatCreatedDate(activeProfile.createdAt)}
          </p>
          <Badge tone="brand" className="mt-4">
            Local profile
          </Badge>

          <div className="mt-6 flex w-full gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => setFormModal({ open: true, profile: activeProfile })}
            >
              <Pencil size={14} aria-hidden="true" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => setDeleteTarget(activeProfile)}
            >
              <Trash2 size={14} aria-hidden="true" />
              Delete
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Local profiles on this device</h2>
              <Badge tone="neutral">{profiles.length}</Badge>
            </div>
            <ProfileSelector onCreateNew={() => setFormModal({ open: true, profile: null })} />
            <p className="mt-4 border-t border-border pt-4 text-xs leading-relaxed text-ink-faint">
              Your profile is stored only in this browser, on this device. It isn't sent to a
              server, and switching browsers or devices won't bring it with you.
            </p>
          </Card>
        </div>
      </div>

      <ProfileFormModal open={formModal.open} profile={formModal.profile} onClose={closeFormModal} />
      <DeleteProfileDialog
        profile={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={(id) => {
          deleteProfile(id);
          setDeleteTarget(null);
        }}
      />
    </PageContainer>
  );
}
