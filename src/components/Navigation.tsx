"use client";

import { useEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { usePageScrollProgress } from "@/lib/hooks";
import { scrollToTarget, setScrollLocked } from "@/lib/scroll";

export function Navigation() {
  const { progress, scrollY } = usePageScrollProgress();
  const scrolled = scrollY > 40;
  const [activeId, setActiveId] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navListRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Track active section via IntersectionObserver with exact rootMargin: -45% 0px -50% 0px
  useEffect(() => {
    const sections = NAV.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    for (const sec of sections) observer.observe(sec);
    return () => observer.disconnect();
  }, []);

  // Reset active indicator when scrolled right back to the hero top
  useEffect(() => {
    if (scrollY < 120) {
      setActiveId("");
    }
  }, [scrollY]);

  // Measure active link pill coordinates
  useEffect(() => {
    const measure = () => {
      if (!activeId || !navListRef.current) {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }));
        return;
      }
      const linkEl = linkRefs.current[activeId];
      if (!linkEl) {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }));
        return;
      }
      setPillStyle({
        left: linkEl.offsetLeft,
        width: linkEl.offsetWidth,
        opacity: 1,
      });
    };

    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, [activeId, scrolled]);

  // Lock page scroll & listen for Escape when mobile menu is open
  useEffect(() => {
    setScrollLocked(menuOpen);
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      setScrollLocked(false);
    };
  }, [menuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToTarget(`#${targetId}`, -16);
  };

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToTarget(0);
  };

  return (
    <>
      <style>{`
        .nav-progress {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          z-index: 120;
          pointer-events: none;
          background: transparent;
        }
        .nav-progress-bar {
          width: 100%;
          height: 100%;
          background: var(--maroon);
          transform-origin: 0 50%;
          will-change: transform;
        }
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 90;
          padding-block: 16px;
          pointer-events: none;
        }
        .site-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .brand-btn {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 4px;
          border-radius: 999px;
        }
        .brand-mark {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: -0.02em;
          border: 1.5px solid var(--ink);
          background: transparent;
          color: var(--ink);
          transition:
            background-color 0.45s var(--ease),
            color 0.45s var(--ease),
            transform 0.72s var(--ease);
        }
        .brand-mark.is-solid {
          background: var(--ink);
          color: var(--paper);
        }
        .brand-btn:hover .brand-mark,
        .brand-btn:focus-visible .brand-mark {
          transform: rotate(360deg);
          border-color: var(--maroon);
        }
        .brand-btn:hover .brand-mark.is-solid,
        .brand-btn:focus-visible .brand-mark.is-solid {
          background: var(--maroon);
        }
        .brand-name {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--ink);
          transition: opacity 0.4s var(--ease), transform 0.4s var(--ease);
          white-space: nowrap;
        }
        .brand-name.is-hidden {
          opacity: 0;
          transform: translateX(-8px);
          pointer-events: none;
        }
        .nav-pill-wrap {
          pointer-events: auto;
          position: relative;
          display: none;
          align-items: center;
          padding: 5px;
          border-radius: 999px;
          background: transparent;
          transition:
            background-color 0.45s var(--ease),
            box-shadow 0.45s var(--ease),
            backdrop-filter 0.45s var(--ease);
        }
        .nav-pill-wrap.is-glass {
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow:
            inset 0 0 0 1px var(--line),
            0 10px 30px -14px rgba(13, 13, 13, 0.12);
        }
        .nav-indicator {
          position: absolute;
          top: 5px;
          bottom: 5px;
          border-radius: 999px;
          background: var(--maroon);
          transition:
            left 0.48s var(--ease),
            width 0.48s var(--ease),
            opacity 0.3s var(--ease);
          pointer-events: none;
          z-index: 0;
        }
        .nav-link {
          position: relative;
          z-index: 1;
          padding: 8px 15px;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--ink-2);
          transition: color 0.35s var(--ease);
          white-space: nowrap;
        }
        .nav-link:hover {
          color: var(--ink);
        }
        .nav-link.is-active {
          color: var(--card);
        }
        .nav-mobile-toggle {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 38px;
          padding-inline: 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: inset 0 0 0 1px var(--line);
          color: var(--ink);
          transition: background-color 0.3s var(--ease), color 0.3s var(--ease);
        }
        .nav-mobile-toggle[aria-expanded="true"] {
          background: var(--maroon);
          color: var(--paper);
          box-shadow: none;
        }
        .mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 80;
          background: var(--paper);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 104px var(--gutter) 40px;
          clip-path: inset(0 0 100% 0);
          opacity: 0;
          pointer-events: none;
          transition:
            clip-path 0.65s var(--ease),
            opacity 0.4s var(--ease);
        }
        .mobile-overlay.is-open {
          clip-path: inset(0 0 0% 0);
          opacity: 1;
          pointer-events: auto;
        }
        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mobile-link {
          display: flex;
          align-items: baseline;
          gap: 18px;
          padding-block: 10px;
          border-bottom: 1px solid var(--line);
          opacity: 0;
          transform: translateY(22px);
          transition:
            opacity 0.55s var(--ease),
            transform 0.55s var(--ease);
        }
        .mobile-overlay.is-open .mobile-link {
          opacity: 1;
          transform: translateY(0);
          transition-delay: calc(var(--mi, 0) * 55ms + 120ms);
        }
        .mobile-link-num {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--maroon);
        }
        .mobile-link-label {
          font-size: clamp(2rem, 9vw, 3rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.05;
          color: var(--ink);
        }
        .mobile-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--mute);
        }
        @media (min-width: 820px) {
          .nav-pill-wrap {
            display: inline-flex;
          }
          .nav-mobile-toggle {
            display: none;
          }
        }
      `}</style>

      <div className="nav-progress" aria-hidden="true">
        <div
          className="nav-progress-bar"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <header className="site-header">
        <div className="container-editorial site-header-inner">
          <a
            href="#top"
            onClick={handleBrandClick}
            className="brand-btn"
          >
            <span className={`brand-mark ${scrolled ? "is-solid" : ""}`} aria-hidden="true">
              {PROFILE.initials}
            </span>
            <span className={`brand-name ${scrolled ? "is-hidden" : ""}`}>
              {PROFILE.name}
            </span>
          </a>

          <nav aria-label="Primary">
            <div
              ref={navListRef}
              className={`nav-pill-wrap ${scrolled ? "is-glass" : ""}`}
            >
              <span
                className="nav-indicator"
                aria-hidden="true"
                style={{
                  left: pillStyle.left,
                  width: pillStyle.width,
                  opacity: pillStyle.opacity,
                }}
              />
              {NAV.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    ref={(el) => {
                      linkRefs.current[item.id] = el;
                    }}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`nav-link ${isActive ? "is-active" : ""}`}
                    aria-current={isActive ? "location" : undefined}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            <button
              type="button"
              className="nav-mobile-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-overlay"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span>{menuOpen ? "Close" : "Menu"}</span>
            </button>
          </nav>
        </div>
      </header>

      <div
        id="mobile-nav-overlay"
        className={`mobile-overlay ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation" className="mobile-links">
          {NAV.map((item, idx) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              tabIndex={menuOpen ? 0 : -1}
              onClick={(e) => handleNavClick(e, item.id)}
              className="mobile-link"
              style={{ ["--mi" as string]: idx }}
            >
              <span className="mobile-link-num">{item.index}</span>
              <span className="mobile-link-label">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="mobile-meta">
          <a href={`mailto:${PROFILE.email}`} tabIndex={menuOpen ? 0 : -1}>
            {PROFILE.email}
          </a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer" tabIndex={menuOpen ? 0 : -1}>
            GitHub ↗
          </a>
          <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" tabIndex={menuOpen ? 0 : -1}>
            LinkedIn ↗
          </a>
        </div>
      </div>
    </>
  );
}

