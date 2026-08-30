import { CompassIcon } from "lucide-react";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { useSEO } from "@/hooks/useSEO";

export default function NotFound() {
  useSEO({ title: "Page Not Found", noIndex: true });

  return (
    <PlaceholderPage
      icon={CompassIcon}
      pageName="Page not found"
      routePath="404"
      description="The page you're looking for doesn't exist. Use the navigation above to get back on track."
    />
  );
}
