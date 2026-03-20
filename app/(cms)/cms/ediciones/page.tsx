import Link from "next/link";

import { CmsBreadcrumbs } from "@/components/cms/cms-breadcrumbs";
import { CmsPageHeader } from "@/components/cms/cms-page-header";
import { Callout } from "@/components/shared/callout";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { requireCmsSession } from "@/lib/cms/auth";
import { formatEditionEditorialLabel } from "@/lib/cms/labels";
import { getCmsEditionsList } from "@/lib/cms/queries";

function formatDateRange(startsOn: string, endsOn: string) {
  const formatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  });

  return `${formatter.format(new Date(startsOn))} - ${formatter.format(new Date(endsOn))}`;
}

export default async function CmsEditionsPage() {
  await requireCmsSession();
  const editions = await getCmsEditionsList();

  return (
    <div className="space-y-5">
      <CmsPageHeader
        breadcrumb={<CmsBreadcrumbs items={[{ label: "Inicio", href: "/cms" }, { label: "Ediciones" }]} />}
        title="Ediciones"
        description="Acceso transversal secundario."
      />

      {editions.error ? <Callout variant="error">{editions.error}</Callout> : null}

      <SectionCard contentClassName="space-y-3">
        {editions.data.length ? (
          editions.data.map((edition) => (
            <article
              key={edition.id}
              className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface-strong)] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <Link
                    href={`/cms/ediciones/${edition.id}`}
                    className="font-semibold text-[var(--foreground)] transition hover:text-[var(--accent)]"
                  >
                    {formatEditionEditorialLabel(edition)}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {formatDateRange(edition.starts_on, edition.ends_on)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant={edition.status === "published" ? "default" : "outline"}>
                      {edition.status === "published" ? "Publicado" : edition.status === "archived" ? "Archivado" : "Borrador"}
                    </Badge>
                    {edition.is_current ? <Badge variant="outline">Actual</Badge> : null}
                    <Badge variant="outline">{edition.metrics.publishedEventsCount} actos</Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/cms/festivales/${edition.festival_id}`}
                    className={buttonVariants({ variant: "link" })}
                  >
                    Ver festival
                  </Link>
                  <Link
                    href={`/cms/ediciones/${edition.id}/actos`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    Ver actos
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <Callout className="border-dashed text-[var(--muted)]">
            No hay ediciones cargadas todavia.
          </Callout>
        )}
      </SectionCard>
    </div>
  );
}
