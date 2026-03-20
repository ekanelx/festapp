import { SectionCard } from "@/components/shared/section-card";
import { requireCmsSession } from "@/lib/cms/auth";
import { getCmsEventsList } from "@/lib/cms/queries";

export default async function CmsEventsPage() {
  await requireCmsSession();
  const events = await getCmsEventsList();

  return (
    <SectionCard
      eyebrow="CMS · Actos"
      title="Listado minimo real de actos"
      description="Esta vista ya consulta la tabla `events` con RLS interna. El CRUD vendra en la siguiente fase."
    >
      {events.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {events.error}
        </div>
      ) : null}

      {events.data.length ? (
        <div className="space-y-3">
          {events.data.map((event) => (
            <article key={event.id} className="rounded-3xl border border-black/8 bg-[#fff9f3] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-stone-900">{event.title}</p>
                  <p className="mt-1 text-sm text-stone-600">
                    {event.edition?.name ?? "Sin edicion"} ·{" "}
                    {new Date(event.starts_at).toLocaleString("es-ES")}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-500">
                    {event.status} · {event.review_status}
                  </p>
                </div>
                <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-stone-700">
                  {event.slug}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-black/15 bg-white/60 p-5 text-sm text-stone-600">
          Todavia no hay actos cargados o visibles para este entorno.
        </div>
      )}
    </SectionCard>
  );
}

