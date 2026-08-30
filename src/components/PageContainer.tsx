import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/**
 * Consistent horizontal padding + max content width, used by every
 * page and by the Navbar/Footer so content aligns across the app.
 */
export function PageContainer({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-content px-6 sm:px-8", className)}
      {...props}
    />
  );
}
