# Lessons

The structured Urdu phonetic typing curriculum.

## Curriculum shape

```text
Course
 └─ Level
     └─ Module
         └─ Lesson
             ├─ ordered steps (learn → observe → practice → review)
             ├─ curriculum metadata
             └─ reusable typing targets
```

The curriculum is generated from `data/curriculum.ts` and uses the existing
keyboard mapping, grapheme-aware typing engine, progress service, sound
settings, virtual keyboard, and finger guide. There are 95 sequential lessons:

- 42 character/key lessons, including Alif through Yay and mapped variants
- 14 combination/review lessons
- 21 word lessons using a 141-word Urdu practice bank
- 6 sentence lessons
- 3 paragraph lessons
- 2 professional-writing lessons
- 7 final mastery lessons

Every lesson is data-driven; React components do not contain individual lesson
content or keyboard mappings.

## Important integration points

- `services/lessonCatalog.ts` is the single catalog API used by pages.
- `components/LessonPractice.tsx` provides the step-by-step experience and
  delegates typing to the existing Typing Engine.
- `features/keyboard/data/phoneticMap.ts` remains the source of truth for
  physical-key → Urdu mapping.
- `features/keyboard/data/fingerGuide.ts` remains the source of truth for
  physical-key → finger assignment.
- `features/progress` remains the source of truth for persistence and lesson
  completion.
