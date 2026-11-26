"use client";

import { useState } from "react";
import { PROJECTS, type ProjectItem } from "@/lib/data";
import { TechLogo } from "@/components/ui/TechLogo";

function IllustrativeMiniUI({ variant }: { variant: ProjectItem["uiVariant"] }) {
  if (variant === "fitness") {
    return (
      <div className="mini-ui" aria-label="Illustrative monochrome interface for AI Fitness Tracker">
        <div className="mini-topbar">
          <span className="mini-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="mini-badge">Illustrative UI</span>
        </div>
        <div className="mini-body">
          <div className="mini-row-3">
            <div className="mini-stat">
              <span className="mini-k">Workout</span>
              <span className="mini-bar">
                <span style={{ width: "78%" }} />
              </span>
            </div>
            <div className="mini-stat">
              <span className="mini-k">Calories</span>
              <span className="mini-bar">
                <span style={{ width: "64%" }} />
              </span>
            </div>
            <div className="mini-stat">
              <span className="mini-k">Sleep</span>
              <span className="mini-bar">
                <span style={{ width: "86%" }} />
              </span>
            </div>
          </div>

          <div className="mini-chart-box">
            <span className="mini-k">Weekly Progress</span>
            <div className="mini-bars">
              {[42, 68, 55, 84, 74, 92, 80].map((h, i) => (
                <div key={i} className="mini-bar-col">
                  <span style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </div>

          <div className="mini-card-line">
            <span className="mini-k">FastAPI · Scikit-learn</span>
            <div className="mini-skeleton-row">
              <span className="mini-skel" style={{ width: "82%" }} />
              <span className="mini-skel" style={{ width: "58%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "attendance") {
    return (
      <div
        className="mini-ui"
        aria-label="Illustrative monochrome interface for Smart Attendance Management System"
      >
        <div className="mini-topbar">
          <span className="mini-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="mini-badge">Illustrative UI</span>
        </div>
        <div className="mini-body">
          <div className="mini-cam">
            <div className="mini-bbox">
              <span className="mini-bbox-tag">YOLO · FACE</span>
              <span className="mini-corner tl" />
              <span className="mini-corner tr" />
              <span className="mini-corner bl" />
              <span className="mini-corner br" />
              <div className="mini-silhouette" aria-hidden="true">
                <span className="mini-head" />
                <span className="mini-shoulders" />
              </div>
            </div>
          </div>

          <div className="mini-log">
            <span className="mini-k">Automated Attendance Feed</span>
            <div className="mini-log-rows">
              <div className="mini-log-row">
                <span className="mini-dot-dark" />
                <span className="mini-skel" style={{ width: "52%" }} />
                <span className="mini-k">PRESENT</span>
              </div>
              <div className="mini-log-row">
                <span className="mini-dot-dark" />
                <span className="mini-skel" style={{ width: "44%" }} />
                <span className="mini-k">PRESENT</span>
              </div>
              <div className="mini-log-row">
                <span className="mini-dot-dark" />
                <span className="mini-skel" style={{ width: "60%" }} />
                <span className="mini-k">PRESENT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mini-ui"
      aria-label="Illustrative monochrome interface for Rudra Cryptographic Interface"
    >
      <div className="mini-topbar">
        <span className="mini-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="mini-badge">Illustrative UI</span>
      </div>
      <div className="mini-body">
        <div className="mini-crypto-keys">
          {["K1 · X25519", "K2 · HKDF", "K3 · AES-GCM", "K4 · TETRA"].map((label) => (
            <div key={label} className="mini-key-pill">
              {label}
            </div>
          ))}
        </div>

        <div className="mini-cipher-box">
          <span className="mini-k">Ciphertext Stream</span>
          <div className="mini-hex">
            <span>9F 4A C2 1E 7B 08 D4 51</span>
            <span>3C 8E A1 64 F0 29 B7 0D</span>
            <span>E6 15 4D 92 8A C0 73 4F</span>
          </div>
        </div>

        <div className="mini-chart-box">
          <span className="mini-k">Cryptanalysis Frequency Distribution</span>
          <div className="mini-bars mini-bars-tight">
            {[74, 78, 72, 76, 75, 79, 73, 77, 74, 76].map((h, i) => (
              <div key={i} className="mini-bar-col">
                <span style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Work() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="work" className="section-pad work-section">
      <style>{`
        .work-head {
          margin-bottom: clamp(36px, 5.5vh, 56px);
        }

        .work-gallery {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .work-panel {
          position: relative;
          border-radius: 26px;
          background: var(--card);
          box-shadow: inset 0 0 0 1px var(--line);
          overflow: hidden;
          transition:
            flex 0.72s var(--ease),
            box-shadow 0.48s var(--ease),
            background-color 0.35s var(--ease);
        }
        .work-panel.is-open {
          box-shadow:
            inset 0 0 0 1px var(--maroon-line),
            0 28px 64px -26px rgba(13, 13, 13, 0.14);
        }

        /* Mobile accordion header */
        .work-mobile-trigger {
          width: 100%;
          padding: 20px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          text-align: left;
        }
        .work-mobile-left {
          display: flex;
          align-items: baseline;
          gap: 14px;
          min-width: 0;
        }
        .work-index {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--mute-text);
          flex-shrink: 0;
        }
        .work-mobile-title {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--ink);
          line-height: 1.2;
        }
        .work-plus {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          box-shadow: inset 0 0 0 1px var(--line);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 18px;
          font-weight: 400;
          color: var(--ink);
          transition: transform 0.42s var(--ease), background-color 0.35s var(--ease), color 0.35s var(--ease);
        }
        .work-panel:hover .work-plus,
        .work-panel.is-open .work-plus {
          transform: rotate(45deg);
        }
        .work-panel.is-open .work-plus {
          background: var(--maroon);
          color: var(--card);
          box-shadow: inset 0 0 0 1px var(--maroon);
        }

        /* Desktop collapsed spine */
        .work-spine {
          display: none;
        }

        /* Open content body */
        .work-body {
          display: none;
          padding: 0 22px 24px;
        }
        .work-panel.is-open .work-body {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 24px;
        }
        .work-copy {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
          min-width: 0;
        }
        .work-kicker {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--mute-text);
          margin: 0 0 10px;
        }
        .work-title {
          margin: 0 0 14px;
          font-size: clamp(1.5rem, 2.5vw, 2.2rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.06;
          color: var(--ink);
        }
        .work-desc {
          margin: 0 0 20px;
          font-size: 14.5px;
          line-height: 1.65;
          color: var(--ink-2);
          max-width: 52ch;
        }
        .work-features {
          list-style: none;
          margin: 0;
          padding: 16px 0;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 10px 18px;
        }
        .work-feature {
          font-size: 13px;
          line-height: 1.45;
          color: var(--ink-2);
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .work-feature::before {
          content: "";
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: var(--maroon);
          flex-shrink: 0;
          transform: translateY(-2px);
        }
        .work-footer {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }
        .work-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
        .work-tech-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 11px;
          border-radius: 999px;
          background: var(--paper);
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--ink-2);
        }

        /* Illustrative Mini UI + clip-path wipe reveal */
        .work-preview {
          display: flex;
          align-items: stretch;
          min-width: 0;
          clip-path: inset(0 100% 0 0 round 20px);
          animation: uiWipeReveal 0.72s var(--ease) 0.14s forwards;
        }
        @keyframes uiWipeReveal {
          to {
            clip-path: inset(0 0% 0 0 round 20px);
          }
        }
        .mini-ui {
          width: 100%;
          border-radius: 20px;
          background: var(--paper);
          box-shadow: inset 0 0 0 1px var(--line);
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mini-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mini-dots {
          display: inline-flex;
          gap: 5px;
        }
        .mini-dots i {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: rgba(13, 13, 13, 0.18);
          display: block;
        }
        .mini-badge {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--mute-text);
          padding: 3px 8px;
          border-radius: 999px;
          background: var(--card);
          box-shadow: inset 0 0 0 1px var(--line);
        }
        .mini-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          justify-content: space-between;
        }
        .mini-k {
          display: block;
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--mute-text);
        }
        .mini-row-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }
        .mini-stat,
        .mini-chart-box,
        .mini-card-line,
        .mini-log,
        .mini-cipher-box {
          background: var(--card);
          border-radius: 13px;
          padding: 10px 11px;
          box-shadow: inset 0 0 0 1px var(--line);
        }
        .mini-bar {
          display: block;
          height: 6px;
          border-radius: 999px;
          background: var(--soft);
          margin-top: 8px;
          overflow: hidden;
        }
        .mini-bar > span {
          display: block;
          height: 100%;
          border-radius: 999px;
          background: var(--ink);
        }
        .mini-bars {
          height: 82px;
          margin-top: 10px;
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 7px;
          align-items: end;
        }
        .mini-bars-tight {
          height: 64px;
          grid-template-columns: repeat(10, minmax(0, 1fr));
          gap: 5px;
        }
        .mini-bar-col {
          height: 100%;
          display: flex;
          align-items: flex-end;
        }
        .mini-bar-col > span {
          width: 100%;
          border-radius: 5px 5px 2px 2px;
          background: linear-gradient(180deg, #1a1a1a 0%, #6f6d68 100%);
        }
        .mini-skeleton-row {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mini-skel {
          display: block;
          height: 7px;
          border-radius: 999px;
          background: var(--soft);
        }
        .mini-cam {
          background: var(--card);
          border-radius: 14px;
          padding: 16px;
          box-shadow: inset 0 0 0 1px var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 146px;
        }
        .mini-bbox {
          position: relative;
          width: 122px;
          height: 112px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mini-bbox-tag {
          position: absolute;
          top: -10px;
          left: 8px;
          background: var(--ink);
          color: var(--card);
          font-family: var(--font-mono);
          font-size: 8.5px;
          letter-spacing: 0.08em;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .mini-corner {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: var(--ink);
          border-style: solid;
        }
        .mini-corner.tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
        .mini-corner.tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
        .mini-corner.bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
        .mini-corner.br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }
        .mini-silhouette {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .mini-head {
          width: 30px;
          height: 30px;
          border-radius: 999px;
          background: #d5d2cc;
        }
        .mini-shoulders {
          width: 58px;
          height: 24px;
          border-radius: 16px 16px 6px 6px;
          background: #d5d2cc;
        }
        .mini-log-rows {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .mini-log-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .mini-dot-dark {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: var(--ink);
          flex-shrink: 0;
        }
        .mini-crypto-keys {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 7px;
        }
        .mini-key-pill {
          background: var(--card);
          border-radius: 10px;
          padding: 7px 10px;
          box-shadow: inset 0 0 0 1px var(--line);
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: var(--ink-2);
          text-align: center;
        }
        .mini-hex {
          margin-top: 7px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.04em;
          color: var(--ink);
        }

        @media (min-width: 600px) {
          .work-features {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 960px) {
          .work-gallery {
            flex-direction: row;
            height: min(78svh, 600px);
            align-items: stretch;
          }
          .work-panel {
            flex: 1;
            min-width: 86px;
            display: flex;
          }
          .work-panel.is-open {
            flex: 8;
          }
          .work-mobile-trigger {
            display: none;
          }
          .work-spine {
            width: 100%;
            height: 100%;
            padding: 24px 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
          }
          .work-panel.is-open .work-spine {
            display: none;
          }
          .work-spine-title {
            writing-mode: vertical-rl;
            transform: rotate(180deg);
            font-size: 15px;
            font-weight: 600;
            letter-spacing: -0.02em;
            color: var(--ink);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-height: 360px;
          }
          .work-body {
            width: 100%;
            height: 100%;
            padding: clamp(28px, 3vw, 40px);
          }
          .work-panel.is-open .work-body {
            display: grid;
            grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
            gap: clamp(24px, 3vw, 38px);
            align-items: stretch;
          }
        }
      `}</style>

      <div className="container-editorial">
        <div className="work-head">
          <div className="section-tag rv" style={{ ["--i" as string]: 0 }}>
            <span>03</span>
            <span>—</span>
            <span>Selected work</span>
          </div>
          <h2 className="section-heading rv" style={{ ["--i" as string]: 1 }}>
            Things I&apos;ve <em className="serif-accent">built.</em>
          </h2>
        </div>

        <div className="work-gallery rv" style={{ ["--i" as string]: 2 }}>
          {PROJECTS.map((project, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <article
                key={project.id}
                className={`work-panel ${isOpen ? "is-open" : ""}`}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {/* Mobile accordion trigger */}
                <button
                  type="button"
                  className="work-mobile-trigger"
                  aria-expanded={isOpen}
                  aria-controls={`project-body-${project.id}`}
                  onClick={() => setActiveIndex(idx)}
                >
                  <span className="work-mobile-left">
                    <span className="work-index">{project.index}</span>
                    <span className="work-mobile-title">{project.title}</span>
                  </span>
                  <span className="work-plus" aria-hidden="true">
                    +
                  </span>
                </button>

                {/* Desktop slim spine when folded */}
                <button
                  type="button"
                  className="work-spine"
                  aria-expanded={isOpen}
                  aria-controls={`project-body-${project.id}`}
                  onFocus={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                >
                  <span className="work-index" aria-hidden="true">{project.index}</span>
                  <span className="work-spine-title">{project.title}</span>
                  <span className="work-plus" aria-hidden="true">
                    +
                  </span>
                </button>

                {/* Expanded panel content */}
                <div id={`project-body-${project.id}`} className="work-body">
                  <div className="work-copy">
                    <div>
                      <p className="work-kicker">
                        {project.index} · {project.kicker}
                      </p>
                      <h3 className="work-title">{project.title}</h3>
                      <p className="work-desc">{project.description}</p>
                      <ul className="work-features">
                        {project.features.map((feat) => (
                          <li key={feat} className="work-feature">
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="work-footer">
                      <div className="work-tech">
                        {project.tech.map((t) => (
                          <span key={t.name} className="work-tech-chip">
                            <TechLogo name={t.logoKey} size={14} />
                            <span>{t.name}</span>
                          </span>
                        ))}
                      </div>

                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-pill btn-primary"
                        >
                          View on GitHub ↗
                        </a>
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div key={project.id} className="work-preview">
                      <IllustrativeMiniUI variant={project.uiVariant} />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

