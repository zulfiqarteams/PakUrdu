import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Save } from "lucide-react";import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { getLessonById } from "@/features/lessons";
import { getBiography } from "@/features/biography";
import { sahiUrduWords } from "@/features/sahiUrdu/data/words";
import { loadBookmarkIds, loadSavedLaterIds, toggleBookmark, toggleSavedLater } from "@/features/library/services/savedContent";
import { loadBiographyProgress, toggleBookmark as toggleBiographyBookmark } from "@/features/biography/services/progress";
import { loadReadLaterIds, toggleReadLater } from "@/features/biography/services/readLater";
import { useSEO } from "@/hooks/useSEO";
import { useLanguage } from "@/i18n/useLanguage";

interface SavedItem {
  id: string;
  title: string;
  href: string;
  remove: () => void;
}

/**
 * Bookmark/Save-for-Later already write real ids to localStorage — but
 * until now there was no single page that read every one of those ids
 * back and showed what they point to, so the feature had no visible
 * effect after the button animation. Lessons, biographies, and biography
 * "read later" each use their own storage key; this page reads all three
 * and shows the combined result.
 */
export default function Saved() {
  const { text } = useLanguage();
  useSEO({ title: "Saved Lessons", description: "Your bookmarked and saved-for-later lessons.", noIndex: true });

  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [savedLaterIds, setSavedLaterIds] = useState<string[]>([]);
  const [bioBookmarkIds, setBioBookmarkIds] = useState<string[]>([]);
  const [bioReadLaterIds, setBioReadLaterIds] = useState<string[]>([]);
  const SAHI_URDU_BOOKMARK_PREFIX = "sahi-urdu:word:";

  useEffect(() => {
    setBookmarkIds(loadBookmarkIds());
    setSavedLaterIds(loadSavedLaterIds());
    setBioBookmarkIds(loadBiographyProgress().bookmarks);
    setBioReadLaterIds(loadReadLaterIds());
  }, []);

  function removeBookmark(id: string) {
    toggleBookmark(id);
    setBookmarkIds(loadBookmarkIds());
  }

  function removeSavedLater(id: string) {
    toggleSavedLater(id);
    setSavedLaterIds(loadSavedLaterIds());
  }

  function removeBioBookmark(id: string) {
    toggleBiographyBookmark(id);
    setBioBookmarkIds(loadBiographyProgress().bookmarks);
  }

  function removeBioReadLater(id: string) {
    toggleReadLater(id);
    setBioReadLaterIds(loadReadLaterIds());
  }

  const sahiUrduBookmarkIds = bookmarkIds.filter((id) => id.startsWith(SAHI_URDU_BOOKMARK_PREFIX));
  const regularBookmarkIds = bookmarkIds.filter((id) => !id.startsWith(SAHI_URDU_BOOKMARK_PREFIX));
  const bookmarkedSahiUrduWords: SavedItem[] = sahiUrduBookmarkIds
    .map((id) => sahiUrduWords.find((word) => word.id === id.slice(SAHI_URDU_BOOKMARK_PREFIX.length)))
    .filter((word): word is NonNullable<typeof word> => Boolean(word))
    .map((word) => ({ id: word.id, title: word.correctWord, href: `/sahi-urdu/word/${word.id}`, remove: () => removeBookmark(`${SAHI_URDU_BOOKMARK_PREFIX}${word.id}`) }));

  const bookmarkedLessons: SavedItem[] = regularBookmarkIds
    .map((id) => getLessonById(id))
    .filter((l): l is NonNullable<typeof l> => Boolean(l))
    .map((lesson) => ({ id: lesson.id, title: text(lesson.title), href: `/lesson/${lesson.id}`, remove: () => removeBookmark(lesson.id) }));

  const bookmarkedBiographies: SavedItem[] = bioBookmarkIds
    .map((id) => getBiography(id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
    .map((bio) => ({ id: bio.id, title: bio.respectfulName, href: `/biography/${bio.id}`, remove: () => removeBioBookmark(bio.id) }));

  const allBookmarks = [...bookmarkedLessons, ...bookmarkedBiographies, ...bookmarkedSahiUrduWords];

  const sahiUrduSavedLaterIds = savedLaterIds.filter((id) => id.startsWith(SAHI_URDU_BOOKMARK_PREFIX));
  const regularSavedLaterIds = savedLaterIds.filter((id) => !id.startsWith(SAHI_URDU_BOOKMARK_PREFIX));
  const savedLaterSahiUrduWords: SavedItem[] = sahiUrduSavedLaterIds
    .map((id) => sahiUrduWords.find((word) => word.id === id.slice(SAHI_URDU_BOOKMARK_PREFIX.length)))
    .filter((word): word is NonNullable<typeof word> => Boolean(word))
    .map((word) => ({ id: word.id, title: word.correctWord, href: `/sahi-urdu/word/${word.id}`, remove: () => removeSavedLater(`${SAHI_URDU_BOOKMARK_PREFIX}${word.id}`) }));

  const savedLaterLessons: SavedItem[] = regularSavedLaterIds
    .map((id) => getLessonById(id))
    .filter((l): l is NonNullable<typeof l> => Boolean(l))
    .map((lesson) => ({ id: lesson.id, title: text(lesson.title), href: `/lesson/${lesson.id}`, remove: () => removeSavedLater(lesson.id) }));

  const savedLaterBiographies: SavedItem[] = bioReadLaterIds
    .map((id) => getBiography(id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
    .map((bio) => ({ id: bio.id, title: bio.respectfulName, href: `/biography/${bio.id}`, remove: () => removeBioReadLater(bio.id) }));

  const allSavedLater = [...savedLaterLessons, ...savedLaterBiographies, ...savedLaterSahiUrduWords];

  return (
    <PageContainer>
      <div className="py-8 sm:py-10">
        <PageHeader title={text("Saved Lessons")} description={text("Lessons you've bookmarked or saved for later, stored only in this browser.")} />

        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <BookmarkCheck size={18} className="text-brand-600" aria-hidden="true" />
            {text("Bookmarked")}
          </h2>
          {allBookmarks.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allBookmarks.map((item) => (
                <Card key={item.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{item.title}</p>
                    <Button to={item.href} variant="ghost" size="sm" className="mt-2 px-0">
                      {text("Open")}
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={item.remove}
                    aria-label={text("Remove bookmark")}
                    className="shrink-0 rounded-full border border-border p-2 text-ink-soft hover:border-error-300 hover:text-error-600"
                  >
                    <Bookmark size={14} fill="currentColor" />
                  </button>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState icon={Bookmark} title={text("No bookmarks yet")} description={text("Bookmark a lesson or Correct Urdu word from its page to see it here.")} />
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Save size={18} className="text-brand-600" aria-hidden="true" />
            {text("Saved for Later")}
          </h2>
          {allSavedLater.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allSavedLater.map((item) => (
                <Card key={item.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{item.title}</p>
                    <Button to={item.href} variant="ghost" size="sm" className="mt-2 px-0">
                      {text("Open")}
                    </Button>
                  </div>
                  <button
                    type="button"
                    onClick={item.remove}
                    aria-label={text("Remove from saved")}
                    className="shrink-0 rounded-full border border-border p-2 text-ink-soft hover:border-error-300 hover:text-error-600"
                  >
                    <Save size={14} fill="currentColor" />
                  </button>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState icon={Save} title={text("Nothing saved for later")} description={text("Use Save for Later on a lesson or Correct Urdu word to see it here.")} />
          )}
        </section>
      </div>
    </PageContainer>
  );
}
