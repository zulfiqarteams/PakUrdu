import type { HTMLAttributes, ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/cn";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
}

const variantConfig: Record<
  AlertVariant,
  { icon: typeof Info; classes: string }
> = {
  info: { icon: Info, classes: "border-info-500/30 bg-info-50 text-info-600" },
  success: { icon: CheckCircle2, classes: "border-success-500/30 bg-success-50 text-success-600" },
  warning: { icon: AlertTriangle, classes: "border-warning-500/30 bg-warning-50 text-warning-600" },
  error: { icon: AlertCircle, classes: "border-error-500/30 bg-error-50 text-error-600" },
};

/**
 * Reusable feedback banner for status/validation messaging — e.g. the
 * "correct" confirmation on SahiUrdu's اعراب exercise.
 */
export function Alert({ variant = "info", title, children, className, ...props }: AlertProps) {
  const { icon: Icon, classes } = variantConfig[variant];

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-sm border px-4 py-3.5 text-sm leading-relaxed",
        classes,
        className,
      )}
      {...props}
    >
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className={cn(title && "mt-0.5", "text-ink-soft")}>{children}</div>
      </div>
    </div>
  );
}
