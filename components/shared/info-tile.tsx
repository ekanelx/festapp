import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type InfoTileVariant = "soft" | "outline";

const variantStyles: Record<InfoTileVariant, string> = {
  soft: "bg-[var(--surface-muted)] ring-1 ring-black/4",
  outline: "border border-[color:var(--border-strong)] bg-[var(--surface-strong)] shadow-[var(--shadow-control)]",
};

type InfoTileProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: ReactNode;
  description?: ReactNode;
  variant?: InfoTileVariant;
  valueClassName?: string;
};

export function InfoTile({
  label,
  value,
  description,
  variant = "soft",
  className,
  valueClassName,
  ...props
}: InfoTileProps) {
  return (
    <div
      className={cn("rounded-[var(--radius-lg)] p-4", variantStyles[variant], className)}
      {...props}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <div className={cn("mt-2 font-semibold text-[var(--foreground)]", valueClassName)}>{value}</div>
      {description ? <div className="mt-1 text-sm text-[var(--muted)]">{description}</div> : null}
    </div>
  );
}
