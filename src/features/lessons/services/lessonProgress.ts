export interface UserLessonProgress {
  completedLessons: string[];
  currentLessonId: string;
  lessonScores: Record<string, { accuracy: number; mistakes: number; timestamp: number }>;
}

const STORAGE_KEY = 'urdu_typing_lesson_progress_v1';

export const getLessonProgress = (): UserLessonProgress => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load lesson progress', e);
  }
  return {
    completedLessons: [],
    currentLessonId: 'lesson-1',
    lessonScores: {}
  };
};

export const saveLessonProgress = (progress: UserLessonProgress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save lesson progress', e);
  }
};