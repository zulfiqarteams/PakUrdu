import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Shows a spinner and disables the button. Label stays in place. */
  loading?: boolean;
}

interface ButtonAsButton
  extends BaseProps,
    ButtonHTMLAttributes<HTMLButtonElement> {
  to?: undefined;
}

interface ButtonAsLink extends BaseProps {
  /** Internal route. When provided, Button renders as a real <Link>. */
  to: string;
  children: ReactNode;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 font-display font-semibold " +
  "rounded transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700",
  secondary:
    "bg-transparent text-ink border border-border-strong hover:border-ink hover:bg-surface",
  outline:
    "bg-transparent text-brand-600 border border-brand-500 hover:bg-brand-50 active:bg-brand-100",
  ghost: "bg-transparent text-brand-500 hover:bg-brand-50",
  destructive: "bg-error-500 text-white hover:bg-error-600 active:bg-error-600",
};

const sizes: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-2",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-6 py-3.5",
};

const spinnerSizes: Record<ButtonSize, number> = {
  sm: 13,
  md: 15,
  lg: 17,
};

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  { variant = "primary", size = "md", className, loading = false, ...props },
  ref,
) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const spinner = loading && (
    <Loader2
      size={spinnerSizes[size]}
      className="animate-spin"
      aria-hidden="true"
    />
  );

  if ("to" in props && props.to) {
    const { to, children } = props as ButtonAsLink;
    // A loading Link stays navigable by design (there's no HTML-native
    // "disabled" for anchors) — loading is only meaningful for actions
    // that submit/mutate, which are always real <button>s in this app.
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        to={to}
        className={classes}
      >
        {spinner}
        {children}
      </Link>
    );
  }

  const { children, disabled, ...rest } = props as ButtonAsButton;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {spinner}
      {children}
    </button>
  );
});
