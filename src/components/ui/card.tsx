"use client";

import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/** Glass surface card — design.md §3.1 glass token. */
export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn("glass rounded-3xl", className)} {...props}>
      {children}
    </div>
  );
}
