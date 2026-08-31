"use client";

import { cn } from "@/lib/utils";

/** Empty state — plan §28 / design.md production-quality states. */
export function EmptyState({
  emoji = "🔍",
  title,
  subtitle,
  className,
}: {
  emoji?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass flex flex-col items-center justify-center rounded-3xl px-6 py-14 text-center",
        className
      )}
    >
      <span aria-hidden className="text-4xl opacity-70">
        {emoji}
      </span>
      <p className="mt-4 font-display text-lg font-bold tracking-tight text-ink">{title}</p>
      {subtitle && <p className="mt-1 max-w-sm text-sm text-ink-secondary">{subtitle}</p>}
    </div>
  );
}
