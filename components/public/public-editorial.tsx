import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { MediaAsset } from "@/lib/media/utils";
import { cn } from "@/lib/utils";

type PublicMetaRowProps = {
  items: Array<ReactNode | null | undefined>;
  className?: string;
};

export function PublicMetaRow({ items, className }: PublicMetaRowProps) {
  const visibleItems = items.filter(Boolean);

  if (!visibleItems.length) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-2.5 text-sm text-[var(--muted)]", className)}>
      {visibleItems.map((item, index) => (
        <span
          key={index}
          className="inline-flex items-center rounded-full bg-[var(--surface-soft)] px-3 py-1.5"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

type PublicMediaPlaceholderProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  tone?: "terracotta" | "stone" | "night";
  className?: string;
};

const mediaToneStyles = {
  terracotta:
    "bg-[radial-gradient(circle_at_top_left,rgba(244,193,153,0.7),transparent_28%),linear-gradient(135deg,#b05d33_0%,#8c2b15_40%,#3b2e26_100%)] text-white",
  stone:
    "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_34%),linear-gradient(135deg,#f2ede3_0%,#ddd3c3_50%,#867a6f_100%)] text-[var(--foreground)]",
  night:
    "bg-[radial-gradient(circle_at_top_left,rgba(232,223,212,0.2),transparent_28%),linear-gradient(135deg,#2f2924_0%,#544a41_50%,#9b6a4f_100%)] text-white",
} as const;

export function PublicMediaPlaceholder({
  title,
  subtitle,
  badge,
  tone = "terracotta",
  className,
}: PublicMediaPlaceholderProps) {
  return (
    <div
      className={cn(
        "relative min-h-[18rem] overflow-hidden rounded-[calc(var(--radius-xl)+0.25rem)] p-5",
        mediaToneStyles[tone],
        className,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_5%,rgba(0,0,0,0.18)_100%)] opacity-70" />
      <div className="absolute -right-12 top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex h-full flex-col justify-between">
        <div>
          {badge ? <Badge variant="accent">{badge}</Badge> : null}
        </div>

        <div className="max-w-sm">
          {subtitle ? (
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-current/70">
              {subtitle}
            </p>
          ) : null}
          <p className="mt-3 font-serif text-3xl leading-[1.02] tracking-[-0.02em] text-current">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

type PublicEntityMediaProps = PublicMediaPlaceholderProps & {
  asset?: MediaAsset | null;
  priority?: boolean;
  sizes?: string;
};

export function PublicEntityMedia({
  asset,
  title,
  subtitle,
  badge,
  tone = "terracotta",
  className,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: PublicEntityMediaProps) {
  if (!asset?.publicUrl) {
    return (
      <PublicMediaPlaceholder
        title={title}
        subtitle={subtitle}
        badge={badge}
        tone={tone}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative min-h-[18rem] overflow-hidden rounded-[calc(var(--radius-xl)+0.25rem)] p-5 text-white",
        className,
      )}
    >
      <Image
        src={asset.publicUrl}
        alt={asset.altText ?? title}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,16,14,0.12)_0%,rgba(17,16,14,0.64)_100%)]" />
      <div className="absolute -right-12 top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-black/15 blur-2xl" />

      <div className="relative flex h-full flex-col justify-between">
        <div>
          {badge ? <Badge variant="accent">{badge}</Badge> : null}
        </div>

        <div className="max-w-sm">
          {subtitle ? (
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
              {subtitle}
            </p>
          ) : null}
          <p className="mt-3 font-serif text-3xl leading-[1.02] tracking-[-0.02em] text-white">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

type PublicHeroBlockProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  media: ReactNode;
  aside?: ReactNode;
  className?: string;
};

export function PublicHeroBlock({
  eyebrow,
  title,
  description,
  meta,
  actions,
  media,
  aside,
  className,
}: PublicHeroBlockProps) {
  return (
    <section
      className={cn(
        "grid gap-4 rounded-[calc(var(--radius-xl)+0.5rem)] bg-[var(--surface-layer)] p-3 shadow-[var(--shadow-ambient)] lg:grid-cols-[1.15fr_0.85fr]",
        className,
      )}
    >
      <div className="min-w-0 overflow-hidden rounded-[calc(var(--radius-xl)+0.25rem)]">{media}</div>

      <div className="flex flex-col justify-between gap-6 rounded-[calc(var(--radius-xl)+0.25rem)] bg-[var(--surface-raised)] p-5">
        <div className="space-y-4">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              {eyebrow}
            </p>
          ) : null}
          <div className="space-y-3">
            <h1 className="font-serif text-[clamp(2rem,6vw,4rem)] leading-[0.98] tracking-[-0.025em] text-[var(--foreground)]">
              {title}
            </h1>
            {description ? (
              <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">{description}</p>
            ) : null}
          </div>

          {meta}
        </div>

        <div className="space-y-4">
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          {aside}
        </div>
      </div>
    </section>
  );
}

type PublicInfoPanelProps = {
  label: string;
  value: ReactNode;
  description?: ReactNode;
  className?: string;
};

export function PublicInfoPanel({
  label,
  value,
  description,
  className,
}: PublicInfoPanelProps) {
  return (
    <section
      className={cn(
        "rounded-[calc(var(--radius-xl)-0.1rem)] bg-[var(--surface-soft)] p-5",
        className,
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <div className="mt-4 text-[var(--foreground)]">{value}</div>
      {description ? <div className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</div> : null}
    </section>
  );
}

type PublicStoryCardProps = {
  href: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  media?: ReactNode;
  ctaLabel?: string;
  className?: string;
};

export function PublicStoryCard({
  href,
  eyebrow,
  title,
  description,
  meta,
  media,
  ctaLabel = "Ver detalle",
  className,
}: PublicStoryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col gap-4 rounded-[calc(var(--radius-xl)+0.1rem)] bg-[var(--surface-raised)] p-4 shadow-[var(--shadow-ambient)] transition hover:-translate-y-px",
        className,
      )}
    >
      {media ? <div className="overflow-hidden rounded-[calc(var(--radius-xl)-0.2rem)]">{media}</div> : null}

      <div className="flex flex-1 flex-col gap-3">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-2">
          <h2 className="font-serif text-2xl leading-[1.05] tracking-[-0.02em] text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
            {title}
          </h2>
          {description ? <p className="text-sm leading-6 text-[var(--muted)]">{description}</p> : null}
        </div>

        {meta}

        <span className={cn(buttonVariants({ variant: "link" }), "mt-auto w-fit")}>{ctaLabel}</span>
      </div>
    </Link>
  );
}
