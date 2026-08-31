"use client";

import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "accent" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

/** design.md buttons: rounded, confident, uppercase tracking, glow on primary actions. */
export function Button({
  children,
  variant = "default",
  size = "default",
  className,
  ...props
}: ButtonProps) {
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    default:
      "bg-accent text-white shadow-[0_0_24px_rgb(124_92_255/0.35)] hover:bg-accent/90 hover:shadow-[0_0_36px_rgb(124_92_255/0.5)]",
    accent:
      "bg-accent-secondary text-bg shadow-[0_0_24px_rgb(0_229_255/0.25)] hover:bg-accent-secondary/90",
    outline: "glass border-line-strong text-ink hover:border-accent hover:text-accent",
    ghost: "text-ink-secondary hover:bg-white/5 hover:text-ink",
  };

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "h-9 px-4 text-[11px]",
    default: "h-11 px-6 text-xs",
    lg: "h-13 px-8 text-sm",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-[0.14em] transition-all duration-300 ease-cinematic focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
