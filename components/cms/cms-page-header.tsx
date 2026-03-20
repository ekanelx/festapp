import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type CmsPageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  breadcrumb?: ReactNode;
  actions?: ReactNode;
  secondaryActions?: ReactNode;
  className?: string;
};

export function CmsPageHeader({
  title,
  description,
  breadcrumb,
  actions,
  secondaryActions,
  className,
}: CmsPageHeaderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {breadcrumb ? <div>{breadcrumb}</div> : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="font-serif text-[clamp(2rem,4.4vw,3rem)] leading-[1.02] text-[var(--foreground)]">
            {title}
          </h1>
          {description ? (
            <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">{description}</p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">{actions}</div>
        ) : null}
      </div>

      {secondaryActions ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">{secondaryActions}</div>
      ) : null}
    </div>
  );
}
