"use client";

import { useEffect, useRef, useState } from "react";
import { EDUCATION, EXPERIENCE, PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

export function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const swingRef = useRef<HTMLDivElement | null>(null);
  const [flipped, setFlipped] = useState(false);

  // Spring-damped pendulum physics driven by pointer X velocity + subtle idle sway
  // Only ticks when the About section is intersecting the viewport (zero idle CPU cost).
  useEffect(() => {
    const section = sectionRef.current;
    const swingEl = swingRef.current;
    if (!section || !swingEl || prefersReducedMotion()) return;

    let angle = 0;
    let velocity = 0;
    let lastX: number | null = null;
    let lastTime = performance.now();
    let rafId = 0;
    let isVisible = false;

    const stiffness = 19;
    const damping = 3.2;
    const startTime = performance.now();

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (lastX !== null) {
        const dx = e.clientX - lastX;
        const dt = Math.max(8, now - lastTime);
        const pointerVel = dx / dt;
        velocity += Math.max(-1.6, Math.min(1.6, -pointerVel * 1.15));
      }
      lastX = e.clientX;
      lastTime = now;
    };

    const onPointerLeave = () => {
      lastX = null;
    };

    const tick = (now: number) => {
      if (!isVisible) {
        rafId = 0;
        return;
      }
      const step = 0.016;
      const elapsed = (now - startTime) / 1000;
      const idleTarget = Math.sin(elapsed * 1.15) * 1.15;

      const accel = -stiffness * (angle - idleTarget) - damping * velocity;
      velocity += accel * step;
      angle += velocity * step;
      angle = Math.max(-13, Math.min(13, angle));

      swingEl.style.transform = `rotate(${angle.toFixed(3)}deg)`;
      rafId = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = Boolean(entry?.isIntersecting);
        if (isVisible && !rafId) {
          rafId = window.requestAnimationFrame(tick);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(section);
    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      observer.disconnect();
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const primaryEdu = EDUCATION[0];
  const primaryExp = EXPERIENCE[0];

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFlipped((prev) => !prev);
    }
  };

  return (
    <section id="about" ref={sectionRef} className="section-pad about-section">
      <style>{`
        .about-section {
          position: relative;
        }
        .about-head {
          margin-bottom: clamp(44px, 6vh, 72px);
        }
        .about-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: clamp(32px, 5vw, 56px);
          align-items: stretch;
        }
        .about-col {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 28px;
        }
        .about-intro-title {
          margin: 0 0 18px;
          font-size: clamp(1.55rem, 2.3vw, 2rem);
          font-weight: 700;
          letter-spacing: -0.035em;
          line-height: 1.15;
          color: var(--ink);
        }
        .about-summary {
          margin: 0 0 14px;
          font-size: 15.5px;
          line-height: 1.68;
          color: var(--ink-2);
        }
        .about-secondary {
          margin: 0;
          font-size: 14.5px;
          line-height: 1.62;
          color: var(--mute-text);
        }
        .about-links {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding-top: 8px;
        }

        /* Centre hanging lanyard ID card */
        .lanyard-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          position: relative;
        }
        .lanyard-anchor {
          width: 44px;
          height: 6px;
          border-radius: 999px;
          background: rgba(13, 13, 13, 0.16);
          margin-bottom: -2px;
        }
        .lanyard-pendulum {
          display: flex;
          flex-direction: column;
          align-items: center;
          transform-origin: 50% 0%;
          will-change: transform;
        }
        .lanyard-strap {
          position: relative;
          width: 30px;
          height: 56px;
          background: var(--ink);
          overflow: hidden;
          border-radius: 3px 3px 0 0;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
        }
        .lanyard-strap-track {
          position: absolute;
          left: 50%;
          top: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          transform: translateX(-50%);
          animation: strapScroll 9s linear infinite;
        }
        .lanyard-strap-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          font-family: var(--font-mono);
          font-size: 7px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(244, 242, 238, 0.72);
          white-space: nowrap;
        }
        @keyframes strapScroll {
          0% {
            transform: translate(-50%, 0%);
          }
          100% {
            transform: translate(-50%, -50%);
          }
        }
        .lanyard-clip {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: -10px;
          z-index: 2;
        }
        .lanyard-clip-bar {
          width: 34px;
          height: 8px;
          border-radius: 3px;
          background: linear-gradient(180deg, #e5e5e5, #9a9a9a 55%, #cfcfcf);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.22);
        }
        .lanyard-clip-hook {
          width: 14px;
          height: 16px;
          border: 2.5px solid #969696;
          border-top: 0;
          border-radius: 0 0 8px 8px;
          background: transparent;
        }
        .id-scene {
          width: min(300px, calc(100vw - 44px));
          height: 404px;
          perspective: 1100px;
          cursor: pointer;
          user-select: none;
          border-radius: 24px;
        }
        .id-card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.78s var(--ease);
          border-radius: 24px;
        }
        .id-scene:hover .id-card,
        .id-card.is-flipped {
          transform: rotateY(180deg);
        }
        .id-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 24px;
          background: var(--card);
          box-shadow:
            inset 0 0 0 1px var(--line),
            0 24px 52px -24px rgba(13, 13, 13, 0.18),
            0 8px 20px -12px rgba(13, 13, 13, 0.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .id-back {
          transform: rotateY(180deg);
          padding: 24px 22px 20px;
          justify-content: space-between;
        }
        .id-top-band {
          background: var(--ink);
          color: var(--paper);
          padding: 16px 18px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .id-slot {
          width: 44px;
          height: 7px;
          border-radius: 999px;
          background: var(--paper);
          opacity: 0.92;
        }
        .id-top-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(244, 242, 238, 0.9);
        }
        .id-front-body {
          flex: 1;
          padding: 16px 20px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }
        .id-photo-halo {
          position: relative;
          padding: 3px;
          border-radius: 18px;
          background: linear-gradient(145deg, #d7d4ce 0%, #8c8982 50%, #eae7e1 100%);
          box-shadow: 0 12px 26px -12px rgba(13, 13, 13, 0.22);
        }
        .id-photo-frame {
          width: 128px;
          height: 156px;
          border-radius: 15px;
          overflow: hidden;
          background: #ffffff;
        }
        .id-photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: transform 0.6s var(--ease);
        }
        .id-scene:hover .id-photo-img {
          transform: scale(1.05);
        }
        .id-identity {
          text-align: center;
          margin-top: 8px;
        }
        .id-name {
          margin: 0;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--ink);
          line-height: 1.15;
        }
        .id-role {
          margin: 3px 0 0;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--mute-text);
        }
        .id-meta-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 6px;
          padding-block: 8px;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          text-align: left;
        }
        .id-meta-key {
          display: block;
          font-family: var(--font-mono);
          font-size: 8.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--mute-text);
        }
        .id-meta-val {
          display: block;
          font-family: var(--font-mono);
          font-size: 10.5px;
          font-weight: 600;
          color: var(--ink);
          margin-top: 2px;
        }
        .id-footer-strip {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .id-holo {
          width: 30px;
          height: 30px;
          border-radius: 999px;
          background: conic-gradient(from 40deg, #dcdcdc, #f9f9f9, #b8b8b8, #efefef, #c7c7c7, #dcdcdc);
          box-shadow: inset 0 0 0 1px rgba(13, 13, 13, 0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 8px;
          font-weight: 700;
          color: var(--ink-2);
          flex-shrink: 0;
        }
        .id-hint {
          margin-top: 12px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--faint);
        }

        /* Back face */
        .id-back-kicker {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--mute-text);
          padding-bottom: 10px;
          border-bottom: 1px solid var(--line);
        }
        .id-back-list {
          list-style: none;
          margin: 14px 0 auto;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .id-back-item {
          font-size: 12.5px;
          line-height: 1.45;
          color: var(--ink-2);
        }
        .id-back-item strong {
          display: block;
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--mute-text);
          font-weight: 500;
          margin-bottom: 2px;
        }
        .id-signature {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 24px;
          color: var(--ink);
          padding-top: 10px;
          border-top: 1px solid var(--line);
        }
        .id-found {
          margin-top: 6px;
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: var(--mute-text);
          word-break: break-word;
        }

        /* Right column: Quick facts + Quote */
        .facts-heading {
          margin: 0 0 16px;
          font-family: var(--font-mono);
          font-size: 11.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--mute-text);
        }
        .facts-list {
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
        }
        .fact-row {
          padding-block: 14px;
          border-top: 1px solid var(--line);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .fact-row:last-child {
          border-bottom: 1px solid var(--line);
        }
        .fact-dt {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--mute-text);
        }
        .fact-dd {
          margin: 0;
          font-size: 14.5px;
          font-weight: 500;
          color: var(--ink);
          line-height: 1.45;
          word-break: break-word;
        }
        .fact-link {
          text-decoration: underline;
          text-decoration-color: rgba(13, 13, 13, 0.25);
          text-underline-offset: 4px;
          transition: text-decoration-color 0.25s var(--ease);
        }
        .fact-link:hover {
          text-decoration-color: var(--ink);
        }
        .about-quote {
          margin: 0;
          padding: 20px 22px;
          border-radius: 20px;
          background: var(--card);
          box-shadow: inset 0 0 0 1px var(--line);
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 20px;
          line-height: 1.38;
          color: var(--ink-2);
        }

        @media (min-width: 1060px) {
          .about-grid {
            grid-template-columns: minmax(0, 1fr) 320px minmax(0, 1fr);
            gap: clamp(28px, 3.5vw, 52px);
          }
        }
      `}</style>

      <div className="container-editorial">
        <div className="about-head">
          <div className="section-tag rv" style={{ ["--i" as string]: 0 }}>
            <span>01</span>
            <span>—</span>
            <span>About</span>
          </div>
          <h2 className="section-heading rv" style={{ ["--i" as string]: 1 }}>
            A closer <em className="serif-accent">look.</em>
          </h2>
        </div>

        <div className="about-grid">
          {/* Left column */}
          <div className="about-col rv" style={{ ["--i" as string]: 2 }}>
            <div>
              <h3 className="about-intro-title">Hi, I&apos;m {PROFILE.firstName}.</h3>
              <p className="about-summary">{PROFILE.resumeSummary}</p>
              <p className="about-secondary">{PROFILE.aboutSecondaryLine}</p>
            </div>

            <div className="about-links">
              <a
                href={PROFILE.resumePath}
                download={PROFILE.resumeFileName}
                className="btn-pill btn-primary"
              >
                Résumé ↓
              </a>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noreferrer"
                className="btn-pill btn-secondary"
              >
                GitHub ↗
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn-pill btn-secondary"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>

          {/* Centre column: hanging lanyard ID card */}
          <div className="lanyard-col rv" style={{ ["--i" as string]: 3 }}>
            <div className="lanyard-anchor" aria-hidden="true" />
            <div ref={swingRef} className="lanyard-pendulum">
              <div className="lanyard-strap" aria-hidden="true">
                <div className="lanyard-strap-track">
                  <span className="lanyard-strap-text">
                    {PROFILE.name} · {PROFILE.role.replace(".", "")} ·
                  </span>
                  <span className="lanyard-strap-text">
                    {PROFILE.name} · {PROFILE.role.replace(".", "")} ·
                  </span>
                </div>
              </div>

              <div className="lanyard-clip" aria-hidden="true">
                <div className="lanyard-clip-bar" />
                <div className="lanyard-clip-hook" />
              </div>

              <div
                className="id-scene"
                role="button"
                tabIndex={0}
                aria-pressed={flipped}
                aria-label="Flip developer ID card to inspect summary details"
                onClick={() => setFlipped((prev) => !prev)}
                onKeyDown={handleCardKeyDown}
              >
                <div className={`id-card ${flipped ? "is-flipped" : ""}`}>
                  {/* Front */}
                  <div className="id-face id-front">
                    <div className="id-top-band">
                      <span className="id-slot" aria-hidden="true" />
                      <span className="id-top-label">DEVELOPER ID</span>
                    </div>

                    <div className="id-front-body">
                      <div className="id-photo-halo">
                        <div className="id-photo-frame">
                          <img
                            src="/portrait-bust.webp"
                            alt={`Portrait of ${PROFILE.name}`}
                            width={128}
                            height={156}
                            loading="lazy"
                            decoding="async"
                            className="id-photo-img"
                          />
                        </div>
                      </div>

                      <div className="id-identity">
                        <p className="id-name">{PROFILE.name}</p>
                        <p className="id-role">AI &amp; Prompt Engineer</p>
                      </div>

                      <div className="id-meta-grid">
                        <div>
                          <span className="id-meta-key">ID No.</span>
                          <span className="id-meta-val">VM-2027</span>
                        </div>
                        <div>
                          <span className="id-meta-key">Dept.</span>
                          <span className="id-meta-val">{PROFILE.department}</span>
                        </div>
                        <div>
                          <span className="id-meta-key">Valid till</span>
                          <span className="id-meta-val">{PROFILE.graduationYear}</span>
                        </div>
                      </div>

                      <div className="id-footer-strip">
                        <svg
                          width="176"
                          height="28"
                          viewBox="0 0 176 28"
                          fill="var(--ink)"
                          aria-hidden="true"
                        >
                          <rect x="0" y="2" width="2" height="24" />
                          <rect x="4" y="2" width="1" height="24" />
                          <rect x="8" y="2" width="3" height="24" />
                          <rect x="14" y="2" width="1.5" height="24" />
                          <rect x="18" y="2" width="2" height="24" />
                          <rect x="23" y="2" width="4" height="24" />
                          <rect x="30" y="2" width="1" height="24" />
                          <rect x="34" y="2" width="2.5" height="24" />
                          <rect x="40" y="2" width="1.5" height="24" />
                          <rect x="44" y="2" width="3" height="24" />
                          <rect x="50" y="2" width="1" height="24" />
                          <rect x="54" y="2" width="2" height="24" />
                          <rect x="59" y="2" width="4" height="24" />
                          <rect x="66" y="2" width="1.5" height="24" />
                          <rect x="70" y="2" width="2" height="24" />
                          <rect x="75" y="2" width="3" height="24" />
                          <rect x="81" y="2" width="1" height="24" />
                          <rect x="85" y="2" width="2.5" height="24" />
                          <rect x="91" y="2" width="1.5" height="24" />
                          <rect x="96" y="2" width="3.5" height="24" />
                          <rect x="103" y="2" width="1" height="24" />
                          <rect x="107" y="2" width="2" height="24" />
                          <rect x="112" y="2" width="3" height="24" />
                          <rect x="118" y="2" width="1.5" height="24" />
                          <rect x="123" y="2" width="2" height="24" />
                          <rect x="128" y="2" width="4" height="24" />
                          <rect x="135" y="2" width="1" height="24" />
                          <rect x="139" y="2" width="2.5" height="24" />
                          <rect x="145" y="2" width="1.5" height="24" />
                          <rect x="150" y="2" width="3" height="24" />
                          <rect x="156" y="2" width="1" height="24" />
                          <rect x="160" y="2" width="2" height="24" />
                          <rect x="165" y="2" width="3" height="24" />
                          <rect x="171" y="2" width="2" height="24" />
                        </svg>
                        <span className="id-holo" aria-hidden="true">
                          VM
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="id-face id-back">
                    <div className="id-back-kicker">What I am</div>
                    <ul className="id-back-list">
                      <li className="id-back-item">
                        <strong>Focus</strong>
                        Prompt Engineer · AI Engineer · Generative AI
                      </li>
                      <li className="id-back-item">
                        <strong>Education</strong>
                        {primaryEdu.degree}, {primaryEdu.institution} ({primaryEdu.year})
                      </li>
                      <li className="id-back-item">
                        <strong>Experience</strong>
                        {primaryExp.title}, {primaryExp.organization}
                      </li>
                      <li className="id-back-item">
                        <strong>Key Projects</strong>
                        AI Fitness Tracker · YOLO Attendance · Rudra Crypto
                      </li>
                      <li className="id-back-item">
                        <strong>Honours &amp; Certs</strong>
                        3rd at SPARK · Avishkar State · AWS Cloud Practitioner
                      </li>
                    </ul>
                    <div>
                      <div className="id-signature">{PROFILE.name}</div>
                      <div className="id-found">
                        If found, say hello · {PROFILE.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span className="id-hint" aria-hidden="true">
              Hover or tap to flip
            </span>
          </div>

          {/* Right column: Quick facts + Quote */}
          <div className="about-col rv" style={{ ["--i" as string]: 4 }}>
            <div>
              <h3 className="facts-heading">Quick facts</h3>
              <dl className="facts-list">
                {PROFILE.location && (
                  <div className="fact-row">
                    <dt className="fact-dt">Location</dt>
                    <dd className="fact-dd">{PROFILE.location}</dd>
                  </div>
                )}
                <div className="fact-row">
                  <dt className="fact-dt">Education</dt>
                  <dd className="fact-dd">
                    {primaryEdu.degree}, {primaryEdu.institution} ({primaryEdu.year})
                  </dd>
                </div>
                <div className="fact-row">
                  <dt className="fact-dt">Internship</dt>
                  <dd className="fact-dd">
                    {primaryExp.title}, {primaryExp.organization} ({primaryExp.period})
                  </dd>
                </div>
                <div className="fact-row">
                  <dt className="fact-dt">Languages</dt>
                  <dd className="fact-dd">{PROFILE.languages.join(" · ")}</dd>
                </div>
                <div className="fact-row">
                  <dt className="fact-dt">Email</dt>
                  <dd className="fact-dd">
                    <a href={`mailto:${PROFILE.email}`} className="fact-link">
                      {PROFILE.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <blockquote className="about-quote">&ldquo;{PROFILE.quote}&rdquo;</blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

