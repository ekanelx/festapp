import Link from "next/link";

import type { PublicEventSummary } from "@/lib/public/queries";
import { cn } from "@/lib/utils";

import { SectionCard } from "@/components/shared/section-card";

type EditionOverviewProps = {
  title: string;
  description: string;
  emptyMessage: string;
  events: PublicEventSummary[];
  showDayLabel?: boolean;
  festivalSlug?: string;
  editionSlug?: string;
};

export function EditionOverview({
  title,
  description,
  emptyMessage,
  events,
  showDayLabel = false,
  festivalSlug,
  editionSlug,
}: EditionOverviewProps) {
  function getEventClasses(event: PublicEventSummary) {
    if (event.status === "cancelled") {
      return {
        article: "border-[#9b2c16]/20 bg-[#fff3ef]",
        badge: "bg-[#9b2c16] text-white",
        note: "text-[#8c2b15]",
      };
    }

    if (event.status === "updated") {
      return {
        article: "border-amber-200 bg-amber-50",
        badge: "bg-amber-600 text-white",
        note: "text-amber-800",
      };
    }

    if (event.status === "finished") {
      return {
        article: "border-stone-200 bg-stone-100",
        badge: "bg-stone-700 text-white",
        note: "text-stone-600",
      };
    }

    return {
      article: "border-black/8 bg-[#fff9f3]",
      badge: "bg-[#9b2c16] text-white",
      note: "text-stone-500",
    };
  }

  return (
    <SectionCard title={title} description={description}>
      {events.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/12 bg-stone-50 px-4 py-5 text-sm text-stone-600">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const styles = getEventClasses(event);

            return (
            <article
              key={event.id}
              className={cn(
                "rounded-3xl border p-4 transition hover:border-black/15 hover:bg-white",
                styles.article,
              )}
            >
              {festivalSlug && editionSlug ? (
                <Link
                  href={`/${festivalSlug}/${editionSlug}/actos/${event.slug}`}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b2c16] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <div className="grid grid-cols-[72px_1fr] gap-4">
                    <div className="rounded-2xl bg-white px-2 py-3 text-center">
                      <p className="text-2xl font-semibold leading-none text-stone-950">
                        {event.startsAtTimeLabel}
                      </p>
                      {showDayLabel ? (
                        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
                          {event.startsAtDayLabel}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-semibold text-stone-900">{event.title}</p>
                        {event.locationLabel ? (
                          <p className="text-sm text-stone-500">{event.locationLabel}</p>
                        ) : (
                          <p className="text-sm text-stone-400">Sin ubicacion publicada</p>
                        )}
                        {event.changeNote ? (
                          <p className={cn("pt-1 text-sm leading-5", styles.note)}>
                            {event.changeNote}
                          </p>
                        ) : null}
                      </div>

                      {event.statusLabel ? (
                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", styles.badge)}>
                          {event.statusLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="grid grid-cols-[72px_1fr] gap-4">
                  <div className="rounded-2xl bg-white px-2 py-3 text-center">
                    <p className="text-2xl font-semibold leading-none text-stone-950">
                      {event.startsAtTimeLabel}
                    </p>
                    {showDayLabel ? (
                      <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
                        {event.startsAtDayLabel}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-stone-900">{event.title}</p>
                      {event.locationLabel ? (
                        <p className="text-sm text-stone-500">{event.locationLabel}</p>
                      ) : (
                        <p className="text-sm text-stone-400">Sin ubicacion publicada</p>
                      )}
                      {event.changeNote ? (
                        <p className={cn("pt-1 text-sm leading-5", styles.note)}>
                          {event.changeNote}
                        </p>
                      ) : null}
                    </div>

                    {event.statusLabel ? (
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", styles.badge)}>
                        {event.statusLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              )}
            </article>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
