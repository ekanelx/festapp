import type { ReactNode } from "react";

import { signOutAction } from "@/app/(auth)/acceso/actions";
import { CmsNav } from "@/components/cms/cms-nav";
import { Button } from "@/components/ui/button";
import { requireCmsSession } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export default async function CmsLayout({ children }: { children: ReactNode }) {
  const session = await requireCmsSession();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="rounded-[28px] border border-black/8 bg-stone-950 px-5 py-4 text-white shadow-[0_28px_80px_-45px_rgba(0,0,0,0.75)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-stone-400">Festapp CMS</p>
              <h1 className="mt-1 font-serif text-2xl leading-none text-white">Operativa editorial</h1>
            </div>

            <CmsNav />
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200">
            <div className="min-w-0">
              <p className="truncate font-semibold">{session.email ?? "Usuario interno"}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-stone-400">{session.role}</p>
            </div>
            <form action={signOutAction}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                Salir
              </Button>
            </form>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
