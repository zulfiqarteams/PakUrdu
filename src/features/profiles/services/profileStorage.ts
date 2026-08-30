import type {
  CreateProfileInput,
  Profile,
  ProfileStoreV1,
  UpdateProfileInput,
} from "@/features/profiles/types";
import { generateProfileId } from "@/features/profiles/utils/id";
import { DEFAULT_AVATAR_ID } from "@/features/profiles/utils/avatars";

/**
 * Single namespaced storage strategy — every key this feature owns
 * lives under this prefix so nothing is scattered across the app.
 */
const PROFILES_KEY = "urduTypingTutorial:profiles";
const ACTIVE_PROFILE_KEY = "urduTypingTutorial:activeProfile";

const CURRENT_VERSION = 1;
export const PROFILE_NAME_MAX_LENGTH = 40;

function emptyStore(): ProfileStoreV1 {
  return { version: CURRENT_VERSION, profiles: [] };
}

function isValidProfile(value: unknown): value is Profile {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    candidate.id.length > 0 &&
    typeof candidate.name === "string" &&
    candidate.name.length > 0 &&
    typeof candidate.avatarId === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
  );
}

/**
 * Reads and validates the profile store from localStorage. Never
 * throws — missing, corrupted, or unrecognized-version data is
 * treated as "no profiles yet" rather than crashing the app. Any
 * profile entries that don't match the expected shape are dropped
 * silently rather than failing the whole read.
 */
function readStore(): ProfileStoreV1 {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(PROFILES_KEY);
  } catch {
    // localStorage can throw in private-browsing / storage-blocked contexts.
    return emptyStore();
  }
  if (!raw) return emptyStore();

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return emptyStore();

    const candidate = parsed as Partial<ProfileStoreV1>;
    // No migrations exist yet (version 1 is the only version so far);
    // an unrecognized version falls back to empty rather than risking
    // a shape the rest of the app doesn't understand.
    if (candidate.version !== CURRENT_VERSION) return emptyStore();
    if (!Array.isArray(candidate.profiles)) return emptyStore();

    return { version: CURRENT_VERSION, profiles: candidate.profiles.filter(isValidProfile) };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: ProfileStoreV1): void {
  try {
    window.localStorage.setItem(PROFILES_KEY, JSON.stringify(store));
  } catch {
    // Storage full, disabled, or unavailable — fail silently rather
    // than crash. The calling context still reflects the change for
    // the rest of this session even if it won't persist on reload.
  }
}

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ").slice(0, PROFILE_NAME_MAX_LENGTH);
}

export function getProfiles(): Profile[] {
  return readStore().profiles;
}

export function getProfile(id: string): Profile | null {
  return readStore().profiles.find((profile) => profile.id === id) ?? null;
}

/**
 * Creates a new local profile. Duplicate display names are allowed
 * (profiles are identified by id, not name) — blocking on name
 * collisions would be surprising for two people who happen to share
 * a first name.
 */
export function createProfile(input: CreateProfileInput): Profile {
  const name = normalizeName(input.name);
  const now = new Date().toISOString();
  const profile: Profile = {
    id: generateProfileId(),
    name: name.length > 0 ? name : "Learner",
    avatarId: input.avatarId ?? DEFAULT_AVATAR_ID,
    createdAt: now,
    updatedAt: now,
  };

  const store = readStore();
  store.profiles.push(profile);
  writeStore(store);
  return profile;
}

export function updateProfile(id: string, updates: UpdateProfileInput): Profile | null {
  const store = readStore();
  const index = store.profiles.findIndex((profile) => profile.id === id);
  if (index === -1) return null;

  const existing = store.profiles[index];
  const nextName = updates.name !== undefined ? normalizeName(updates.name) : existing.name;
  const updated: Profile = {
    ...existing,
    name: nextName.length > 0 ? nextName : existing.name,
    avatarId: updates.avatarId ?? existing.avatarId,
    updatedAt: new Date().toISOString(),
  };

  store.profiles[index] = updated;
  writeStore(store);
  return updated;
}

/** Deletes a profile. If it was the active profile, also clears the
 *  active-profile pointer so the app doesn't reference a profile
 *  that no longer exists. */
export function deleteProfile(id: string): boolean {
  const store = readStore();
  const nextProfiles = store.profiles.filter((profile) => profile.id !== id);
  const didDelete = nextProfiles.length !== store.profiles.length;
  if (!didDelete) return false;

  writeStore({ ...store, profiles: nextProfiles });

  if (getActiveProfileId() === id) {
    setActiveProfileId(null);
  }
  return true;
}

export function getActiveProfileId(): string | null {
  try {
    return window.localStorage.getItem(ACTIVE_PROFILE_KEY);
  } catch {
    return null;
  }
}

export function setActiveProfileId(id: string | null): void {
  try {
    if (id === null) {
      window.localStorage.removeItem(ACTIVE_PROFILE_KEY);
    } else {
      window.localStorage.setItem(ACTIVE_PROFILE_KEY, id);
    }
  } catch {
    // Ignore — the active profile just won't persist across reloads
    // in this environment (e.g. storage disabled).
  }
}

/**
 * Resolves the active profile, gracefully clearing the stored active
 * id if it no longer points at a real profile (e.g. deleted in
 * another tab, or corrupted). Callers never need to handle a
 * dangling id themselves.
 */
export function getActiveProfile(): Profile | null {
  const activeId = getActiveProfileId();
  if (!activeId) return null;

  const profile = getProfile(activeId);
  if (!profile) {
    setActiveProfileId(null);
    return null;
  }
  return profile;
}
