"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Smoothly animates towards `target` with cubic ease-out (design.md §9 easing feel).
 * Respects prefers-reduced-motion by snapping instantly.
 */
export function useAnimatedNumber(target: number, duration = 700): number {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);
  const rafRef = useRef(0);

  useEffect(() => {
    const from = valueRef.current;
    if (from === target) return;

    // Reduced motion → collapse the duration to 0 so the first frame lands exactly
    // on target. Keeps every setState() inside the rAF callback (no cascading render).
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = prefersReduced ? 0 : duration;

    const start = performance.now();
    const step = (now: number) => {
      const t = ms <= 0 ? 1 : Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;
      valueRef.current = next;
      setValue(next);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}
