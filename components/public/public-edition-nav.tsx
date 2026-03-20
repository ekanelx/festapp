import Link from "next/link";

import { cn } from "@/lib/utils";

type PublicEditionNavProps = {
  festivalSlug: string;
  editionSlug: string;
  current: "home" | "agenda";
};

export function PublicEditionNav({
  festivalSlug,
  editionSlug,
  current,
}: PublicEditionNavProps) {
  const items = [
    {
      key: "home",
      label: "Resumen",
      href: `/${festivalSlug}/${editionSlug}`,
    },
    {
      key: "agenda",
      label: "Agenda",
      href: `/${festivalSlug}/${editionSlug}/agenda`,
    },
  ] as const;

  return (
    <nav
      aria-label="Navegacion de la edicion"
      className="flex items-center gap-2 overflow-x-auto rounded-full border border-black/8 bg-white/80 p-1 shadow-[0_18px_45px_-35px_rgba(73,44,24,0.5)]"
    >
      {items.map((item) => {
        const isActive = item.key === current;

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              isActive
                ? "bg-stone-950 text-white"
                : "text-stone-700 hover:bg-stone-100",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
