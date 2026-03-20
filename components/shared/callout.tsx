import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type CalloutVariant = "info" | "success" | "warning" | "error";

const calloutStyles: Record<CalloutVariant, string> = {
  info: "border-[color:var(--border)] bg-[var(--surface-strong)] text-[var(--foreground)]",
  success:
    "border-[color:var(--success-border)] bg-[var(--success-surface)] text-[var(--success)]",
  warning:
    "border-[color:var(--warning-border)] bg-[var(--warning-surface)] text-[var(--warning)]",
  error: "border-[color:var(--danger-border)] bg-[var(--danger-surface)] text-[var(--danger)]",
};

type CalloutProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CalloutVariant;
};

export function Callout({
  className,
  variant = "info",
  ...props
}: CalloutProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border px-4 py-3 text-sm leading-6",
        calloutStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
