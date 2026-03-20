import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function DrawerRoot({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("fixed inset-0 z-40 flex justify-end", className)} {...props} />;
}

export function DrawerOverlay({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("absolute inset-0 bg-[var(--overlay)]", className)} {...props} />;
}

export function DrawerPanel({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <aside
      aria-modal="true"
      role="dialog"
      className={cn(
        "relative z-10 flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-[color:var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-card-strong)] sm:p-6",
        className,
      )}
      {...props}
    />
  );
}

export function DrawerHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-start justify-between gap-4", className)} {...props} />;
}

export function DrawerEyebrow({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]",
        className,
      )}
      {...props}
    />
  );
}

export function DrawerTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("font-serif text-2xl text-[var(--foreground)]", className)} {...props} />;
}

export function DrawerDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-2 text-sm text-[var(--muted)]", className)} {...props} />;
}

export function DrawerContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn("mt-6", className)} {...props}>
      {children}
    </div>
  );
}
