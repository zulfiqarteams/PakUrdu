import type { GameDefinition } from "../core/gameTypes";
export const gameDefinitions: GameDefinition[] = [
  { id: "letter-hunter", titleKey: "letterHunter", descriptionKey: "letterHunterDescription", category: "beginner", durationOptions: [30, 60], defaultDuration: 60 },
  { id: "word-rush", titleKey: "wordRush", descriptionKey: "wordRushDescription", category: "speed", durationOptions: [30, 60, 120], defaultDuration: 60 },
  { id: "combo-master", titleKey: "comboMaster", descriptionKey: "comboMasterDescription", category: "keyboard", durationOptions: [60, 120], defaultDuration: 60 },
  { id: "typing-sprint", titleKey: "typingSprint", descriptionKey: "typingSprintDescription", category: "speed", durationOptions: [15, 30, 60], defaultDuration: 30 },
  { id: "urdu-survival", titleKey: "urduSurvival", descriptionKey: "urduSurvivalDescription", category: "advanced", durationOptions: [60, 120], defaultDuration: 60 },
];
