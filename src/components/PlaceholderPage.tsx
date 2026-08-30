import type { LucideIcon } from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { Badge } from "@/components/Badge";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

interface PlaceholderPageProps {
  icon: LucideIcon;
  pageName: string;
  routePath: string;
  description: string;
}

/**
 * Renders a clearly-labelled placeholder for routes whose real
 * functionality belongs to a later part of the project. Exists so
 * routing can be manually verified now without faking functionality.
 */
export function PlaceholderPage({
  icon: Icon,
  pageName,
  routePath,
  description,
}: PlaceholderPageProps) {
  useDocumentTitle(pageName);

  return (
    <PageContainer className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <Icon size={26} aria-hidden="true" />
      </span>
      <Badge tone="gold" className="mb-4">
        Coming in a future part
      </Badge>
      <h1 className="text-3xl font-bold">{pageName}</h1>
      <p className="numeric mt-2 text-sm text-ink-faint">{routePath}</p>
      <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
        {description}
      </p>
    </PageContainer>
  );
}
