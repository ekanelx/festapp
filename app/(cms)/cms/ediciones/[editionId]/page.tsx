import Link from "next/link";
import { notFound } from "next/navigation";

import { CmsBreadcrumbs } from "@/components/cms/cms-breadcrumbs";
import { CmsEventsList } from "@/components/cms/cms-events-list";
import { CmsPageHeader } from "@/components/cms/cms-page-header";
import { CmsSidePanel } from "@/components/cms/cms-side-panel";
import { Callout } from "@/components/shared/callout";
import { CheckboxField, FormField } from "@/components/shared/form-field";
import { FormSubmitButton } from "@/components/shared/form-submit-button";
import { InfoTile } from "@/components/shared/info-tile";
import { MediaImageField } from "@/components/shared/media-image-field";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { requireCmsSession } from "@/lib/cms/auth";
import { formatEditionEditorialLabel, formatFestivalEditorialLabel } from "@/lib/cms/labels";
import { getCmsEditionDetail, getCmsEventsList } from "@/lib/cms/queries";

import { updateEditionAction } from "../actions";

function formatDateRange(startsOn: string, endsOn: string) {
  const formatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  });

  return `${formatter.format(new Date(startsOn))} - ${formatter.format(new Date(endsOn))}`;
}

function getEditionStatusLabel(status: string) {
  if (status === "published") {
    return "Publicado";
  }

  if (status === "archived") {
    return "Archivado";
  }

  return "Borrador";
}

type CmsEditionDetailPageProps = {
  params: Promise<{
    editionId: string;
  }>;
  searchParams?: Promise<{
    saved?: string;
    created?: string;
    error?: string;
    edit?: string;
    field?: string;
  }>;
};

export default async function CmsEditionDetailPage({
  params,
  searchParams,
}: CmsEditionDetailPageProps) {
  const session = await requireCmsSession();
  const { editionId } = await params;
  const messages = searchParams ? await searchParams : undefined;
  const [{ edition, error }, events] = await Promise.all([
    getCmsEditionDetail(editionId),
    getCmsEventsList({ editionId, limit: 5 }),
  ]);

  if (error) {
    return (
      <SectionCard title="No se ha podido cargar la edicion" description="La pagina depende de Supabase real.">
        <Callout variant="error">{error}</Callout>
      </SectionCard>
    );
  }

  if (!edition || !edition.festival) {
    notFound();
  }

  const editionLabel = formatEditionEditorialLabel(edition);
  const publicBasePath = `/${edition.festival.slug}/${edition.slug}`;
  const isAdmin = session.role === "admin";
  const isEditingEdition = messages?.edit === "edition";
  const closeEditHref = `/cms/ediciones/${edition.id}`;
  const isDateError = messages?.field === "dates";

  return (
    <>
      <div className="space-y-5">
        <CmsPageHeader
          breadcrumb={
            <CmsBreadcrumbs
              items={[
                { label: "Inicio", href: "/cms" },
                { label: "Festivales", href: "/cms/festivales" },
                {
                  label: formatFestivalEditorialLabel(edition.festival),
                  href: `/cms/festivales/${edition.festival_id}`,
                },
                { label: editionLabel },
              ]}
            />
          }
          title={editionLabel}
          description="Contexto de la edicion y acceso a su programa."
          actions={
            <>
              <Link
                href={`/cms/ediciones/${edition.id}/actos/nuevo`}
                className={buttonVariants({ variant: "default" })}
              >
                Nuevo acto
              </Link>
              {isAdmin ? (
                <Link
                  href={`${closeEditHref}?edit=edition`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  Editar edicion
                </Link>
              ) : null}
            </>
          }
          secondaryActions={
            <>
              <Link href={publicBasePath} className={buttonVariants({ variant: "link" })}>
                Ver resumen publico
              </Link>
              <Link href={`${publicBasePath}/agenda`} className={buttonVariants({ variant: "link" })}>
                Ver agenda publica
              </Link>
            </>
          }
        />

        {messages?.saved ? <Callout variant="success">Edicion guardada.</Callout> : null}
        {messages?.created ? <Callout variant="success">Edicion creada.</Callout> : null}
        {!isEditingEdition && messages?.error ? <Callout variant="error">{messages.error}</Callout> : null}

        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <SectionCard
            title="Contexto de la edicion"
            description="Datos estructurales y estado editorial."
            contentClassName="space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoTile label="Festival" value={formatFestivalEditorialLabel(edition.festival)} />
              <InfoTile label="Ano" value={edition.year} />
              <InfoTile label="Fechas" value={formatDateRange(edition.starts_on, edition.ends_on)} />
              <InfoTile
                label="Estado"
                value={
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={edition.status === "published" ? "default" : "outline"}>
                      {getEditionStatusLabel(edition.status)}
                    </Badge>
                    {edition.is_current ? <Badge variant="outline">Actual</Badge> : null}
                  </div>
                }
              />
              <InfoTile label="Zona horaria" value={edition.timezone} />
              <InfoTile label="Slug" value={edition.slug} />
            </div>
          </SectionCard>

          <div className="space-y-5">
            <SectionCard
              title="Programa"
              description="La operativa principal de esta edicion."
              contentClassName="space-y-4"
            >
              <InfoTile
                label="Programa publicado"
                value={`${edition.metrics.publishedEventsCount} actos publicados`}
                description={`${edition.metrics.relevantChangesCount} con cambios relevantes`}
              />

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/cms/ediciones/${edition.id}/actos`}
                  className={buttonVariants({ variant: "default" })}
                >
                  Entrar a actos
                </Link>
                <Link
                  href={`/cms/ediciones/${edition.id}/actos/nuevo`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  Nuevo acto
                </Link>
              </div>
            </SectionCard>

            <SectionCard
              title="Actos recientes"
              description="Preview rapida antes del listado completo."
              contentClassName="space-y-3"
            >
              {events.error ? (
                <Callout variant="error">{events.error}</Callout>
              ) : (
                <CmsEventsList
                  events={events.data}
                  emptyMessage="Esta edicion todavia no tiene actos cargados."
                  showEditorialContext={false}
                  density="compact"
                />
              )}
            </SectionCard>
          </div>
        </div>
      </div>

      {isAdmin && isEditingEdition ? (
        <CmsSidePanel
          title={`Editar ${editionLabel}`}
          description="Ajusta la informacion base de esta edicion."
          closeHref={closeEditHref}
        >
          {messages?.error && !isDateError ? <Callout variant="error">{messages.error}</Callout> : null}

          <form action={updateEditionAction} className="mt-5 space-y-4" encType="multipart/form-data">
            <input type="hidden" name="edition_id" value={edition.id} />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Nombre" className="sm:col-span-2">
                <Input name="name" defaultValue={edition.name} />
              </FormField>

              <FormField label="Slug">
                <Input name="slug" defaultValue={edition.slug} />
              </FormField>

              <FormField label="Ano">
                <Input type="number" name="year" defaultValue={edition.year} />
              </FormField>

              <FormField label="Zona horaria">
                <Input name="timezone" defaultValue={edition.timezone} />
              </FormField>

              <FormField label="Estado">
                <Select name="status" defaultValue={edition.status}>
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Archivado</option>
                </Select>
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Inicio">
                <Input type="date" name="starts_on" defaultValue={edition.starts_on} />
              </FormField>

              <FormField label="Fin">
                <Input type="date" name="ends_on" defaultValue={edition.ends_on} />
              </FormField>
            </div>

            {isDateError ? <Callout variant="error">{messages.error}</Callout> : null}

            <CheckboxField
              label="Edicion actual"
              description="Sustituira a la actual del festival."
              checkbox={<Checkbox name="is_current" defaultChecked={edition.is_current} />}
            />

            <MediaImageField
              currentImage={edition.coverMedia}
              previewTitle={edition.name}
              emptyLabel="Esta edicion todavia no tiene portada."
            />

            <div className="flex justify-end">
              <FormSubmitButton size="lg" idleLabel="Guardar edicion" pendingLabel="Guardando edicion..." />
            </div>
          </form>
        </CmsSidePanel>
      ) : null}
    </>
  );
}
