/**
 * Groups the curriculum's ordered `levels` into three learner-facing
 * tracks. This is presentation-only grouping over existing level
 * data — it does not introduce a second source of truth for lessons.
 */
export const tutorialTracks = [
  { id: "basic", label: "Basic", min: 0, max: 2 },
  { id: "intermediate", label: "Intermediate", min: 3, max: 5 },
  { id: "expert", label: "Expert", min: 6, max: Number.POSITIVE_INFINITY },
] as const;

export type TutorialTrackId = (typeof tutorialTracks)[number]["id"];

export function getTrackForLevel(order: number): TutorialTrackId | undefined {
  return tutorialTracks.find((track) => order >= track.min && order <= track.max)?.id;
}

export function getTrackById(id: string) {
  return tutorialTracks.find((track) => track.id === id);
}
