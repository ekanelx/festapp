import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
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
      className="sticky top-[4.5rem] z-10 flex items-center gap-2 overflow-x-auto rounded-full bg-[rgba(250,248,241,0.88)] p-1.5 shadow-[var(--shadow-ambient)] backdrop-blur-xl"
    >
      {items.map((item) => {
        const isActive = item.key === current;

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              buttonVariants({
                variant: isActive ? "accent" : "ghost",
                size: "sm",
              }),
              isActive ? null : "hover:bg-white/80",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
