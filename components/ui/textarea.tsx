import type { TextareaHTMLAttributes } from "react";

import { controlBaseClassName } from "@/components/ui/control";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        controlBaseClassName,
        "min-h-24 px-4 py-3 leading-6",
        className,
      )}
      {...props}
    />
  );
}
