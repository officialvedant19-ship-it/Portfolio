"use client";

import { CERTIFICATIONS } from "@/lib/data";

export function Certifications() {
  if (CERTIFICATIONS.length === 0) return null;

  return (
    <section id="certifications" className="section-pad certs-band">
      <style>{`
        .certs-band {
          background: var(--card);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .certs-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: clamp(32px, 5vw, 64px);
          align-items: start;
        }
        .certs-count {
          margin: 18px 0 0;
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--mute-text);
        }
        .certs-list {
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: 1px solid var(--line);
        }
        .cert-row {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }
        .cert-row::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--maroon-dark);
          transform: scaleX(0);
          transform-origin: 0% 50%;
          transition: transform 0.56s var(--ease);
          z-index: 0;
        }
        .cert-row:hover::before,
        .cert-row:focus-within::before {
          transform: scaleX(1);
        }
        .cert-inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr) auto;
          align-items: center;
          gap: 16px;
          padding: 26px 18px;
          color: var(--ink);
          transition: color 0.35s var(--ease);
        }
        .cert-row:hover .cert-inner,
        .cert-row:focus-within .cert-inner {
          color: var(--card);
        }
        .cert-num {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--mute-text);
          transition: color 0.35s var(--ease);
        }
        .cert-row:hover .cert-num,
        .cert-row:focus-within .cert-num {
          color: rgba(255, 255, 255, 0.72);
        }
        .cert-title {
          margin: 0;
          font-size: clamp(1.1rem, 2vw, 1.45rem);
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.25;
        }
        .cert-issuer {
          margin: 4px 0 0;
          font-size: 13.5px;
          color: var(--mute-text);
          transition: color 0.35s var(--ease);
        }
        .cert-row:hover .cert-issuer,
        .cert-row:focus-within .cert-issuer {
          color: rgba(255, 255, 255, 0.78);
        }
        .cert-right {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }
        .cert-date {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--mute-text);
          transition: color 0.35s var(--ease);
        }
        .cert-row:hover .cert-date,
        .cert-row:focus-within .cert-date {
          color: rgba(255, 255, 255, 0.72);
        }
        .cert-arrow {
          font-size: 18px;
          opacity: 0;
          transform: translateX(-10px);
          transition: opacity 0.4s var(--ease), transform 0.4s var(--ease);
        }
        .cert-row:hover .cert-arrow,
        .cert-row:focus-within .cert-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        @media (min-width: 960px) {
          .certs-grid {
            grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          }
          .certs-sticky {
            position: sticky;
            top: 110px;
          }
          .cert-inner {
            padding: 30px 24px;
          }
        }
      `}</style>

      <div className="container-editorial certs-grid">
        <div className="certs-sticky">
          <div className="section-tag rv" style={{ ["--i" as string]: 0 }}>
            <span>04</span>
            <span>—</span>
            <span>Certifications</span>
          </div>
          <h2 className="section-heading rv" style={{ ["--i" as string]: 1 }}>
            Always <em className="serif-accent">learning.</em>
          </h2>
          <p className="certs-count rv" style={{ ["--i" as string]: 2 }}>
            {String(CERTIFICATIONS.length).padStart(2, "0")} credentials on résumé
          </p>
        </div>

        <ol className="certs-list rv" style={{ ["--i" as string]: 2 }}>
          {CERTIFICATIONS.map((cert) => {
            const content = (
              <>
                <span className="cert-num">{cert.index}</span>
                <div>
                  <h3 className="cert-title">{cert.title}</h3>
                  <p className="cert-issuer">{cert.issuer}</p>
                </div>
                <div className="cert-right">
                  <span className="cert-date">{cert.date}</span>
                  <span className="cert-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </>
            );

            return (
              <li key={cert.id} className="cert-row">
                {cert.url ? (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    className="cert-inner"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="cert-inner" tabIndex={0}>
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

