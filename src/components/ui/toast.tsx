"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { formatINR } from "@/lib/format";

interface Toast {
  id: number;
  type: "success" | "hurt";
  title: string;
  subtitle?: string;
}

const ToastContext = createContext<{ pushToast: (t: Omit<Toast, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, t.type === "hurt" ? 1000 : 2600);
    timers.current.push(timer);
  }, []);

  const success = toasts.filter((t) => t.type === "success");
  const hurt = toasts.find((t) => t.type === "hurt");

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}

      {/* Success toasts — design.md §28 "Toast notifications" */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed top-24 left-1/2 z-90 flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4"
      >
        {success.map((t) => (
          <div
            key={t.id}
            className="glass-strong fade-scale-in rounded-full border-success/40 px-5 py-2.5 text-center"
          >
            <p className="text-sm font-semibold text-success">✓ {t.title}</p>
            {t.subtitle && (
              <p className="text-xs text-ink-secondary tabular-nums">{t.subtitle}</p>
            )}
          </div>
        ))}
      </div>

      {/* Big-purchase "THAT HURT" — plan §29 */}
      {hurt && (
        <div
          key={hurt.id}
          aria-live="assertive"
          className="pointer-events-none fixed inset-0 z-90 flex flex-col items-center justify-center"
        >
          <div className="hurt-in flex flex-col items-center">
            <span aria-hidden className="text-8xl">
              💸
            </span>
            <p className="mt-4 font-display text-5xl font-bold tracking-tight text-error sm:text-7xl">
              THAT HURT
            </p>
            {hurt.subtitle && (
              <p className="mt-3 font-display text-2xl font-bold text-ink tabular-nums">
                −{formatINR(Number(hurt.subtitle))}
              </p>
            )}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

/** Big-purchase threshold — plan §29 "THAT HURT" animation. */
export function isBigPurchase(amount: number, total: number): boolean {
  return amount >= Math.max(total * 0.15, 10_000);
}
