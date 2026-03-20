import Link from "next/link";

import { PublicEditionNav } from "@/components/public/public-edition-nav";
import { SectionCard } from "@/components/shared/section-card";
import { getPublicEventDetailData } from "@/lib/public/queries";

type EventDetailPageProps = {
  params: Promise<{
    festivalSlug: string;
    editionSlug: string;
    eventSlug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const resolvedParams = await params;
  const { data: event, error } = await getPublicEventDetailData(
    resolvedParams.festivalSlug,
    resolvedParams.editionSlug,
    resolvedParams.eventSlug,
  );

  const agendaHref = `/${resolvedParams.festivalSlug}/${resolvedParams.editionSlug}/agenda`;

  if (error) {
    return (
      <SectionCard
        eyebrow="Error"
        title="No se ha podido cargar el acto"
        description="El detalle publico read-only ya usa Supabase real y esta carga ha fallado."
      >
        <div className="space-y-4 text-sm text-stone-600">
          <p>{error}</p>
          <Link
            href={agendaHref}
            className="inline-flex font-semibold text-[#9b2c16] underline-offset-4 hover:underline"
          >
            Volver a agenda
          </Link>
        </div>
      </SectionCard>
    );
  }

  if (!event) {
    return (
      <SectionCard
        eyebrow="No disponible"
        title="No encontramos ese acto"
        description="Comprueba el enlace o revisa que el acto siga publicado dentro de esta edicion."
      >
        <Link
          href={agendaHref}
          className="inline-flex text-sm font-semibold text-[#9b2c16] underline-offset-4 hover:underline"
        >
          Volver a agenda
        </Link>
      </SectionCard>
    );
  }

  const isChangeRelevant = event.status === "updated" || event.status === "cancelled";

  return (
    <div className="space-y-6">
      <PublicEditionNav
        festivalSlug={event.festivalSlug}
        editionSlug={event.editionSlug}
        current="agenda"
      />

      <div>
        <Link
          href={`/${event.festivalSlug}/${event.editionSlug}/agenda`}
          className="text-sm font-semibold text-[#9b2c16] underline-offset-4 hover:underline"
        >
          Volver a agenda
        </Link>
      </div>

      <SectionCard
        eyebrow="Acto"
        title={event.title}
        description={`${event.festivalName} / ${event.editionName}`}
      >
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#fff3e6] px-3 py-1.5 text-sm text-stone-700">
              {event.startsAtDayLabel}
            </span>
            {event.statusLabel ? (
              <span className="rounded-full bg-[#9b2c16] px-3 py-1.5 text-sm font-medium text-white">
                {event.statusLabel}
              </span>
            ) : null}
          </div>

          {isChangeRelevant && event.statusLabel ? (
            <section className="rounded-3xl border border-[#9b2c16]/15 bg-[#fff5ef] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c2b15]">
                Cambio relevante
              </p>
              <p className="mt-2 text-base font-semibold text-stone-900">{event.statusLabel}</p>
              {event.statusNote ? (
                <p className="mt-1 text-sm leading-6 text-stone-700">{event.statusNote}</p>
              ) : null}
            </section>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <section className="rounded-3xl bg-[#fff9f3] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                Fecha y hora
              </p>
              <p className="mt-3 text-base font-semibold text-stone-900">
                {event.startsAtDateLabel}
              </p>
              <p className="mt-2 text-3xl font-semibold leading-none text-stone-950">
                {event.startsAtTimeLabel}
              </p>
            </section>

            <section className="rounded-3xl bg-[#fff9f3] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                Ubicacion
              </p>
              {event.locationName ? (
                <>
                  <p className="mt-3 text-base font-semibold text-stone-900">
                    {event.locationName}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-stone-600">
                    {event.locationAddress ?? "Direccion no publicada todavia."}
                  </p>
                  {event.mapsUrl ? (
                    <a
                      href={event.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex rounded-full bg-[#9b2c16] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7f200f]"
                    >
                      Abrir en mapas
                    </a>
                  ) : null}
                </>
              ) : (
                <p className="mt-3 text-base font-semibold text-stone-900">
                  {event.locationStatusLabel}
                </p>
              )}
            </section>
          </div>

          {event.statusLabel && !isChangeRelevant ? (
            <section className="rounded-3xl border border-black/8 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                Estado visible
              </p>
              <p className="mt-2 text-base font-semibold text-stone-900">{event.statusLabel}</p>
              {event.statusNote ? (
                <p className="mt-1 text-sm leading-6 text-stone-600">{event.statusNote}</p>
              ) : null}
            </section>
          ) : null}

          {event.shortDescription ? (
            <section className="rounded-3xl border border-black/8 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
                Descripcion breve
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-700">{event.shortDescription}</p>
            </section>
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
