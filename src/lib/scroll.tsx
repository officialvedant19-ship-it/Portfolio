"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/hooks";

let lenisInstance: Lenis | null = null;

export function scrollToTarget(target: string | number, offset = 0): void {
  if (typeof window === "undefined") return;
  const reduced = prefersReducedMotion();

  if (lenisInstance && !reduced) {
    lenisInstance.scrollTo(target, {
      offset,
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
    return;
  }

  const selector = target.startsWith("#") ? target : `#${target}`;
  const el = document.querySelector<HTMLElement>(selector);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }
}

export function setScrollLocked(locked: boolean): void {
  if (typeof document === "undefined") return;
  if (locked) {
    lenisInstance?.stop();
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  } else {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    lenisInstance?.start();
  }
}

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      lenisInstance = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenisInstance = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}

