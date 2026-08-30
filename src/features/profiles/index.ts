/**
 * Public surface of the profiles feature. Other modules (pages, the
 * navbar, and future feature areas like progress/lessons) should
 * import from here rather than reaching into services/ or utils/
 * directly, so this feature can be re-implemented later without
 * every consumer needing to change.
 */
export { ProfileProvider, useProfiles } from "@/features/profiles/context/ProfileContext";
export { ProfileAvatar } from "@/features/profiles/components/ProfileAvatar";
export { ProfileSelector } from "@/features/profiles/components/ProfileSelector";
export { ProfileMenu } from "@/features/profiles/components/ProfileMenu";
export { ProfileFormModal } from "@/features/profiles/components/ProfileFormModal";
export { DeleteProfileDialog } from "@/features/profiles/components/DeleteProfileDialog";
export { AVATAR_OPTIONS, DEFAULT_AVATAR_ID } from "@/features/profiles/utils/avatars";
export { PROFILE_NAME_MAX_LENGTH } from "@/features/profiles/services/profileStorage";
export type { Profile, CreateProfileInput, UpdateProfileInput } from "@/features/profiles/types";
