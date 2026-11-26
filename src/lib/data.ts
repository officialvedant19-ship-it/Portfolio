export interface Profile {
  name: string;
  firstName: string;
  initials: string;
  role: string;
  roleSubtitle: string;
  email: string;
  phone: string;
  phoneHref: string;
  location: string | null;
  resumeSummary: string;
  aboutSecondaryLine: string;
  quote: string;
  github: string;
  githubHandle: string;
  linkedin: string;
  linkedinHandle: string;
  resumePath: string;
  resumeFileName: string;
  languages: string[];
  department: string;
  graduationYear: string;
}

export interface NavItem {
  id: string;
  label: string;
  index: string;
}

export interface SkillItem {
  atomicNumber: number;
  symbol: string;
  name: string;
  family: string;
  logoKey: string;
  projects: string[];
  learning?: boolean;
}

export interface SkillGroup {
  family: string;
  label: string;
  items: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  period: string;
  year: string;
  title: string;
  organization: string;
  bullets: string[];
  summary: string;
}

export interface EducationItem {
  id: string;
  period: string;
  year: string;
  degree: string;
  institution: string;
  status: string;
  detail: string;
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  kicker: string;
  period: string;
  description: string;
  features: string[];
  tech: { name: string; logoKey: string }[];
  github?: string;
  uiVariant: "fitness" | "attendance" | "crypto";
}

export interface CertificationItem {
  id: string;
  index: string;
  title: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface AchievementItem {
  id: string;
  index: string;
  label: string;
  caption: string;
  detail: string;
  metricValue: number | null;
  metricPrefix?: string;
  metricSuffix?: string;
  metricDisplay?: string;
  logoKey: string;
}

export const PROFILE: Profile = {
  name: "Vedant Mendhule",
  firstName: "Vedant",
  initials: "VM",
  role: "AI & Prompt Engineer.",
  roleSubtitle: "Prompt Engineer · AI Engineer · Generative AI",
  email: "officialvedant19@gmail.com",
  phone: "+91 7796234194",
  phoneHref: "tel:+917796234194",
  location: null,
  resumeSummary:
    "Final-year B.Tech IT student and Analytics Intern who builds AI products end to end, from ML model to API to React dashboard. Built an AI Fitness Tracker that placed 3rd at SPARK, and hold the AWS Cloud Practitioner certification with hands-on prompt engineering (few-shot, CoT, RAG). Seeking an entry-level Prompt Engineer, AI Engineer or Generative AI role.",
  aboutSecondaryLine:
    "Pursuing B.Tech (IT) at K.D.K College of Engineering (Class of 2027) and recently completed an Analytics Internship at Greamio Technologies Pvt. Ltd.",
  quote:
    "Building AI products end to end — from ML model and prompt design to API and React dashboard.",
  github: "https://github.com/officialvedant19-ship-it",
  githubHandle: "github.com/officialvedant19-ship-it",
  linkedin: "https://www.linkedin.com/in/vedant-mendhule",
  linkedinHandle: "linkedin.com/in/vedant-mendhule",
  resumePath: "/Vedant_Mendhule_CV.pdf",
  resumeFileName: "Vedant_Mendhule_CV.pdf",
  languages: ["English", "Marathi", "Hindi"],
  department: "B.Tech (IT)",
  graduationYear: "2027",
};

export const NAV: NavItem[] = [
  { id: "about", label: "About", index: "01" },
  { id: "skills", label: "Skills", index: "02" },
  { id: "work", label: "Work", index: "03" },
  { id: "experience", label: "Experience", index: "05" },
  { id: "achievements", label: "Achievements", index: "06" },
  { id: "contact", label: "Contact", index: "07" },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Languages",
    label: "Programming Languages",
    items: [
      {
        atomicNumber: 1,
        symbol: "C",
        name: "C",
        family: "Languages",
        logoKey: "c",
        projects: [],
      },
      {
        atomicNumber: 2,
        symbol: "Cp",
        name: "C++",
        family: "Languages",
        logoKey: "cplusplus",
        projects: [],
      },
      {
        atomicNumber: 3,
        symbol: "Py",
        name: "Python",
        family: "Languages",
        logoKey: "python",
        projects: [
          "AI Fitness Tracker",
          "Rudra Cryptographic Interface",
          "Greamio Technologies (Analytics Intern)",
        ],
      },
      {
        atomicNumber: 4,
        symbol: "Js",
        name: "JavaScript",
        family: "Languages",
        logoKey: "javascript",
        projects: ["Rudra Cryptographic Interface"],
      },
      {
        atomicNumber: 5,
        symbol: "Sq",
        name: "SQL",
        family: "Languages",
        logoKey: "sql",
        projects: ["Greamio Technologies (Analytics Intern)"],
      },
    ],
  },
  {
    family: "Frontend",
    label: "Frontend Technologies",
    items: [
      {
        atomicNumber: 6,
        symbol: "Ht",
        name: "HTML",
        family: "Frontend",
        logoKey: "html5",
        projects: ["AI Fitness Tracker", "Rudra Cryptographic Interface"],
      },
      {
        atomicNumber: 7,
        symbol: "Cs",
        name: "CSS",
        family: "Frontend",
        logoKey: "css3",
        projects: ["AI Fitness Tracker", "Rudra Cryptographic Interface"],
      },
      {
        atomicNumber: 8,
        symbol: "Re",
        name: "React.js",
        family: "Frontend",
        logoKey: "react",
        projects: ["AI Fitness Tracker"],
      },
    ],
  },
  {
    family: "Backend",
    label: "Backend & Vision",
    items: [
      {
        atomicNumber: 9,
        symbol: "Fa",
        name: "FastAPI",
        family: "Backend",
        logoKey: "fastapi",
        projects: ["AI Fitness Tracker"],
      },
      {
        atomicNumber: 10,
        symbol: "Fl",
        name: "Flask",
        family: "Backend",
        logoKey: "flask",
        projects: ["Rudra Cryptographic Interface"],
      },
      {
        atomicNumber: 11,
        symbol: "Mp",
        name: "MediaPipe",
        family: "Backend",
        logoKey: "mediapipe",
        projects: [],
      },
    ],
  },
  {
    family: "Databases",
    label: "Databases",
    items: [
      {
        atomicNumber: 12,
        symbol: "Pg",
        name: "PostgreSQL",
        family: "Databases",
        logoKey: "postgresql",
        projects: ["AI Fitness Tracker"],
      },
      {
        atomicNumber: 13,
        symbol: "Mg",
        name: "MongoDB",
        family: "Databases",
        logoKey: "mongodb",
        projects: [],
      },
      {
        atomicNumber: 14,
        symbol: "My",
        name: "MySQL",
        family: "Databases",
        logoKey: "mysql",
        projects: [],
      },
    ],
  },
  {
    family: "Data & ML",
    label: "Data, ML & Cloud",
    items: [
      {
        atomicNumber: 15,
        symbol: "Pd",
        name: "Pandas",
        family: "Data & ML",
        logoKey: "pandas",
        projects: ["Greamio Technologies (Analytics Intern)"],
      },
      {
        atomicNumber: 16,
        symbol: "Np",
        name: "NumPy",
        family: "Data & ML",
        logoKey: "numpy",
        projects: ["Greamio Technologies (Analytics Intern)"],
      },
      {
        atomicNumber: 17,
        symbol: "Sk",
        name: "Scikit-learn",
        family: "Data & ML",
        logoKey: "scikitlearn",
        projects: ["AI Fitness Tracker"],
      },
      {
        atomicNumber: 18,
        symbol: "Tb",
        name: "Tableau",
        family: "Data & ML",
        logoKey: "tableau",
        projects: ["Greamio Technologies (Analytics Intern)"],
      },
      {
        atomicNumber: 19,
        symbol: "Yl",
        name: "YOLO & CV",
        family: "Data & ML",
        logoKey: "yolo",
        projects: ["Smart Attendance Management System using YOLO"],
      },
      {
        atomicNumber: 20,
        symbol: "Aw",
        name: "AWS",
        family: "Data & ML",
        logoKey: "aws",
        projects: ["AWS Certified Cloud Practitioner"],
      },
    ],
  },
  {
    family: "Prompting",
    label: "Prompt Engineering",
    items: [
      {
        atomicNumber: 21,
        symbol: "Zf",
        name: "Zero / Few-shot",
        family: "Prompting",
        logoKey: "prompting",
        projects: [],
      },
      {
        atomicNumber: 22,
        symbol: "Ct",
        name: "Chain-of-Thought",
        family: "Prompting",
        logoKey: "cot",
        projects: [],
      },
      {
        atomicNumber: 23,
        symbol: "Ra",
        name: "ReAct",
        family: "Prompting",
        logoKey: "react_prompt",
        projects: [],
      },
      {
        atomicNumber: 24,
        symbol: "Rs",
        name: "Role & System Prompts",
        family: "Prompting",
        logoKey: "system_prompt",
        projects: [],
      },
      {
        atomicNumber: 25,
        symbol: "Pt",
        name: "Prompt Templates",
        family: "Prompting",
        logoKey: "templates",
        projects: [],
      },
      {
        atomicNumber: 26,
        symbol: "Pc",
        name: "Prompt Chaining",
        family: "Prompting",
        logoKey: "chaining",
        projects: [],
      },
      {
        atomicNumber: 27,
        symbol: "Jn",
        name: "JSON Outputs",
        family: "Prompting",
        logoKey: "json_out",
        projects: [],
      },
      {
        atomicNumber: 28,
        symbol: "Tp",
        name: "Temperature",
        family: "Prompting",
        logoKey: "temperature",
        projects: [],
      },
    ],
  },
  {
    family: "GenAI & LLMs",
    label: "Generative AI & LLMs (Learning)",
    items: [
      {
        atomicNumber: 29,
        symbol: "Oa",
        name: "OpenAI / Gemini APIs",
        family: "GenAI & LLMs",
        logoKey: "openai",
        projects: [],
        learning: true,
      },
      {
        atomicNumber: 30,
        symbol: "Hf",
        name: "Hugging Face",
        family: "GenAI & LLMs",
        logoKey: "huggingface",
        projects: [],
        learning: true,
      },
      {
        atomicNumber: 31,
        symbol: "Lc",
        name: "LangChain",
        family: "GenAI & LLMs",
        logoKey: "langchain",
        projects: [],
        learning: true,
      },
      {
        atomicNumber: 32,
        symbol: "Rg",
        name: "RAG",
        family: "GenAI & LLMs",
        logoKey: "rag",
        projects: [],
        learning: true,
      },
      {
        atomicNumber: 33,
        symbol: "Em",
        name: "Embeddings",
        family: "GenAI & LLMs",
        logoKey: "embeddings",
        projects: [],
        learning: true,
      },
      {
        atomicNumber: 34,
        symbol: "Vd",
        name: "Vector DBs",
        family: "GenAI & LLMs",
        logoKey: "vectordb",
        projects: [],
        learning: true,
      },
    ],
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "greamio-analytics-intern",
    period: "Apr – Sep 2026",
    year: "2026",
    title: "Analytics Intern",
    organization: "Greamio Technologies Pvt. Ltd.",
    bullets: [
      "Analysed data with Python (Pandas, NumPy) and SQL to solve analytical problems.",
      "Applied statistical analysis and hypothesis testing to improve model precision.",
      "Built Tableau dashboards connected to databases to support analysis and reporting.",
    ],
    summary:
      "Analysed data with Python (Pandas, NumPy) and SQL, applied statistical analysis and hypothesis testing to improve model precision, and built database-connected Tableau dashboards.",
  },
];

export const EDUCATION: EducationItem[] = [
  {
    id: "kdk-btech-it",
    period: "Pursuing · 2027",
    year: "2027",
    degree: "B.Tech (IT)",
    institution: "K.D.K College of Engineering",
    status: "Pursuing",
    detail: "Final-year Bachelor of Technology in Information Technology.",
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "ai-fitness-tracker",
    index: "01",
    title: "AI Fitness Tracker",
    kicker: "Full-Stack AI · Mar 2026",
    period: "Mar 2026",
    description:
      "Responsive full-stack application to track workouts, calories and sleep with analytical progress dashboards and personalised AI recommendations. Ranked 3rd in the SPARK Competition.",
    features: [
      "Workout, calorie and sleep tracking",
      "Analytical progress dashboards",
      "Personalised Scikit-learn AI recommendations",
      "FastAPI REST APIs with PostgreSQL backend",
    ],
    tech: [
      { name: "Python", logoKey: "python" },
      { name: "FastAPI", logoKey: "fastapi" },
      { name: "React.js", logoKey: "react" },
      { name: "PostgreSQL", logoKey: "postgresql" },
      { name: "Scikit-learn", logoKey: "scikitlearn" },
    ],
    uiVariant: "fitness",
  },
  {
    id: "smart-attendance-yolo",
    index: "02",
    title: "Smart Attendance Management System using YOLO",
    kicker: "Computer Vision · Dec 2025 – Feb 2026",
    period: "Dec 2025 – Feb 2026",
    description:
      "AI-powered face-based attendance automation system developed using YOLO and Computer Vision in an industry-based team to reduce manual attendance effort and improve efficiency.",
    features: [
      "YOLO object & face detection pipeline",
      "Automated face-based attendance logging",
      "Built in an industry-based team",
      "Reduced manual attendance effort",
    ],
    tech: [
      { name: "YOLO", logoKey: "yolo" },
      { name: "Computer Vision", logoKey: "cv" },
      { name: "Python", logoKey: "python" },
    ],
    uiVariant: "attendance",
  },
  {
    id: "rudra-cryptographic-interface",
    index: "03",
    title: "Rudra Cryptographic Interface",
    kicker: "Applied Cryptography · Oct 2026",
    period: "Oct 2026",
    description:
      "Full-stack web application for secure text and multi-format file encryption built around a custom four-key algorithm (TetraCipher) with modern key exchange and built-in cryptanalysis tools.",
    features: [
      "Text & multi-format file encryption (TetraCipher)",
      "X25519 ECDH key exchange",
      "HKDF-SHA256 key derivation & AES-GCM",
      "Built-in cryptanalysis tools",
    ],
    tech: [
      { name: "Python", logoKey: "python" },
      { name: "Flask", logoKey: "flask" },
      { name: "JavaScript", logoKey: "javascript" },
      { name: "X25519", logoKey: "crypto" },
      { name: "AES-GCM", logoKey: "crypto" },
    ],
    uiVariant: "crypto",
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: "aws-ccp",
    index: "01",
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "2026",
  },
  {
    id: "adca",
    index: "02",
    title: "Advanced Diploma in Computer Application (ADCA)",
    issuer: "Independent Skill Development Mission",
    date: "Jan 2026",
  },
  {
    id: "dsa-bootcoding",
    index: "03",
    title: "Data Structures & Algorithms (DSA)",
    issuer: "Bootcoding Pvt. Ltd.",
    date: "Mar 2025",
  },
];

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "spark-3rd",
    index: "01 / 03",
    label: "SPARK Competition",
    caption: "Ranked 3rd Place",
    detail: "Awarded 3rd place for the AI Fitness Tracker project.",
    metricValue: 3,
    metricSuffix: "rd",
    logoKey: "trophy",
  },
  {
    id: "avishkar-state",
    index: "02 / 03",
    label: "Avishkar Research Convention",
    caption: "Maharashtra State Representative",
    detail:
      "Represented K.D.K College of Engineering at the Maharashtra State Inter-University Research Convention.",
    metricValue: null,
    metricDisplay: "State",
    logoKey: "research",
  },
  {
    id: "aws-certified",
    index: "03 / 03",
    label: "AWS Cloud Practitioner",
    caption: "Certified · 2026",
    detail: "Hold the AWS Certified Cloud Practitioner certification.",
    metricValue: 2026,
    logoKey: "aws",
  },
];

