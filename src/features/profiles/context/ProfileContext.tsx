import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { CreateProfileInput, Profile, UpdateProfileInput } from "@/features/profiles/types";
import * as profileStorage from "@/features/profiles/services/profileStorage";
import { deleteProfileProgress } from "@/features/progress/services/progressStorage";

interface ProfileContextValue {
  /** Every local profile on this browser. */
  profiles: Profile[];
  /** The currently selected profile, or null if none exists/is selected. */
  activeProfile: Profile | null;
  createProfile: (input: CreateProfileInput) => Profile;
  updateProfile: (id: string, updates: UpdateProfileInput) => void;
  deleteProfile: (id: string) => void;
  selectProfile: (id: string) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

/**
 * Owns all profile state for the app and is the only piece of React
 * code that talks to `profileStorage` directly. Everything else —
 * pages, the navbar, future feature modules — reads/writes profiles
 * through `useProfiles()` and never touches localStorage itself.
 */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>(() => profileStorage.getProfiles());
  const [activeProfile, setActiveProfile] = useState<Profile | null>(() =>
    profileStorage.getActiveProfile(),
  );

  const createProfile = useCallback((input: CreateProfileInput) => {
    const profile = profileStorage.createProfile(input);
    setProfiles(profileStorage.getProfiles());
    // A freshly created profile becomes active immediately — a
    // first-time user shouldn't have to pick it right back again.
    profileStorage.setActiveProfileId(profile.id);
    setActiveProfile(profile);
    return profile;
  }, []);

  const updateProfile = useCallback((id: string, updates: UpdateProfileInput) => {
    const updated = profileStorage.updateProfile(id, updates);
    if (!updated) return;
    setProfiles(profileStorage.getProfiles());
    setActiveProfile((current) => (current?.id === id ? updated : current));
  }, []);

  const deleteProfile = useCallback((id: string) => {
    profileStorage.deleteProfile(id);
    // A deleted profile's learning progress (Part 9) must not be left
    // behind as orphaned data — this is the one place profiles code
    // reaches into the progress feature, and only for cleanup.
    deleteProfileProgress(id);
    setProfiles(profileStorage.getProfiles());
    // Re-resolve rather than assume: deleting the active profile
    // clears it, deleting any other profile leaves it untouched.
    setActiveProfile(profileStorage.getActiveProfile());
  }, []);

  const selectProfile = useCallback((id: string) => {
    const profile = profileStorage.getProfile(id);
    if (!profile) return;
    profileStorage.setActiveProfileId(id);
    setActiveProfile(profile);
  }, []);

  const value = useMemo<ProfileContextValue>(
    () => ({ profiles, activeProfile, createProfile, updateProfile, deleteProfile, selectProfile }),
    [profiles, activeProfile, createProfile, updateProfile, deleteProfile, selectProfile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfiles(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfiles must be used within a ProfileProvider");
  }
  return context;
}
