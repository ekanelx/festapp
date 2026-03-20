import Link from "next/link";

import { SectionCard } from "@/components/shared/section-card";
import { getPublicHomeEditionItems } from "@/lib/public/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: editions, error } = await getPublicHomeEditionItems();

  if (error) {
    return (
      <SectionCard
        eyebrow="Error"
        title="No se ha podido cargar Festapp"
        description="La home global publica ya depende de Supabase real y esta carga ha fallado."
      >
        <p className="text-sm text-stone-600">{error}</p>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-black/8 bg-white/75 p-6 shadow-[0_30px_90px_-55px_rgba(73,44,24,0.7)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          Festapp
        </p>
        <h1 className="mt-3 font-serif text-4xl text-stone-950">Ediciones publicas</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
          Consulta que festival o edicion te interesa ahora y entra directamente a su resumen.
        </p>
      </section>

      {!editions || editions.length === 0 ? (
        <SectionCard
          eyebrow="Sin contenido"
          title="No hay ediciones publicas activas o proximas"
          description="Cuando exista al menos una edicion publicada vigente o cercana, aparecera aqui."
        />
      ) : (
        <SectionCard
          eyebrow="Disponibles"
          title="Elige una edicion"
          description="La lista prioriza decidir rapido a que edicion entrar desde movil."
        >
          <div className="space-y-3">
            {editions.map((edition) => (
              <article
                key={`${edition.festivalSlug}-${edition.editionSlug}`}
                className="rounded-3xl border border-black/8 bg-[#fff9f3] p-4 transition hover:border-black/15 hover:bg-white"
              >
                <Link
                  href={`/${edition.festivalSlug}/${edition.editionSlug}`}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b2c16] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-stone-950">{edition.festivalName}</p>
                      <p className="text-sm text-stone-600">{edition.editionName}</p>
                      <div className="flex flex-wrap gap-2 pt-2 text-sm text-stone-500">
                        <span>{edition.dateRangeLabel}</span>
                        {edition.festivalCity ? <span>{edition.festivalCity}</span> : null}
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                        edition.temporalLabel === "En curso" || edition.temporalLabel === "Hoy"
                          ? "bg-[#9b2c16] text-white"
                          : "bg-white text-stone-700"
                      }`}
                    >
                      {edition.temporalLabel}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                    {edition.publishedEventsCount > 0 ? (
                      <p className="text-stone-500">
                        {edition.publishedEventsCount} acto
                        {edition.publishedEventsCount === 1 ? "" : "s"} publicado
                        {edition.publishedEventsCount === 1 ? "" : "s"}
                      </p>
                    ) : (
                      <p className="text-stone-400">Sin actos publicados todavia</p>
                    )}

                    <span className="font-semibold text-[#9b2c16]">Abrir edicion</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
