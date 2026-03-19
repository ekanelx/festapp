import { SectionCard } from "@/components/shared/section-card";
import { getEditionScaffold } from "@/lib/data/scaffold";

type HistoryPageProps = {
  params: {
    festivalSlug: string;
    editionSlug: string;
  };
};

export default function HistoryPage({ params }: HistoryPageProps) {
  const edition = getEditionScaffold(params.festivalSlug, params.editionSlug);

  return (
    <SectionCard
      eyebrow="Historico"
      title="Actos finalizados accesibles"
      description="La PRD pide mantener accesible el historico de una edicion activa. Esta pagina deja esa superficie preparada."
    >
      <div className="space-y-3">
        {edition.historical.map((event) => (
          <article key={event.slug} className="rounded-3xl border border-black/8 bg-[#f8f1e8] p-4">
            <p className="font-semibold text-stone-900">{event.title}</p>
            <p className="mt-1 text-sm text-stone-600">
              {event.startsAt} · {event.location} · Finalizado
            </p>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
