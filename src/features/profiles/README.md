# profiles

Browser-local, multi-profile system. No backend, no accounts — every
profile lives only in this browser's `localStorage`.

## Architecture

```
UI (pages, Navbar)
  ↓
ProfileContext  (context/ProfileContext.tsx — useProfiles())
  ↓
profileStorage  (services/profileStorage.ts)
  ↓
localStorage
```

Nothing outside `services/profileStorage.ts` touches `localStorage`
directly. Nothing outside this folder needs to know it's
`localStorage` at all — components consume profiles through
`useProfiles()`.

## Storage keys

- `urduTypingTutorial:profiles` — `{ version: 1, profiles: Profile[] }`
- `urduTypingTutorial:activeProfile` — the active profile's id (plain string)

## What's implemented (Part 4)

- Multiple local profiles (create, rename, change avatar, delete)
- Active profile persisted across reloads
- Graceful handling of missing/corrupted/deleted-profile data
- Onboarding for first-time users, profile switcher, delete confirmation

## Out of scope here

Progress, lesson state, and typing/learning preferences are future
modules. They'll reference a profile by `id` but don't live on the
`Profile` type or in this folder.
