/**
 * Generates a profile id. Never derived from the profile name (names
 * can collide and can change), and never sent anywhere — it only
 * needs to be unique within this browser's localStorage.
 */
export function generateProfileId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID.
  return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
