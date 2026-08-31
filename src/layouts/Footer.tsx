import { Link } from "react-router-dom";
import { ArrowUpRight, Github } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { useLanguage } from "@/i18n/useLanguage";
import { BrandLogo } from "@/components/brand/BrandLogo";

const navigationLinks = [
  { path: "/", key: "home" as const },
  { path: "/learn", key: "learn" as const },
  { path: "/practice", key: "practice" as const },
  { path: "/test", key: "tests" as const },
];

const websiteUrl = "https://zulfiqarteams.github.io/Portfolio_Website";

export function Footer() {
  const { t } = useLanguage();

  const labelFor = (key: (typeof navigationLinks)[number]["key"]) => t.nav[key];

  return (
    <footer
      className="border-t border-border bg-surface text-ink"
      aria-label="PakUrdu Typing Tutorial footer"
    >
      <PageContainer className="py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-[1.35fr_0.8fr_1fr] md:gap-12 lg:gap-20">
          {/* App identity */}
          <section className="max-w-md" aria-labelledby="footer-brand-title">
            <div className="flex items-center gap-4">
              <span
                className="flex h-16 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-paper p-2 shadow-card"
                aria-hidden="true"
              >
                <BrandLogo decorative className="h-full w-full" />
              </span>
              <h2
                id="footer-brand-title"
                className="font-display text-lg font-semibold tracking-[-0.02em] text-ink"
              >
                PakUrdu Typing Tutorial
              </h2>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-7 text-ink-soft">
              {t.footer.description}
            </p>
          </section>

          {/* Navigation */}
          <nav aria-labelledby="footer-navigation-title">
            <h2
              id="footer-navigation-title"
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint"
            >
              Navigation
            </h2>
            <ul className="mt-5 space-y-3">
              {navigationLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors duration-150 hover:text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  >
                    {labelFor(item.key)}
                    <ArrowUpRight
                      size={13}
                      aria-hidden="true"
                      className="-translate-x-0.5 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-70"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Open source */}
          <section
            className="rounded-2xl border border-border bg-paper p-5 sm:p-6"
            aria-labelledby="footer-open-source-title"
          >
            <div className="flex items-center gap-2 text-ink-faint">
              <Github size={16} aria-hidden="true" />
              <h2
                id="footer-open-source-title"
                className="text-[11px] font-semibold uppercase tracking-[0.16em]"
              >
                Open Source
              </h2>
            </div>

            <p className="mt-4 text-sm leading-6 text-ink-soft">
              Built and shared with care by{" "}
              <span className="font-semibold text-ink">Zulfiqar Teams</span>.
            </p>

            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-ink-soft transition-all duration-150 hover:border-brand-500/40 hover:bg-brand-50 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60"
              aria-label="Visit Zulfiqar Teams website"
            >
              <Github size={14} aria-hidden="true" />
              Visit website
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </section>
        </div>

        {/* Bottom strip */}
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-5 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} PakUrdu Typing Tutorial.</p>
          <p className="italic tracking-wide text-ink-faint">Learn, practice, improve</p>
        </div>
      </PageContainer>
    </footer>
  );
}
