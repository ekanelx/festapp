import Link from "next/link";

import { PublicEditionNav } from "@/components/public/public-edition-nav";
import { EditionOverview } from "@/components/public/edition-overview";
import { SectionCard } from "@/components/shared/section-card";
import { getPublicEditionPageData } from "@/lib/public/queries";

type EditionHomePageProps = {
  params: Promise<{
    festivalSlug: string;
    editionSlug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EditionHomePage({ params }: EditionHomePageProps) {
  const resolvedParams = await params;
  const { data: edition, error } = await getPublicEditionPageData(
    resolvedParams.festivalSlug,
    resolvedParams.editionSlug,
  );

  if (error) {
    return (
      <SectionCard
        eyebrow="Error"
        title="No se ha podido cargar esta edicion"
        description="La home publica ya depende de Supabase real y la carga ha fallado."
      >
        <p className="text-sm text-stone-600">{error}</p>
      </SectionCard>
    );
  }

  if (!edition) {
    return (
      <SectionCard
        eyebrow="No disponible"
        title="No encontramos esa edicion publica"
        description="Comprueba el enlace o publica la edicion correcta antes de compartirla."
      />
    );
  }

  const todayPreview = edition.todayEvents.slice(0, 3);
  const nextEvent = edition.upcomingEvents[0] ?? null;
  const changedEventsPreview = edition.changedEvents.slice(0, 3);

  return (
    <div className="space-y-6">
      <PublicEditionNav
        festivalSlug={edition.festivalSlug}
        editionSlug={edition.editionSlug}
        current="home"
      />

      <section className="rounded-[32px] border border-black/8 bg-white/75 p-6 shadow-[0_30px_90px_-55px_rgba(73,44,24,0.7)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Edicion activa</p>
        <h1 className="mt-3 font-serif text-4xl text-stone-950">
          {edition.editionName}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          {edition.festivalName}
          {edition.festivalCity ? ` · ${edition.festivalCity}` : ""}
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-sm text-stone-600">
          <span className="rounded-full bg-[#fff3e6] px-3 py-1.5">{edition.dateRangeLabel}</span>
          <span className="rounded-full bg-white px-3 py-1.5">
            {edition.allEvents.length} actos publicados
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/${edition.festivalSlug}/${edition.editionSlug}/agenda`}
            className="rounded-full bg-[#9b2c16] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7f200f]"
          >
            Abrir agenda
          </Link>
        </div>
      </section>

      {changedEventsPreview.length > 0 ? (
        <SectionCard
          eyebrow="Cambios"
          title="Cambios relevantes"
          description="Solo se muestran actos actualizados o cancelados para detectarlos rapido."
        >
          <div className="space-y-3">
            {changedEventsPreview.map((event) => (
              <Link
                key={event.id}
                href={`/${edition.festivalSlug}/${edition.editionSlug}/actos/${event.slug}`}
                className="block rounded-3xl border border-[#9b2c16]/12 bg-[#fff5ef] p-4 transition hover:border-[#9b2c16]/25 hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-stone-950">{event.title}</p>
                    <p className="text-sm text-stone-600">
                      {event.startsAtDayLabel} · {event.startsAtTimeLabel}
                    </p>
                    {event.changeNote ? (
                      <p className="pt-1 text-sm leading-5 text-[#8c2b15]">{event.changeNote}</p>
                    ) : null}
                  </div>

                  {event.statusLabel ? (
                    <span className="rounded-full bg-[#9b2c16] px-2.5 py-1 text-xs font-medium text-white">
                      {event.statusLabel}
                    </span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {todayPreview.length > 0 ? (
        <EditionOverview
          title="Hoy"
          description="Los actos de hoy son lo primero que deberias ver al entrar."
          emptyMessage="Hoy no hay actos publicados para esta edicion."
          events={todayPreview}
          festivalSlug={edition.festivalSlug}
          editionSlug={edition.editionSlug}
        />
      ) : (
        <SectionCard
          eyebrow="Hoy"
          title="Hoy no hay actos publicados"
          description={
            nextEvent
              ? "El siguiente acto ya publicado queda destacado para que no tengas que abrir mas pantallas."
              : "Todavia no hay un siguiente acto publicado para esta edicion."
          }
        >
          {nextEvent ? (
            <article className="rounded-3xl border border-black/8 bg-[#fff9f3] p-4">
              <div className="grid grid-cols-[72px_1fr] gap-4">
                <div className="rounded-2xl bg-white px-2 py-3 text-center">
                  <p className="text-2xl font-semibold leading-none text-stone-950">
                    {nextEvent.startsAtTimeLabel}
                  </p>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
                    {nextEvent.startsAtDayLabel}
                  </p>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-semibold text-stone-900">{nextEvent.title}</p>
                    <p className="text-sm text-stone-500">
                      {nextEvent.locationLabel ?? "Ubicacion por confirmar"}
                    </p>
                  </div>

                  {nextEvent.statusLabel ? (
                    <span className="rounded-full bg-[#9b2c16] px-2.5 py-1 text-xs font-medium text-white">
                      {nextEvent.statusLabel}
                    </span>
                  ) : null}
                </div>
              </div>
            </article>
          ) : null}
        </SectionCard>
      )}
    </div>
  );
}
