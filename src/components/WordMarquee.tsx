import { cn } from "@/lib/cn";
import { HOME_MARQUEE_WORDS, PRACTICE_MARQUEE_WORDS, uniqueWords } from "@/data/marqueeWords";

export type WordMarqueeContext = "home" | "practice" | "lesson";
export type WordMarqueeSpeed = "slow" | "normal" | "fast";

interface WordMarqueeProps {
  /** Optional contextual words. When omitted, the context dataset is used. */
  words?: string[];
  label?: string;
  className?: string;
  context?: WordMarqueeContext;
  speed?: WordMarqueeSpeed;
  /** Optional key/character drill source for lesson-specific streams. */
  lessonCharacters?: string[];
}

const speedClass: Record<WordMarqueeSpeed, string> = {
  slow: "word-marquee--slow",
  normal: "word-marquee--normal",
  fast: "word-marquee--fast",
};

function contextualWords(context: WordMarqueeContext, words?: string[], lessonCharacters?: string[]) {
  if (words && words.length > 0) return uniqueWords(words, 24);
  if (context === "practice") return [...PRACTICE_MARQUEE_WORDS];
  if (context === "lesson" && lessonCharacters && lessonCharacters.length > 0) {
    return uniqueWords(lessonCharacters, 24);
  }
  return [...HOME_MARQUEE_WORDS];
}

export function WordMarquee({
  words,
  label,
  className,
  context = "home",
  speed = "normal",
  lessonCharacters,
}: WordMarqueeProps) {
  const safeWords = contextualWords(context, words, lessonCharacters);
  if (safeWords.length === 0) return null;

  return (
    <section
      className={cn("word-marquee", speedClass[speed], className)}
      aria-label={label}
      dir="rtl"
    >
      {label && <p className="sr-only">{label}</p>}
      <div className="word-marquee__viewport" aria-hidden="true">
        <div className="word-marquee__track">
          {[0, 1].map((copyIndex) => (
            <div className="word-marquee__group" key={`marquee-copy-${copyIndex}`}>
              {safeWords.map((word, index) => (
                <span
                  key={`${copyIndex}-${word}-${index}`}
                  className="word-marquee__word"
                  lang="ur"
                >
                  <span className="word-marquee__word-glow" aria-hidden="true" />
                  <span className="word-marquee__word-text">{word}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
