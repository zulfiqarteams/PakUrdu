import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Plus, Settings, UserCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { useProfiles } from "@/features/profiles/context/ProfileContext";
import { ProfileAvatar } from "@/features/profiles/components/ProfileAvatar";
import { ProfileSelector } from "@/features/profiles/components/ProfileSelector";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/i18n/useLanguage";

interface ProfileMenuProps {
  onCreateNew: () => void;
}

/**
 * Compact navbar control: avatar + name that opens a small menu with
 * Profile, Settings, and (when there's more than one local profile)
 * a switcher — the three things item 15 of the spec asks for, kept
 * to one compact control rather than a full dashboard. Renders a
 * "Create Profile" button instead when no profile is active yet.
 */
export function ProfileMenu({ onCreateNew }: ProfileMenuProps) {
  const { activeProfile, profiles } = useProfiles();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!activeProfile) {
    return (
      <Button size="md" variant="secondary" onClick={onCreateNew}>
        <Plus size={15} aria-hidden="true" />
        {t.nav.createProfile}
      </Button>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Profile menu — ${activeProfile.name}`}
        className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm font-medium text-ink hover:bg-surface"
      >
        <ProfileAvatar
          name={activeProfile.name}
          avatarId={activeProfile.avatarId}
          seed={activeProfile.id}
          size="sm"
        />
        <span className="max-w-[9rem] truncate">{activeProfile.name}</span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={cn("text-ink-faint transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Profile"
          className="absolute right-0 top-full z-30 mt-2 w-64 rounded-lg border border-border bg-surface-elevated p-2 shadow-raised"
        >
          <Link
            role="menuitem"
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium text-ink hover:bg-surface"
          >
            <UserCircle size={16} aria-hidden="true" />
            {t.nav.profile}
          </Link>
          <Link
            role="menuitem"
            to="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium text-ink hover:bg-surface"
          >
            <Settings size={16} aria-hidden="true" />
            {t.nav.settings}
          </Link>

          {profiles.length > 1 && (
            <>
              <div className="my-2 border-t border-border" />
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-widest text-ink-faint">
                {t.nav.switchProfile}
              </p>
              <ProfileSelector onSelect={() => setOpen(false)} />
            </>
          )}

          <div className="my-2 border-t border-border" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onCreateNew();
            }}
            className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-start text-sm font-medium text-brand-600 hover:bg-brand-50"
          >
            <Plus size={15} aria-hidden="true" />
            {t.nav.createNewProfile}
          </button>
        </div>
      )}
    </div>
  );
}
