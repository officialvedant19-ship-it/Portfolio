"use client";

import { useMemo, useState } from "react";
import { SKILL_GROUPS, type SkillItem } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import { TechLogo, getBrandTint, isBrand } from "@/components/ui/TechLogo";

export function Skills() {
  const allSkills = useMemo<SkillItem[]>(
    () => SKILL_GROUPS.flatMap((g) => g.items),
    []
  );
  const families = useMemo(
    () => ["All", ...SKILL_GROUPS.map((g) => g.family)],
    []
  );

  const [activeFamily, setActiveFamily] = useState<string>("All");
  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(
    () => allSkills.find((s) => s.symbol === "Py") ?? allSkills[0]
  );

  const [gridRef, gridVisible] = useInView<HTMLDivElement>({ threshold: 0.12 });

  const brandMode = isBrand(selectedSkill.logoKey);
  const glowTint = brandMode ? getBrandTint(selectedSkill.logoKey) : "rgba(13, 13, 13, 0.05)";

  return (
    <section id="skills" className="section-pad skills-section">
      <style>{`
        .skills-head {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: clamp(32px, 5vh, 48px);
        }
        .skills-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .skill-chip {
          height: 36px;
          padding-inline: 15px;
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 11.5px;
          letter-spacing: 0.03em;
          color: var(--ink-2);
          background: transparent;
          box-shadow: inset 0 0 0 1px var(--line);
          transition:
            background-color 0.3s var(--ease),
            color 0.3s var(--ease),
            box-shadow 0.3s var(--ease);
        }
        .skill-chip:hover {
          color: var(--ink);
          box-shadow: inset 0 0 0 1px rgba(13, 13, 13, 0.32);
        }
        .skill-chip.is-active {
          background: var(--ink);
          color: var(--card);
          box-shadow: inset 0 0 0 1px var(--ink);
        }

        .skills-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 28px;
          align-items: start;
        }

        .periodic-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
        }

        .el-tile {
          position: relative;
          aspect-ratio: 1 / 1.06;
          padding: 9px 8px 8px;
          border-radius: 16px;
          background: var(--card);
          box-shadow: inset 0 0 0 1px var(--line);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          opacity: 0;
          transform: translateY(16px) scale(0.96);
          transition:
            opacity 0.52s var(--ease),
            transform 0.52s var(--ease),
            box-shadow 0.35s var(--ease),
            background-color 0.3s var(--ease);
          transition-delay: var(--wave, 0ms);
        }
        .periodic-grid.is-visible .el-tile {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .periodic-grid.is-visible .el-tile.is-dim {
          opacity: 0.2;
          transform: scale(0.96);
          transition-delay: 0ms;
        }
        .periodic-grid.is-visible .el-tile:hover,
        .periodic-grid.is-visible .el-tile:focus-visible,
        .periodic-grid.is-visible .el-tile.is-selected {
          transition-delay: 0ms;
          opacity: 1;
          transform: translateY(-3px) scale(1.02);
          box-shadow:
            inset 0 0 0 1.5px var(--ink),
            0 16px 32px -18px rgba(13, 13, 13, 0.24);
          z-index: 2;
        }
        .el-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
        }
        .el-num {
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: var(--mute-text);
          line-height: 1;
        }
        .el-dot {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: var(--mute-text);
        }
        .el-symbol {
          font-family: var(--font-sans);
          font-size: clamp(1.15rem, 2.2vw, 1.55rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--ink);
        }
        .el-name {
          font-size: 10px;
          line-height: 1.2;
          color: var(--mute-text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Sticky right inspector panel */
        .skill-inspector {
          padding: 26px 24px 24px;
          border-radius: 26px;
          background: var(--card);
          box-shadow:
            inset 0 0 0 1px var(--line),
            0 24px 56px -26px rgba(13, 13, 13, 0.12);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .inspector-stage {
          position: relative;
          height: 200px;
          border-radius: 20px;
          background: var(--paper);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .inspector-glow {
          position: absolute;
          width: 170px;
          height: 170px;
          border-radius: 999px;
          filter: blur(30px);
          pointer-events: none;
          transition: background-color 0.45s var(--ease);
        }
        .inspector-logo-pop {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: logoPop 0.48s var(--ease) both;
        }
        @keyframes logoPop {
          0% {
            opacity: 0;
            transform: scale(0.76) translateY(8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .inspector-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--mute-text);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .inspector-title {
          margin: 0;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.035em;
          line-height: 1.1;
          color: var(--ink);
        }
        .inspector-tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }
        .inspector-pill {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--ink-2);
          background: var(--paper);
        }
        .inspector-projects {
          padding-top: 14px;
          border-top: 1px solid var(--line);
        }
        .inspector-sub {
          margin: 0 0 10px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--mute-text);
        }
        .inspector-proj-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .inspector-proj-item {
          font-size: 13.5px;
          color: var(--ink-2);
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .inspector-proj-item::before {
          content: "—";
          color: var(--mute-text);
          font-family: var(--font-mono);
        }
        .skills-legend {
          margin-top: 14px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--mute-text);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (min-width: 720px) {
          .periodic-grid {
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 10px;
          }
        }
        @media (min-width: 1100px) {
          .skills-layout {
            grid-template-columns: minmax(0, 1fr) 320px;
            gap: 32px;
          }
          .periodic-grid {
            grid-template-columns: repeat(8, minmax(0, 1fr));
          }
          .skill-inspector {
            position: sticky;
            top: 96px;
          }
        }
      `}</style>

      <div className="container-editorial">
        <div className="skills-head">
          <div>
            <div className="section-tag rv" style={{ ["--i" as string]: 0 }}>
              <span>02</span>
              <span>—</span>
              <span>Skills</span>
            </div>
            <h2 className="section-heading rv" style={{ ["--i" as string]: 1 }}>
              The periodic table of my <em className="serif-accent">stack.</em>
            </h2>
          </div>

          <div
            className="skills-filters rv"
            style={{ ["--i" as string]: 2 }}
            role="tablist"
            aria-label="Filter skills by family"
          >
            {families.map((fam) => {
              const active = activeFamily === fam;
              return (
                <button
                  key={fam}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`skill-chip ${active ? "is-active" : ""}`}
                  onClick={() => {
                    setActiveFamily(fam);
                    if (fam !== "All") {
                      const firstInFam = allSkills.find((s) => s.family === fam);
                      if (firstInFam) setSelectedSkill(firstInFam);
                    }
                  }}
                >
                  {fam}
                </button>
              );
            })}
          </div>
        </div>

        <div className="skills-layout">
          <div>
            <div
              ref={gridRef}
              className={`periodic-grid ${gridVisible ? "is-visible" : ""}`}
            >
              {allSkills.map((skill, idx) => {
                const row = Math.floor(idx / 8);
                const col = idx % 8;
                const delayMs = (row + col) * 40;
                const isMatch = activeFamily === "All" || skill.family === activeFamily;
                const isSelected = selectedSkill.atomicNumber === skill.atomicNumber;

                return (
                  <button
                    key={skill.atomicNumber}
                    type="button"
                    className={`el-tile ${!isMatch ? "is-dim" : ""} ${
                      isSelected ? "is-selected" : ""
                    }`}
                    style={{ ["--wave" as string]: `${delayMs}ms` }}
                    onMouseEnter={() => setSelectedSkill(skill)}
                    onFocus={() => setSelectedSkill(skill)}
                    onClick={() => setSelectedSkill(skill)}
                    aria-pressed={isSelected}
                  >
                    <div className="el-top" aria-hidden="true">
                      <span className="el-num">
                        {String(skill.atomicNumber).padStart(2, "0")}
                      </span>
                      {skill.learning && (
                        <span
                          className="el-dot"
                          title="Currently learning"
                        />
                      )}
                    </div>
                    <span className="el-symbol" aria-hidden="true">{skill.symbol}</span>
                    <span className="el-name">{skill.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="skills-legend">
              <span className="el-dot" aria-hidden="true" />
              <span>Dot denotes Generative AI &amp; LLMs (Learning) on résumé</span>
            </div>
          </div>

          <aside className="skill-inspector" aria-live="polite" aria-label="Skill inspector">
            <div className="inspector-stage">
              <span
                className="inspector-glow"
                aria-hidden="true"
                style={{ backgroundColor: glowTint }}
              />
              <div key={selectedSkill.atomicNumber} className="inspector-logo-pop">
                <TechLogo name={selectedSkill.logoKey} size={150} />
              </div>
            </div>

            <div>
              <div className="inspector-meta">
                <span>No. {String(selectedSkill.atomicNumber).padStart(2, "0")}</span>
                <span>{selectedSkill.symbol}</span>
              </div>
              <h3 className="inspector-title">{selectedSkill.name}</h3>
              <div className="inspector-tag-row">
                <span className="inspector-pill">{selectedSkill.family}</span>
                {selectedSkill.learning && (
                  <span className="inspector-pill">Learning</span>
                )}
              </div>
            </div>

            <div className="inspector-projects">
              <p className="inspector-sub">Applied in</p>
              {selectedSkill.projects.length > 0 ? (
                <ul className="inspector-proj-list">
                  {selectedSkill.projects.map((proj) => (
                    <li key={proj} className="inspector-proj-item">
                      {proj}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="inspector-proj-item" style={{ margin: 0 }}>
                  Listed in résumé {selectedSkill.family} stack
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

