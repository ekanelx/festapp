import type { SelectHTMLAttributes } from "react";

import { controlBaseClassName } from "@/components/ui/control";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        controlBaseClassName,
        "min-h-11 px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}
