// ProductImage — free real photo with emoji fallback.
// Uses plain <img> (not next/image) so `output: export` + Firebase Hosting stays free + simple.
// If the CDN photo fails offline, the emoji gradient shows instead — game never breaks.
"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

export function ProductImage({
  product,
  className,
  imgClassName,
  eager = false,
}: {
  product: Product;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      aria-hidden
      className={cn("relative block overflow-hidden", className)}
      style={{
        background: `radial-gradient(120% 120% at 50% 10%, ${product.gradient[0]}, ${product.gradient[1]})`,
      }}
    >
      {!failed ? (
        <img
          src={product.image}
          alt=""
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover transition-transform duration-500 ease-cinematic group-hover:scale-105", imgClassName)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-6xl drop-shadow-[0_8px_24px_rgb(0_0_0/0.45)]">
          {product.emoji}
        </span>
      )}
      {/* soft bottom shade so price/badges stay readable over photo */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
    </span>
  );
}
