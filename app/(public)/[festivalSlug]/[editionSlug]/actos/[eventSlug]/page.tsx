import Link from "next/link";

import { SectionCard } from "@/components/shared/section-card";
import { getEditionScaffold } from "@/lib/data/scaffold";

type EventDetailPageProps = {
  params: {
    festivalSlug: string;
    editionSlug: string;
    eventSlug: string;
  };
};

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const edition = getEditionScaffold(params.festivalSlug, params.editionSlug);
  const events = [...edition.now, ...edition.today, ...edition.upcoming, ...edition.historical];
  const event = events.find((item) => item.slug === params.eventSlug) ?? events[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <SectionCard
        eyebrow="Detalle de acto"
        title={event.title}
        description="Placeholder de ficha operativa: hora, estado, lugar, descripcion breve, compartir, favorito y salida a Google Maps."
      >
        <div className="space-y-4 text-sm text-stone-700">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-[#fff9f3] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Hora</p>
              <p className="mt-2 text-lg font-semibold text-stone-900">{event.startsAt}</p>
            </div>
            <div className="rounded-3xl bg-[#fff9f3] p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Estado</p>
              <p className="mt-2 text-lg font-semibold text-stone-900">{event.status}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#fff9f3] p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Ubicacion</p>
            <p className="mt-2 font-semibold text-stone-900">{event.location}</p>
            <p className="mt-1 text-stone-600">Salida a Google Maps pendiente de datos reales.</p>
          </div>

          <p className="leading-6 text-stone-600">
            Esta superficie queda reservada para mostrar cambios importantes, comparsa o filà
            asociada, boton de compartir nativo y favorito local en navegador.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Siguiente iteracion"
        title="Que faltara conectar aqui"
        description="Este panel resume la implementacion real que ira en fases posteriores."
      >
        <ul className="space-y-3 text-sm text-stone-700">
          <li>Consulta real a Supabase por slug y edicion.</li>
          <li>Etiqueta visual de cambios cuando haya modificacion relevante.</li>
          <li>Share sheet movil y fallback de copia de enlace.</li>
          <li>Favoritos locales persistidos por `localStorage`.</li>
        </ul>
        <div className="mt-5">
          <Link
            href={`/${edition.festivalSlug}/${edition.editionSlug}/agenda`}
            className="text-sm font-semibold text-[#9b2c16] underline-offset-4 hover:underline"
          >
            Volver a agenda
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}

