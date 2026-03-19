import Link from "next/link";

import type { EventCard } from "@/lib/domain/types";

import { SectionCard } from "@/components/shared/section-card";

type EditionOverviewProps = {
  festivalSlug: string;
  editionSlug: string;
  title: string;
  description: string;
  events: EventCard[];
};

function statusLabel(status: EventCard["status"]) {
  switch (status) {
    case "updated":
      return "Actualizado";
    case "cancelled":
      return "Cancelado";
    case "finished":
      return "Finalizado";
    default:
      return "Programado";
  }
}

export function EditionOverview({
  festivalSlug,
  editionSlug,
  title,
  description,
  events,
}: EditionOverviewProps) {
  return (
    <SectionCard title={title} description={description}>
      <div className="space-y-3">
        {events.map((event) => (
          <article
            key={event.slug}
            className="rounded-3xl border border-black/8 bg-[#fff9f3] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="font-semibold text-stone-900">{event.title}</p>
                <p className="text-sm text-stone-600">
                  {event.startsAt} · {event.location} · {event.category}
                </p>
              </div>
              <span className="rounded-full bg-stone-950 px-2.5 py-1 text-xs font-medium text-white">
                {statusLabel(event.status)}
              </span>
            </div>

            {event.highlight ? <p className="mt-3 text-sm text-stone-600">{event.highlight}</p> : null}

            <div className="mt-4">
              <Link
                href={`/${festivalSlug}/${editionSlug}/actos/${event.slug}`}
                className="text-sm font-semibold text-[#9b2c16] underline-offset-4 hover:underline"
              >
                Ver detalle placeholder
              </Link>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}

