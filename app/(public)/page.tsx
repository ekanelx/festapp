import Link from "next/link";

import {
  PublicEntityMedia,
  PublicHeroBlock,
  PublicInfoPanel,
  PublicMetaRow,
  PublicStoryCard,
} from "@/components/public/public-editorial";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getPublicHomeEditionItems } from "@/lib/public/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: editions, error } = await getPublicHomeEditionItems();

  if (error) {
    return (
      <SectionCard
        variant="editorial"
        eyebrow="Error"
        title="No se ha podido cargar Festapp"
        description="La home publica ya depende de Supabase real."
      >
        <p className="text-sm text-[var(--muted)]">{error}</p>
      </SectionCard>
    );
  }

  if (!editions || editions.length === 0) {
    return (
      <SectionCard
        variant="editorial"
        eyebrow="Sin contenido"
        title="No hay ediciones publicas activas o proximas"
        description="Cuando exista al menos una edicion publicada vigente o cercana, aparecera aqui."
      />
    );
  }

  const [featuredEdition, ...upcomingEditions] = editions;

  return (
    <div className="space-y-10">
      <PublicHeroBlock
        eyebrow="Fiesta destacada"
        title={
          <>
            {featuredEdition.festivalName}
            <br />
            <span className="text-[0.72em]">{featuredEdition.editionName}</span>
          </>
        }
        description="Una lectura rapida para decidir a que edicion entrar ahora."
        media={
          <PublicEntityMedia
            asset={featuredEdition.festivalCoverMedia}
            tone="terracotta"
            badge={featuredEdition.temporalLabel}
            subtitle={featuredEdition.festivalCity ?? "Festapp"}
            title={featuredEdition.festivalName}
            className="min-h-[20rem] sm:min-h-[26rem]"
            priority
          />
        }
        meta={
          <PublicMetaRow
            items={[
              featuredEdition.dateRangeLabel,
              featuredEdition.festivalCity,
              `${featuredEdition.publishedEventsCount} actos publicados`,
            ]}
          />
        }
        actions={
          <>
            <Link
              href={`/${featuredEdition.festivalSlug}/${featuredEdition.editionSlug}`}
              className={buttonVariants({ variant: "accent", size: "lg" })}
            >
              Ver edicion destacada
            </Link>
            <Badge variant="soft">{featuredEdition.temporalLabel}</Badge>
          </>
        }
        aside={
          <div className="grid gap-3 sm:grid-cols-2">
            <PublicInfoPanel
              label="Ahora"
              value={featuredEdition.temporalLabel}
              description="La portada prioriza la edicion en curso o la siguiente mas cercana."
            />
            <PublicInfoPanel
              label="Contexto"
              value={featuredEdition.festivalCity ?? "Ciudad por confirmar"}
              description={featuredEdition.dateRangeLabel}
            />
          </div>
        }
      />

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Proximas ediciones
            </p>
            <h2 className="mt-2 font-serif text-4xl leading-none tracking-[-0.02em] text-[var(--foreground)]">
              Lo siguiente en Festapp
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[var(--muted)]">
            El tono visual toma la calma editorial de Stitch, pero la decision sigue siendo practica:
            ciudad, fechas y acceso rapido.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {upcomingEditions.length ? (
            upcomingEditions.map((edition, index) => (
              <PublicStoryCard
                key={`${edition.festivalSlug}-${edition.editionSlug}`}
                href={`/${edition.festivalSlug}/${edition.editionSlug}`}
                eyebrow={edition.festivalCity ?? "Edicion publica"}
                title={edition.festivalName}
                description={edition.editionName}
                meta={
                  <PublicMetaRow
                    items={[edition.dateRangeLabel, `${edition.publishedEventsCount} actos`, edition.temporalLabel]}
                  />
                }
                media={
                  <PublicEntityMedia
                    asset={edition.festivalCoverMedia}
                    tone={index % 2 === 0 ? "stone" : "night"}
                    badge={edition.temporalLabel}
                    subtitle={edition.festivalCity ?? "Festapp"}
                    title={edition.festivalName}
                    className="min-h-[13rem]"
                    sizes="(min-width: 1280px) 28vw, (min-width: 768px) 44vw, 100vw"
                  />
                }
                ctaLabel="Abrir edicion"
              />
            ))
          ) : (
            <SectionCard
              variant="soft"
              title="Sin mas ediciones por ahora"
              description="Cuando se publiquen nuevas ediciones, apareceran aqui."
            />
          )}
        </div>
      </section>
    </div>
  );
}
