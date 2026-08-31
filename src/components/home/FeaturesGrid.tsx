import { useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle2, Keyboard, LineChart, Timer, Type } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useLanguage } from "@/i18n/useLanguage";
import { cn } from "@/lib/cn";

const icons = [BookOpen, Type, Timer, LineChart, Keyboard, CheckCircle2] as const;
const routes = [
  "/learn",
  "/practice",
  "/test",
  "/progress",
  "/learn/phonetic-keyboard",
  "/biography",
] as const;

export function FeaturesGrid() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const features = t.home.features.slice(0, 6);

  return (
    <section aria-labelledby="home-features-title" className="mx-auto mt-10 max-w-5xl">
      <div className="mb-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">{t.home.aheadEyebrow}</p>
        <h2 id="home-features-title" className="mt-1 text-xl font-bold text-ink sm:text-2xl">{t.home.aheadTitle}</h2>
      </div>
      <div dir={direction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(([title, description], index) => {
          const Icon = icons[index];
          const route = routes[index];
          const open = () => navigate(route);
          return (
            <Card
              key={title}
              hover
              role="link"
              tabIndex={0}
              onClick={open}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  open();
                }
              }}
              className="group cursor-pointer p-4 sm:p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-ink">{title}</h3>
                  <p className="mt-1 truncate text-xs leading-5 text-ink-soft">{description}</p>
                </div>
              </div>
              <Button
                to={route}
                variant="ghost"
                size="sm"
                className={cn("mt-3 px-0", direction === "rtl" && "flex-row-reverse")}
              >
                {t.common.start}
              </Button>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
