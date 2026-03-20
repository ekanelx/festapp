import Link from "next/link";

import { Callout } from "@/components/shared/callout";
import { Badge } from "@/components/ui/badge";
import type { CmsEventListItem } from "@/lib/cms/queries";
import { cn } from "@/lib/utils";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusStyles(event: CmsEventListItem) {
  if (event.status === "cancelled") {
    return {
      article: "border-[color:var(--danger-border)] bg-[var(--danger-surface)] hover:border-[color:var(--danger)]",
      status: "danger" as const,
      note: "text-[var(--danger)]",
    };
  }

  if (event.status === "updated") {
    return {
      article: "border-[color:var(--warning-border)] bg-[var(--warning-surface)] hover:border-[color:var(--warning)]",
      status: "warning" as const,
      note: "text-[var(--warning)]",
    };
  }

  return {
    article:
      "border-[color:var(--border)] bg-[var(--surface-strong)] hover:border-[color:var(--border-strong)]",
    status: "outline" as const,
    note: "text-[var(--muted)]",
  };
}

function getReviewLabel(reviewStatus: CmsEventListItem["review_status"]) {
  if (reviewStatus === "published") {
    return "Publicado";
  }

  if (reviewStatus === "ready") {
    return "Listo";
  }

  if (reviewStatus === "in_review") {
    return "En revision";
  }

  return "Borrador";
}

function getStatusLabel(status: CmsEventListItem["status"]) {
  if (status === "updated") {
    return "Con cambios";
  }

  if (status === "cancelled") {
    return "Cancelado";
  }

  if (status === "finished") {
    return "Finalizado";
  }

  return "Programado";
}

function getEditorialContext(event: CmsEventListItem) {
  const festivalName = event.edition?.festival?.name;
  const editionName = event.edition?.name;

  if (festivalName && editionName) {
    return {
      label: `${festivalName} / ${editionName}`,
      tone: "text-xs text-[var(--muted)]",
    };
  }

  return {
    label: "Contexto editorial no resuelto",
    tone: "text-xs font-medium text-[var(--danger)]",
  };
}

function getLocationLabel(event: CmsEventListItem) {
  if (event.location?.name) {
    return event.location.name;
  }

  if (event.location_pending) {
    return "Ubicacion pendiente";
  }

  return null;
}

type CmsEventsListProps = {
  events: CmsEventListItem[];
  emptyMessage: string;
  showEditorialContext?: boolean;
  summary?: string;
  density?: "default" | "compact";
};

export function CmsEventsList({
  events,
  emptyMessage,
  showEditorialContext = true,
  summary,
  density = "default",
}: CmsEventsListProps) {
  if (!events.length) {
    return <Callout className="border-dashed text-[var(--muted)]">{emptyMessage}</Callout>;
  }

  return (
    <div className="space-y-3">
      {summary ? <p className="text-sm text-[var(--muted-foreground)]">{summary}</p> : null}

      {events.map((event) => {
        const styles = getStatusStyles(event);
        const editorialContext = getEditorialContext(event);
        const locationLabel = getLocationLabel(event);
        const isCompact = density === "compact";

        return (
          <Link
            key={event.id}
            href={`/cms/actos/${event.id}`}
            className={cn(
              "group block rounded-[var(--radius-lg)] border transition hover:-translate-y-px",
              isCompact ? "p-3.5" : "p-4",
              styles.article,
            )}
          >
            <div className={cn("flex flex-col", isCompact ? "gap-2.5" : "gap-3")}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  {showEditorialContext ? (
                    <p className={editorialContext.tone}>{editorialContext.label}</p>
                  ) : null}

                  <p className="font-semibold text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
                    {event.title}
                  </p>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-[var(--muted-foreground)]">
                    <span>{formatDateTime(event.starts_at)}</span>
                    {locationLabel ? <span>{locationLabel}</span> : null}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Badge variant={styles.status}>{getStatusLabel(event.status)}</Badge>
                  <Badge variant={event.review_status === "in_review" ? "default" : "outline"}>
                    {getReviewLabel(event.review_status)}
                  </Badge>
                </div>
              </div>

              {event.change_note ? (
                <p className={cn("text-sm leading-5", styles.note)}>{event.change_note}</p>
              ) : null}

              {!isCompact && event.short_description ? (
                <p className="text-sm text-[var(--muted)]">{event.short_description}</p>
              ) : null}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
