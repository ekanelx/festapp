import Link from "next/link";

import {
  PublicEntityMedia,
  PublicHeroBlock,
  PublicInfoPanel,
  PublicMetaRow,
} from "@/components/public/public-editorial";
import { PublicEditionNav } from "@/components/public/public-edition-nav";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getPublicEventDetailData } from "@/lib/public/queries";

type EventDetailPageProps = {
  params: Promise<{
    festivalSlug: string;
    editionSlug: string;
    eventSlug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const resolvedParams = await params;
  const { data: event, error } = await getPublicEventDetailData(
    resolvedParams.festivalSlug,
    resolvedParams.editionSlug,
    resolvedParams.eventSlug,
  );

  const agendaHref = `/${resolvedParams.festivalSlug}/${resolvedParams.editionSlug}/agenda`;

  if (error) {
    return (
      <SectionCard
        variant="editorial"
        eyebrow="Error"
        title="No se ha podido cargar el acto"
        description="El detalle publico read-only ya usa Supabase real."
      >
        <div className="space-y-4 text-sm text-[var(--muted)]">
          <p>{error}</p>
          <Link href={agendaHref} className={buttonVariants({ variant: "link" })}>
            Volver a agenda
          </Link>
        </div>
      </SectionCard>
    );
  }

  if (!event) {
    return (
      <SectionCard
        variant="editorial"
        eyebrow="No disponible"
        title="No encontramos ese acto"
        description="Comprueba el enlace o revisa que el acto siga publicado dentro de esta edicion."
      >
        <Link href={agendaHref} className={buttonVariants({ variant: "link" })}>
          Volver a agenda
        </Link>
      </SectionCard>
    );
  }

  const isChangeRelevant = event.status === "updated" || event.status === "cancelled";

  return (
    <div className="space-y-8">
      <PublicEditionNav
        festivalSlug={event.festivalSlug}
        editionSlug={event.editionSlug}
        current="agenda"
      />

      <PublicHeroBlock
        eyebrow="Acto"
        title={event.title}
        description={`${event.festivalName} / ${event.editionName}`}
        media={
          <PublicEntityMedia
            asset={event.coverMedia}
            tone="stone"
            badge={event.statusLabel ?? "Acto"}
            subtitle={event.festivalCity ?? event.festivalName}
            title={event.title}
            className="min-h-[20rem] sm:min-h-[24rem]"
            priority
          />
        }
        meta={
          <PublicMetaRow
            items={[
              event.startsAtDateLabel,
              event.startsAtTimeLabel,
              event.locationName ?? event.locationStatusLabel,
              event.editionDateRangeLabel,
            ]}
          />
        }
        actions={
          <Link href={agendaHref} className={buttonVariants({ variant: "outline" })}>
            Volver a agenda
          </Link>
        }
        aside={
          <div className="flex flex-wrap items-center gap-2">
            {event.statusLabel ? <Badge variant={isChangeRelevant ? "accent" : "soft"}>{event.statusLabel}</Badge> : null}
            {event.mapsUrl ? (
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "accent" })}
              >
                Abrir en mapas
              </a>
            ) : null}
          </div>
        }
      />

      {isChangeRelevant && event.statusLabel ? (
        <SectionCard
          variant="soft"
          title="Cambio relevante"
          description="Este acto muestra una actualizacion visible para el publico."
          contentClassName="space-y-3"
        >
          <Badge variant="accent">{event.statusLabel}</Badge>
          {event.statusNote ? (
            <p className="text-sm leading-6 text-[var(--foreground)]">{event.statusNote}</p>
          ) : null}
        </SectionCard>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <PublicInfoPanel
          label="Fecha y hora"
          value={
            <div className="space-y-2">
              <p className="font-serif text-3xl leading-none tracking-[-0.02em]">{event.startsAtDateLabel}</p>
              <p className="text-lg text-[var(--muted)]">{event.startsAtTimeLabel}</p>
            </div>
          }
        />

        <PublicInfoPanel
          label="Ubicacion"
          value={
            <div className="space-y-2">
              <p className="font-serif text-3xl leading-none tracking-[-0.02em]">
                {event.locationName ?? event.locationStatusLabel}
              </p>
              {event.locationAddress ? <p className="text-sm text-[var(--muted)]">{event.locationAddress}</p> : null}
            </div>
          }
          description={!event.locationName ? "La ubicacion todavia no puede mostrarse con mas detalle." : undefined}
        />
      </div>

      <SectionCard
        variant="editorial"
        title="Detalle del acto"
        description="Contexto y descripcion publica."
        contentClassName="space-y-5"
      >
        {event.shortDescription ? (
          <blockquote className="border-l-2 border-[color:var(--accent-soft)] pl-5 font-serif text-xl leading-8 text-[var(--muted)] italic">
            {event.shortDescription}
          </blockquote>
        ) : null}

        {!isChangeRelevant && event.statusLabel && event.statusNote ? (
          <PublicInfoPanel
            label="Estado visible"
            value={event.statusLabel}
            description={event.statusNote}
          />
        ) : null}

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href={`/${event.festivalSlug}/${event.editionSlug}`} className={buttonVariants({ variant: "link" })}>
            Ver resumen de la edicion
          </Link>
          <Link href={agendaHref} className={buttonVariants({ variant: "link" })}>
            Ver agenda completa
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}
