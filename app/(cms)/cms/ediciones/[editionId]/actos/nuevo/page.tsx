import Link from "next/link";
import { notFound } from "next/navigation";

import { CmsBreadcrumbs } from "@/components/cms/cms-breadcrumbs";
import { Callout } from "@/components/shared/callout";
import { CheckboxField, FormField } from "@/components/shared/form-field";
import { FormSubmitButton } from "@/components/shared/form-submit-button";
import { MediaImageField } from "@/components/shared/media-image-field";
import { SectionCard } from "@/components/shared/section-card";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireCmsSession } from "@/lib/cms/auth";
import { formatEditionEditorialLabel, formatFestivalEditorialLabel } from "@/lib/cms/labels";
import { getCmsEventCreationData } from "@/lib/cms/queries";

import { createCmsEventAction } from "@/app/(cms)/cms/actos/actions";

type CmsCreateEventPageProps = {
  params: Promise<{
    editionId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

function defaultStartsAt(dateValue: string) {
  return `${dateValue}T12:00`;
}

export default async function CmsCreateEventPage({
  params,
  searchParams,
}: CmsCreateEventPageProps) {
  await requireCmsSession();
  const { editionId } = await params;
  const messages = searchParams ? await searchParams : undefined;
  const { edition, locations, error } = await getCmsEventCreationData(editionId);

  if (error) {
    return (
      <SectionCard
        eyebrow="CMS / Actos"
        title="No se ha podido preparar el alta del acto"
        description="La creacion depende del contexto real de la edicion."
      >
        <Callout variant="error">{error}</Callout>
      </SectionCard>
    );
  }

  if (!edition || !edition.festival) {
    notFound();
  }

  const editionLabel = formatEditionEditorialLabel(edition);

  return (
    <SectionCard
      eyebrow="CMS / Actos"
      title={`Nuevo acto en ${editionLabel}`}
      description="Alta minima de un acto dentro de una edicion concreta."
    >
      <CmsBreadcrumbs
        items={[
          { label: "Inicio", href: "/cms" },
          { label: "Festivales", href: "/cms/festivales" },
          {
            label: formatFestivalEditorialLabel(edition.festival),
            href: `/cms/festivales/${edition.festival_id}`,
          },
          { label: editionLabel, href: `/cms/ediciones/${edition.id}` },
          { label: "Actos", href: `/cms/ediciones/${edition.id}/actos` },
          { label: "Nuevo acto" },
        ]}
      />

      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <Link href={`/cms/ediciones/${edition.id}/actos`} className={buttonVariants({ variant: "outline" })}>
          Volver a actos
        </Link>
      </div>

      {messages?.error ? (
        <Callout variant="error" className="mt-5">
          {messages.error}
        </Callout>
      ) : null}

      <form action={createCmsEventAction} className="mt-5 space-y-5" encType="multipart/form-data">
        <input type="hidden" name="edition_id" value={edition.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Titulo" className="sm:col-span-2">
            <Input name="title" />
          </FormField>

          <FormField label="Slug">
            <Input
              name="slug"
              placeholder="se-genera-desde-el-titulo-si-lo-dejas-vacio"
            />
          </FormField>

          <FormField label="Fecha y hora">
            <Input
              type="datetime-local"
              name="starts_at"
              defaultValue={defaultStartsAt(edition.starts_on)}
            />
          </FormField>

          <FormField label="Estado">
            <Select name="status" defaultValue="scheduled">
              <option value="scheduled">Programado</option>
              <option value="updated">Actualizado</option>
              <option value="cancelled">Cancelado</option>
              <option value="finished">Finalizado</option>
            </Select>
          </FormField>

          <FormField label="Publicacion">
            <Select name="review_status" defaultValue="draft">
              <option value="draft">Borrador</option>
              <option value="in_review">En revision</option>
              <option value="ready">Listo</option>
              <option value="published">Publicado</option>
            </Select>
          </FormField>

          <FormField label="Descripcion breve" className="sm:col-span-2">
            <Textarea name="short_description" rows={4} />
          </FormField>

          <FormField label="Nota de cambio" className="sm:col-span-2">
            <Textarea name="change_note" rows={3} />
          </FormField>

          <FormField label="Ubicacion">
            <Select name="location_id" defaultValue="">
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
            label="Ubicacion pendiente de confirmar"
            checkbox={<Checkbox name="location_pending" />}
          />
        </div>

        <MediaImageField
          previewTitle="Portada del acto"
          emptyLabel="Todavia no hay una portada cargada para este acto."
        />

        <div className="flex justify-end">
          <FormSubmitButton size="lg" idleLabel="Crear acto" pendingLabel="Creando acto..." />
        </div>
      </form>
    </SectionCard>
  );
}
