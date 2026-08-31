"use client";

import { useState } from "react";
import { ProductTile } from "@/components/ProductTile";
import { useWallet } from "@/components/providers/WalletProvider";
import { track } from "@/lib/analytics";
import { CATEGORIES, PRODUCTS, trendingProducts, type Category } from "@/lib/products";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

type Filter = "Trending" | "All" | Category;

/** Spending floor — typographic category discovery (design.md §12) + trending (plan §6). */
export function SpendingExperience() {
  const [filter, setFilter] = useState<Filter>("All");
  const { remaining, deniedProductId } = useWallet();

  const visible =
    filter === "All"
      ? PRODUCTS
      : filter === "Trending"
        ? trendingProducts(8)
        : PRODUCTS.filter((p) => p.category === filter);

  const filters: Filter[] = ["Trending", "All", ...CATEGORIES];

  const changeFilter = (next: Filter) => {
    setFilter(next);
    track("category_viewed", { category: next });
  };

  return (
    <section id="spend" className="scroll-mt-28" aria-label="Spending experience">
      {/* Category discovery — design.md §12 large typographic list */}
      <div className="mb-8 flex flex-wrap items-baseline gap-x-6 gap-y-3">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
          The Collection
        </h2>
        {filters.map((option, i) => (
          <button
            key={option}
            type="button"
            onClick={() => changeFilter(option)}
            aria-pressed={filter === option}
            className={cn(
              "group flex items-baseline gap-1.5 font-display text-sm font-bold uppercase tracking-[0.14em] transition-all duration-300",
              filter === option ? "text-accent" : "text-ink-muted hover:text-ink"
            )}
          >
            {option !== "Trending" && option !== "All" && (
              <span className="text-[10px] font-semibold text-ink-muted/70">
                {String(i - 1).padStart(2, "0")}
              </span>
            )}
            {option === "Trending" ? "🔥 Trending" : option}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          subtitle="This category is still being stocked with imaginary luxury. Try another one."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Denial feedback fallback when the wallet HUD is off-screen (mobile) */}
      {deniedProductId && remaining > 0 && (
        <p role="status" className="mt-6 text-center text-xs text-error">
          Some items in view exceed your remaining balance. The fantasy has limits. 💀
        </p>
      )}
      {remaining <= 0 && !deniedProductId && (
        <p className="mt-6 text-center text-xs text-ink-muted">
          Wallet at ₹0 — your Damage Report is on screen.
        </p>
      )}
    </section>
  );
}
