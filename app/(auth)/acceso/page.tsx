import Link from "next/link";
import { redirect } from "next/navigation";

import { signInAction } from "@/app/(auth)/acceso/actions";
import { SectionCard } from "@/components/shared/section-card";
import {
  CMS_HOME_PATH,
  getCmsLoginReasonLabel,
  getOptionalCmsSession,
  sanitizeCmsRedirect,
} from "@/lib/cms/auth";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type AccessPageProps = {
  searchParams?: Promise<{
    next?: string;
    error?: string;
    message?: string;
    reason?: string;
  }>;
};

export default async function AccessPage({ searchParams }: AccessPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const nextPath = sanitizeCmsRedirect(params?.next);
  const isConfigured = hasSupabaseEnv();
  const session = isConfigured ? await getOptionalCmsSession() : null;

  if (session) {
    redirect(nextPath || CMS_HOME_PATH);
  }

  const infoMessage = params?.message ?? getCmsLoginReasonLabel(params?.reason);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10 sm:px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] border border-black/8 bg-stone-950 p-6 text-white shadow-[0_32px_90px_-50px_rgba(0,0,0,0.75)] sm:p-8">
          <p className="text-sm uppercase tracking-[0.26em] text-stone-300">Festapp CMS</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight">Acceso interno para admin y editor</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-stone-300">
            Esta fase conecta la app con Supabase real y protege `/cms` con sesion y rol
            interno. Solo entran usuarios con fila activa en `internal_users`.
          </p>

          <div className="mt-8 space-y-4 text-sm text-stone-300">
            <p>Incluye en Fase 1: login, logout, middleware, verificacion de rol y consultas minimas reales.</p>
            <p>No incluye todavia: CRUD completo, flujo editorial avanzado, push, IA ni importacion.</p>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Volver a la portada
            </Link>
          </div>
        </section>

        <SectionCard
          eyebrow="Login"
          title="Inicia sesion en el CMS"
          description="Usa un usuario de Supabase Auth que exista tambien en `internal_users` y este activo."
        >
          {!isConfigured ? (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Configura `.env.local` con las variables de Supabase antes de validar el login real.
            </div>
          ) : null}

          <form action={signInAction} className="space-y-4">
            <input type="hidden" name="next" value={nextPath} />

            <label className="block space-y-2">
              <span className="text-sm font-medium text-stone-700">Email</span>
              <input
                required
                name="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-950"
                placeholder="equipo@festapp.local"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-stone-700">Password</span>
              <input
                required
                name="password"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-950"
                placeholder="Tu password"
              />
            </label>

            {params?.error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {params.error}
              </div>
            ) : null}

            {infoMessage ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {infoMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!isConfigured}
              className="w-full rounded-full bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#9b2c16]"
            >
              Entrar al CMS
            </button>
          </form>
        </SectionCard>
      </div>
    </main>
  );
}
