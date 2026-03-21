import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "outline" | "warning" | "danger" | "accent" | "soft";

const badgeStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--primary)] text-[var(--primary-foreground)]",
  outline: "border border-[color:var(--border)] bg-[var(--surface-strong)] text-[var(--muted)]",
  warning: "bg-[var(--warning)] text-[var(--color-white)]",
  danger: "bg-[var(--danger)] text-[var(--color-white)]",
  accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
  soft: "bg-[var(--surface-soft)] text-[var(--muted)]",
};

export function Badge({
  className,
  variant = "outline",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        badgeStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
