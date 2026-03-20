import Link from "next/link";

import { CmsPageHeader } from "@/components/cms/cms-page-header";
import { Callout } from "@/components/shared/callout";
import { InfoTile } from "@/components/shared/info-tile";
import { SectionCard } from "@/components/shared/section-card";
import { buttonVariants } from "@/components/ui/button";
import { requireCmsSession } from "@/lib/cms/auth";
import { formatEditionEditorialLabel } from "@/lib/cms/labels";
import { getCmsDashboardData } from "@/lib/cms/queries";

type CmsHomePageProps = {
  searchParams?: Promise<{
    denied?: string;
  }>;
};

function formatDateRange(startsOn: string, endsOn: string) {
  const formatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  });

  return `${formatter.format(new Date(startsOn))} - ${formatter.format(new Date(endsOn))}`;
}

export default async function CmsHomePage({ searchParams }: CmsHomePageProps) {
  const session = await requireCmsSession();
  const params = searchParams ? await searchParams : undefined;
  const { festivals, editions, events } = await getCmsDashboardData();

  return (
    <div className="space-y-5">
      <CmsPageHeader
        title="Inicio CMS"
        description="Entra por festivales y baja desde ahi a la edicion y sus actos."
        actions={
          <Link href="/cms/festivales" className={buttonVariants({ variant: "default" })}>
            Ir a festivales
          </Link>
        }
      />

      {params?.denied ? (
        <Callout variant="warning">
          Esa ruta ya no forma parte del flujo editorial principal.
        </Callout>
      ) : null}

      {festivals.error || editions.error || events.error ? (
        <Callout variant="error">
          {festivals.error ?? editions.error ?? events.error}
        </Callout>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Entrada principal"
          description="El trabajo editorial empieza en el festival correcto."
          contentClassName="space-y-4"
        >
          <Link
            href="/cms/festivales"
            className="group block rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface-strong)] p-5 transition hover:-translate-y-px hover:border-[color:var(--border-strong)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Flujo editorial
            </p>
            <p className="mt-2 font-serif text-2xl text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
              Festival / edicion / actos
            </p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Revisa el contexto del festival, entra en su edicion activa y desde ahi mantiene el programa.
            </p>
          </Link>

          <div className="grid gap-3 sm:grid-cols-3">
            <InfoTile label="Rol" value={session.role} variant="outline" valueClassName="text-lg" />
            <InfoTile
              label="Festivales"
              value={festivals.data.length}
              variant="outline"
              valueClassName="text-lg"
            />
            <InfoTile label="Actos" value={events.data.length} variant="outline" valueClassName="text-lg" />
          </div>
        </SectionCard>

        <SectionCard
          title="Ediciones recientes"
          description="Atajos utiles sin convertir la home en un dashboard."
          contentClassName="space-y-3"
        >
          {editions.data.length ? (
            editions.data.slice(0, 4).map((edition) => (
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
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {edition.metrics.publishedEventsCount} actos publicados
                    </p>
                  </div>

                  <Link
                    href={`/cms/ediciones/${edition.id}/actos`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    Ver actos
                  </Link>
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
    </div>
  );
}
