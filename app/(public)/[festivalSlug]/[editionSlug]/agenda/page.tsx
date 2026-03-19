import { SectionCard } from "@/components/shared/section-card";
import { getEditionScaffold } from "@/lib/data/scaffold";

type AgendaPageProps = {
  params: {
    festivalSlug: string;
    editionSlug: string;
  };
};

export default function AgendaPage({ params }: AgendaPageProps) {
  const edition = getEditionScaffold(params.festivalSlug, params.editionSlug);
  const events = [...edition.now, ...edition.today, ...edition.upcoming];

  return (
    <div className="space-y-6">
      <SectionCard
        eyebrow="Agenda"
        title="Listado base para catalogo publico"
        description="Aqui viviran busqueda, filtros por fecha, categoria y comparsa/fila, todos sincronizados en URL."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl border border-dashed border-black/15 bg-white/70 p-4 text-sm text-stone-600">
            Filtro fecha
          </div>
          <div className="rounded-3xl border border-dashed border-black/15 bg-white/70 p-4 text-sm text-stone-600">
            Filtro categoria
          </div>
          <div className="rounded-3xl border border-dashed border-black/15 bg-white/70 p-4 text-sm text-stone-600">
            Filtro comparsa / fila
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Actos placeholder"
        description="Datos estaticos para visualizar la superficie sin implementar aun queries reales."
      >
        <div className="space-y-3">
          {events.map((event) => (
            <article key={event.slug} className="rounded-3xl border border-black/8 bg-[#fff9f3] p-4">
              <p className="font-semibold text-stone-900">{event.title}</p>
              <p className="mt-1 text-sm text-stone-600">
                {event.startsAt} · {event.location} · {event.category}
              </p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

