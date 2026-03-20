import type { ReactNode } from "react";

import { signOutAction } from "@/app/(auth)/acceso/actions";
import { CmsNav } from "@/components/cms/cms-nav";
import { requireCmsSession } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export default async function CmsLayout({ children }: { children: ReactNode }) {
  const session = await requireCmsSession();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="rounded-[28px] border border-black/8 bg-stone-950 p-6 text-white shadow-[0_28px_80px_-45px_rgba(0,0,0,0.75)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-stone-300">CMS interno</p>
            <h1 className="mt-3 font-serif text-4xl">Backoffice de Festapp</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-300">
              Fase 1 activa: Supabase real, sesion resuelta en server, middleware de proteccion y
              acceso base por rol para `admin` y `editor`.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-stone-200">
            <p className="font-semibold">{session.email ?? "Usuario interno"}</p>
            <p className="mt-1 uppercase tracking-[0.2em] text-stone-400">{session.role}</p>
            <form action={signOutAction} className="mt-4">
              <button
                type="submit"
                className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                Cerrar sesion
              </button>
            </form>
          </div>
        </div>

        <div className="mt-5">
          <CmsNav role={session.role} />
        </div>
      </header>

      {children}
    </div>
  );
}
