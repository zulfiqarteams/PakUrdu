import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { BASE_PATH } from "@/config/site";

export const BRAND_LOGO_SRC = `${BASE_PATH}assets/logo.png`;
export const BRAND_LOGO_SVG_SRC = `${BASE_PATH}assets/logo.svg`;

interface BrandLogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  alt?: string;
  decorative?: boolean;
}

/**
 * Single source of truth for the supplied PAKURDU brand artwork.
 * The source image has a transparent background, so it works on both the
 * light application shell and the #0b131a dark footer/splash surfaces.
 */
export function BrandLogo({ className, alt = "PAKURDU", decorative = false, ...props }: BrandLogoProps) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt={decorative ? "" : alt}
      aria-hidden={decorative ? true : undefined}
      className={cn("block h-auto w-auto object-contain", className)}
      decoding="async"
      {...props}
    />
  );
}
