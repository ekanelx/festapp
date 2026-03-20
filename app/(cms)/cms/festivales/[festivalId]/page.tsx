import Link from "next/link";
import { notFound } from "next/navigation";

import { CmsBreadcrumbs } from "@/components/cms/cms-breadcrumbs";
import { CmsPageHeader } from "@/components/cms/cms-page-header";
import { CmsSidePanel } from "@/components/cms/cms-side-panel";
import { Callout } from "@/components/shared/callout";
import { FormField } from "@/components/shared/form-field";
import { InfoTile } from "@/components/shared/info-tile";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireCmsSession } from "@/lib/cms/auth";
import { formatEditionEditorialLabel, formatFestivalEditorialLabel } from "@/lib/cms/labels";
import { getCmsFestivalDetail } from "@/lib/cms/queries";

import { updateFestivalAction } from "../actions";

function formatDateRange(startsOn: string, endsOn: string) {
  const formatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  });

  return `${formatter.format(new Date(startsOn))} - ${formatter.format(new Date(endsOn))}`;
}

function getFestivalStatusLabel(status: string) {
  if (status === "published") {
    return "Publicado";
  }

  if (status === "archived") {
    return "Archivado";
  }

  return "Borrador";
}

type CmsFestivalDetailPageProps = {
  params: Promise<{
    festivalId: string;
  }>;
  searchParams?: Promise<{
    created?: string;
    saved?: string;
    error?: string;
    edit?: string;
  }>;
};

export default async function CmsFestivalDetailPage({
  params,
  searchParams,
}: CmsFestivalDetailPageProps) {
  const session = await requireCmsSession();
  const { festivalId } = await params;
  const messages = searchParams ? await searchParams : undefined;
  const { festival, error } = await getCmsFestivalDetail(festivalId);

  if (error) {
    return (
      <SectionCard title="No se ha podido cargar el festival" description="La vista depende de Supabase real.">
        <Callout variant="error">{error}</Callout>
      </SectionCard>
    );
  }

  if (!festival) {
    notFound();
  }

  const festivalLabel = formatFestivalEditorialLabel(festival);
  const isAdmin = session.role === "admin";
  const isEditingFestival = messages?.edit === "festival";
  const closeEditHref = `/cms/festivales/${festival.id}`;
  const newEditionHref = `/cms/festivales/${festival.id}/ediciones/nueva`;

  return (
    <>
      <div className="space-y-5">
        <CmsPageHeader
          breadcrumb={
            <CmsBreadcrumbs
              items={[
                { label: "Inicio", href: "/cms" },
                { label: "Festivales", href: "/cms/festivales" },
                { label: festivalLabel },
              ]}
            />
          }
          title={festivalLabel}
          description="Contexto base del festival y acceso a sus ediciones."
          actions={
            isAdmin ? (
              <>
                <Link href={newEditionHref} className={buttonVariants({ variant: "default" })}>
                  Nueva edicion
                </Link>
                <Link href={`${closeEditHref}?edit=festival`} className={buttonVariants({ variant: "outline" })}>
                  Editar festival
                </Link>
              </>
            ) : null
          }
        />

        {messages?.created ? <Callout variant="success">Festival creado.</Callout> : null}
        {messages?.saved ? <Callout variant="success">Festival guardado.</Callout> : null}
        {!isEditingFestival && messages?.error ? <Callout variant="error">{messages.error}</Callout> : null}

        <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
          <SectionCard
            title="Contexto del festival"
            description="Datos estructurales y resumen operativo."
            contentClassName="space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoTile label="Ciudad" value={festival.city ?? "Sin ciudad"} />
              <InfoTile
                label="Estado"
                value={<Badge variant={festival.status === "published" ? "default" : "outline"}>{getFestivalStatusLabel(festival.status)}</Badge>}
              />
              <InfoTile label="Zona horaria" value={festival.default_timezone} />
              <InfoTile label="Slug" value={festival.slug} />
            </div>

            <InfoTile
              label="Resumen"
              value={festival.short_description ?? "Sin descripcion breve."}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <InfoTile label="Ediciones" value={festival.metrics.editionsCount} variant="outline" valueClassName="text-lg" />
              <InfoTile
                label="Actos publicados"
                value={festival.metrics.publishedEventsCount}
                variant="outline"
                valueClassName="text-lg"
              />
              <InfoTile
                label="Con cambios"
                value={festival.metrics.relevantChangesCount}
                variant="outline"
                valueClassName="text-lg"
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Ediciones"
            description="Siguiente paso natural dentro del flujo editorial."
            contentClassName="space-y-3"
          >
            {festival.editions.length ? (
              festival.editions.map((edition) => (
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
                        {formatEditionEditorialLabel({ ...edition, festival })}
                      </Link>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {formatDateRange(edition.starts_on, edition.ends_on)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">{edition.status === "published" ? "Publicado" : edition.status === "archived" ? "Archivado" : "Borrador"}</Badge>
                        {edition.is_current ? <Badge variant="default">Actual</Badge> : null}
                        <Badge variant="outline">{edition.metrics.publishedEventsCount} actos</Badge>
                      </div>
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
                No hay ediciones cargadas para este festival.
              </Callout>
            )}
          </SectionCard>
        </div>
      </div>

      {isAdmin && isEditingFestival ? (
        <CmsSidePanel
          title={`Editar ${festivalLabel}`}
          description="Ajusta el contexto base del festival."
          closeHref={closeEditHref}
        >
          {messages?.error ? <Callout variant="error">{messages.error}</Callout> : null}

          <form action={updateFestivalAction} className="mt-5 space-y-4">
            <input type="hidden" name="festival_id" value={festival.id} />

            <FormField label="Nombre">
              <Input name="name" defaultValue={festival.name} />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Ciudad">
                <Input name="city" defaultValue={festival.city ?? ""} />
              </FormField>

              <FormField label="Zona horaria">
                <Input name="default_timezone" defaultValue={festival.default_timezone} />
              </FormField>

              <FormField label="Estado">
                <Select name="status" defaultValue={festival.status}>
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Archivado</option>
                </Select>
              </FormField>

              <FormField label="Slug">
                <Input value={festival.slug} disabled />
              </FormField>
            </div>

            <FormField label="Descripcion breve">
              <Textarea name="short_description" rows={3} defaultValue={festival.short_description ?? ""} />
            </FormField>

            <div className="flex justify-end">
              <Button type="submit" size="lg">
                Guardar festival
              </Button>
            </div>
          </form>
        </CmsSidePanel>
      ) : null}
    </>
  );
}
