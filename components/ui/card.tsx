import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type CardVariant = "default" | "editorial" | "soft" | "strong";

const cardVariantStyles: Record<CardVariant, string> = {
  default:
    "border border-[color:var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)] backdrop-blur",
  editorial:
    "border-transparent bg-[var(--surface-raised)] shadow-[var(--shadow-ambient)] backdrop-blur",
  soft: "border-transparent bg-[var(--surface-soft)] shadow-none",
  strong: "border-transparent bg-[var(--surface-strong)] shadow-[var(--shadow-ambient)]",
};

type CardProps = HTMLAttributes<HTMLElement> & {
  variant?: CardVariant;
};

export function Card({ className, variant = "default", ...props }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-xl)]",
        cardVariantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2 p-5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("font-serif text-2xl text-[var(--foreground)]", className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-[var(--muted)]", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5", className)} {...props} />;
}
