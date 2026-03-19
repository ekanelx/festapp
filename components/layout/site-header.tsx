import Link from "next/link";

import { publicNavigation } from "@/lib/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/8 bg-[#f7efe3]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div>
          <Link href="/" className="font-serif text-xl text-stone-950">
            Festapp
          </Link>
          <p className="text-xs text-stone-600">Consulta rapida de fiestas desde movil</p>
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto text-sm">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-stone-700 transition hover:bg-stone-950 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

