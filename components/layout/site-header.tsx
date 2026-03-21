import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { publicNavigation } from "@/lib/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 bg-[rgba(250,248,241,0.84)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="space-y-1">
          <Link href="/" className="font-serif text-2xl tracking-[-0.02em] text-stone-950">
            Festapp
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Guia publica de fiestas y actos</p>
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto text-sm">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
