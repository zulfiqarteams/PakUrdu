import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/i18n/useLanguage";
import { getLevels, getLessonById } from "@/features/lessons";
import { tutorialTracks, getTrackForLevel } from "@/features/lessons/data/tracks";
import { readingSections } from "@/features/reading/data/content";
import { biographyCategories, biographies } from "@/features/biography";
import { useReadingProgress } from "@/features/reading/hooks/useReadingProgress";

interface ContentSidebarProps {
  activeLessonId?: string;
  activeReadingId?: string;
}

function biographiesForSidebar(category: string) {
  return biographies.filter((item) => item.category === category).slice(0, 8);
}

function SectionToggle({
  expanded,
  onClick,
  children,
}: {
  expanded: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-start text-sm font-semibold text-ink transition-colors hover:bg-surface"
    >
      <span>{children}</span>
      {expanded ? (
        <ChevronDown size={16} aria-hidden="true" />
      ) : (
        <ChevronRight className="directional-icon" size={16} aria-hidden="true" />
      )}
    </button>
  );
}

function SidebarContent({ activeLessonId, activeReadingId, onNavigate }: ContentSidebarProps & { onNavigate?: () => void }) {
  const location = useLocation();
  const { visited } = useReadingProgress();
  const { language, text } = useLanguage();
  const activeLesson = activeLessonId ? getLessonById(activeLessonId) : undefined;
  const activeTrack = activeLesson
    ? getTrackForLevel(getLevels().find((level) => level.id === activeLesson.levelId)?.order ?? -1)
    : undefined;

  const selectedTrack = new URLSearchParams(location.search).get("track");
  const [tutorialOpen, setTutorialOpen] = useState(
    activeTrack !== undefined || selectedTrack !== null || location.pathname === "/learn",
  );
  const [readingOpen, setReadingOpen] = useState(
    activeReadingId !== undefined || location.pathname === "/learn/phonetic-keyboard",
  );
  const [sahiUrduOpen, setSahiUrduOpen] = useState(location.pathname.startsWith("/sahi-urdu"));
  const [biographyOpen, setBiographyOpen] = useState(location.pathname.startsWith("/biography"));
  const [openBiographyCategory, setOpenBiographyCategory] = useState<string | null>(null);

  useEffect(() => {
    if (activeTrack || selectedTrack !== null || location.pathname === "/learn") {
      setTutorialOpen(true);
    }
  }, [activeTrack, location.pathname, selectedTrack]);

  useEffect(() => {
    if (activeReadingId || location.pathname === "/learn/phonetic-keyboard") {
      setReadingOpen(true);
    }
  }, [activeReadingId, location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith("/sahi-urdu")) setSahiUrduOpen(true);
    if (location.pathname.startsWith("/biography")) setBiographyOpen(true);
  }, [location.pathname]);


  return (
    <aside
      aria-label="Learning content navigation"
      className="w-full shrink-0 lg:sticky lg:top-24 lg:w-60 lg:self-start"
    >
      <div className="max-h-[calc(100vh-7rem)] overflow-y-auto rounded-md border border-border bg-paper p-2 shadow-card overscroll-contain">
        <div>
          <SectionToggle expanded={tutorialOpen} onClick={() => setTutorialOpen((open) => !open)}>
            {text("Typing Tutorial")}
          </SectionToggle>
          <div
            className={cn(
              "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out",
              tutorialOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="min-h-0 overflow-hidden pb-1 pl-2">
              {tutorialTracks.map((track) => {
                const isActive =
                  activeTrack === track.id ||
                  (location.pathname === "/learn" &&
                    new URLSearchParams(location.search).get("track") === track.id);

                return (
                  <NavLink
                    key={track.id}
                    to={`/learn?track=${track.id}`}
                    onClick={onNavigate}
                    className={cn(
                      "block rounded-sm px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-brand-50 font-semibold text-brand-700"
                        : "text-ink-soft hover:bg-surface hover:text-ink",
                    )}
                  >
                    <span>{text(track.label)}</span>
                    {activeTrack === track.id && activeLesson && (
                      <span className="mt-0.5 block truncate text-[11px] font-normal text-brand-600">
                        {text("Current: ")}{text(activeLesson.title)}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-1 border-t border-border pt-1">
          <SectionToggle expanded={readingOpen} onClick={() => setReadingOpen((open) => !open)}>
            {text("Learn About Phonetic Keyboard")}
          </SectionToggle>
          <div
            className={cn(
              "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out",
              readingOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <nav className="min-h-0 overflow-hidden pb-1 pl-2" aria-label={text("Phonetic keyboard learning topics")}>
              {readingSections.map((section, index) => {
                const isActive = activeReadingId === section.id;
                const isVisited = visited.has(section.id);
                return (
                  <Link
                    key={section.id}
                    to={`/learn/phonetic-keyboard#${section.id}`}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-sm px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-brand-50 font-semibold text-brand-700"
                        : "text-ink-soft hover:bg-surface hover:text-ink",
                    )}
                  >
                    <span className="truncate">
                      {index + 1}. {section.title[language]}
                    </span>
                    {isVisited && (
                      <CheckCircle2
                        size={14}
                        className={cn("shrink-0", isActive ? "text-brand-600" : "text-success-600")}
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="mt-1 border-t border-border pt-1">
          <SectionToggle expanded={biographyOpen} onClick={() => setBiographyOpen((open) => !open)}>
            {text("Biographies & Islamic History")}
          </SectionToggle>
          <div className={cn(
            "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out",
            biographyOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}>
            <nav className="min-h-0 overflow-hidden pb-1 pl-2" aria-label={text("Biography and Islamic History topics")}>
              <Link to="/biography" onClick={onNavigate} className={cn("block rounded-sm px-3 py-2 text-sm", location.pathname === "/biography" ? "bg-brand-50 font-semibold text-brand-700" : "text-ink-soft hover:bg-surface hover:text-ink")}>
                {text("Overview")}
              </Link>
              <Link to="/biography/muhammad" onClick={onNavigate} className={cn("block rounded-sm px-3 py-2 text-sm font-semibold", location.pathname === "/biography/muhammad" ? "bg-brand-50 text-brand-700" : "text-ink-soft hover:bg-surface hover:text-ink")}>
                {text("حضرت محمد ﷺ — The Greatest Man in History")}
              </Link>
              {biographyCategories.map((category) => {
                const open = openBiographyCategory === category.id;
                const entries = biographiesForSidebar(category.id);
                return (
                  <div key={category.id} className="mt-0.5">
                    <button type="button" aria-expanded={open} onClick={() => setOpenBiographyCategory(open ? null : category.id)} className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-start text-sm text-ink-soft hover:bg-surface hover:text-ink">
                      <span>{category.label}</span>{open ? <ChevronDown size={14}/> : <ChevronRight className="directional-icon" size={14}/>}
                    </button>
                    {open && <div className="border-l border-border ml-3 pl-2">{entries.map((entry) => <Link key={entry.id} to={`/biography/${entry.id}`} onClick={onNavigate} className="block rounded-sm px-3 py-1.5 text-xs text-ink-soft hover:bg-surface hover:text-ink">{entry.respectfulName}</Link>)}<Link to={`/biography/library?category=${category.id}`} onClick={onNavigate} className="block rounded-sm px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50">{text("تمام شخصیات")} {text(category.label)}</Link></div>}
                  </div>
                );
              })}
              <Link to="/biography/library" onClick={onNavigate} className="mt-1 block rounded-sm px-3 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50">{text("All biographies / search")}</Link>
            </nav>
          </div>
        </div>

        <div className="mt-1 border-t border-border pt-1">
          <SectionToggle expanded={sahiUrduOpen} onClick={() => setSahiUrduOpen((open) => !open)}>
            {text("صحیح اردو")}
          </SectionToggle>
          <div
            className={cn(
              "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out",
              sahiUrduOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <nav className="min-h-0 overflow-hidden pb-1 pl-2" aria-label={text("Correct Urdu learning topics")}>
              {[
                ["/sahi-urdu", "صحیح الفاظ"],
                ["/sahi-urdu/words?category=غلط العام", "غلط العام"],
                ["/sahi-urdu/words?category=تلفظ", "تلفظ"],
                ["/sahi-urdu/words?category=املا", "املا"],
                ["/sahi-urdu/diacritics", "اعراب"],
                ["/sahi-urdu/practice", "الفاظ کی مشق"],
                ["/sahi-urdu/quiz", "کوئز"],
                ["/sahi-urdu/progress", "میری پیش رفت"],
              ].map(([path, label]) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={onNavigate}
                  className={({ isActive }) => cn(
                    "block rounded-sm px-3 py-2 text-sm transition-colors",
                    isActive ? "bg-brand-50 font-semibold text-brand-700" : "text-ink-soft hover:bg-surface hover:text-ink",
                  )}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function ContentSidebar({ activeLessonId, activeReadingId }: ContentSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { text } = useLanguage();

  return (
    <>
      <div className="mb-4 lg:hidden">
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="learning-content-navigation"
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-paper px-3 py-2 text-sm font-semibold text-ink shadow-card transition-colors hover:bg-surface"
        >
          {mobileOpen ? <X size={17} aria-hidden="true" /> : <Menu size={17} aria-hidden="true" />}
          {text("Course navigation")}
        </button>
      </div>

      <div id="learning-content-navigation" className={cn(!mobileOpen && "hidden lg:block")}>
        <SidebarContent
          activeLessonId={activeLessonId}
          activeReadingId={activeReadingId}
          onNavigate={() => setMobileOpen(false)}
        />
      </div>
    </>
  );
}
