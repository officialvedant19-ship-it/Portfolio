"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const soundBtnRef = useRef<HTMLButtonElement | null>(null);

  const [soundOn, setSoundOn] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const userMutedRef = useRef(false);
  const visibleRef = useRef(true);

  // Attempt playback with sound on load; fall back to muted playback if blocked
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;

    const tryStart = async () => {
      try {
        video.muted = false;
        await video.play();
        if (!cancelled) {
          setSoundOn(true);
          setAutoplayBlocked(false);
        }
      } catch {
        try {
          video.muted = true;
          await video.play();
          if (!cancelled) {
            setSoundOn(false);
            setAutoplayBlocked(true);
          }
        } catch {
          if (!cancelled) {
            setSoundOn(false);
            setAutoplayBlocked(true);
          }
        }
      }
    };

    tryStart();
    return () => {
      cancelled = true;
    };
  }, []);

  // Unlock sound on visitor's first pointerdown, keydown, or touchend
  useEffect(() => {
    if (!autoplayBlocked || soundOn) return;

    const unlock = (event: Event) => {
      // If user directly clicked the sound button, let its own handler toggle cleanly
      if (
        soundBtnRef.current &&
        event.target instanceof Node &&
        soundBtnRef.current.contains(event.target)
      ) {
        return;
      }
      if (userMutedRef.current) return;

      const video = videoRef.current;
      if (!video) return;

      video.muted = false;
      setSoundOn(true);
      setAutoplayBlocked(false);

      if (visibleRef.current) {
        video.play().catch(() => {
          video.muted = true;
          setSoundOn(false);
          setAutoplayBlocked(true);
        });
      }
    };

    window.addEventListener("pointerdown", unlock, { once: true, passive: true });
    window.addEventListener("keydown", unlock, { once: true });
    window.addEventListener("touchend", unlock, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchend", unlock);
    };
  }, [autoplayBlocked, soundOn]);

  // Pause video & voice when less than 35% of hero is visible; resume on return
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const isMostlyVisible = entry.intersectionRatio >= 0.35;
        visibleRef.current = isMostlyVisible;

        if (!isMostlyVisible) {
          video.pause();
        } else {
          video.play().catch(() => {});
        }
      },
      { threshold: [0, 0.2, 0.35, 0.5, 0.8] }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (soundOn) {
      userMutedRef.current = true;
      video.muted = true;
      setSoundOn(false);
      setAutoplayBlocked(false);
    } else {
      userMutedRef.current = false;
      video.muted = false;
      setSoundOn(true);
      setAutoplayBlocked(false);
      video.play().catch(() => {
        video.muted = true;
        setSoundOn(false);
      });
    }
  }, [soundOn]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="hero-section"
      aria-label={`${PROFILE.name} introduction`}
    >
      <style>{`
        .hero-section {
          position: relative;
          isolation: isolate;
          background: var(--paper);
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: clip;
          padding-top: 76px;
          padding-bottom: clamp(28px, 4.5vh, 48px);
        }
        .hero-ghost {
          position: absolute;
          top: 46%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: clamp(6rem, 23vw, 22rem);
          line-height: 0.85;
          letter-spacing: -0.055em;
          text-transform: uppercase;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(13, 13, 13, 0.085);
          user-select: none;
          pointer-events: none;
          white-space: nowrap;
        }
        .hero-stage {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          mix-blend-mode: multiply;
          pointer-events: none;
        }
        .hero-video-shell {
          position: relative;
          height: min(62svh, 520px);
          aspect-ratio: 768 / 960;
          max-width: calc(100vw - 24px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .hero-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
        }
        .hero-sound-wrap {
          position: absolute;
          right: var(--gutter);
          top: calc(76px + min(62svh, 520px) - 62px);
          z-index: 20;
        }
        .hero-sound-btn {
          position: relative;
          width: 46px;
          height: 46px;
          border-radius: 999px;
          background: var(--ink);
          color: var(--card);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 28px -10px rgba(13, 13, 13, 0.42);
          transition: transform 0.35s var(--ease), background-color 0.3s var(--ease);
        }
        .hero-sound-btn:hover {
          transform: scale(1.07);
          background: var(--maroon);
        }
        .hero-sound-btn[aria-pressed="true"] {
          background: var(--maroon);
        }
        .hero-sound-btn[aria-pressed="true"]:hover {
          background: var(--maroon-dark);
        }
        .hero-sound-btn:active {
          transform: scale(0.96);
        }
        .hero-ping {
          position: absolute;
          inset: -6px;
          border-radius: 999px;
          border: 1.5px solid var(--maroon-line);
          pointer-events: none;
          animation: heroSoundPing 2.2s var(--ease) infinite;
        }
        @keyframes heroSoundPing {
          0% {
            transform: scale(0.88);
            opacity: 0.72;
          }
          75%,
          100% {
            transform: scale(1.52);
            opacity: 0;
          }
        }
        .hero-overlay {
          position: relative;
          z-index: 3;
          width: 100%;
          margin-top: 16px;
        }
        .hero-overlay-grid {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .hero-kicker {
          font-family: var(--font-mono);
          font-size: 11.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--mute-text);
          margin: 0 0 10px;
        }
        .hero-title {
          margin: 0;
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: clamp(2.4rem, 5.2vw, 4.65rem);
          letter-spacing: -0.045em;
          line-height: 0.98;
          color: var(--ink);
          max-width: 11ch;
        }
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }
        .hero-scroll-hint {
          display: none;
          font-family: var(--font-mono);
          font-size: 11.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--mute);
        }

        @media (min-width: 900px) {
          .hero-section {
            padding-top: 0;
            padding-bottom: clamp(32px, 4.5vh, 52px);
          }
          .hero-stage {
            position: absolute;
            inset: 0;
            align-items: flex-end;
            justify-content: center;
            pointer-events: none;
          }
          .hero-video-shell {
            height: min(96svh, 1040px);
            aspect-ratio: 768 / 960;
            pointer-events: none;
          }
          .hero-sound-wrap {
            top: auto;
            right: auto;
            left: calc(50% + 148px);
            bottom: 205px;
            pointer-events: auto;
          }
          .hero-overlay {
            margin-top: auto;
            pointer-events: none;
          }
          .hero-overlay-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            align-items: flex-end;
            gap: 24px;
          }
          .hero-left {
            pointer-events: auto;
            max-width: 440px;
          }
          .hero-right {
            pointer-events: auto;
            justify-self: end;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 16px;
            max-width: 440px;
          }
          .hero-scroll-hint {
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }
        }
      `}</style>

      <div className="hero-ghost" aria-hidden="true">
        {PROFILE.firstName.toUpperCase()}
      </div>

      <div className="hero-stage">
        <div className="hero-video-shell">
          <video
            ref={videoRef}
            className="hero-video"
            poster="/hero/hero-poster.webp"
            muted
            loop
            playsInline
            preload="auto"
            aria-label={`Self-introduction video of ${PROFILE.name}`}
          >
            <source src="/hero/hero.webm" type="video/webm" />
            <source src="/hero/hero.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="hero-sound-wrap">
        {autoplayBlocked && !soundOn && <span className="hero-ping" aria-hidden="true" />}
        <button
          ref={soundBtnRef}
          type="button"
          className="hero-sound-btn"
          onClick={toggleSound}
          aria-label={soundOn ? "Mute introduction audio" : "Play introduction audio"}
          aria-pressed={soundOn}
        >
          {soundOn ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <rect x="2.2" y="1.8" width="3.2" height="10.4" rx="0.8" />
              <rect x="8.6" y="1.8" width="3.2" height="10.4" rx="0.8" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <path d="M3.2 1.8a.6.6 0 0 1 .9-.52l8.1 5.2a.6.6 0 0 1 0 1.04l-8.1 5.2a.6.6 0 0 1-.9-.52V1.8Z" />
            </svg>
          )}
        </button>
      </div>

      <div className="hero-overlay">
        <div className="container-editorial hero-overlay-grid">
          <div className="hero-left">
            <p className="hero-kicker">{PROFILE.roleSubtitle}</p>
            <h1 className="hero-title">
              AI &amp; Prompt
              <br />
              <em className="serif-accent">Engineer.</em>
            </h1>
          </div>

          <div className="hero-right">
            <div className="hero-actions">
              <a
                href="#work"
                className="btn-pill btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#work", -16);
                }}
              >
                Explore work
              </a>
              <a
                href="#contact"
                className="btn-pill btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#contact", -16);
                }}
              >
                Let&apos;s talk
              </a>
              <a
                href={PROFILE.resumePath}
                download={PROFILE.resumeFileName}
                className="btn-pill btn-secondary"
              >
                Résumé ↓
              </a>
            </div>
            <span className="hero-scroll-hint" aria-hidden="true">
              Scroll to explore ↓
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

