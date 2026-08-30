/**
 * Local, browser-only user profile.
 *
 * Nothing here is ever sent to a server — profiles are persisted
 * entirely through `profileStorage` into this browser's
 * localStorage. See PROFILES_KEY / ACTIVE_PROFILE_KEY in
 * `services/profileStorage.ts`.
 *
 * Deliberately flat and minimal for Part 4: only what onboarding,
 * the profile page, and profile switching actually need right now.
 * Progress, lesson state, and typing preferences are future modules
 * that will reference a profile by `id` — they do not live on this
 * type, and no fake values for them are invented here.
 */
export interface Profile {
  id: string;
  name: string;
  /** References an entry in AVATAR_OPTIONS (see utils/avatars.ts). */
  avatarId: string;
  /** ISO 8601 timestamp, set once at creation. */
  createdAt: string;
  /** ISO 8601 timestamp, updated on every rename/avatar change. */
  updatedAt: string;
}

export interface CreateProfileInput {
  name: string;
  avatarId?: string;
}

export interface UpdateProfileInput {
  name?: string;
  avatarId?: string;
}

/**
 * On-disk shape written to localStorage. Versioned so a future part
 * can migrate the data model (e.g. to add settings/progress) without
 * losing profiles that already exist in someone's browser.
 */
export interface ProfileStoreV1 {
  version: 1;
  profiles: Profile[];
}
