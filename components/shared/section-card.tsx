import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  eyebrow,
  description,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-black/8 bg-white/80 p-5 shadow-[0_24px_70px_-40px_rgba(73,44,24,0.5)] backdrop-blur",
        className,
      )}
    >
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-serif text-2xl text-stone-950">{title}</h2>
        {description ? <p className="text-sm text-stone-600">{description}</p> : null}
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}

