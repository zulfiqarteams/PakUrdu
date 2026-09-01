import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Plus, X } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { primaryNav, secondaryNav } from "@/data/navigation";
import { cn } from "@/lib/cn";
import { useProfiles } from "@/features/profiles/context/ProfileContext";
import { ProfileAvatar } from "@/features/profiles/components/ProfileAvatar";
import { ProfileMenu } from "@/features/profiles/components/ProfileMenu";
import { ProfileFormModal } from "@/features/profiles/components/ProfileFormModal";
import { LanguageSwitcher } from "@/features/settings/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/useLanguage";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const { activeProfile } = useProfiles();
  const { t } = useLanguage();
  const location = useLocation();

  const navLabel = (path: string) => {
    if (path === "/") return t.nav.home;
    if (path === "/learn") return t.nav.learn;
    if (path === "/games") return t.nav.games;
    if (path === "/practice") return t.nav.practice;
    if (path === "/test") return t.nav.tests;
    if (path === "/progress") return t.nav.progress;
    if (path === "/saved") return t.nav.saved;
    if (path === "/profile") return t.nav.profile;
    return t.nav.settings;
  };

  // Close the mobile menu automatically whenever the route changes.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Let keyboard users dismiss the mobile menu with Escape.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/90 backdrop-blur">
      <PageContainer className="flex h-16 items-center justify-between">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2 font-display text-lg font-bold text-ink"
        >
          <span className="flex h-8 w-7 shrink-0 items-center justify-center overflow-hidden sm:h-9 sm:w-8" aria-hidden="true">
            <BrandLogo decorative className="h-full w-full" />
          </span>
          {/* `truncate` + a capped width on the smallest screens is a
              hard guarantee against this wordmark ever being the
              thing that forces the header into horizontal scroll,
              rather than relying on flex-shrink text wrapping to
              happen to look right at every width. */}
          <span className="max-w-[8.5rem] truncate min-[400px]:max-w-none">PakUrdu Typing Tutorial</span>
        </Link>

        {/* Desktop navigation. Switches on at `lg` (1024px), not `md`
            (768px): with 5 labeled nav items plus the logo, profile
            control, and "Start Learning" button all needing to fit
            on one fixed-height (`h-16`) row, 768px is too tight —
            see the responsive review notes in this part's report.
            768px (explicitly one of the required test widths) now
            gets the roomy drawer nav instead, same as any other
            phone/small-tablet width. */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          {primaryNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-sm border-b-2 px-2.5 py-2 text-sm transition-colors",
                  isActive
                    ? "border-brand-500 bg-brand-50 font-semibold text-brand-700"
                    : "border-transparent font-medium text-ink-soft hover:bg-surface hover:text-ink",
                )
              }
            >
              {item.icon && (
                <item.icon size={15} aria-hidden="true" className="shrink-0" />
              )}
              {navLabel(item.path)}
            </NavLink>
          ))}
        </nav>

        {/* "Start Learning" lives on the Home hero as the single
            primary CTA (see PR notes) — the navbar already has a
            "Learn" link, so a second CTA here was a duplicate path
            to the same place. */}
        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <ProfileMenu onCreateNew={() => setIsCreateProfileOpen(true)} />
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center rounded-sm p-2 text-ink lg:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          {isMobileMenuOpen ? (
            <X size={22} aria-hidden="true" />
          ) : (
            <Menu size={22} aria-hidden="true" />
          )}
        </button>
      </PageContainer>

      {/* Mobile navigation panel */}
      {isMobileMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-paper lg:hidden"
        >
          <PageContainer className="flex flex-col gap-1 py-4">
            {primaryNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-sm px-3 py-2.5 text-base",
                    isActive
                      ? "bg-brand-50 font-semibold text-brand-700"
                      : "font-medium text-ink-soft hover:bg-surface hover:text-ink",
                  )
                }
              >
                {item.icon && <item.icon size={18} aria-hidden="true" />}
                {navLabel(item.path)}
              </NavLink>
            ))}

            <div className="flex items-center justify-between border-b border-border px-3 pb-3">
              <span className="text-sm font-medium text-ink-soft">{t.nav.language}</span>
              <LanguageSwitcher />
            </div>

            {activeProfile ? (
              <Link
                to="/profile"
                className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-base font-medium text-ink-soft hover:bg-surface hover:text-ink"
              >
                <ProfileAvatar
                  name={activeProfile.name}
                  avatarId={activeProfile.avatarId}
                  seed={activeProfile.id}
                  size="sm"
                />
                {activeProfile.name}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreateProfileOpen(true)}
                className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-base font-medium text-brand-600 hover:bg-brand-50"
              >
                <Plus size={18} aria-hidden="true" />
                {t.nav.createProfile}
              </button>
            )}

            {secondaryNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-sm px-3 py-2.5 text-base",
                    isActive
                      ? "bg-brand-50 font-semibold text-brand-700"
                      : "font-medium text-ink-soft hover:bg-surface hover:text-ink",
                  )
                }
              >
                {item.icon && <item.icon size={18} aria-hidden="true" />}
                {navLabel(item.path)}
              </NavLink>
            ))}
          </PageContainer>
        </nav>
      )}

      <ProfileFormModal open={isCreateProfileOpen} onClose={() => setIsCreateProfileOpen(false)} />
    </header>
  );
}
