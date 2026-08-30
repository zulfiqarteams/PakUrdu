# Biography & Islamic History

This feature is data-driven: biographies, chapters, timelines, relationships, quizzes, and source metadata live in `data/biographies.ts`. The reusable `Biography.tsx` engine renders dashboard, library, reading, listening, typing, quiz, timeline, related topics, and bookmark flows.

To add a new person or historical topic, add one `BiographyEntry` object rather than a new page/component. Typing uses the existing `useTypingEngine`, `TypingCaptureArea`, `VirtualKeyboard`, and `HandFingerGuide`.

Religious and historical content is intentionally conservative: disputed details are labelled or described cautiously, and each major entry carries source metadata.
