"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

export function RevealObserver() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".rv, .rv-mask"));
    if (targets.length === 0) return;

    if (prefersReducedMotion()) {
      for (const el of targets) el.classList.add("is-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return null;
}

