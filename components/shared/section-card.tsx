import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  title?: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function SectionCard({
  title,
  eyebrow,
  description,
  actions,
  children,
  className,
  headerClassName,
  contentClassName,
  titleClassName,
  descriptionClassName,
}: SectionCardProps) {
  const hasHeader = eyebrow || title || description || actions;

  return (
    <Card className={className}>
      {hasHeader ? (
        <CardHeader
          className={cn(
            actions ? "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between" : null,
            headerClassName,
          )}
        >
          <div className="min-w-0 space-y-2">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <CardTitle
                className={cn("leading-tight", !description ? "mb-0" : null, titleClassName)}
              >
                {title}
              </CardTitle>
            ) : null}
            {description ? (
              <CardDescription
                className={cn("max-w-3xl leading-6", descriptionClassName)}
              >
                {description}
              </CardDescription>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
        </CardHeader>
      ) : null}
      {children ? <CardContent className={contentClassName}>{children}</CardContent> : null}
    </Card>
  );
}
