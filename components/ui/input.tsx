import type { InputHTMLAttributes } from "react";

import { controlBaseClassName } from "@/components/ui/control";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        controlBaseClassName,
        "min-h-11 px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}
