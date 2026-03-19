import { SectionCard } from "@/components/shared/section-card";
import { getEditionScaffold } from "@/lib/data/scaffold";

type AlertsPageProps = {
  params: {
    festivalSlug: string;
    editionSlug: string;
  };
};

export default function AlertsPage({ params }: AlertsPageProps) {
  const edition = getEditionScaffold(params.festivalSlug, params.editionSlug);

  return (
    <SectionCard
      eyebrow="Alertas"
      title="Vista publica de avisos"
      description="En la implementacion real esta pagina mostrara alertas activas por edicion y alertas ligadas a actos."
    >
      <div className="space-y-3">
        {edition.alerts.map((alert) => (
          <article key={alert.title} className="rounded-3xl border border-black/8 bg-[#fff5ec] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9b2c16]">
              Prioridad {alert.priority}
            </p>
            <h2 className="mt-2 font-semibold text-stone-900">{alert.title}</h2>
            <p className="mt-2 text-sm text-stone-600">{alert.message}</p>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}

