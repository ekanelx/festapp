import { SectionCard } from "@/components/shared/section-card";
import { requireCmsSession } from "@/lib/cms/auth";
import { getCmsDashboardData } from "@/lib/cms/queries";

type CmsHomePageProps = {
  searchParams?: Promise<{
    denied?: string;
  }>;
};

export default async function CmsHomePage({ searchParams }: CmsHomePageProps) {
  const session = await requireCmsSession();
  const params = searchParams ? await searchParams : undefined;
  const { festivals, editions, events } = await getCmsDashboardData();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SectionCard
        eyebrow="Resumen"
        title="Acceso funcional minimo al CMS"
        description="Estas tarjetas ya consultan Supabase real con las policies internas activas."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl bg-[#fff9f3] p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Rol</p>
            <p className="mt-2 text-lg font-semibold text-stone-900">{session.role}</p>
          </div>
          <div className="rounded-3xl bg-[#fff9f3] p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Fiestas</p>
            <p className="mt-2 text-lg font-semibold text-stone-900">{festivals.data.length}</p>
          </div>
          <div className="rounded-3xl bg-[#fff9f3] p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Actos visibles en CMS</p>
            <p className="mt-2 text-lg font-semibold text-stone-900">{events.data.length}</p>
          </div>
        </div>

        {festivals.error || editions.error || events.error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {festivals.error ?? editions.error ?? events.error}
          </div>
        ) : null}

        {params?.denied ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Tu rol actual no puede abrir esa seccion del CMS.
          </div>
        ) : null}
      </SectionCard>

      <SectionCard
        eyebrow="Lectura real"
        title="Ultimas ediciones y proximos actos"
        description="Todavia no hay CRUD, pero ya hay lectura real de las tablas base para operar el backoffice."
      >
        <div className="space-y-4 text-sm text-stone-700">
          <div>
            <p className="font-semibold text-stone-900">Ediciones</p>
            {editions.data.length ? (
              <ul className="mt-2 space-y-2">
                {editions.data.slice(0, 4).map((edition) => (
                  <li key={edition.id}>
                    {edition.festival?.name ?? "Sin fiesta"} · {edition.name} ({edition.year})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-stone-600">No hay ediciones cargadas todavia.</p>
            )}
          </div>

          <div>
            <p className="font-semibold text-stone-900">Actos</p>
            {events.data.length ? (
              <ul className="mt-2 space-y-2">
                {events.data.slice(0, 4).map((event) => (
                  <li key={event.id}>
                    {event.title} · {new Date(event.starts_at).toLocaleString("es-ES")}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-stone-600">No hay actos cargados todavia.</p>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
