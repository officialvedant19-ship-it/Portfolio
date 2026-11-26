"use client";

import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS, type AchievementItem } from "@/lib/data";
import { prefersReducedMotion, useScrollProgress } from "@/lib/hooks";
import { TechLogo, getBrandTint, isBrand } from "@/components/ui/TechLogo";

function CountUpMetric({
  item,
  active,
}: {
  item: AchievementItem;
  active: boolean;
}) {
  const [display, setDisplay] = useState<string>(() => {
    if (item.metricValue === null) return item.metricDisplay ?? "";
    return `${item.metricPrefix ?? ""}0${item.metricSuffix ?? ""}`;
  });
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (item.metricValue === null) {
      setDisplay(item.metricDisplay ?? "");
      return;
    }
    if (!active || hasRunRef.current) return;
    hasRunRef.current = true;

    const target = item.metricValue;
    const prefix = item.metricPrefix ?? "";
    const suffix = item.metricSuffix ?? "";

    if (prefersReducedMotion()) {
      setDisplay(`${prefix}${target}${suffix}`);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    let rafId = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - t, 4);
      const val = Math.round(eased * target);
      setDisplay(`${prefix}${val}${suffix}`);
      if (t < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        setDisplay(`${prefix}${target}${suffix}`);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [active, item]);

  return <span className="ach-metric">{display}</span>;
}

export function Achievements() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const progress = useScrollProgress(sectionRef, "sticky");
  const [maxTravel, setMaxTravel] = useState(900);
  const [sectionHeight, setSectionHeight] = useState<number | null>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const [seenMap, setSeenMap] = useState<Record<string, boolean>>({});

  // Measure exact horizontal travel distance so section height = 100vh + horizontal travel
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const travel = Math.max(240, track.scrollWidth - vw + 96);
      setMaxTravel(travel);
      setSectionHeight(vh + travel);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Observe individual cards so count-up fires the first time each card enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hitIds: string[] = [];
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.achId;
            if (id) hitIds.push(id);
            observer.unobserve(entry.target);
          }
        }
        if (hitIds.length > 0) {
          setSeenMap((prev) => {
            const next = { ...prev };
            for (const id of hitIds) next[id] = true;
            return next;
          });
        }
      },
      { threshold: 0.25 }
    );

    for (const el of cardRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Determine which card is closest to viewport center & trigger count-up when cards appear
  useEffect(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    const vpCenter = vw / 2;
    let bestIdx = 0;
    let bestDist = Infinity;

    const newlySeen: Record<string, boolean> = {};
    ACHIEVEMENTS.forEach((item, idx) => {
      const el = cardRefs.current[idx];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(cardCenter - vpCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
      if (
        rect.right > 24 &&
        rect.left < vw - 24 &&
        rect.top < window.innerHeight &&
        rect.bottom > 0
      ) {
        newlySeen[item.id] = true;
      }
    });

    setCenterIndex(bestIdx);
    if (Object.keys(newlySeen).length > 0) {
      setSeenMap((prev) => {
        let changed = false;
        const next = { ...prev };
        for (const k of Object.keys(newlySeen)) {
          if (!next[k]) {
            next[k] = true;
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }
  }, [progress, maxTravel]);

  if (ACHIEVEMENTS.length === 0) return null;

  const translateX = -(progress * maxTravel);

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="ach-section"
      style={{ height: sectionHeight ? `${sectionHeight}px` : "210vh" }}
    >
      <style>{`
        .ach-section {
          position: relative;
        }
        .ach-sticky {
          position: sticky;
          top: 0;
          height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          padding-block: clamp(72px, 10vh, 108px) clamp(28px, 5vh, 48px);
        }
        .ach-header {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: clamp(28px, 5vh, 52px);
        }
        .ach-progress-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          min-width: 160px;
        }
        .ach-progress-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--mute);
        }
        .ach-progress-rail {
          width: 160px;
          height: 2px;
          background: var(--line);
          border-radius: 999px;
          overflow: hidden;
        }
        .ach-progress-fill {
          width: 100%;
          height: 100%;
          background: var(--ink);
          transform-origin: 0% 50%;
          will-change: transform;
        }

        .ach-track-viewport {
          width: 100%;
          padding-block: 24px;
        }
        .ach-track {
          display: flex;
          align-items: stretch;
          gap: clamp(18px, 2.4vw, 28px);
          padding-inline: var(--gutter);
          width: max-content;
          will-change: transform;
        }

        .ach-card {
          position: relative;
          width: clamp(310px, 40vw, 540px);
          height: clamp(260px, 36vh, 310px);
          padding: clamp(22px, 2.5vw, 30px);
          border-radius: 28px;
          background: var(--card);
          box-shadow:
            inset 0 0 0 1px var(--line),
            0 12px 28px -20px rgba(13, 13, 13, 0.08);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition:
            transform 0.55s var(--ease),
            box-shadow 0.55s var(--ease);
        }
        .ach-card.is-center {
          transform: translateY(-12px);
          box-shadow:
            inset 0 0 0 1px rgba(13, 13, 13, 0.06),
            0 36px 74px -26px rgba(13, 13, 13, 0.16),
            0 12px 26px -14px rgba(13, 13, 13, 0.08);
        }
        .ach-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }
        .ach-logo-tile {
          position: relative;
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: var(--paper);
          box-shadow: inset 0 0 0 1px var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .ach-logo-glow {
          position: absolute;
          inset: -6px;
          border-radius: 999px;
          filter: blur(18px);
          opacity: 0.6;
          transition: opacity 0.45s var(--ease), transform 0.45s var(--ease);
          pointer-events: none;
        }
        .ach-card.is-center .ach-logo-glow {
          opacity: 1;
          transform: scale(1.15);
        }
        .ach-logo-inner {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ach-index {
          font-family: var(--font-mono);
          font-size: 11.5px;
          letter-spacing: 0.06em;
          color: var(--mute-text);
        }

        .ach-card-bottom {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
        }
        .ach-copy {
          min-width: 0;
          max-width: 62%;
        }
        .ach-label {
          margin: 0;
          font-size: clamp(1.15rem, 1.8vw, 1.4rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.15;
          color: var(--ink);
        }
        .ach-caption {
          margin: 4px 0 0;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--mute-text);
        }
        .ach-detail {
          margin: 8px 0 0;
          font-size: 13px;
          line-height: 1.48;
          color: var(--ink-2);
        }
        .ach-metric {
          font-family: var(--font-sans);
          font-size: clamp(2.4rem, 4.4vw, 3.8rem);
          font-weight: 700;
          letter-spacing: -0.055em;
          line-height: 0.9;
          color: var(--ink);
          flex-shrink: 0;
        }

        .ach-end-card {
          width: clamp(240px, 28vw, 340px);
          height: clamp(260px, 36vh, 310px);
          border-radius: 28px;
          border: 1.5px dashed rgba(13, 13, 13, 0.18);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 24px;
          text-align: center;
        }
        .ach-end-text {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: clamp(1.75rem, 3vw, 2.35rem);
          color: var(--mute);
          line-height: 1.1;
        }
        .ach-end-sub {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--faint);
        }
      `}</style>

      <div className="ach-sticky">
        <div className="container-editorial ach-header">
          <div>
            <div className="section-tag">
              <span>06</span>
              <span>—</span>
              <span>Achievements</span>
            </div>
            <h2 className="section-heading">
              Milestones &amp; <em className="serif-accent">honours.</em>
            </h2>
          </div>

          <div className="ach-progress-wrap" aria-hidden="true">
            <span className="ach-progress-label">
              {String(centerIndex + 1).padStart(2, "0")} /{" "}
              {String(ACHIEVEMENTS.length).padStart(2, "0")}
            </span>
            <div className="ach-progress-rail">
              <div
                className="ach-progress-fill"
                style={{ transform: `scaleX(${Math.max(0.08, progress)})` }}
              />
            </div>
          </div>
        </div>

        <div className="ach-track-viewport">
          <div
            ref={trackRef}
            className="ach-track"
            style={{ transform: `translate3d(${translateX.toFixed(2)}px, 0, 0)` }}
          >
            {ACHIEVEMENTS.map((item, idx) => {
              const isCenter = centerIndex === idx;
              const tint = isBrand(item.logoKey)
                ? getBrandTint(item.logoKey)
                : "rgba(13, 13, 13, 0.07)";

              return (
                <article
                  key={item.id}
                  data-ach-id={item.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  className={`ach-card ${isCenter ? "is-center" : ""}`}
                >
                  <div className="ach-card-top">
                    <div className="ach-logo-tile">
                      <span
                        className="ach-logo-glow"
                        aria-hidden="true"
                        style={{ backgroundColor: tint }}
                      />
                      <span className="ach-logo-inner">
                        <TechLogo name={item.logoKey} size={40} />
                      </span>
                    </div>
                    <span className="ach-index">{item.index}</span>
                  </div>

                  <div className="ach-card-bottom">
                    <div className="ach-copy">
                      <h3 className="ach-label">{item.label}</h3>
                      <p className="ach-caption">{item.caption}</p>
                      <p className="ach-detail">{item.detail}</p>
                    </div>
                    <CountUpMetric item={item} active={Boolean(seenMap[item.id])} />
                  </div>
                </article>
              );
            })}

            <div className="ach-end-card" aria-hidden="true">
              <span className="ach-end-text">and counting →</span>
              <span className="ach-end-sub">Keep scrolling</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

