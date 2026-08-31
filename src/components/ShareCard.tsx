"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { track } from "@/lib/analytics";
import { formatINR } from "@/lib/format";
import type { Personality } from "@/lib/personality";

type ShareState = "idle" | "shared" | "copied";

/** Share card — plan §11 layout: given / spent / personality / biggest flex / left. */
export function ShareCard({ personality }: { personality: Personality }) {
  const { spent, total, purchases } = useWallet();
  const [state, setState] = useState<ShareState>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const biggest = purchases.reduce<null | (typeof purchases)[number]>(
    (best, p) => (!best || p.price * p.qty > best.price * best.qty ? p : best),
    null
  );
  const message = `KHARCH KARO 💸 — I was given ${formatINR(total)}, I spent ${formatINR(
    spent
  )} and became ${personality.emoji} ${personality.name}. Biggest flex: ${
    biggest ? biggest.name : "nothing (yet)"
  }. Money left: ${formatINR(Math.max(0, total - spent))}. Can you do better? Zero real rupees.`;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const finishWith = (next: ShareState) => {
    setState(next);
    timeoutRef.current = setTimeout(() => setState("idle"), 2400);
  };

  const handleShare = async () => {
    track("share_clicked", { personality: personality.id });
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Kharch Karo 💸", text: message });
        finishWith("shared");
        return;
      } catch {
        return; // user cancelled
      }
    }
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      /* clipboard unavailable — still show feedback */
    }
    finishWith("copied");
  };

  const handleWhatsApp = () => {
    track("share_clicked", { channel: "whatsapp" });
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  };

  const handleCopy = async () => {
    track("share_clicked", { channel: "copy" });
    try {
      await navigator.clipboard.writeText(message);
      finishWith("copied");
    } catch {
      finishWith("copied");
    }
  };

  const rows: Array<[string, string]> = [
    ["I was given", formatINR(total)],
    ["I spent", formatINR(spent)],
    ["Biggest flex", biggest ? `${biggest.emoji} ${biggest.name}` : "Nothing yet"],
    ["Money left", formatINR(Math.max(0, total - spent))],
  ];

  return (
    <div className="glass rounded-3xl p-6 text-center">
      <p className="font-display text-lg font-bold tracking-[0.2em] text-accent uppercase">
        Kharch Karo 💸
      </p>
      <p
        className="mt-2 font-display text-xl font-bold"
        style={{ color: personality.color }}
      >
        <span aria-hidden>{personality.emoji}</span> {personality.name}
      </p>

      <dl className="mt-4 space-y-1.5 text-left">
        {rows.map(([label, val]) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-2 text-sm"
          >
            <dt className="text-ink-muted">{label}</dt>
            <dd className="font-display font-bold text-ink tabular-nums">{val}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-xs text-ink-muted">&ldquo;Can you do better?&rdquo;</p>

      <button
        type="button"
        onClick={handleShare}
        className="mt-4 w-full rounded-full bg-accent py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgb(124_92_255/0.35)] transition-all duration-300 hover:bg-accent/90"
      >
        {state === "shared"
          ? "✓ Shared"
          : state === "copied"
            ? "✓ Copied to clipboard"
            : "Share my damage →"}
      </button>

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={handleWhatsApp}
          className="flex-1 rounded-full border border-success/40 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-success transition-colors hover:bg-success/10"
        >
          WhatsApp
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 rounded-full border border-line-strong py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-secondary transition-colors hover:border-accent hover:text-accent"
        >
          {state === "copied" ? "✓ Copied" : "Copy result"}
        </button>
      </div>
    </div>
  );
}
