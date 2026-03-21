import Link from "next/link";

import { CmsBreadcrumbs } from "@/components/cms/cms-breadcrumbs";
import { CmsPageHeader } from "@/components/cms/cms-page-header";
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
import { Textarea } from "@/components/ui/textarea";
import { requireCmsSession } from "@/lib/cms/auth";
import { formatEditionEditorialLabel, formatFestivalEditorialLabel } from "@/lib/cms/labels";
import { getCmsEventEditorData } from "@/lib/cms/queries";

import { updateCmsEventAction } from "../actions";

type CmsEventEditorPageProps = {
  params: Promise<{
    eventId: string;
  }>;
  searchParams?: Promise<{
    saved?: string;
    created?: string;
    error?: string;
  }>;
};

function formatDateTimeLocal(value: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusLabel(status: string) {
  if (status === "updated") {
    return "Con cambios";
  }

  if (status === "cancelled") {
    return "Cancelado";
  }

  if (status === "finished") {
    return "Finalizado";
  }

  return "Programado";
}

function getReviewLabel(reviewStatus: string) {
  if (reviewStatus === "published") {
    return "Publicado";
  }

  if (reviewStatus === "ready") {
    return "Listo";
  }

  if (reviewStatus === "in_review") {
    return "En revision";
  }

  return "Borrador";
}

export default async function CmsEventEditorPage({
  params,
  searchParams,
}: CmsEventEditorPageProps) {
  await requireCmsSession();
  const resolvedParams = await params;
  const messages = searchParams ? await searchParams : undefined;
  const { event, locations, error } = await getCmsEventEditorData(resolvedParams.eventId);

  if (error) {
    return (
      <SectionCard title="No se ha podido cargar la ficha" description="La ficha depende de consultas reales a Supabase.">
        <Callout variant="error">{error}</Callout>
      </SectionCard>
    );
  }

  if (!event || !event.edition || !event.edition.festival) {
    return (
      <SectionCard title="No encontramos ese acto" description="Vuelve a la edicion y abre otro acto real del entorno.">
        <Link href="/cms/ediciones" className={buttonVariants({ variant: "link" })}>
          Volver a ediciones
        </Link>
      </SectionCard>
    );
  }

  const cmsEditionPath = `/cms/ediciones/${event.edition.id}`;
  const cmsEditionEventsPath = `${cmsEditionPath}/actos`;
  const publicBasePath = `/${event.edition.festival.slug}/${event.edition.slug}`;
  const publicEventPath = `${publicBasePath}/actos/${event.slug}`;
  const editionLabel = formatEditionEditorialLabel({
    ...event.edition,
    festival: event.edition.festival,
  });

  return (
    <div className="space-y-5">
      <CmsPageHeader
        breadcrumb={
          <CmsBreadcrumbs
            items={[
              { label: "Inicio", href: "/cms" },
              { label: "Festivales", href: "/cms/festivales" },
              {
                label: formatFestivalEditorialLabel(event.edition.festival),
                href: `/cms/festivales/${event.edition.festival_id}`,
              },
              { label: editionLabel, href: cmsEditionPath },
              { label: "Actos", href: cmsEditionEventsPath },
              { label: event.title },
            ]}
          />
        }
        title={event.title}
        description="Edicion de campos que impactan la salida publica."
        actions={
          <Link href={cmsEditionEventsPath} className={buttonVariants({ variant: "outline" })}>
            Volver a actos
          </Link>
        }
        secondaryActions={
          <Link href={publicEventPath} className={buttonVariants({ variant: "link" })}>
            Ver en publico
          </Link>
        }
      />

      {messages?.created ? <Callout variant="success">Acto creado.</Callout> : null}
      {messages?.saved ? <Callout variant="success">Cambios guardados.</Callout> : null}
      {messages?.error ? <Callout variant="error">{messages.error}</Callout> : null}

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Ficha del acto"
          description="Organizada por bloques para crecer sin romper el flujo editorial."
          contentClassName="space-y-5"
        >
          <form action={updateCmsEventAction} className="space-y-5" encType="multipart/form-data">
            <input type="hidden" name="event_id" value={event.id} />

            <section className="space-y-4 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface-strong)] p-4">
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)]">Identidad publica</h2>
                <p className="text-sm text-[var(--muted)]">Nombre, URL y texto corto.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Titulo" className="sm:col-span-2">
                  <Input name="title" defaultValue={event.title} />
                </FormField>

                <FormField label="Slug" hint="Cambiarlo modifica la URL publica.">
                  <Input name="slug" defaultValue={event.slug} />
                </FormField>

                <FormField label="Descripcion breve" className="sm:col-span-2">
                  <Textarea name="short_description" rows={4} defaultValue={event.short_description ?? ""} />
                </FormField>
              </div>
            </section>

            <section className="space-y-4 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface-strong)] p-4">
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)]">Programacion y publicacion</h2>
                <p className="text-sm text-[var(--muted)]">Fecha visible, estado del acto y estado editorial.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Fecha y hora">
                  <Input
                    type="datetime-local"
                    name="starts_at"
                    defaultValue={formatDateTimeLocal(event.starts_at, event.edition.timezone)}
                  />
                </FormField>

                <FormField label="Estado visible">
                  <Select name="status" defaultValue={event.status}>
                    <option value="scheduled">Programado</option>
                    <option value="updated">Con cambios</option>
                    <option value="cancelled">Cancelado</option>
                    <option value="finished">Finalizado</option>
                  </Select>
                </FormField>

                <FormField label="Publicacion editorial">
                  <Select name="review_status" defaultValue={event.review_status}>
                    <option value="draft">Borrador</option>
                    <option value="in_review">En revision</option>
                    <option value="ready">Listo</option>
                    <option value="published">Publicado</option>
                  </Select>
                </FormField>
              </div>
            </section>

            <section className="space-y-4 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface-strong)] p-4">
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)]">Cambios y comunicacion</h2>
                <p className="text-sm text-[var(--muted)]">Solo para cambios que deban explicarse al publico.</p>
              </div>

              <FormField label="Nota de cambio" hint="Visible cuando el acto tenga cambios relevantes.">
                <Textarea name="change_note" rows={3} defaultValue={event.change_note ?? ""} />
              </FormField>
            </section>

            <section className="space-y-4 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface-strong)] p-4">
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)]">Contexto relacionado</h2>
                <p className="text-sm text-[var(--muted)]">Ubicacion operativa y contexto del programa.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Ubicacion">
                  <Select name="location_id" defaultValue={event.location_id ?? ""}>
                    <option value="">Sin ubicacion asignada</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                        {location.address ? ` / ${location.address}` : ""}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <CheckboxField
                  label="Ubicacion pendiente"
                  description="Usalo cuando todavia no pueda publicarse una ubicacion."
                  checkbox={<Checkbox name="location_pending" defaultChecked={event.location_pending} />}
                />
              </div>
            </section>

            <section className="space-y-4 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface-strong)] p-4">
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)]">Portada</h2>
                <p className="text-sm text-[var(--muted)]">Imagen principal del acto en CMS y app publica.</p>
              </div>

              <MediaImageField
                currentImage={event.coverMedia}
                previewTitle={event.title}
                emptyLabel="Este acto todavia no tiene portada."
              />
            </section>

            <div className="flex justify-end">
              <FormSubmitButton size="lg" idleLabel="Guardar cambios" pendingLabel="Guardando acto..." />
            </div>
          </form>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard
            title="Contexto editorial"
            description="Referencia rapida del acto dentro del arbol editorial."
            contentClassName="space-y-3"
          >
            <InfoTile label="Festival" value={event.edition.festival.name} />
            <InfoTile label="Edicion" value={`${event.edition.name} (${event.edition.year})`} />
            <InfoTile
              label="Estado"
              value={
                <div className="flex flex-wrap gap-2">
                  <Badge>{getStatusLabel(event.status)}</Badge>
                  <Badge variant="outline">{getReviewLabel(event.review_status)}</Badge>
                </div>
              }
            />
          </SectionCard>

          <SectionCard
            title="Salida publica"
            description="Estado actual de lo que se ve fuera del CMS."
            contentClassName="space-y-3"
          >
            <InfoTile label="Fecha publicada" value={formatDateTime(event.starts_at)} />
            <InfoTile
              label="Ubicacion"
              value={
                event.location?.name ?? (event.location_pending ? "Pendiente de confirmar" : "No publicada")
              }
            />
            <InfoTile
              label="Publicacion"
              value={
                event.review_status === "published"
                  ? `Visible${event.published_at ? ` desde ${formatDateTime(event.published_at)}` : ""}`
                  : "No visible publicamente"
              }
            />

            <div className="flex flex-wrap gap-3 pt-1 text-sm">
              <Link href={cmsEditionPath} className={buttonVariants({ variant: "link" })}>
                Volver a la edicion
              </Link>
              <Link href={publicBasePath} className={buttonVariants({ variant: "link" })}>
                Ver resumen publico
              </Link>
              <Link href={`${publicBasePath}/agenda`} className={buttonVariants({ variant: "link" })}>
                Ver agenda publica
              </Link>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
