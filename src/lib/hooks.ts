"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

interface UseInViewOptions extends IntersectionObserverInit {
  once?: boolean;
}

export function useInView<T extends HTMLElement>(
  options: UseInViewOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.15, root = null, rootMargin = "0px", once = true } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(el);
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, once]);

  return [ref, inView];
}

/**
 * Tracks normalized scroll progress [0, 1] through a target section.
 * Mode "sticky": 0 when section top reaches viewport top, 1 when section bottom reaches viewport bottom.
 * Mode "traverse": 0 when section top enters viewport ~65%, 1 when section bottom passes viewport ~45%.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  mode: "sticky" | "traverse" = "traverse"
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;

    const compute = () => {
      rafId = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      let p = 0;
      if (mode === "sticky") {
        const travel = Math.max(1, el.offsetHeight - vh);
        p = -rect.top / travel;
      } else {
        const start = vh * 0.72;
        const end = vh * 0.25;
        const total = rect.height + (start - end);
        p = (start - rect.top) / Math.max(1, total);
      }

      const clamped = Math.max(0, Math.min(1, p));
      setProgress((prev) => (Math.abs(prev - clamped) > 0.0005 ? clamped : prev));
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(compute);
      }
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [ref, mode]);

  return progress;
}

export function usePageScrollProgress(): { progress: number; scrollY: number } {
  const [state, setState] = useState({ progress: 0, scrollY: 0 });

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const y = window.scrollY || window.pageYOffset || 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.max(0, Math.min(1, y / max));
      setState({ progress: p, scrollY: y });
    };

    const schedule = () => {
      if (!rafId) rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return state;
}

