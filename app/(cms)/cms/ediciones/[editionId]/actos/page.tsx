import Link from "next/link";
import { notFound } from "next/navigation";

import { CmsBreadcrumbs } from "@/components/cms/cms-breadcrumbs";
import { CmsEventsList } from "@/components/cms/cms-events-list";
import { CmsPageHeader } from "@/components/cms/cms-page-header";
import { Callout } from "@/components/shared/callout";
import { SectionCard } from "@/components/shared/section-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { requireCmsSession } from "@/lib/cms/auth";
import { formatEditionEditorialLabel, formatFestivalEditorialLabel } from "@/lib/cms/labels";
import { getCmsEditionDetail, getCmsEventsList } from "@/lib/cms/queries";

type CmsEditionEventsPageProps = {
  params: Promise<{
    editionId: string;
  }>;
  searchParams?: Promise<{
    q?: string;
    status?: string;
    sort?: string;
  }>;
};

const EVENT_FILTERS = new Set(["all", "scheduled", "updated", "cancelled", "in_review"]);
const EVENT_SORTS = new Set(["starts_at_asc", "starts_at_desc", "updated_at_desc"]);

export default async function CmsEditionEventsPage({
  params,
  searchParams,
}: CmsEditionEventsPageProps) {
  await requireCmsSession();
  const { editionId } = await params;
  const filters = searchParams ? await searchParams : undefined;
  const [{ edition, error }, events] = await Promise.all([
    getCmsEditionDetail(editionId),
    getCmsEventsList({ editionId }),
  ]);

  if (error || events.error) {
    return (
      <SectionCard title="No se ha podido cargar la edicion" description="El listado depende de Supabase real.">
        <Callout variant="error">{error ?? events.error}</Callout>
      </SectionCard>
    );
  }

  if (!edition || !edition.festival) {
    notFound();
  }

  const publicBasePath = `/${edition.festival.slug}/${edition.slug}`;
  const editionLabel = formatEditionEditorialLabel(edition);
  const query = filters?.q?.trim().toLowerCase() ?? "";
  const statusFilter = EVENT_FILTERS.has(filters?.status ?? "") ? filters?.status ?? "all" : "all";
  const sort = EVENT_SORTS.has(filters?.sort ?? "") ? filters?.sort ?? "starts_at_asc" : "starts_at_asc";

  const filteredEvents = events.data
    .filter((event) => {
      if (query) {
        const haystack = [
          event.title,
          event.short_description ?? "",
          event.change_note ?? "",
          event.location?.name ?? "",
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(query)) {
          return false;
        }
      }

      if (statusFilter === "all") {
        return true;
      }

      if (statusFilter === "in_review") {
        return event.review_status === "in_review";
      }

      return event.status === statusFilter;
    })
    .sort((left, right) => {
      if (sort === "starts_at_desc") {
        return right.starts_at.localeCompare(left.starts_at);
      }

      if (sort === "updated_at_desc") {
        return right.updated_at.localeCompare(left.updated_at);
      }

      return left.starts_at.localeCompare(right.starts_at);
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
                label: formatFestivalEditorialLabel(edition.festival),
                href: `/cms/festivales/${edition.festival_id}`,
              },
              { label: editionLabel, href: `/cms/ediciones/${edition.id}` },
              { label: "Actos" },
            ]}
          />
        }
        title={`Actos de ${editionLabel}`}
        description="Vista operativa del programa de esta edicion."
        actions={
          <>
            <Link
              href={`/cms/ediciones/${edition.id}/actos/nuevo`}
              className={buttonVariants({ variant: "default" })}
            >
              Nuevo acto
            </Link>
            <Link href={`/cms/ediciones/${edition.id}`} className={buttonVariants({ variant: "outline" })}>
              Volver a la edicion
            </Link>
          </>
        }
        secondaryActions={
          <Link href={`${publicBasePath}/agenda`} className={buttonVariants({ variant: "link" })}>
            Ver agenda publica
          </Link>
        }
      />

      <SectionCard
        title="Filtrar y revisar"
        description="Busqueda simple y estado editorial visible."
        contentClassName="space-y-5"
      >
        <form className="grid gap-3 md:grid-cols-[minmax(0,1fr)_13rem_13rem_auto_auto] md:items-end">
          <FormSearchInput defaultValue={filters?.q ?? ""} />
          <FormStatusSelect defaultValue={statusFilter} />
          <FormSortSelect defaultValue={sort} />
          <Button type="submit" variant="outline">
            Aplicar
          </Button>
          <Link href={`/cms/ediciones/${edition.id}/actos`} className={buttonVariants({ variant: "link" })}>
            Limpiar
          </Link>
        </form>

        <CmsEventsList
          events={filteredEvents}
          showEditorialContext={false}
          summary={`${filteredEvents.length} de ${events.data.length} actos en esta edicion.`}
          emptyMessage="No hay actos que coincidan con los filtros actuales."
        />
      </SectionCard>
    </div>
  );
}

function FormSearchInput({ defaultValue }: { defaultValue: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[var(--foreground)]">Buscar</span>
      <Input name="q" defaultValue={defaultValue} placeholder="Titulo, nota o ubicacion" />
    </label>
  );
}

function FormStatusSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[var(--foreground)]">Estado</span>
      <Select name="status" defaultValue={defaultValue}>
        <option value="all">Todos</option>
        <option value="scheduled">Programado</option>
        <option value="updated">Con cambios</option>
        <option value="cancelled">Cancelado</option>
        <option value="in_review">En revision</option>
      </Select>
    </label>
  );
}

function FormSortSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-[var(--foreground)]">Orden</span>
      <Select name="sort" defaultValue={defaultValue}>
        <option value="starts_at_asc">Fecha ascendente</option>
        <option value="starts_at_desc">Fecha descendente</option>
        <option value="updated_at_desc">Actualizacion reciente</option>
      </Select>
    </label>
  );
}
