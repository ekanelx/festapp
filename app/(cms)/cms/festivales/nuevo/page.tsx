import Link from "next/link";

import { CmsBreadcrumbs } from "@/components/cms/cms-breadcrumbs";
import { CmsPageHeader } from "@/components/cms/cms-page-header";
import { Callout } from "@/components/shared/callout";
import { FormField } from "@/components/shared/form-field";
import { FormSubmitButton } from "@/components/shared/form-submit-button";
import { MediaImageField } from "@/components/shared/media-image-field";
import { SectionCard } from "@/components/shared/section-card";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requireCmsRole } from "@/lib/cms/auth";

import { createFestivalAction } from "../actions";

type CmsCreateFestivalPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function CmsCreateFestivalPage({
  searchParams,
}: CmsCreateFestivalPageProps) {
  await requireCmsRole("admin");
  const messages = searchParams ? await searchParams : undefined;

  return (
    <div className="space-y-5">
      <CmsPageHeader
        breadcrumb={
          <CmsBreadcrumbs
            items={[
              { label: "Inicio", href: "/cms" },
              { label: "Festivales", href: "/cms/festivales" },
              { label: "Nuevo festival" },
            ]}
          />
        }
        title="Nuevo festival"
        description="Alta base del festival."
        secondaryActions={
          <Link href="/cms/festivales" className={buttonVariants({ variant: "link" })}>
            Volver a festivales
          </Link>
        }
      />

      <SectionCard
        title="Datos del festival"
        description="Solo lo necesario para abrir su arbol editorial."
        contentClassName="space-y-5"
      >
        {messages?.error ? <Callout variant="error">{messages.error}</Callout> : null}

        <form action={createFestivalAction} className="space-y-5" encType="multipart/form-data">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nombre" className="sm:col-span-2">
              <Input name="name" />
            </FormField>

            <FormField label="Slug">
              <Input name="slug" placeholder="moros-y-cristianos" />
            </FormField>

            <FormField label="Ciudad">
              <Input name="city" />
            </FormField>

            <FormField label="Zona horaria">
              <Input name="default_timezone" defaultValue="Europe/Madrid" />
            </FormField>

            <FormField label="Estado">
              <Select name="status" defaultValue="draft">
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
              </Select>
            </FormField>

            <FormField label="Descripcion breve" className="sm:col-span-2">
              <Textarea name="short_description" rows={4} />
            </FormField>
          </div>

          <MediaImageField
            previewTitle="Portada del festival"
            emptyLabel="Todavia no hay una portada cargada para este festival."
          />

          <div className="flex justify-end">
            <FormSubmitButton size="lg" idleLabel="Crear festival" pendingLabel="Creando festival..." />
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
