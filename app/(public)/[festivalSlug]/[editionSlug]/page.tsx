import Link from "next/link";

import { EditionOverview } from "@/components/public/edition-overview";
import { SectionCard } from "@/components/shared/section-card";
import { getEditionScaffold } from "@/lib/data/scaffold";

type EditionHomePageProps = {
  params: {
    festivalSlug: string;
    editionSlug: string;
  };
};

export default function EditionHomePage({ params }: EditionHomePageProps) {
  const edition = getEditionScaffold(params.festivalSlug, params.editionSlug);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-black/8 bg-white/75 p-6 shadow-[0_30px_90px_-55px_rgba(73,44,24,0.7)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          Home publica
        </p>
        <h1 className="mt-3 font-serif text-4xl text-stone-950">
          {edition.festivalName} · {edition.editionName}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Esta ruta ya marca la estructura correcta para una edicion activa: bloques de Ahora,
          Hoy, Proximos y alertas visibles, con navegacion directa a agenda, detalle e historico.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/${edition.festivalSlug}/${edition.editionSlug}/agenda`}
            className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Ir a agenda
          </Link>
          <Link
            href={`/${edition.festivalSlug}/${edition.editionSlug}/alertas`}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-stone-700"
          >
            Ver alertas
          </Link>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <EditionOverview
            festivalSlug={edition.festivalSlug}
            editionSlug={edition.editionSlug}
            title="Ahora"
            description="Bloque prioritario para resolver la pregunta principal del producto."
            events={edition.now}
          />
          <EditionOverview
            festivalSlug={edition.festivalSlug}
            editionSlug={edition.editionSlug}
            title="Hoy"
            description="Resumen de actos del dia con espacio para estados operativos visibles."
            events={edition.today}
          />
          <EditionOverview
            festivalSlug={edition.festivalSlug}
            editionSlug={edition.editionSlug}
            title="Proximos"
            description="Reservado para la continuidad del flujo cuando el usuario quiere planificar."
            events={edition.upcoming}
          />
        </div>

        <SectionCard
          eyebrow="Alertas"
          title="Cambios importantes"
          description="En fases siguientes esta caja se alimentara desde la tabla de alertas publicadas."
        >
          <div className="space-y-3">
            {edition.alerts.map((alert) => (
              <article key={alert.title} className="rounded-3xl border border-black/8 bg-[#fff5ec] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9b2c16]">
                  {alert.priority}
                </p>
                <h2 className="mt-2 font-semibold text-stone-900">{alert.title}</h2>
                <p className="mt-1 text-sm text-stone-600">{alert.message}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

