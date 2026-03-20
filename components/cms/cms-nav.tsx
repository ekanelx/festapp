"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cmsNavigation } from "@/lib/config/site";
import { cn } from "@/lib/utils";

export function CmsNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/cms" ? pathname === "/cms" : pathname.startsWith(href);

  return (
    <nav className="flex flex-wrap gap-2" aria-label="Secciones CMS">
      {cmsNavigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={cn(
            "inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition",
            isActive(item.href)
              ? "border-white bg-white text-stone-950"
              : "border-white/14 bg-white/6 text-stone-200 hover:bg-white/10 hover:text-white",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
