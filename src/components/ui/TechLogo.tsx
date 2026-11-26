"use client";

import React from "react";

export interface BrandMeta {
  src: string;
  label: string;
  tint: string;
}

export const BRAND: Record<string, BrandMeta> = {
  c: { src: "/logos/c.svg", label: "C", tint: "rgba(0, 89, 156, 0.14)" },
  cplusplus: { src: "/logos/cplusplus.svg", label: "C++", tint: "rgba(0, 89, 156, 0.14)" },
  python: { src: "/logos/python.svg", label: "Python", tint: "rgba(55, 118, 171, 0.15)" },
  javascript: { src: "/logos/javascript.svg", label: "JavaScript", tint: "rgba(247, 223, 30, 0.22)" },
  html5: { src: "/logos/html5.svg", label: "HTML5", tint: "rgba(227, 79, 38, 0.14)" },
  css3: { src: "/logos/css3.svg", label: "CSS3", tint: "rgba(21, 114, 182, 0.14)" },
  react: { src: "/logos/react.svg", label: "React.js", tint: "rgba(97, 218, 251, 0.20)" },
  fastapi: { src: "/logos/fastapi.svg", label: "FastAPI", tint: "rgba(0, 150, 136, 0.15)" },
  flask: { src: "/logos/flask.svg", label: "Flask", tint: "rgba(13, 13, 13, 0.10)" },
  mediapipe: { src: "/logos/mediapipe.svg", label: "MediaPipe", tint: "rgba(0, 151, 167, 0.16)" },
  postgresql: { src: "/logos/postgresql.svg", label: "PostgreSQL", tint: "rgba(51, 103, 145, 0.16)" },
  mongodb: { src: "/logos/mongodb.svg", label: "MongoDB", tint: "rgba(71, 162, 72, 0.16)" },
  mysql: { src: "/logos/mysql.svg", label: "MySQL", tint: "rgba(0, 117, 143, 0.16)" },
  pandas: { src: "/logos/pandas.svg", label: "Pandas", tint: "rgba(19, 6, 84, 0.14)" },
  numpy: { src: "/logos/numpy.svg", label: "NumPy", tint: "rgba(77, 171, 207, 0.18)" },
  scikitlearn: { src: "/logos/scikitlearn.svg", label: "Scikit-learn", tint: "rgba(247, 147, 30, 0.16)" },
  tableau: { src: "/logos/tableau.svg", label: "Tableau", tint: "rgba(233, 118, 39, 0.15)" },
  yolo: { src: "/logos/ultralytics.svg", label: "YOLO / Ultralytics", tint: "rgba(17, 31, 104, 0.14)" },
  aws: { src: "/logos/aws.svg", label: "AWS", tint: "rgba(255, 153, 0, 0.18)" },
  openai: { src: "/logos/openai.svg", label: "OpenAI / Gemini APIs", tint: "rgba(16, 163, 127, 0.16)" },
  gemini: { src: "/logos/googlegemini.svg", label: "Google Gemini", tint: "rgba(66, 133, 244, 0.16)" },
  huggingface: { src: "/logos/huggingface.svg", label: "Hugging Face", tint: "rgba(255, 210, 30, 0.22)" },
  langchain: { src: "/logos/langchain.svg", label: "LangChain", tint: "rgba(28, 60, 60, 0.15)" },
};

type ConceptRenderer = (size: number) => React.ReactNode;

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const CONCEPT: Record<string, ConceptRenderer> = {
  sql: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.5" />
      <path d="M4.5 5.5v13c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-13" />
      <path d="M4.5 12c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5" />
    </svg>
  ),
  prompting: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M7.5 9.5 10.5 12l-3 2.5" />
      <path d="M12.5 14.5h4" />
    </svg>
  ),
  cot: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <circle cx="5.5" cy="12" r="2.2" />
      <circle cx="12" cy="6.5" r="2.2" />
      <circle cx="12" cy="17.5" r="2.2" />
      <circle cx="18.5" cy="12" r="2.2" />
      <path d="M7.4 10.6 10.2 8.1M7.4 13.4l2.8 2.5M13.8 8.1l2.8 2.5M13.8 15.9l2.8-2.5" />
    </svg>
  ),
  react_prompt: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <path d="M19 8a7.5 7.5 0 0 0-13.2-2.2" />
      <path d="M5 4v3.5h3.5" />
      <path d="M5 16a7.5 7.5 0 0 0 13.2 2.2" />
      <path d="M19 20v-3.5h-3.5" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  ),
  system_prompt: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19c1.2-3.2 3.8-4.8 6.5-4.8s5.3 1.6 6.5 4.8" />
      <path d="M17.5 4.5h2.5v2.5M4 7V4.5h2.5" />
    </svg>
  ),
  templates: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M4 9.5h16M10 9.5V20" />
      <path d="M13 13.5h4M13 16.5h3" />
    </svg>
  ),
  chaining: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <rect x="3" y="8.5" width="6" height="7" rx="2" />
      <rect x="15" y="8.5" width="6" height="7" rx="2" />
      <path d="M9 12h6M13 9.8 15.2 12 13 14.2" />
    </svg>
  ),
  json_out: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <path d="M8.5 4.5C6.5 4.5 6 5.5 6 7.5v2c0 1.4-.6 2.2-2 2.5 1.4.3 2 1.1 2 2.5v2c0 2 .5 3 2.5 3" />
      <path d="M15.5 4.5c2 0 2.5 1 2.5 3v2c0 1.4.6 2.2 2 2.5-1.4.3-2 1.1-2 2.5v2c0 2-.5 3-2.5 3" />
      <circle cx="10.2" cy="12" r="0.8" fill="currentColor" />
      <circle cx="13.8" cy="12" r="0.8" fill="currentColor" />
    </svg>
  ),
  temperature: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <path d="M14 14.2V5.5a2 2 0 1 0-4 0v8.7a3.8 3.8 0 1 0 4 0Z" />
      <path d="M12 9v6.5" />
      <path d="M17 7h2.5M17 10.5h2" />
    </svg>
  ),
  rag: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <rect x="3.5" y="4" width="8.5" height="11" rx="1.8" />
      <path d="M6 7.5h3.5M6 10.5h3.5" />
      <circle cx="15.5" cy="15.5" r="3.5" />
      <path d="m18.2 18.2 2.3 2.3" />
    </svg>
  ),
  embeddings: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <path d="M4 20 20 4M4 20h15M4 20V5" />
      <circle cx="9.5" cy="14.5" r="1.4" />
      <circle cx="15" cy="13" r="1.4" />
      <circle cx="12.5" cy="8.5" r="1.4" />
      <circle cx="17.5" cy="7.5" r="1.4" />
    </svg>
  ),
  vectordb: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <polygon points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5" />
      <path d="M12 12 20 7.5M12 12 4 7.5M12 12v9" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  ),
  cv: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M4 5.5V4h1.5M20 5.5V4h-1.5M4 18.5V20h1.5M20 18.5V20h-1.5" />
    </svg>
  ),
  crypto: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
      <path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" />
      <circle cx="12" cy="15.2" r="1.3" />
    </svg>
  ),
  trophy: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <path d="M7 4.5h10v5a5 5 0 0 1-10 0v-5Z" />
      <path d="M7 6.5H4.5a2 2 0 0 0 2 3.5H7M17 6.5h2.5a2 2 0 0 1-2 3.5H17" />
      <path d="M12 14.5V19M8.5 19.5h7" />
    </svg>
  ),
  research: (size) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <path d="M12 4 3 8.5 12 13l9-4.5L12 4Z" />
      <path d="M6.5 10.5v5.2c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-5.2" />
      <path d="M20.5 9.5v6" />
    </svg>
  ),
};

export function isBrand(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(BRAND, key);
}

export function getBrandTint(key: string): string {
  return isBrand(key) ? "rgba(110, 29, 42, 0.1)" : "rgba(13, 13, 13, 0.06)";
}

interface TechLogoProps {
  name: string;
  size?: number;
  className?: string;
}

export function TechLogo({ name, size = 24, className = "" }: TechLogoProps) {
  const brand = BRAND[name];
  if (brand) {
    return (
      <img
        src={brand.src}
        alt={brand.label}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className={className}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }

  const renderer = CONCEPT[name] ?? CONCEPT.prompting;
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        color: "var(--ink)",
      }}
      aria-hidden="true"
    >
      {renderer(Math.round(size * 0.82))}
    </span>
  );
}

