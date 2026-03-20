import type { LabelHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type FormFieldProps = LabelHTMLAttributes<HTMLLabelElement> & {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
};

export function FormField({
  label,
  hint,
  children,
  className,
  ...props
}: FormFieldProps) {
  return (
    <label className={cn("grid gap-2", className)} {...props}>
      <span className="text-sm font-semibold text-[var(--foreground)]">{label}</span>
      {children}
      {hint ? <p className="text-xs leading-5 text-[var(--muted-foreground)]">{hint}</p> : null}
    </label>
  );
}

type CheckboxFieldProps = LabelHTMLAttributes<HTMLLabelElement> & {
  label: ReactNode;
  description?: ReactNode;
  checkbox: ReactNode;
};

export function CheckboxField({
  label,
  description,
  checkbox,
  className,
  ...props
}: CheckboxFieldProps) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)] shadow-[var(--shadow-control)]",
        className,
      )}
      {...props}
    >
      {checkbox}
      <span className="min-w-0">
        <span className="font-medium">{label}</span>
        {description ? (
          <span className="mt-1 block text-xs leading-5 text-[var(--muted-foreground)]">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
