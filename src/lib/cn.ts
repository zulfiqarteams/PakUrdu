type ClassValue = string | number | boolean | null | undefined;

/**
 * Joins truthy class name fragments together.
 * Deliberately dependency-free (no clsx/tailwind-merge) to keep the
 * foundation lean; can be swapped for tailwind-merge later if class
 * conflicts become common once more components exist.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
