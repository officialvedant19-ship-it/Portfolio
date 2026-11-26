"use client";

import { useRef } from "react";
import { EDUCATION, EXPERIENCE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

interface TimelineStop {
  id: string;
  kind: "Education" | "Experience";
  period: string;
  title: string;
  place: string;
  details: string[];
}

export function Experience() {
  const pathRef = useRef<HTMLDivElement | null>(null);
  const progress = useScrollProgress(pathRef, "traverse");

  // Combine education and experience chronologically
  const stops: TimelineStop[] = [
    ...EDUCATION.map((edu) => ({
      id: edu.id,
      kind: "Education" as const,
      period: edu.period,
      title: edu.degree,
      place: edu.institution,
      details: [
        edu.detail,
        "Represented K.D.K College of Engineering at the Maharashtra State Inter-University Research Convention (Avishkar).",
        "Ranked 3rd in the SPARK Competition for the AI Fitness Tracker project.",
      ],
    })),
    ...EXPERIENCE.map((exp) => ({
      id: exp.id,
      kind: "Experience" as const,
      period: exp.period,
      title: exp.title,
      place: exp.organization,
      details: exp.bullets,
    })),
  ];

  const totalNodes = stops.length + 1;

  return (
    <section id="experience" className="section-pad exp-section">
      <style>{`
        .exp-head {
          margin-bottom: clamp(44px, 6.5vh, 72px);
        }
        .timeline-wrap {
          position: relative;
          max-width: 920px;
          padding-left: 34px;
        }
        .timeline-rail {
          position: absolute;
          left: 9px;
          top: 10px;
          bottom: 10px;
          width: 2px;
          background: var(--line);
          border-radius: 999px;
          overflow: hidden;
        }
        .timeline-spine {
          width: 100%;
          height: 100%;
          background: var(--maroon);
          transform-origin: 50% 0%;
          will-change: transform;
        }
        .timeline-list {
          display: flex;
          flex-direction: column;
          gap: clamp(24px, 4vh, 38px);
        }
        .timeline-stop {
          position: relative;
          padding: 26px clamp(20px, 3vw, 34px);
          border-radius: 26px;
          background: var(--card);
          box-shadow: inset 0 0 0 1px var(--line);
          opacity: 0.56;
          transform: translateY(8px);
          transition:
            opacity 0.55s var(--ease),
            transform 0.55s var(--ease),
            box-shadow 0.55s var(--ease);
        }
        .timeline-stop.is-lit {
          opacity: 1;
          transform: translateY(0);
          box-shadow:
            inset 0 0 0 1px rgba(13, 13, 13, 0.08),
            0 24px 52px -28px rgba(13, 13, 13, 0.14);
        }
        .timeline-dot {
          position: absolute;
          left: -32px;
          top: 32px;
          width: 16px;
          height: 16px;
          border-radius: 999px;
          background: var(--paper);
          border: 2px solid rgba(13, 13, 13, 0.28);
          transition:
            background-color 0.45s var(--ease),
            border-color 0.45s var(--ease),
            box-shadow 0.45s var(--ease);
        }
        .timeline-stop.is-lit .timeline-dot {
          background: var(--maroon);
          border-color: var(--maroon);
          box-shadow: 0 0 0 6px var(--maroon-soft);
        }
        .stop-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--mute-text);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .stop-kind {
          padding: 3px 9px;
          border-radius: 999px;
          background: var(--paper);
          color: var(--ink-2);
        }
        .stop-title {
          margin: 0;
          font-size: clamp(1.3rem, 2.4vw, 1.75rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.15;
          color: var(--ink);
        }
        .stop-place {
          margin: 5px 0 0;
          font-size: 15px;
          font-weight: 500;
          color: var(--mute-text);
        }
        .stop-bullets {
          list-style: none;
          margin: 16px 0 0;
          padding: 16px 0 0;
          border-top: 1px solid var(--line);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .stop-bullet {
          font-size: 14px;
          line-height: 1.6;
          color: var(--ink-2);
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .stop-bullet::before {
          content: "—";
          font-family: var(--font-mono);
          color: var(--faint);
          flex-shrink: 0;
        }

        /* Dashed closing card */
        .timeline-next {
          position: relative;
          padding: 28px clamp(20px, 3vw, 34px);
          border-radius: 26px;
          border: 1.5px dashed rgba(13, 13, 13, 0.24);
          background: transparent;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          opacity: 0.68;
          transition: opacity 0.55s var(--ease), border-color 0.4s var(--ease);
        }
        .timeline-next.is-lit {
          opacity: 1;
          border-color: var(--maroon-line);
        }
        .timeline-next .timeline-dot {
          top: 34px;
          border-style: dashed;
        }
        .timeline-next.is-lit .timeline-dot {
          background: var(--maroon);
          border-style: solid;
          border-color: var(--maroon);
        }
        .next-title {
          margin: 0;
          font-size: clamp(1.3rem, 2.4vw, 1.7rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--ink);
        }
        .next-sub {
          margin: 6px 0 0;
          font-size: 14px;
          color: var(--mute-text);
        }

        @media (min-width: 720px) {
          .timeline-wrap {
            padding-left: 54px;
          }
          .timeline-rail {
            left: 15px;
          }
          .timeline-dot {
            left: -46px;
          }
        }
      `}</style>

      <div className="container-editorial">
        <div className="exp-head">
          <div className="section-tag rv" style={{ ["--i" as string]: 0 }}>
            <span>05</span>
            <span>—</span>
            <span>Path</span>
          </div>
          <h2 className="section-heading rv" style={{ ["--i" as string]: 1 }}>
            Education &amp; <em className="serif-accent">experience.</em>
          </h2>
        </div>

        <div ref={pathRef} className="timeline-wrap">
          <div className="timeline-rail" aria-hidden="true">
            <div
              className="timeline-spine"
              style={{ transform: `scaleY(${progress})` }}
            />
          </div>

          <div className="timeline-list">
            {stops.map((stop, idx) => {
              const threshold = (idx + 0.12) / totalNodes;
              const lit = progress >= threshold;
              return (
                <article
                  key={stop.id}
                  className={`timeline-stop ${lit ? "is-lit" : ""}`}
                >
                  <span className="timeline-dot" aria-hidden="true" />
                  <div className="stop-meta">
                    <span className="stop-kind">{stop.kind}</span>
                    <span>{stop.period}</span>
                  </div>
                  <h3 className="stop-title">{stop.title}</h3>
                  <p className="stop-place">{stop.place}</p>
                  <ul className="stop-bullets">
                    {stop.details.map((line) => (
                      <li key={line} className="stop-bullet">
                        {line}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}

            <div className={`timeline-next ${progress >= 0.78 ? "is-lit" : ""}`}>
              <span className="timeline-dot" aria-hidden="true" />
              <div>
                <h3 className="next-title">Next — Your team?</h3>
                <p className="next-sub">
                  Seeking an entry-level Prompt Engineer, AI Engineer or Generative AI role.
                </p>
              </div>
              <a
                href="#contact"
                className="btn-pill btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#contact", -16);
                }}
              >
                Get in touch →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

