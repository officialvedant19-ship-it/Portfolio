# Vedant Mendhule — Talking-Video Personal Portfolio

A quiet, editorial personal portfolio built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS 4**, and **Lenis** smooth scrolling. Every piece of copy, every link, and every credential comes strictly from `Vedant_Mendhule_CV.pdf` via `src/lib/data.ts`.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

To build and run the production bundle:

```bash
npm run build
npm run start
```

## Sections

| # | Section | Component | Interaction / Motion |
|---|---|---|---|
| — | **Hero** | `src/components/hero/Hero.tsx` | Seamless looping talking-head video (`mix-blend-mode: multiply`), auto-pause below 35% visibility, first-interaction audio unlock & icon-only sound toggle |
| 01 | **About** | `src/components/sections/About.tsx` | 3-column layout with spring-damped hanging lanyard ID card (pointer velocity swing, idle sway, hover/tap/keyboard 3D flip) |
| 02 | **Skills** | `src/components/sections/Skills.tsx` | Periodic table of résumé skills with family filters, diagonal wave entrance, and sticky brand-logo inspector |
| 03 | **Selected work** | `src/components/sections/Work.tsx` | Expanding horizontal accordion gallery (vertical accordion on mobile) with clip-path grayscale illustrative mini-UIs |
| 04 | **Certifications** | `src/components/sections/Certifications.tsx` | Sticky heading paired with left-to-right ink-flood index rows |
| 05 | **Path** | `src/components/sections/Experience.tsx` | Combined Education & Experience vertical timeline with scroll-scaled spine and stop illumination |
| 06 | **Achievements** | `src/components/sections/Achievements.tsx` | Pinned horizontal gallery driven by vertical scroll, viewport-centre lift, and easeOutQuart count-up metrics |
| 07 | **Contact** | `src/components/sections/Contact.tsx` | Per-letter hover-hopping heading, spinning "say hello" badge, clipboard copy with `aria-live`, and footer |

## Rebuilding the Hero Video & Still Assets

Requires **Python 3.11+**, `ffmpeg` / `ffprobe` on `PATH`, and `numpy`, `opencv-python`, `Pillow`.

```bash
python scripts/build-hero-assets.py --input path/to/intro.mp4
```

Optional explicit crop override (`W:H:X:Y` for a `1920x1080` source):

```bash
python scripts/build-hero-assets.py --input path/to/intro.mp4 --crop 832:1040:518:40
```

Outputs generated:
- `public/hero/hero.mp4` — H.264 (`yuv420p`, CRF 24, `-preset slow`, `+faststart`) + AAC 96 kbps
- `public/hero/hero.webm` — VP9 (CRF 36) + Opus 80 kbps
- `public/portrait-bust.webp` — `480x600` head-to-shirt portrait crop
- `public/og.jpg` — `1200x630` OpenGraph card

The script cross-fades the last `0.5 s` of video (`ffmpeg xfade`) and audio (sample-accurate raised-cosine cross-fade in `numpy`) into the opening `0.5 s`, producing a seamless loop without retiming or lip-sync drift.

## Fonts & Brand Logo Credits / Licences

- **Self-hosted fonts** (`src/fonts/*.woff2`, loaded via `next/font/local`):
  - **Inter Tight** (SIL Open Font License 1.1)
  - **Instrument Serif** (SIL Open Font License 1.1)
  - **JetBrains Mono** (SIL Open Font License 1.1)
- **Official brand SVGs** (`public/logos/`):
  - **Devicon** (`c`, `cplusplus`, `python`, `javascript`, `html5`, `css3`, `react`, `fastapi`, `flask`, `postgresql`, `mongodb`, `mysql`, `pandas`, `numpy`, `scikitlearn`, `aws`) — MIT Licence (`public/logos/LICENSE-DEVICON.txt`)
  - **Simple Icons** (`openai`, `googlegemini`, `langchain`, `ultralytics`, `mediapipe`) — CC0 1.0 Universal (`public/logos/LICENSE-SIMPLE-ICONS.md`)
  - **SVG Logos / Iconify** (`huggingface`, `tableau`) — CC0 1.0 Universal
  - All brand trademarks belong to their respective owners.

