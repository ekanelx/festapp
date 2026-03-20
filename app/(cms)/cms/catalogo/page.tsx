import { SectionCard } from "@/components/shared/section-card";
import { requireCmsRole } from "@/lib/cms/auth";
import { getCmsCatalogOverview } from "@/lib/cms/queries";

export default async function CmsCatalogPage() {
  await requireCmsRole("admin");
  const { festivals, editions } = await getCmsCatalogOverview();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SectionCard
        eyebrow="CMS · Catalogo"
        title="Fiestas"
        description="Comprobacion simple de permisos: esta pagina solo entra para `admin`."
      >
        {festivals.error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {festivals.error}
          </div>
        ) : festivals.data.length ? (
          <div className="space-y-3">
            {festivals.data.map((festival) => (
              <article key={festival.id} className="rounded-3xl border border-black/8 bg-[#fff9f3] p-4">
                <p className="font-semibold text-stone-900">{festival.name}</p>
                <p className="mt-1 text-sm text-stone-600">
                  {festival.slug} · {festival.city ?? "Sin ciudad"}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-500">
                  {festival.status}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-stone-600">No hay fiestas registradas todavia.</p>
        )}
      </SectionCard>

      <SectionCard
        eyebrow="CMS · Catalogo"
        title="Ediciones"
        description="Lectura real de `editions` para preparar el selector operativo del CMS."
      >
        {editions.error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {editions.error}
          </div>
        ) : editions.data.length ? (
          <div className="space-y-3">
            {editions.data.map((edition) => (
              <article key={edition.id} className="rounded-3xl border border-black/8 bg-[#fff9f3] p-4">
                <p className="font-semibold text-stone-900">
                  {edition.festival?.name ?? "Sin fiesta"} · {edition.name}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  {edition.slug} · {edition.year}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-500">
                  {edition.status}
                  {edition.is_current ? " · actual" : ""}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-stone-600">No hay ediciones registradas todavia.</p>
        )}
      </SectionCard>
    </div>
  );
}
