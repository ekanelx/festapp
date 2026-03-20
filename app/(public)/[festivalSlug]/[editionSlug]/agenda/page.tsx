import { EditionOverview } from "@/components/public/edition-overview";
import { PublicEditionNav } from "@/components/public/public-edition-nav";
import { SectionCard } from "@/components/shared/section-card";
import { getPublicEditionPageData, type PublicEventSummary } from "@/lib/public/queries";

type AgendaPageProps = {
  params: Promise<{
    festivalSlug: string;
    editionSlug: string;
  }>;
};

export const dynamic = "force-dynamic";

function groupEventsByDay(events: PublicEventSummary[]) {
  const grouped = new Map<string, { label: string; events: PublicEventSummary[] }>();

  events.forEach((event) => {
    const bucket = grouped.get(event.startsAtDayLabel);

    if (bucket) {
      bucket.events.push(event);
      return;
    }

    grouped.set(event.startsAtDayLabel, {
      label: event.startsAtDayLabel,
      events: [event],
    });
  });

  return Array.from(grouped.values());
}

export default async function AgendaPage({ params }: AgendaPageProps) {
  const resolvedParams = await params;
  const { data: edition, error } = await getPublicEditionPageData(
    resolvedParams.festivalSlug,
    resolvedParams.editionSlug,
  );

  if (error) {
    return (
      <SectionCard
        eyebrow="Error"
        title="No se ha podido cargar la agenda"
        description="La agenda publica read-only ya usa Supabase real y esta carga ha fallado."
      >
        <p className="text-sm text-stone-600">{error}</p>
      </SectionCard>
    );
  }

  if (!edition) {
    return (
      <SectionCard
        eyebrow="No disponible"
        title="No encontramos esa agenda publica"
        description="Comprueba el enlace o publica la edicion antes de compartirla."
      />
    );
  }

  const groupedEvents = groupEventsByDay(edition.allEvents);

  return (
    <div className="space-y-6">
      <PublicEditionNav
        festivalSlug={edition.festivalSlug}
        editionSlug={edition.editionSlug}
        current="agenda"
      />

      <SectionCard
        eyebrow="Agenda"
        title="Agenda"
        description={`${edition.festivalName} · ${edition.editionName}`}
      >
        <div className="flex flex-wrap gap-3 text-sm text-stone-600">
          <span className="rounded-full bg-[#fff3e6] px-3 py-1.5">{edition.dateRangeLabel}</span>
          <span className="rounded-full bg-white px-3 py-1.5">
            {edition.allEvents.length} actos publicados
          </span>
        </div>
      </SectionCard>

      {groupedEvents.length === 0 ? (
        <SectionCard
          title="Sin actos publicados"
          description="Cuando haya actos visibles para esta edicion, apareceran aqui ordenados por dia."
        >
          <div className="rounded-3xl border border-dashed border-black/12 bg-stone-50 px-4 py-5 text-sm text-stone-600">
            Todavia no hay actos publicados para esta edicion.
          </div>
        </SectionCard>
      ) : (
        groupedEvents.map((group) => (
          <EditionOverview
            key={group.label}
            title={group.label}
            description={`${group.events.length} acto${group.events.length === 1 ? "" : "s"} publicado${group.events.length === 1 ? "" : "s"}`}
            emptyMessage=""
            events={group.events}
            festivalSlug={edition.festivalSlug}
            editionSlug={edition.editionSlug}
          />
        ))
      )}
    </div>
  );
}
