import type { ReactNode } from "react";

import { CmsNav } from "@/components/cms/cms-nav";

export default function CmsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="rounded-[28px] border border-black/8 bg-stone-950 p-6 text-white shadow-[0_28px_80px_-45px_rgba(0,0,0,0.75)]">
        <p className="text-sm uppercase tracking-[0.24em] text-stone-300">CMS interno</p>
        <h1 className="mt-3 font-serif text-4xl">Base del backoffice de Festapp</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-300">
          En esta fase solo dejamos separada la superficie privada, la navegacion base y la
          estructura que usara autenticacion Supabase y roles `admin` / `editor`.
        </p>
        <div className="mt-5">
          <CmsNav />
        </div>
      </header>

      {children}
    </div>
  );
}

