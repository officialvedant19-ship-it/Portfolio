"use client";

import { useMemo, useState } from "react";
import { SKILL_GROUPS, type SkillItem } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import { TechLogo } from "@/components/ui/TechLogo";

export function Skills() {
  const allSkills = useMemo<SkillItem[]>(
    () => SKILL_GROUPS.flatMap((g) => g.items),
    []
  );
  const groupLabelMap = useMemo<Record<string, string>>(
    () => Object.fromEntries(SKILL_GROUPS.map((g) => [g.family, g.label])),
    []
  );
  const categories = useMemo(
    () => [
      { family: "All", count: allSkills.length },
      ...SKILL_GROUPS.map((g) => ({ family: g.family, count: g.items.length })),
    ],
    [allSkills.length]
  );

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(
    () => allSkills.find((s) => s.name === "Python") ?? allSkills[0]
  );

  const [stageRef, stageVisible] = useInView<HTMLDivElement>({ threshold: 0.12 });

  // Active orbit displays the focused category's skills (always 3-8 nodes, zero overlap).
  const orbitCategory =
    activeCategory === "All" ? selectedSkill.family : activeCategory;
  const orbitGroup = useMemo(
    () =>
      SKILL_GROUPS.find((g) => g.family === orbitCategory) ?? SKILL_GROUPS[0],
    [orbitCategory]
  );
  const orbitSkills = orbitGroup.items;

  // Filtered groups shown in the navigator index below (and on mobile).
  const visibleGroups = useMemo(
    () =>
      activeCategory === "All"
        ? SKILL_GROUPS
        : SKILL_GROUPS.filter((g) => g.family === activeCategory),
    [activeCategory]
  );

  const visibleSkills = useMemo(
    () => visibleGroups.flatMap((g) => g.items),
    [visibleGroups]
  );

  const selectedGlobalIdx = allSkills.findIndex(
    (s) => s.name === selectedSkill.name
  );
  const selectedOrbitIdx = Math.max(
    0,
    orbitSkills.findIndex((s) => s.name === selectedSkill.name)
  );
  const selectedAngleDeg =
    orbitSkills.length > 0
      ? -90 + (selectedOrbitIdx / orbitSkills.length) * 360
      : -90;

  const stepSkill = (delta: number) => {
    const list = visibleSkills.length > 0 ? visibleSkills : allSkills;
    const currentIdx = list.findIndex((s) => s.name === selectedSkill.name);
    const nextIdx =
      currentIdx === -1
        ? 0
        : (currentIdx + delta + list.length) % list.length;
    setSelectedSkill(list[nextIdx]);
  };

  const handleCategoryChange = (family: string) => {
    setActiveCategory(family);
    if (family !== "All") {
      const group = SKILL_GROUPS.find((g) => g.family === family);
      if (group && !group.items.some((s) => s.name === selectedSkill.name)) {
        setSelectedSkill(group.items[0]);
      }
    }
  };

  return (
    <section id="skills" className="section-pad skills-section">
      <style>{`
        .skills-head {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: clamp(28px, 4.5vh, 44px);
        }
        .skills-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .skill-cat-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 38px;
          padding: 6px 14px;
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 11.5px;
          letter-spacing: 0.02em;
          color: var(--ink-2);
          background: transparent;
          box-shadow: inset 0 0 0 1px var(--line);
          transition:
            background-color 0.3s var(--ease),
            color 0.3s var(--ease),
            box-shadow 0.3s var(--ease);
        }
        .skill-cat-btn:hover {
          color: var(--maroon);
          box-shadow: inset 0 0 0 1px var(--maroon-line);
        }
        .skill-cat-btn.is-active {
          background: var(--maroon);
          color: var(--card);
          box-shadow: inset 0 0 0 1px var(--maroon);
        }
        .skill-cat-count {
          font-size: 10px;
          opacity: 0.72;
        }

        .skills-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }

        /* Interactive Orbital Navigator Stage (Desktop / Large Tablet) */
        .orbit-card {
          display: none;
          position: relative;
          padding: 24px 28px 28px;
          border-radius: 26px;
          background: var(--card);
          box-shadow: inset 0 0 0 1px var(--line);
          overflow: hidden;
        }
        .orbit-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 12px;
        }
        .orbit-group-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--maroon);
          font-weight: 600;
        }
        .orbit-group-meta {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--mute-text);
        }
        .orbit-arena {
          position: relative;
          width: 100%;
          max-width: 580px;
          aspect-ratio: 1 / 0.84;
          margin-inline: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .orbit-guides {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .orbit-pointer {
          transform-origin: 270px 238px;
          transition: transform 0.65s var(--ease);
        }
        .orbit-core {
          position: relative;
          z-index: 2;
          width: 132px;
          height: 132px;
          border-radius: 999px;
          background: var(--paper);
          box-shadow:
            inset 0 0 0 1px var(--maroon-line),
            0 0 0 8px var(--maroon-soft),
            0 18px 40px -22px rgba(13, 13, 13, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 12px;
          text-align: center;
        }
        .orbit-core-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: orbitLogoPop 0.42s var(--ease) both;
        }
        @keyframes orbitLogoPop {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .orbit-core-name {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--ink);
          line-height: 1.15;
          max-width: 116px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .orbit-node {
          position: absolute;
          z-index: 3;
          transform: translate(-50%, -50%) scale(0.92);
          opacity: 0;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border-radius: 999px;
          background: var(--card);
          color: var(--ink);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: -0.01em;
          white-space: nowrap;
          max-width: 156px;
          box-shadow:
            inset 0 0 0 1px var(--line),
            0 8px 20px -12px rgba(13, 13, 13, 0.14);
          transition:
            opacity 0.5s var(--ease),
            transform 0.5s var(--ease),
            background-color 0.28s var(--ease),
            color 0.28s var(--ease),
            box-shadow 0.28s var(--ease);
          transition-delay: var(--nd, 0ms);
        }
        .orbit-arena.is-visible .orbit-node {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        .orbit-arena.is-visible .orbit-node:hover,
        .orbit-arena.is-visible .orbit-node:focus-visible {
          transition-delay: 0ms;
          transform: translate(-50%, -50%) scale(1.06);
          box-shadow:
            inset 0 0 0 1.5px var(--maroon),
            0 14px 28px -14px rgba(110, 29, 42, 0.28);
          z-index: 4;
        }
        .orbit-arena.is-visible .orbit-node.is-selected {
          transition-delay: 0ms;
          background: var(--maroon);
          color: var(--card);
          transform: translate(-50%, -50%) scale(1.06);
          box-shadow:
            inset 0 0 0 1.5px var(--maroon),
            0 0 0 5px var(--maroon-soft),
            0 16px 32px -14px rgba(110, 29, 42, 0.4);
          z-index: 5;
        }
        .orbit-node-icon {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: var(--paper);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .orbit-node.is-selected .orbit-node-icon {
          background: rgba(255, 255, 255, 0.94);
        }
        .orbit-node-label {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Categorized Skill Navigator Index (all 34 skills always browsable & touch-friendly) */
        .skill-nav-groups {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-top: 20px;
        }
        .skill-group-card {
          padding: 18px 20px;
          border-radius: 22px;
          background: var(--card);
          box-shadow: inset 0 0 0 1px var(--line);
        }
        .skill-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--line);
        }
        .skill-group-title {
          margin: 0;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--mute-text);
        }
        .skill-group-card.is-focused .skill-group-title {
          color: var(--maroon);
        }
        .skill-group-count {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--mute-text);
        }
        .skill-pill-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .skill-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 38px;
          padding: 6px 13px;
          border-radius: 999px;
          background: var(--paper);
          color: var(--ink);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.01em;
          box-shadow: inset 0 0 0 1px transparent;
          transition:
            background-color 0.28s var(--ease),
            color 0.28s var(--ease),
            box-shadow 0.28s var(--ease),
            transform 0.28s var(--ease);
        }
        .skill-pill:hover {
          background: var(--card);
          box-shadow: inset 0 0 0 1px var(--maroon-line);
          transform: translateY(-1px);
        }
        .skill-pill.is-selected {
          background: var(--maroon);
          color: var(--card);
          box-shadow: inset 0 0 0 1px var(--maroon);
        }
        .skill-pill-badge {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: var(--card);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .skill-pill-dot {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: var(--maroon);
          flex-shrink: 0;
        }
        .skill-pill.is-selected .skill-pill-dot {
          background: var(--paper);
        }

        /* Sticky Detail Inspector */
        .skill-inspector {
          padding: 24px;
          border-radius: 26px;
          background: var(--card);
          box-shadow:
            inset 0 0 0 1px var(--line),
            0 24px 56px -26px rgba(13, 13, 13, 0.12);
          display: flex;
          flex-direction: column;
          gap: 18px;
          order: -1;
        }
        .inspector-stage {
          position: relative;
          height: 168px;
          border-radius: 20px;
          background: var(--paper);
          box-shadow: inset 0 0 0 1px var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .inspector-ring {
          position: absolute;
          width: 132px;
          height: 132px;
          border-radius: 999px;
          border: 1px dashed var(--maroon-line);
          background: radial-gradient(circle, var(--maroon-soft) 0%, transparent 72%);
          pointer-events: none;
        }
        .inspector-logo-pop {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: orbitLogoPop 0.45s var(--ease) both;
        }
        .inspector-top-row {
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
          margin: 6px 0 0;
          font-size: clamp(1.35rem, 2.2vw, 1.65rem);
          font-weight: 700;
          letter-spacing: -0.035em;
          line-height: 1.12;
          color: var(--ink);
        }
        .inspector-group-sub {
          margin: 5px 0 0;
          font-size: 13px;
          color: var(--mute-text);
        }
        .inspector-tag-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }
        .inspector-pill {
          display: inline-flex;
          align-items: center;
          padding: 4px 11px;
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--maroon);
          background: var(--maroon-soft);
          box-shadow: inset 0 0 0 1px var(--maroon-line);
        }
        .inspector-pill-neutral {
          color: var(--ink-2);
          background: var(--paper);
          box-shadow: inset 0 0 0 1px var(--line);
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
          gap: 7px;
        }
        .inspector-proj-item {
          font-size: 13.5px;
          color: var(--ink-2);
          display: flex;
          align-items: baseline;
          gap: 8px;
          line-height: 1.45;
        }
        .inspector-proj-item::before {
          content: "—";
          color: var(--maroon);
          font-family: var(--font-mono);
          flex-shrink: 0;
        }
        .inspector-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-top: 14px;
          border-top: 1px solid var(--line);
        }
        .inspector-step-btn {
          height: 36px;
          padding-inline: 14px;
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--ink);
          background: var(--paper);
          box-shadow: inset 0 0 0 1px var(--line);
          transition: background-color 0.28s var(--ease), color 0.28s var(--ease);
        }
        .inspector-step-btn:hover {
          background: var(--maroon);
          color: var(--card);
          box-shadow: inset 0 0 0 1px var(--maroon);
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

        @media (min-width: 980px) {
          .skills-layout {
            grid-template-columns: minmax(0, 1fr) 340px;
            gap: 32px;
          }
          .orbit-card {
            display: block;
          }
          .skill-inspector {
            order: 0;
            position: sticky;
            top: 96px;
          }
          .inspector-stage {
            height: 196px;
          }
        }
        @media (min-width: 1240px) {
          .orbit-node {
            max-width: 192px;
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
              Explore my <em className="serif-accent">stack.</em>
            </h2>
          </div>

          <div
            className="skills-filters rv"
            style={{ ["--i" as string]: 2 }}
            role="tablist"
            aria-label="Filter skills by category"
          >
            {categories.map((cat) => {
              const active = activeCategory === cat.family;
              return (
                <button
                  key={cat.family}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`skill-cat-btn ${active ? "is-active" : ""}`}
                  onClick={() => handleCategoryChange(cat.family)}
                >
                  <span>{cat.family}</span>
                  <span className="skill-cat-count" aria-hidden="true">
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="skills-layout">
          <div>
            {/* Desktop Interactive Skill Orbit */}
            <div className="orbit-card">
              <div className="orbit-topbar">
                <span className="orbit-group-label">{orbitGroup.label}</span>
                <span className="orbit-group-meta">
                  {orbitSkills.length} skills in active orbit · Select any node
                </span>
              </div>

              <div
                ref={stageRef}
                className={`orbit-arena ${stageVisible ? "is-visible" : ""}`}
                role="region"
                aria-label={`${orbitGroup.label} interactive orbit`}
              >
                <svg
                  className="orbit-guides"
                  viewBox="0 0 540 476"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="270"
                    cy="238"
                    r="176"
                    stroke="rgba(13, 13, 13, 0.1)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="270"
                    cy="238"
                    r="122"
                    stroke="rgba(13, 13, 13, 0.06)"
                    strokeWidth="1"
                    strokeDasharray="3 6"
                  />
                  <line
                    x1="60"
                    y1="238"
                    x2="480"
                    y2="238"
                    stroke="rgba(13, 13, 13, 0.05)"
                    strokeWidth="1"
                  />
                  <line
                    x1="270"
                    y1="28"
                    x2="270"
                    y2="448"
                    stroke="rgba(13, 13, 13, 0.05)"
                    strokeWidth="1"
                  />
                  <g
                    className="orbit-pointer"
                    style={{
                      transform: `rotate(${selectedAngleDeg + 90}deg)`,
                    }}
                  >
                    <line
                      x1="270"
                      y1="164"
                      x2="270"
                      y2="62"
                      stroke="var(--maroon)"
                      strokeWidth="1.5"
                      strokeOpacity="0.65"
                    />
                    <circle cx="270" cy="62" r="4" fill="var(--maroon)" />
                  </g>
                </svg>

                <div className="orbit-core">
                  <div
                    key={selectedSkill.name}
                    className="orbit-core-logo"
                  >
                    <TechLogo name={selectedSkill.logoKey} size={52} />
                  </div>
                  <span className="orbit-core-name">{selectedSkill.name}</span>
                </div>

                {orbitSkills.map((skill, idx) => {
                  const angleRad =
                    ((-90 + (idx / orbitSkills.length) * 360) * Math.PI) / 180;
                  const rxPct = 32.5;
                  const ryPct = 38.0;
                  const leftPct = 50 + Math.cos(angleRad) * rxPct;
                  const topPct = 50 + Math.sin(angleRad) * ryPct;
                  const isSelected = selectedSkill.name === skill.name;

                  return (
                    <button
                      key={skill.name}
                      type="button"
                      className={`orbit-node ${isSelected ? "is-selected" : ""}`}
                      style={{
                        left: `${leftPct.toFixed(2)}%`,
                        top: `${topPct.toFixed(2)}%`,
                        ["--nd" as string]: `${idx * 45}ms`,
                      }}
                      onMouseEnter={() => setSelectedSkill(skill)}
                      onFocus={() => setSelectedSkill(skill)}
                      onClick={() => setSelectedSkill(skill)}
                      aria-pressed={isSelected}
                    >
                      <span className="orbit-node-icon" aria-hidden="true">
                        <TechLogo name={skill.logoKey} size={14} />
                      </span>
                      <span className="orbit-node-label">{skill.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categorized Skill Navigator (all 34 skills grouped & touch-ready) */}
            <div className="skill-nav-groups">
              {visibleGroups.map((group) => {
                const isFocused = group.family === orbitCategory;
                return (
                  <div
                    key={group.family}
                    className={`skill-group-card ${isFocused ? "is-focused" : ""}`}
                  >
                    <div className="skill-group-header">
                      <h3 className="skill-group-title">{group.label}</h3>
                      <span className="skill-group-count">
                        {group.items.length}{" "}
                        {group.items.length === 1 ? "skill" : "skills"}
                      </span>
                    </div>

                    <div className="skill-pill-list">
                      {group.items.map((skill) => {
                        const isSelected = selectedSkill.name === skill.name;
                        return (
                          <button
                            key={skill.name}
                            type="button"
                            className={`skill-pill ${isSelected ? "is-selected" : ""}`}
                            onClick={() => setSelectedSkill(skill)}
                            onFocus={() => setSelectedSkill(skill)}
                            aria-pressed={isSelected}
                          >
                            <span className="skill-pill-badge" aria-hidden="true">
                              <TechLogo name={skill.logoKey} size={14} />
                            </span>
                            <span>{skill.name}</span>
                            {skill.learning && (
                              <span
                                className="skill-pill-dot"
                                title="Currently learning"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="skills-legend">
              <span className="skill-pill-dot" aria-hidden="true" />
              <span>Maroon dot denotes Generative AI &amp; LLMs (Learning) on résumé</span>
            </div>
          </div>

          <aside
            className="skill-inspector"
            aria-live="polite"
            aria-label="Selected skill details"
          >
            <div className="inspector-stage">
              <span className="inspector-ring" aria-hidden="true" />
              <div key={selectedSkill.name} className="inspector-logo-pop">
                <TechLogo name={selectedSkill.logoKey} size={108} />
              </div>
            </div>

            <div>
              <div className="inspector-top-row">
                <span>{selectedSkill.family}</span>
                <span>
                  {String(selectedGlobalIdx + 1).padStart(2, "0")} /{" "}
                  {String(allSkills.length).padStart(2, "0")}
                </span>
              </div>
              <h3 className="inspector-title">{selectedSkill.name}</h3>
              <p className="inspector-group-sub">
                {groupLabelMap[selectedSkill.family] ?? selectedSkill.family}
              </p>
              <div className="inspector-tag-row">
                <span className="inspector-pill">{selectedSkill.family}</span>
                {selectedSkill.learning && (
                  <span className="inspector-pill inspector-pill-neutral">
                    Learning
                  </span>
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

            <div className="inspector-nav">
              <button
                type="button"
                className="inspector-step-btn"
                onClick={() => stepSkill(-1)}
                aria-label="Previous skill"
              >
                ← Prev
              </button>
              <button
                type="button"
                className="inspector-step-btn"
                onClick={() => stepSkill(1)}
                aria-label="Next skill"
              >
                Next →
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
