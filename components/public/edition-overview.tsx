import Link from "next/link";

import type { PublicEventSummary } from "@/lib/public/queries";
import { cn } from "@/lib/utils";

import { PublicMetaRow } from "@/components/public/public-editorial";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";

type EditionOverviewProps = {
  title: string;
  description: string;
  emptyMessage: string;
  events: PublicEventSummary[];
  showDayLabel?: boolean;
  festivalSlug?: string;
  editionSlug?: string;
};

function getEventStyles(event: PublicEventSummary) {
  if (event.status === "cancelled") {
    return {
      card: "bg-[var(--danger-surface)]",
      badge: "danger" as const,
      note: "text-[var(--danger)]",
    };
  }

  if (event.status === "updated") {
    return {
      card: "bg-[var(--warning-surface)]",
      badge: "warning" as const,
      note: "text-[var(--warning)]",
    };
  }

  if (event.status === "finished") {
    return {
      card: "bg-[var(--surface-soft)]",
      badge: "soft" as const,
      note: "text-[var(--muted)]",
    };
  }

  return {
    card: "bg-[var(--surface-soft)]",
    badge: "accent" as const,
    note: "text-[var(--muted)]",
  };
}

export function EditionOverview({
  title,
  description,
  emptyMessage,
  events,
  showDayLabel = false,
  festivalSlug,
  editionSlug,
}: EditionOverviewProps) {
  return (
    <SectionCard variant="editorial" title={title} description={description} contentClassName="space-y-3">
      {events.length === 0 ? (
        <div className="rounded-[calc(var(--radius-xl)-0.15rem)] bg-[var(--surface-soft)] px-4 py-5 text-sm text-[var(--muted)]">
          {emptyMessage}
        </div>
      ) : (
        events.map((event) => {
          const styles = getEventStyles(event);
          const href =
            festivalSlug && editionSlug
              ? `/${festivalSlug}/${editionSlug}/actos/${event.slug}`
              : null;

          const content = (
            <div className={cn("grid gap-4 rounded-[calc(var(--radius-xl)-0.15rem)] p-4 sm:grid-cols-[5.25rem_1fr]", styles.card)}>
              <div className="rounded-[calc(var(--radius-lg)-0.15rem)] bg-[var(--surface-raised)] px-3 py-4 text-center shadow-[var(--shadow-control)]">
                <p className="text-2xl font-semibold leading-none text-[var(--foreground)]">
                  {event.startsAtTimeLabel}
                </p>
                {showDayLabel ? (
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    {event.startsAtDayLabel}
                  </p>
                ) : null}
              </div>

              <div className="flex min-w-0 flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-serif text-2xl leading-[1.05] tracking-[-0.02em] text-[var(--foreground)]">
                      {event.title}
                    </p>
                    <PublicMetaRow
                      items={[event.locationLabel, showDayLabel ? null : event.startsAtDayLabel]}
                      className="mt-3"
                    />
                  </div>

                  {event.statusLabel ? <Badge variant={styles.badge}>{event.statusLabel}</Badge> : null}
                </div>

                {event.changeNote ? (
                  <p className={cn("text-sm leading-6", styles.note)}>{event.changeNote}</p>
                ) : null}
              </div>
            </div>
          );

          if (!href) {
            return <article key={event.id}>{content}</article>;
          }

          return (
            <Link
              key={event.id}
              href={href}
              className="block transition hover:-translate-y-px"
            >
              {content}
            </Link>
          );
        })
      )}
    </SectionCard>
  );
}
