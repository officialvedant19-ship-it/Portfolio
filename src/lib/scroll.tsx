"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/hooks";

let lenisInstance: Lenis | null = null;
let scrollLocked = false;

export function setScrollLocked(locked: boolean): void {
  if (typeof document === "undefined") return;
  if (locked === scrollLocked) return;
  scrollLocked = locked;

  if (locked) {
    lenisInstance?.stop();
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";
    document.body.style.touchAction = "none";
  } else {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.documentElement.style.overscrollBehavior = "";
    document.body.style.overscrollBehavior = "";
    document.body.style.touchAction = "";
    lenisInstance?.start();
    lenisInstance?.resize();
  }
}

export function scrollToTarget(target: string | number, offset = 0): void {
  if (typeof window === "undefined") return;

  // Ensure scroll is unlocked and Lenis is running before navigating
  if (scrollLocked) {
    setScrollLocked(false);
  }

  const reduced = prefersReducedMotion();

  if (lenisInstance && !reduced) {
    lenisInstance.start();
    lenisInstance.scrollTo(target, {
      offset,
      force: true,
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
    const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY + offset);
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
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

    if (scrollLocked) {
      lenis.stop();
    }

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
