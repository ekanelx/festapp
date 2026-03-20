import Link from "next/link";

type CmsBreadcrumb = {
  label: string;
  href?: string;
};

type CmsBreadcrumbsProps = {
  items: CmsBreadcrumb[];
};

export function CmsBreadcrumbs({ items }: CmsBreadcrumbsProps) {
  return (
    <nav
      aria-label="Ruta editorial"
      className="flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--muted-foreground)]"
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="transition hover:text-[var(--muted)]"
            >
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-[var(--muted)]">
              {item.label}
            </span>
          )}
          {index < items.length - 1 ? <span className="text-[var(--border-strong)]">/</span> : null}
        </span>
      ))}
    </nav>
  );
}
