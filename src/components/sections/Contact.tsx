"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

function HoppingLine({ text, italic = false }: { text: string; italic?: boolean }) {
  return (
    <span className={italic ? "serif-accent" : undefined} aria-hidden="true">
      {Array.from(text).map((char, idx) =>
        char === " " ? (
          <span key={idx} className="hop-space">
            &nbsp;
          </span>
        ) : (
          <span key={idx} className="hop-char">
            {char}
          </span>
        )
      )}
    </span>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = PROFILE.email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <style>{`
        .contact-section {
          padding-top: clamp(96px, 14vh, 160px);
          padding-bottom: 36px;
        }
        .contact-top {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 32px;
          margin-bottom: clamp(40px, 7vh, 72px);
        }
        .contact-heading {
          margin: 0;
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: clamp(2.8rem, 7.6vw, 6.4rem);
          letter-spacing: -0.05em;
          line-height: 0.96;
          color: var(--ink);
        }
        .hop-char {
          display: inline-block;
          transition: transform 0.36s var(--ease);
          will-change: transform;
        }
        .hop-char:hover {
          transform: translateY(-12px);
        }
        .hop-space {
          display: inline-block;
          width: 0.24em;
        }

        /* Interactive Contact Portal CTA */
        .contact-portal {
          position: relative;
          width: 124px;
          height: 124px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--card);
          isolation: isolate;
          transition: transform 0.45s var(--ease);
        }
        .contact-portal:hover,
        .contact-portal:focus-visible {
          transform: translateY(-2px);
        }
        .portal-dial {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          animation: portalOrbit 16s linear infinite;
          transition: transform 0.55s var(--ease);
        }
        .contact-portal:hover .portal-dial,
        .contact-portal:focus-visible .portal-dial {
          animation-duration: 7s;
        }
        @keyframes portalOrbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .portal-core {
          position: relative;
          width: 96px;
          height: 96px;
          border-radius: 999px;
          background: var(--ink);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            0 16px 32px -14px rgba(13, 13, 13, 0.36);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition:
            transform 0.45s var(--ease),
            box-shadow 0.45s var(--ease);
        }
        .portal-core::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: var(--maroon);
          transform: scale(0);
          transition: transform 0.52s var(--ease);
          z-index: 0;
        }
        .contact-portal:hover .portal-core,
        .contact-portal:focus-visible .portal-core {
          transform: scale(1.04);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.24),
            0 0 0 6px var(--maroon-soft),
            0 20px 36px -14px rgba(110, 29, 42, 0.45);
        }
        .contact-portal:hover .portal-core::before,
        .contact-portal:focus-visible .portal-core::before {
          transform: scale(1);
        }
        .portal-viewport {
          position: relative;
          z-index: 1;
          width: 78px;
          height: 44px;
          overflow: hidden;
        }
        .portal-stack {
          display: flex;
          flex-direction: column;
          transition: transform 0.48s var(--ease);
        }
        .contact-portal:hover .portal-stack,
        .contact-portal:focus-visible .portal-stack {
          transform: translateY(-44px);
        }
        .portal-face {
          height: 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          flex-shrink: 0;
        }
        .portal-label {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--paper);
          line-height: 1;
        }
        .portal-arrow {
          font-size: 18px;
          line-height: 1;
          color: var(--card);
        }
        @media (min-width: 780px) {
          .contact-portal {
            width: 136px;
            height: 136px;
          }
          .portal-core {
            width: 104px;
            height: 104px;
          }
        }

        /* Email row */
        .email-block {
          padding-block: clamp(24px, 4vh, 36px);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }
        .email-link {
          font-size: clamp(1.35rem, 3.6vw, 2.75rem);
          font-weight: 600;
          letter-spacing: -0.035em;
          color: var(--ink);
          text-decoration: underline;
          text-decoration-thickness: 1.5px;
          text-underline-offset: 8px;
          text-decoration-color: rgba(13, 13, 13, 0.28);
          word-break: break-all;
          transition: text-decoration-color 0.35s var(--ease);
        }
        .email-link:hover {
          color: var(--maroon);
          text-decoration-color: var(--maroon);
        }
        .copy-chip {
          height: 40px;
          padding-inline: 18px;
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 12px;
          background: var(--card);
          color: var(--ink);
          box-shadow: inset 0 0 0 1px var(--line);
          transition:
            background-color 0.3s var(--ease),
            color 0.3s var(--ease),
            transform 0.3s var(--ease);
        }
        .copy-chip:hover {
          background: var(--maroon);
          color: var(--card);
          transform: translateY(-1px);
        }
        .copy-chip.is-copied {
          background: var(--maroon);
          color: var(--card);
        }

        /* Channels row */
        .contact-channels {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 16px;
          padding-block: clamp(28px, 4.5vh, 44px);
        }
        .channel-card {
          padding: 20px 22px;
          border-radius: 22px;
          background: var(--card);
          box-shadow: inset 0 0 0 1px var(--line);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: transform 0.38s var(--ease), box-shadow 0.38s var(--ease);
        }
        .channel-card:hover {
          transform: translateY(-3px);
          box-shadow:
            inset 0 0 0 1px var(--maroon-line),
            0 18px 40px -24px rgba(13, 13, 13, 0.18);
        }
        .channel-k {
          display: block;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--mute-text);
        }
        .channel-v {
          display: block;
          margin-top: 4px;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.015em;
          color: var(--ink);
          word-break: break-word;
        }
        .channel-arrow {
          font-size: 18px;
          color: var(--mute-text);
          transition: transform 0.35s var(--ease), color 0.35s var(--ease);
        }
        .channel-card:hover .channel-arrow {
          transform: translate(3px, -3px);
          color: var(--maroon);
        }

        /* Footer */
        .site-footer {
          margin-top: clamp(32px, 6vh, 64px);
          padding-top: 24px;
          border-top: 1px solid var(--line);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 14px 24px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--mute-text);
        }
        .back-top-btn {
          color: var(--ink);
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 999px;
          transition: background-color 0.3s var(--ease);
        }
        .back-top-btn:hover {
          background: var(--soft);
        }

        @media (min-width: 780px) {
          .contact-channels {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>

      <div className="container-editorial">
        <div className="section-tag rv" style={{ ["--i" as string]: 0 }}>
          <span>07</span>
          <span>—</span>
          <span>Contact</span>
        </div>

        <div className="contact-top rv" style={{ ["--i" as string]: 1 }}>
          <h2 className="contact-heading" aria-label="Let's build something together.">
            <HoppingLine text="Let's build" />
            <br />
            <HoppingLine text="something " />
            <HoppingLine text="together." italic />
          </h2>

          <a
            href={`mailto:${PROFILE.email}`}
            className="contact-portal"
            aria-label={`Say hello to ${PROFILE.name} via email`}
          >
            <svg viewBox="0 0 136 136" className="portal-dial" fill="none" aria-hidden="true">
              <circle
                cx="68"
                cy="68"
                r="63"
                stroke="rgba(13, 13, 13, 0.14)"
                strokeWidth="1"
                strokeDasharray="3 5"
              />
              <path
                d="M 68 5 A 63 63 0 0 1 131 68"
                stroke="var(--maroon)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="68" cy="5" r="2.6" fill="var(--maroon)" />
              <circle cx="68" cy="131" r="2" fill="rgba(13, 13, 13, 0.32)" />
            </svg>

            <span className="portal-core">
              <span className="portal-viewport">
                <span className="portal-stack">
                  <span className="portal-face" aria-hidden="true">
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2.5" />
                      <path d="m4 7 8 6 8-6" />
                    </svg>
                    <span className="portal-label">Say hello</span>
                  </span>
                  <span className="portal-face" aria-hidden="true">
                    <span className="portal-arrow">↗</span>
                    <span className="portal-label">Email me</span>
                  </span>
                </span>
              </span>
            </span>
          </a>
        </div>

        <div className="email-block rv" style={{ ["--i" as string]: 2 }}>
          <a href={`mailto:${PROFILE.email}`} className="email-link">
            {PROFILE.email}
          </a>

          <button
            type="button"
            className={`copy-chip ${copied ? "is-copied" : ""}`}
            onClick={handleCopy}
            aria-live="polite"
          >
            {copied ? "Copied ✓" : "Copy email"}
          </button>
        </div>

        <div className="contact-channels rv" style={{ ["--i" as string]: 3 }}>
          <a href={PROFILE.phoneHref} className="channel-card">
            <div>
              <span className="channel-k">Phone</span>
              <span className="channel-v">{PROFILE.phone}</span>
            </div>
            <span className="channel-arrow" aria-hidden="true">
              ↗
            </span>
          </a>

          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="channel-card"
          >
            <div>
              <span className="channel-k">GitHub</span>
              <span className="channel-v">{PROFILE.githubHandle}</span>
            </div>
            <span className="channel-arrow" aria-hidden="true">
              ↗
            </span>
          </a>

          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            className="channel-card"
          >
            <div>
              <span className="channel-k">LinkedIn</span>
              <span className="channel-v">{PROFILE.linkedinHandle}</span>
            </div>
            <span className="channel-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>

        <footer className="site-footer">
          <span>© 2026 {PROFILE.name}</span>
          <button
            type="button"
            className="back-top-btn"
            onClick={() => scrollToTarget(0)}
          >
            Back to top ↑
          </button>
          <span>Built with Next.js</span>
        </footer>
      </div>
    </section>
  );
}

