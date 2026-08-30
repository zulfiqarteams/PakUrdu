import { BrandLogo } from "@/components/brand/BrandLogo";

interface AppLoadingOverlayProps {
  visible: boolean;
  label?: string;
}

/** Global first-paint/initialisation overlay. */
export function AppLoadingOverlay({ visible, label = "Loading PAKURDU" }: AppLoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b131a] px-6 text-white"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex flex-col items-center text-center">
        <div className="brand-splash-breathe h-36 w-32 sm:h-44 sm:w-40">
          <BrandLogo decorative className="h-full w-full" />
        </div>
        <span className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
          PAKURDU
        </span>
      </div>
    </div>
  );
}
