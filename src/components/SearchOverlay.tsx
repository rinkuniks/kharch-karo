"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { useToast, isBigPurchase } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/empty-state";
import { track } from "@/lib/analytics";
import { formatINR } from "@/lib/format";
import { PRODUCTS, trendingProducts } from "@/lib/products";
import { cn } from "@/lib/utils";

/** Full-screen search — design.md §17, plan §36 (Ctrl+K, tags, trending). */
export function SearchOverlay() {
  const { searchOpen, setSearchOpen, addToWallet, remaining, total } = useWallet();
  const { pushToast } = useToast();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen, setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => {
        document.body.style.overflow = prev;
        clearTimeout(t);
      };
    }
  }, [searchOpen]);

  if (!searchOpen) return null;

  const q = query.trim().toLowerCase();
  const results = q
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.includes(q))
      )
    : trendingProducts(8);

  const handleAdd = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    if (!addToWallet(product)) {
      track("purchase_attempt", { productId: product.id, reason: "insufficient" });
      pushToast({
        type: "success",
        title: "Not enough balance",
        subtitle: "Drop something first 💀",
      });
      return;
    }
    track("product_added", { productId: product.id, source: "search" });
    if (isBigPurchase(product.price, total)) {
      pushToast({ type: "hurt", title: "THAT HURT", subtitle: String(product.price) });
    } else {
      pushToast({
        type: "success",
        title: `${product.name} added`,
        subtitle: `−${formatINR(product.price)}`,
      });
    }
  };

  /* ---- OVERLAY JSX APPENDED BELOW ---- */

  return (
    <div className="fixed inset-0 z-85 flex items-start justify-center bg-bg/90 px-4 pt-24 pb-8 backdrop-blur-xl">
      <button
        type="button"
        aria-label="Close search"
        onClick={() => setSearchOpen(false)}
        className="absolute inset-0 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="fade-scale-in relative w-full max-w-2xl"
      >
        <div className="glass-strong flex items-center gap-3 rounded-2xl px-5 py-4">
          <span aria-hidden className="text-lg text-ink-muted">
            ⌕
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="w-full bg-transparent font-display text-lg font-bold text-ink outline-none placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-ink-muted"
          />
          <kbd className="hidden rounded border border-line-strong px-2 py-0.5 text-[10px] font-semibold text-ink-muted sm:inline">
            ESC
          </kbd>
        </div>

        <div className="mt-4 max-h-[65svh] overflow-y-auto rounded-2xl">
          {!q && (
            <div className="mb-3 flex flex-wrap items-center gap-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-muted">
                Trending
              </span>
              {trendingProducts(5).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setQuery(p.name)}
                  className="rounded-full border border-line bg-white/5 px-3 py-1 text-xs text-ink-secondary transition-colors hover:border-accent hover:text-accent"
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}

          {results.length === 0 ? (
            <EmptyState
              title={`Nothing for "${query}"`}
              subtitle="Even imaginary money can't buy that. Try 'biryani', 'bmw' or 'goa'."
            />
          ) : (
            <ul className="space-y-2">
              {results.map((p) => {
                const affordable = remaining >= p.price;
                return (
                  <li
                    key={p.id}
                    className="glass flex items-center gap-3 rounded-2xl px-4 py-3"
                  >
                    <span aria-hidden className="text-2xl">
                      {p.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">
                        {p.name}
                      </span>
                      <span className="block truncate text-xs text-ink-muted">
                        {p.tagline} · {p.category}
                      </span>
                    </span>
                    <span className="font-display text-sm font-bold text-accent-secondary tabular-nums">
                      {formatINR(p.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdd(p.id)}
                      disabled={!affordable}
                      className={cn(
                        "rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition-all duration-300",
                        affordable
                          ? "bg-accent text-white hover:bg-accent/90"
                          : "cursor-not-allowed bg-white/5 text-ink-muted"
                      )}
                    >
                      {affordable ? "Add" : "Too rich"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
