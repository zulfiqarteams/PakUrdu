import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Save } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { ContentSidebar } from "@/components/ContentSidebar";
import { Card } from "@/components/Card";
import { LessonNavigation } from "@/features/lessons/components/LessonNavigation";
import { LessonPractice } from "@/features/lessons/components/LessonPractice";
import { LessonObjectives } from "@/features/lessons/components/LessonObjectives";
import { useLesson } from "@/features/lessons";
import { useSEO } from "@/hooks/useSEO";
import { isBookmarked, isSavedLater, toggleBookmark, toggleSavedLater } from "@/features/library/services/savedContent";
import { Button } from "@/components/Button";
import { useLanguage } from "@/i18n/useLanguage";

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const result = useLesson(id);
  const { text } = useLanguage();
  const title = result.status === "ok" ? text(result.context.lesson.title) : text("Lesson not found");
  const description =
    result.status === "ok"
      ? `${text(result.context.lesson.description)} ${text(`Free Urdu typing lesson ${result.context.position} of ${result.context.total} on PAKURDU.`)}`
      : undefined;
  useSEO({ title, description, noIndex: result.status !== "ok" });
  const lessonId = result.status === "ok" ? result.context.lesson.id : null;
  const [bookmarked, setBookmarked] = useState(false);
  const [savedLater, setSavedLater] = useState(false);

  useEffect(() => {
    if (!lessonId) {
      setBookmarked(false);
      setSavedLater(false);
      return;
    }
    setBookmarked(isBookmarked(lessonId));
    setSavedLater(isSavedLater(lessonId));
  }, [lessonId]);

  if (result.status !== "ok") {
    return (
      <PageContainer>
        <PageHeader title={text("Lesson")} breadcrumb={[{ label: text("Learn"), to: "/learn" }, { label: id ?? text("Lesson") }]} />
        <div className="py-10 text-sm text-ink-soft">{text("We could not find this lesson.")}</div>
      </PageContainer>
    );
  }

  const { lesson, level, previous, next, position, total } = result.context;
  const isCharacterLesson = lesson.type === "character";

  function handleBookmark() {
    setBookmarked(toggleBookmark(lesson.id));
  }

  function handleSaveLater() {
    setSavedLater(toggleSavedLater(lesson.id));
  }

  return (
    <PageContainer>
      <div className="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
          <ContentSidebar activeLessonId={lesson.id} />

          <main className="min-w-0">
            <div className="border-b border-border pb-7">
              <nav aria-label={text("Breadcrumb")} className="mb-3">
                <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-faint">
                  <li><Link to="/learn" className="hover:text-ink hover:underline">{text("Learn")}</Link></li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-ink-soft">{text(level.title)}</li>
                </ol>
              </nav>
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <div className="text-sm text-ink-faint">{text(`Lesson ${position} of ${total}`)}</div>
                  <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{isCharacterLesson ? text(`Learn ${lesson.title.split(" — ")[0]}`) : text(lesson.title)}</h1>
                  {!isCharacterLesson && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{text(lesson.description)}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleBookmark} aria-pressed={bookmarked}>
                    {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    {text(bookmarked ? "Bookmarked" : "Bookmark")}
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={handleSaveLater} aria-pressed={savedLater}>
                    {savedLater ? <BookmarkCheck size={16} /> : <Save size={16} />}
                    {text(savedLater ? "Saved" : "Save for Later")}
                  </Button>
                </div>

              </div>
            </div>

            <div className="space-y-6 py-7">
              {!isCharacterLesson && (
                <Card>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">{text("What you will learn")}</h2>
                      <p className="mt-1 text-xs text-ink-faint">{text("This lesson is designed to build a usable typing habit, not just recognition.")}</p>
                    </div>
                    <span className="numeric text-xs font-semibold text-ink-faint">{text(`${lesson.requiredAccuracy ?? 80}% target accuracy`)}</span>
                  </div>
                  <LessonObjectives objectives={lesson.objectives} />
                </Card>
              )}

              <LessonPractice lesson={lesson} nextLessonId={next?.id} />

              <LessonNavigation previous={previous} next={next} />
            </div>
          </main>
        </div>
      </div>
    </PageContainer>
  );
}
