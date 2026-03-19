import Link from "next/link";

import { SectionCard } from "@/components/shared/section-card";
import { siteConfig } from "@/lib/config/site";

const publicBasePath = `/${siteConfig.demoFestivalSlug}/${siteConfig.demoEditionSlug}`;

export default function LandingPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-black/8 bg-stone-950 px-5 py-8 text-stone-50 shadow-[0_30px_90px_-45px_rgba(0,0,0,0.7)] sm:px-8">
        <p className="text-sm uppercase tracking-[0.26em] text-stone-300">Fase 0</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
          Base tecnica inicial para lanzar Festapp por fases y sin complejidad prematura.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-300 sm:text-base">
          Esta entrega no construye Festapp completa: deja listo el scaffold, la direccion de
          arquitectura, el esquema relacional inicial y las rutas minimas para arrancar primero
          con catalogo publico y CMS basico.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={publicBasePath}
            className="rounded-full bg-[#f1b98b] px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
          >
            Abrir demo publica
          </Link>
          <Link
            href="/cms"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Abrir shell CMS
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          eyebrow="Arquitectura"
          title="Direccion tecnica inicial"
          description="Next.js App Router para UI, Supabase para datos y auth, rutas publicas y privadas separadas, y dominio centrado en fiesta > edicion > acto."
        >
          <ul className="space-y-3 text-sm text-stone-700">
            <li>Catalogo publico server-first con filtros y estado en URL.</li>
            <li>CMS en area separada para auth y roles internos.</li>
            <li>Schema SQL con estados explicitos, trazabilidad y base para futuras integraciones.</li>
            <li>Favoritos previstos en cliente local, no en base de datos, para mantener v1 ligera.</li>
          </ul>
        </SectionCard>

        <SectionCard
          eyebrow="Alcance"
          title="Lo que queda listo ahora"
          description="Se prepara la estructura del proyecto, no la funcionalidad completa."
        >
          <ul className="space-y-3 text-sm text-stone-700">
            <li>Rutas publicas: home de edicion, agenda, alertas, historico y detalle.</li>
            <li>Rutas privadas: resumen CMS, actos, alertas y catalogo.</li>
            <li>Documentacion de arquitectura y plan de implementacion por fases.</li>
            <li>Migration inicial de Supabase con RLS base y enums del dominio.</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
