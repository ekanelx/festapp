import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost" | "link" | "danger" | "accent";
type ButtonSize = "sm" | "default" | "lg";

const buttonVariantStyles: Record<ButtonVariant, string> = {
  default:
    "ui-button-default border border-[color:var(--primary)] bg-[var(--primary)] shadow-[0_16px_32px_-18px_rgba(30,27,22,0.9)] hover:bg-[var(--primary-hover)] hover:shadow-[0_20px_36px_-20px_rgba(30,27,22,0.95)] focus-visible:ring-[var(--focus-ring)]",
  outline:
    "ui-button-outline border border-[color:var(--border-strong)] bg-[rgba(255,255,255,0.96)] shadow-[var(--shadow-control)] hover:border-[color:var(--foreground)] hover:bg-[var(--surface-strong)] focus-visible:ring-[var(--focus-ring)]",
  ghost:
    "ui-button-ghost bg-transparent hover:bg-black/6 focus-visible:ring-[var(--focus-ring)]",
  link: "ui-button-link min-h-0 rounded-none bg-transparent px-0 py-0 hover:underline underline-offset-4 focus-visible:ring-[var(--focus-ring)]",
  danger: "ui-button-danger border border-[color:var(--danger)] bg-[var(--danger)] shadow-[0_16px_32px_-18px_rgba(155,44,22,0.7)] hover:bg-[var(--accent-hover)] focus-visible:ring-[var(--focus-ring)]",
  accent:
    "ui-button-accent border border-[#7e2b14] bg-[image:var(--accent-gradient)] shadow-[0_18px_30px_-18px_rgba(140,43,21,0.7)] hover:brightness-[1.04] hover:shadow-[0_22px_36px_-22px_rgba(140,43,21,0.78)] focus-visible:ring-[var(--focus-ring)]",
};

const buttonSizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3.5 py-2 text-sm",
  default: "min-h-11 px-[1.125rem] py-2.5 text-sm",
  lg: "min-h-12 px-5 py-3 text-sm",
};

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "ui-button inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold tracking-[0.01em] transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-55",
    buttonVariantStyles[variant],
    variant === "link" ? null : buttonSizeStyles[size],
    className,
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
