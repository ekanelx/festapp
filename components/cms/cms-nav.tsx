import Link from "next/link";

import { cmsNavigation } from "@/lib/config/site";
import type { AppRole } from "@/lib/domain/types";

type CmsNavProps = {
  role: AppRole;
};

export function CmsNav({ role }: CmsNavProps) {
  const items = cmsNavigation.filter((item) => role === "admin" || item.href !== "/cms/catalogo");

  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm text-stone-700 transition hover:bg-stone-950 hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
