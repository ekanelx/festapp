import Link from "next/link";
import { notFound } from "next/navigation";

import { CmsBreadcrumbs } from "@/components/cms/cms-breadcrumbs";
import { CmsPageHeader } from "@/components/cms/cms-page-header";
import { Callout } from "@/components/shared/callout";
import { CheckboxField, FormField } from "@/components/shared/form-field";
import { FormSubmitButton } from "@/components/shared/form-submit-button";
import { InfoTile } from "@/components/shared/info-tile";
import { MediaImageField } from "@/components/shared/media-image-field";
import { SectionCard } from "@/components/shared/section-card";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { requireCmsRole } from "@/lib/cms/auth";
import { formatFestivalEditorialLabel } from "@/lib/cms/labels";
import { getCmsFestivalDetail } from "@/lib/cms/queries";

import { createEditionAction } from "../../../actions";

type CmsCreateEditionPageProps = {
  params: Promise<{
    festivalId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    field?: string;
  }>;
};

export default async function CmsCreateEditionPage({
  params,
  searchParams,
}: CmsCreateEditionPageProps) {
  await requireCmsRole("admin");
  const { festivalId } = await params;
  const messages = searchParams ? await searchParams : undefined;
  const { festival, error } = await getCmsFestivalDetail(festivalId);

  if (error) {
    return (
      <SectionCard title="No se ha podido preparar la nueva edicion" description="La pantalla depende del contexto real del festival.">
        <Callout variant="error">{error}</Callout>
      </SectionCard>
    );
  }

  if (!festival) {
    notFound();
  }

  const festivalLabel = formatFestivalEditorialLabel(festival);
  const isDateError = messages?.field === "dates";
  const genericError = messages?.error && !isDateError ? messages.error : null;

  return (
    <div className="space-y-5">
      <CmsPageHeader
        breadcrumb={
          <CmsBreadcrumbs
            items={[
              { label: "Inicio", href: "/cms" },
              { label: "Festivales", href: "/cms/festivales" },
              { label: festivalLabel, href: `/cms/festivales/${festival.id}` },
              { label: "Nueva edicion" },
            ]}
          />
        }
        title="Nueva edicion"
        description={`Alta en ${festivalLabel}.`}
        secondaryActions={
          <Link href={`/cms/festivales/${festival.id}`} className={buttonVariants({ variant: "link" })}>
            Volver al festival
          </Link>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          title="Datos de la edicion"
          description="Completa la base editorial y deja el alta lista."
          contentClassName="space-y-5"
        >
          {genericError ? <Callout variant="error">{genericError}</Callout> : null}

          <form action={createEditionAction} className="space-y-5" encType="multipart/form-data">
            <input type="hidden" name="festival_id" value={festival.id} />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Nombre">
                <Input name="name" defaultValue={`Edicion ${new Date().getFullYear() + 1}`} />
              </FormField>

              <FormField label="Slug">
                <Input name="slug" defaultValue={`${new Date().getFullYear() + 1}`} />
              </FormField>

              <FormField label="Ano">
                <Input type="number" name="year" defaultValue={new Date().getFullYear() + 1} />
              </FormField>

              <FormField label="Zona horaria">
                <Input name="timezone" defaultValue={festival.default_timezone} />
              </FormField>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Inicio">
                <Input type="date" name="starts_on" />
              </FormField>

              <FormField label="Fin">
                <Input type="date" name="ends_on" />
              </FormField>
            </div>

            {isDateError ? <Callout variant="error">{messages.error}</Callout> : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Estado">
                <Select name="status" defaultValue="draft">
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Archivado</option>
                </Select>
              </FormField>

              <CheckboxField
                label="Marcar como edicion actual"
                description="Sustituira a la actual del festival."
                checkbox={<Checkbox name="is_current" />}
              />
            </div>

            <MediaImageField
              previewTitle="Portada de la edicion"
              emptyLabel="Todavia no hay una portada cargada para esta edicion."
            />

            <div className="flex justify-end">
              <FormSubmitButton size="lg" idleLabel="Crear edicion" pendingLabel="Creando edicion..." />
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Contexto del festival"
          description="Referencia rapida para no perder el marco editorial."
          contentClassName="space-y-3"
        >
          <InfoTile label="Festival" value={festivalLabel} />
          <InfoTile label="Zona horaria" value={festival.default_timezone} />
          {festival.short_description ? (
            <InfoTile label="Resumen" value={festival.short_description} />
          ) : null}
        </SectionCard>
      </div>
    </div>
  );
}
