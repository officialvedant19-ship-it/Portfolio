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
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const wasOpenRef = useRef(false);

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

  // Automatically close mobile menu if viewport switches to desktop (>= 820px)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 820px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setScrollLocked(false);
        setMenuOpen(false);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Lock page scroll, handle Escape key, and restore focus cleanly
  useEffect(() => {
    setScrollLocked(menuOpen);

    if (menuOpen) {
      wasOpenRef.current = true;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          setScrollLocked(false);
          setMenuOpen(false);
          toggleBtnRef.current?.focus();
        }
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        window.removeEventListener("keydown", onKeyDown);
        setScrollLocked(false);
      };
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
    }
  }, [menuOpen]);

  // Guarantee scroll is unlocked on unmount
  useEffect(() => {
    return () => {
      setScrollLocked(false);
    };
  }, []);

  const navigateAfterClosing = (target: string | number, offset = 0) => {
    if (menuOpen) {
      // Unlock synchronously first, then close menu and scroll on the next frame
      // so Lenis and native scroll containers are fully active.
      setScrollLocked(false);
      setMenuOpen(false);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          scrollToTarget(target, offset);
        });
      });
    } else {
      scrollToTarget(target, offset);
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    navigateAfterClosing(`#${targetId}`, -16);
  };

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigateAfterClosing(0, 0);
  };

  const handleToggleMenu = () => {
    setMenuOpen((prev) => {
      const next = !prev;
      if (!next) {
        setScrollLocked(false);
      }
      return next;
    });
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
          z-index: 1050;
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
          z-index: 1000;
          padding-top: calc(14px + env(safe-area-inset-top, 0px));
          padding-bottom: 14px;
          pointer-events: none;
        }
        .site-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-left: max(var(--gutter), env(safe-area-inset-left, 0px));
          padding-right: max(var(--gutter), env(safe-area-inset-right, 0px));
        }
        .brand-btn {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 4px;
          border-radius: 999px;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          min-width: 0;
        }
        .brand-mark {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
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
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          min-width: 82px;
          padding-inline: 18px;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow:
            inset 0 0 0 1px var(--line),
            0 6px 18px -10px rgba(13, 13, 13, 0.14);
          color: var(--ink);
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          flex-shrink: 0;
          transition:
            background-color 0.3s var(--ease),
            color 0.3s var(--ease),
            box-shadow 0.3s var(--ease);
        }
        .nav-mobile-toggle[aria-expanded="true"] {
          background: var(--maroon);
          color: var(--paper);
          box-shadow: 0 8px 20px -10px rgba(110, 29, 42, 0.45);
        }
        .mobile-overlay {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100vh;
          height: 100dvh;
          max-height: 100dvh;
          z-index: 950;
          background: var(--paper);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 28px;
          overflow-y: auto;
          overscroll-behavior: contain;
          touch-action: pan-y;
          -webkit-overflow-scrolling: touch;
          padding-top: calc(88px + env(safe-area-inset-top, 0px));
          padding-bottom: calc(28px + env(safe-area-inset-bottom, 0px));
          padding-left: max(var(--gutter), env(safe-area-inset-left, 0px));
          padding-right: max(var(--gutter), env(safe-area-inset-right, 0px));
          clip-path: inset(0 0 100% 0);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition:
            clip-path 0.58s var(--ease),
            opacity 0.38s var(--ease),
            visibility 0s linear 0.58s;
        }
        .mobile-overlay.is-open {
          clip-path: inset(0 0 0% 0);
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transition:
            clip-path 0.58s var(--ease),
            opacity 0.38s var(--ease),
            visibility 0s linear 0s;
        }
        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          min-height: 54px;
          padding-block: 10px;
          border-bottom: 1px solid var(--line);
          opacity: 0;
          transform: translateY(18px);
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          transition:
            opacity 0.48s var(--ease),
            transform 0.48s var(--ease),
            color 0.25s var(--ease);
        }
        .mobile-overlay.is-open .mobile-link {
          opacity: 1;
          transform: translateY(0);
          transition-delay: calc(var(--mi, 0) * 45ms + 90ms);
        }
        .mobile-link-left {
          display: inline-flex;
          align-items: baseline;
          gap: 16px;
          min-width: 0;
        }
        .mobile-link-num {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 600;
          color: var(--maroon);
          flex-shrink: 0;
        }
        .mobile-link-label {
          font-size: clamp(1.7rem, 7.2vw, 2.75rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.08;
          color: var(--ink);
          transition: color 0.25s var(--ease);
        }
        .mobile-link.is-active .mobile-link-label,
        .mobile-link:active .mobile-link-label {
          color: var(--maroon);
        }
        .mobile-active-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--maroon);
          flex-shrink: 0;
        }
        .mobile-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px 18px;
          padding-top: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--mute-text);
        }
        .mobile-meta a {
          display: inline-flex;
          align-items: center;
          min-height: 36px;
          word-break: break-word;
          touch-action: manipulation;
        }
        .mobile-meta a:hover,
        .mobile-meta a:focus-visible {
          color: var(--maroon);
        }
        @media (min-width: 820px) {
          .site-header {
            padding-block: 16px;
          }
          .nav-pill-wrap {
            display: inline-flex;
          }
          .nav-mobile-toggle {
            display: none;
          }
          .mobile-overlay {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .mobile-overlay,
          .mobile-overlay.is-open,
          .mobile-link,
          .mobile-overlay.is-open .mobile-link {
            transition: none !important;
            transition-delay: 0ms !important;
            transform: none !important;
          }
          .mobile-overlay {
            clip-path: none;
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
            <span className={`brand-mark ${scrolled && !menuOpen ? "is-solid" : ""}`} aria-hidden="true">
              {PROFILE.initials}
            </span>
            <span className={`brand-name ${scrolled && !menuOpen ? "is-hidden" : ""}`}>
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
              ref={toggleBtnRef}
              type="button"
              className="nav-mobile-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-overlay"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={handleToggleMenu}
            >
              <span>{menuOpen ? "Close" : "Menu"}</span>
            </button>
          </nav>
        </div>
      </header>

      <div
        id="mobile-nav-overlay"
        role="dialog"
        aria-modal={menuOpen ? "true" : undefined}
        aria-label="Mobile navigation menu"
        className={`mobile-overlay ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
        data-lenis-prevent
      >
        <nav aria-label="Mobile navigation" className="mobile-links">
          {NAV.map((item, idx) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                tabIndex={menuOpen ? 0 : -1}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`mobile-link ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "location" : undefined}
                style={{ ["--mi" as string]: idx }}
              >
                <span className="mobile-link-left">
                  <span className="mobile-link-num">{item.index}</span>
                  <span className="mobile-link-label">{item.label}</span>
                </span>
                {isActive && <span className="mobile-active-dot" aria-hidden="true" />}
              </a>
            );
          })}
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
