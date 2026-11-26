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

        /* Circular spinning "say hello" badge */
        .hello-badge {
          position: relative;
          width: 112px;
          height: 112px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--ink);
          transition: transform 0.45s var(--ease);
        }
        .hello-badge:hover {
          transform: scale(1.06);
        }
        .hello-ring {
          width: 100%;
          height: 100%;
          animation: badgeSpin 18s linear infinite;
        }
        .hello-arrow {
          position: absolute;
          font-size: 20px;
          line-height: 1;
        }
        @keyframes badgeSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
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
          text-decoration-color: var(--ink);
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
          background: var(--ink);
          color: var(--card);
          transform: translateY(-1px);
        }
        .copy-chip.is-copied {
          background: var(--ink);
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
            inset 0 0 0 1px rgba(13, 13, 13, 0.14),
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
          color: var(--ink);
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
            className="hello-badge"
            aria-label={`Say hello to ${PROFILE.name} via email`}
          >
            <svg viewBox="0 0 120 120" className="hello-ring" aria-hidden="true">
              <defs>
                <path
                  id="sayHelloCircle"
                  d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                />
              </defs>
              <text
                fill="currentColor"
                fontSize="9.4"
                fontFamily="var(--font-mono)"
                letterSpacing="2.35"
              >
                <textPath href="#sayHelloCircle">
                  SAY HELLO · SAY HELLO · SAY HELLO ·
                </textPath>
              </text>
            </svg>
            <span className="hello-arrow" aria-hidden="true">
              ↗
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

