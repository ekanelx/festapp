import Link from "next/link";

import { EditionOverview } from "@/components/public/edition-overview";
import {
  PublicEntityMedia,
  PublicHeroBlock,
  PublicInfoPanel,
  PublicMetaRow,
  PublicStoryCard,
} from "@/components/public/public-editorial";
import { PublicEditionNav } from "@/components/public/public-edition-nav";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getPublicEditionPageData } from "@/lib/public/queries";

type EditionHomePageProps = {
  params: Promise<{
    festivalSlug: string;
    editionSlug: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EditionHomePage({ params }: EditionHomePageProps) {
  const resolvedParams = await params;
  const { data: edition, error } = await getPublicEditionPageData(
    resolvedParams.festivalSlug,
    resolvedParams.editionSlug,
  );

  if (error) {
    return (
      <SectionCard
        variant="editorial"
        eyebrow="Error"
        title="No se ha podido cargar esta edicion"
        description="La home de edicion ya depende de Supabase real."
      >
        <p className="text-sm text-[var(--muted)]">{error}</p>
      </SectionCard>
    );
  }

  if (!edition) {
    return (
      <SectionCard
        variant="editorial"
        eyebrow="No disponible"
        title="No encontramos esa edicion publica"
        description="Comprueba el enlace o publica la edicion correcta antes de compartirla."
      />
    );
  }

  const todayPreview = edition.todayEvents.slice(0, 3);
  const nextEvent = edition.upcomingEvents[0] ?? null;
  const changedEventsPreview = edition.changedEvents.slice(0, 3);

  return (
    <div className="space-y-8">
      <PublicEditionNav
        festivalSlug={edition.festivalSlug}
        editionSlug={edition.editionSlug}
        current="home"
      />

      <PublicHeroBlock
        eyebrow="Edicion publica"
        title={
          <>
            {edition.festivalName}
            <br />
            <span className="text-[0.72em]">{edition.editionName}</span>
          </>
        }
        description="La portada editorial de esta edicion prioriza contexto, agenda y cambios relevantes."
        media={
          <PublicEntityMedia
            asset={edition.coverMedia}
            tone="night"
            badge={edition.temporalLabel ?? "Edicion"}
            subtitle={edition.festivalCity ?? "Festapp"}
            title={edition.editionName}
            className="min-h-[20rem] sm:min-h-[24rem]"
            priority
          />
        }
        meta={
          <PublicMetaRow
            items={[
              edition.dateRangeLabel,
              edition.festivalCity,
              `${edition.allEvents.length} actos publicados`,
            ]}
          />
        }
        actions={
          <>
            <Link
              href={`/${edition.festivalSlug}/${edition.editionSlug}/agenda`}
              className={buttonVariants({ variant: "accent", size: "lg" })}
            >
              Abrir agenda
            </Link>
            {edition.temporalLabel ? <Badge variant="soft">{edition.temporalLabel}</Badge> : null}
          </>
        }
        aside={
          <div className="grid gap-3 sm:grid-cols-3">
            <PublicInfoPanel
              label="Hoy"
              value={edition.todayEvents.length}
              description="Actos visibles para hoy."
            />
            <PublicInfoPanel
              label="Con cambios"
              value={edition.changedEvents.length}
              description="Actualizados o cancelados."
            />
            <PublicInfoPanel
              label="Ciudad"
              value={edition.festivalCity ?? "Sin ciudad"}
              description="Contexto del festival."
            />
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
        <SectionCard
          variant="editorial"
          title="Contexto rapido"
          description="Lo esencial antes de entrar al programa."
          contentClassName="space-y-3"
        >
          <PublicInfoPanel label="Festival" value={edition.festivalName} />
          <PublicInfoPanel label="Fechas" value={edition.dateRangeLabel} />
          <PublicInfoPanel
            label="Siguiente paso"
            value="Consulta la agenda"
            description="El flujo principal de la app publica sigue entrando por resumen y baja a agenda y detalle."
          />
        </SectionCard>

        {changedEventsPreview.length > 0 ? (
          <SectionCard
            variant="soft"
            title="Cambios relevantes"
            description="Solo aparecen actos con cambios que merecen atencion."
            contentClassName="grid gap-4 md:grid-cols-3"
          >
            {changedEventsPreview.map((event, index) => (
              <PublicStoryCard
                key={event.id}
                href={`/${edition.festivalSlug}/${edition.editionSlug}/actos/${event.slug}`}
                eyebrow={event.statusLabel ?? "Acto"}
                title={event.title}
                description={event.changeNote ?? "Consulta el detalle actualizado del acto."}
                meta={<PublicMetaRow items={[event.startsAtDayLabel, event.startsAtTimeLabel, event.locationLabel]} />}
                media={
                  <PublicEntityMedia
                    asset={event.coverMedia}
                    tone={index === 0 ? "terracotta" : "stone"}
                    subtitle={edition.festivalName}
                    title={event.title}
                    className="min-h-[10rem]"
                    sizes="(min-width: 768px) 30vw, 100vw"
                  />
                }
                ctaLabel="Ver cambio"
              />
            ))}
          </SectionCard>
        ) : (
          <SectionCard
            variant="soft"
            title="Sin cambios relevantes"
            description="La edicion no muestra actos actualizados ni cancelados ahora mismo."
          />
        )}
      </div>

      {todayPreview.length > 0 ? (
        <EditionOverview
          title="Hoy"
          description="La agenda de hoy es lo primero que deberias ver al entrar."
          emptyMessage="Hoy no hay actos publicados para esta edicion."
          events={todayPreview}
          festivalSlug={edition.festivalSlug}
          editionSlug={edition.editionSlug}
        />
      ) : nextEvent ? (
        <SectionCard
          variant="editorial"
          title="Proximo acto"
          description="Si hoy no hay actos, adelantamos el siguiente ya publicado."
          contentClassName="space-y-3"
        >
          <PublicStoryCard
            href={`/${edition.festivalSlug}/${edition.editionSlug}/actos/${nextEvent.slug}`}
            eyebrow={edition.festivalName}
            title={nextEvent.title}
            description={nextEvent.changeNote ?? "Consulta el detalle para ver horario, ubicacion y estado."}
            meta={<PublicMetaRow items={[nextEvent.startsAtDayLabel, nextEvent.startsAtTimeLabel, nextEvent.locationLabel]} />}
            media={
              <PublicEntityMedia
                asset={nextEvent.coverMedia}
                tone="stone"
                subtitle="Siguiente en agenda"
                title={nextEvent.title}
                className="min-h-[12rem]"
                sizes="(min-width: 1280px) 48vw, 100vw"
              />
            }
            ctaLabel="Abrir acto"
          />
        </SectionCard>
      ) : (
        <SectionCard
          variant="editorial"
          title="Sin actos visibles por ahora"
          description="Todavia no hay un siguiente acto publicado para esta edicion."
        />
      )}
    </div>
  );
}
