"use client";

import { useWallet } from "@/components/providers/WalletProvider";
import { ProductImage } from "@/components/ProductImage";
import { useToast, isBigPurchase } from "@/components/ui/toast";
import { track } from "@/lib/analytics";
import { formatINR } from "@/lib/format";
import { POPULAR_THRESHOLD, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

/**
 * Large visual product tile — design.md §11.
 * Hover: visual scale 1.06, purple glow, info shifts up, quick-add prominent.
 * Quick view on tap (design.md §14), instant add (plan §52.7).
 */
export function ProductTile({ product }: { product: Product }) {
  const { remaining, total, addToWallet, openQuickView, deniedProductId } = useWallet();
  const { pushToast } = useToast();

  const affordable = remaining >= product.price;
  const denied = deniedProductId === product.id;
  const popular = product.popularity >= POPULAR_THRESHOLD;

  const handleAdd = () => {
    if (!addToWallet(product)) {
      track("purchase_attempt", { productId: product.id, reason: "insufficient" });
      return;
    }
    track("product_added", { productId: product.id, price: product.price });
    if (isBigPurchase(product.price, total)) {
      pushToast({ type: "hurt", title: "THAT HURT", subtitle: String(product.price) });
    } else {
      pushToast({ type: "success", title: `${product.name} added`, subtitle: `−${formatINR(product.price)}` });
    }
  };

  return (
    <article
      className={cn(
        "product-tile glass group relative flex flex-col overflow-hidden rounded-3xl",
        denied && "shake border-error/60"
      )}
    >
      <button
        type="button"
        onClick={() => openQuickView(product)}
        aria-label={`Quick view ${product.name}`}
        className="product-visual relative block h-44 w-full cursor-pointer overflow-hidden sm:h-52"
      >
        <ProductImage product={product} className="h-full w-full" />
        <span className="absolute top-4 left-4 rounded-full border border-line-strong bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-secondary">
          {product.category}
        </span>
        {popular && (
          <span className="absolute top-4 right-4 rounded-full bg-warning/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-warning">
            🔥 Popular
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-5 transition-transform duration-500 ease-cinematic group-hover:-translate-y-0.5">
        <button
          type="button"
          onClick={() => openQuickView(product)}
          className="text-left"
        >
          <h3 className="font-display text-lg font-bold tracking-tight text-ink transition-colors group-hover:text-accent-secondary">
            {product.name}
          </h3>
        </button>
        <p className="mt-1 text-sm text-ink-secondary">{product.tagline}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-display text-xl font-bold text-accent-secondary tabular-nums">
            {formatINR(product.price)}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!affordable}
            className={cn(
              "rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ease-cinematic",
              affordable
                ? "bg-accent text-white shadow-[0_0_20px_rgb(124_92_255/0.35)] hover:bg-accent/90 hover:shadow-[0_0_32px_rgb(124_92_255/0.5)]"
                : "cursor-not-allowed bg-white/5 text-ink-muted"
            )}
          >
            {affordable ? "+ Add" : "Too rich"}
          </button>
        </div>
      </div>
    </article>
  );
}
