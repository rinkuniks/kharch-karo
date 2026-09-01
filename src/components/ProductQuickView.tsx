"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useWallet } from "@/components/providers/WalletProvider";
import { useToast, isBigPurchase } from "@/components/ui/toast";
import { track } from "@/lib/analytics";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Product quick view — design.md §14 split layout + §28 quick view micro-interaction. */
export function ProductQuickView() {
  const { quickView, closeQuickView, addToWallet, remaining, total, deniedProductId } =
    useWallet();
  const { pushToast } = useToast();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [quickView]);

  if (!quickView) return null;

  const product = quickView;
  const lineTotal = product.price * qty;
  const affordable = remaining >= lineTotal;
  const denied = deniedProductId === product.id;

  const handleAdd = () => {
    if (!addToWallet(product, qty)) {
      track("purchase_attempt", { productId: product.id, qty, reason: "insufficient" });
      return;
    }
    track("product_added", { productId: product.id, qty, source: "quick_view" });
    if (isBigPurchase(lineTotal, total)) {
      pushToast({ type: "hurt", title: "THAT HURT", subtitle: String(lineTotal) });
    } else {
      pushToast({
        type: "success",
        title: `${qty}× ${product.name} added`,
        subtitle: `−${formatINR(lineTotal)}`,
      });
    }
    closeQuickView();
  };

  return (
    <Modal open onClose={closeQuickView} label={`Quick view ${product.name}`}>
      <div className="grid sm:grid-cols-2">
        <div
          className="relative flex h-48 items-center justify-center sm:h-full sm:min-h-80"
          style={{
            background: `radial-gradient(120% 120% at 50% 10%, ${product.gradient[0]}, ${product.gradient[1]})`,
          }}
        >
          <span aria-hidden className="text-8xl drop-shadow-[0_8px_24px_rgb(0_0_0/0.45)]">
            {product.emoji}
          </span>
          <span className="absolute top-4 left-4 rounded-full border border-line-strong bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-secondary">
            {product.category}
          </span>
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
              {product.name}
            </h3>
            <button
              type="button"
              onClick={closeQuickView}
              aria-label="Close quick view"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-secondary transition-colors hover:border-line-strong hover:text-ink"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-sm text-ink-secondary">{product.tagline}</p>
          <p className="mt-4 font-display text-3xl font-bold text-accent-secondary tabular-nums">
            {formatINR(product.price)}
          </p>

          {/* Qty stepper — design.md §14 */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted">
              Qty
            </span>
            <div className="flex items-center gap-3 rounded-full border border-line-strong px-2 py-1">
              <button
                type="button"
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                aria-label="Decrease quantity"
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-white/10"
              >
                −
              </button>
              <span className="w-6 text-center font-display font-bold text-ink tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((n) => Math.min(10, n + 1))}
                aria-label="Increase quantity"
                className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-white/10"
              >
                +
              </button>
            </div>
            <span className="text-xs text-ink-muted tabular-nums">
              = {formatINR(lineTotal)}
            </span>
          </div>

          {denied && (
            <p className="fade-scale-in mt-4 rounded-xl border border-error/30 bg-error/10 px-4 py-2.5 text-xs text-error">
              Insufficient balance for {qty}× {product.name}. The fantasy has limits. 💀
            </p>
          )}

          <button
            type="button"
            onClick={handleAdd}
            disabled={!affordable}
            className={cn(
              "mt-6 w-full rounded-full py-3.5 text-xs font-bold uppercase tracking-[0.16em] transition-all duration-300 ease-cinematic",
              affordable
                ? "bg-accent text-white shadow-[0_0_28px_rgb(124_92_255/0.4)] hover:bg-accent/90"
                : "cursor-not-allowed bg-white/5 text-ink-muted"
            )}
          >
            {affordable ? `Add to wallet grave — ${formatINR(lineTotal)}` : "Too rich for you"}
          </button>
          <p className="mt-3 text-center text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            Virtual money only. Zero real rupees.
          </p>
        </div>
      </div>
    </Modal>
  );
}
