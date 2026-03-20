import Link from "next/link";

import { CmsBreadcrumbs } from "@/components/cms/cms-breadcrumbs";
import { CmsPageHeader } from "@/components/cms/cms-page-header";
import { Callout } from "@/components/shared/callout";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { requireCmsSession } from "@/lib/cms/auth";
import { formatFestivalEditorialLabel } from "@/lib/cms/labels";
import { getCmsFestivalTree } from "@/lib/cms/queries";

export default async function CmsFestivalsPage() {
  const session = await requireCmsSession();
  const festivals = await getCmsFestivalTree();
  const isAdmin = session.role === "admin";

  return (
    <div className="space-y-5">
      <CmsPageHeader
        breadcrumb={<CmsBreadcrumbs items={[{ label: "Inicio", href: "/cms" }, { label: "Festivales" }]} />}
        title="Festivales"
        description="Punto de entrada del CMS."
        actions={
          isAdmin ? (
            <Link href="/cms/festivales/nuevo" className={buttonVariants({ variant: "default" })}>
              Nuevo festival
            </Link>
          ) : null
        }
      />

      {festivals.error ? <Callout variant="error">{festivals.error}</Callout> : null}

      <SectionCard contentClassName="space-y-3">
        {festivals.data.length ? (
          festivals.data.map((festival) => {
            const latestEdition = festival.editions[0];

            return (
              <Link
                key={festival.id}
                href={`/cms/festivales/${festival.id}`}
                className="group block rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface-strong)] p-4 transition hover:-translate-y-px hover:border-[color:var(--border-strong)]"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
                        {formatFestivalEditorialLabel(festival)}
                      </p>
                      {festival.short_description ? (
                        <p className="mt-1 text-sm text-[var(--muted)]">{festival.short_description}</p>
                      ) : null}
                    </div>

                    <Badge variant={festival.status === "published" ? "default" : "outline"}>
                      {festival.status === "published" ? "Publicado" : festival.status === "archived" ? "Archivado" : "Borrador"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{festival.metrics.editionsCount} ediciones</Badge>
                    <Badge variant="outline">{festival.metrics.publishedEventsCount} actos publicados</Badge>
                    {latestEdition ? <Badge variant="outline">Ultima {latestEdition.year}</Badge> : null}
                  </div>

                  {festival.editions.length ? (
                    <div className="flex flex-wrap gap-2 text-sm text-[var(--muted)]">
                      {festival.editions.slice(0, 4).map((edition) => (
                        <span
                          key={edition.id}
                          className="rounded-full border border-[color:var(--border)] bg-[var(--surface-muted)] px-3 py-1"
                        >
                          {edition.year}
                          {edition.is_current ? " actual" : ""}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Sin ediciones cargadas todavia.
                    </p>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <Callout className="border-dashed text-[var(--muted)]">
            No hay festivales cargados todavia.
          </Callout>
        )}
      </SectionCard>
    </div>
  );
}
