/* ==================================================================
   Site content and settings.

   Content rule: every statement about the company, roles and hiring
   comes from the owner's original preview (reference/gemini-original.html),
   lightly reworded for plain English. Nothing here is new information.
   Placeholders that must be replaced are marked "← replace".
   ================================================================== */

export interface SiteConfig {
  /** Inbox that receives applications. Also shown to people who prefer to email. */
  careersEmail: string;
  /** Optional second contact shown in the footer (the original preview had one). Leave empty to hide. */
  corporateEmail: string;
  /**
   * Optional. After you confirm FormSubmit's activation email, it gives you a
   * random ID. Put it here to keep the address out of the form's code.
   */
  formsubmitId: string;
  /** Largest CV accepted, in MB. FormSubmit allows about 10 MB in total. */
  maxUploadMB: number;
  /**
   * Virtual fitting film for the 3D studio section. Make the files with `pnpm video` (it prints
   * these values). Leave src empty to show the jacket drawing instead.
   * width/height are the film's pixel size; the frame keeps that shape.
   */
  fitOnVideo: { src: string; webm: string; poster: string; width: number; height: number };
}

export const CONFIG: SiteConfig = {
  careersEmail: 'careers@example.com', // ← replace before publishing
  corporateEmail: '', // ← optional
  formsubmitId: '',
  maxUploadMB: 10,
  // Boomerang loop made from video-source/fit-on-source.mp4 (AI-generated, illustrative).
  // 360×640 is soft: replace with a 1080p take when available (see HANDOVER §6).
  fitOnVideo: { src: 'video/fit-on.mp4', webm: 'video/fit-on.webm', poster: 'video/fit-on-poster.jpg', width: 1080, height: 1920 },
};

export const COMPANY = 'Aphrodite (Pvt) Ltd';

/* ------------------------------------------------------------------
   Hero
   ------------------------------------------------------------------ */
/** Hero: the original preview's wording. */
export const HERO = {
  eyebrow: 'Incorporated in Sri Lanka · House of Modern Attire',
  /** Each entry is one line of the headline (each rises in on load). */
  titleLines: ['The Architecture\u00a0of'], // \u00a0 keeps "of" with "Architecture" on phones
  titleAccent: 'Modern Attire.',
  lede:
    'Uniting 3D digital garment engineering, precision pattern-making and tightly controlled manufacturing across multi-tiered apparel divisions.',
  primaryCta: 'Explore founding careers',
  secondaryCta: 'Corporate overview',
};

/** The band under the hero. Each phrase appears in the original preview. */
export const CRAFT_WORDS = [
  '3D digital garment engineering',
  'Precision pattern-making',
  'Golden-seal prototypes',
  'French seams',
  'Silk linings',
  'Custom engraved hardware',
  'Inline and final AQL audits',
  'Limited numbered capsules',
];

/* ------------------------------------------------------------------
   The company ("The House" in the original preview)
   ------------------------------------------------------------------ */
export const HOUSE = {
  title: 'Creative autonomy,',
  titleAccent: 'backed by commercial rigour.',
  paragraphs: [
    `${COMPANY} is an emerging Sri Lankan fashion group structured on the European multi-house model. Rather than operating as a single label, our central technical studio powers distinct apparel divisions, from high-rotation island-wide retail distribution to stealth-mode luxury craftsmanship.`,
    'By building new creative labels on active wholesale revenue and tightly audited partner factories, we avoid the usual start-up volatility. That gives Sri Lanka’s leading designers, pattern engineers and master tailors long-term stability alongside real R&D freedom.',
  ],
  confidentiality: {
    title: 'Brand names stay confidential',
    text: 'Our consumer brand names stay private until each launch. Full studio portfolios are shared at interview, under a non-disclosure agreement (NDA).',
  },
  metrics: [
    { value: '03', label: 'Apparel tiers', text: 'Commercial ready-to-wear, neo-luxury and haute flagship design.' },
    { value: 'CLO 3D', label: 'Digital-first workflow', text: 'Virtual drape simulation and zero-waste fit checks before any physical sample is cut.' },
    { value: '14-day', label: 'Release cadence', text: 'Capsule drops and monthly commercial deliveries, managed through strict QC checkpoints.' },
    { value: '360°', label: 'Island-wide and flagship', text: 'Distribution through leading national retail networks and flagship stores.' },
  ],
};

/* ------------------------------------------------------------------
   Divisions
   ------------------------------------------------------------------ */
export type DivisionStage = 'live' | 'soon' | 'later';

export const DIVISIONS: {
  number: string;
  stage: DivisionStage;
  status: string;
  name: string;
  text: string;
  facts: [string, string][];
}[] = [
  {
    number: 'Division 01',
    stage: 'live',
    status: 'Active · 2026',
    name: 'Commercial ready-to-wear',
    text: 'Contemporary apparel made for consistent fit, commercial longevity and monthly silhouette rotation across around twenty leading island-wide retail chains.',
    facts: [
      ['Release cycle', '10 curated silhouettes a month'],
      ['Channel', 'B2B multi-retailer network'],
      ['Role in the group', 'Foundational revenue'],
    ],
  },
  {
    number: 'Division 02',
    stage: 'soon',
    status: 'Launching July 2027',
    name: 'Neo-luxury atelier',
    text: 'A menswear and womenswear house uniting romantic magnetism with composed modern power, with bespoke metal hardware, an architectural flagship store and 3D virtual try-on.',
    facts: [
      ['Price range', 'LKR 7,500 – 50,000'],
      ['Drops', 'Limited, numbered capsule runs'],
      ['Brand name', 'Shared under NDA'],
    ],
  },
  {
    number: 'Division 03',
    stage: 'later',
    status: 'Future phase',
    name: 'Haute flagship label',
    text: 'The group’s namesake house, for experimental textile artistry, sculptural tailoring and private commissions, launched after Divisions 01 and 02.',
    facts: [
      ['Craft focus', 'Artisanal couture and bespoke'],
      ['R&D', 'Archival textile innovation'],
      ['Launch', 'Phase III'],
    ],
  },
];

/* ------------------------------------------------------------------
   3D studio ("3D Atelier" in the original preview)
   ------------------------------------------------------------------ */
export const ATELIER = {
  title: 'Precision, from digital twin',
  titleAccent: 'to final stitch.',
  intro: 'Every style moves through four stages, from 3D simulation in our Central Studio to controlled production with our partners.',
  /** Describes the process, so it stays true whether the film is a CLO 3D export or an illustrative film. */
  videoCaption: 'Virtual fitting: every style is draped and fitted on a 3D avatar before any cloth is cut.',
  stages: [
    {
      title: 'CLO 3D digital twin and drape physics',
      text: 'Every silhouette is shaped and stress-tested in 3D, calibrating fabric weight, bias drape and movement before a single metre of cloth is cut.',
    },
    {
      title: 'Precision pattern engineering and grading',
      text: 'Millimetre-accurate DXF block drafting, concealed seam allowances and proportion grading for modern silhouettes.',
    },
    {
      title: 'Master sample prototyping',
      text: 'Our master sample machinists build golden-seal prototypes, testing French seams, custom engraved hardware and silk linings.',
    },
    {
      title: 'Controlled partner production and QC',
      text: 'Vetted production partners manufacture strictly to our golden-sample tech packs, with on-site inline and final AQL audits.',
    },
  ],
};

/* ------------------------------------------------------------------
   Roles
   ------------------------------------------------------------------ */
export type RoleId = 'a' | 'b' | 'c' | 'd' | 'e';
export type RoleCategory = 'design' | 'craft' | 'media';

export interface Role {
  id: RoleId;
  category: RoleCategory;
  title: string;
  type: string;
  team: string;
  experience: string;
  summary: string;
  requirements: string[];
}

export const ROLE_FILTERS: { id: RoleCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All roles' },
  { id: 'design', label: '3D & pattern' },
  { id: 'craft', label: 'Atelier & QC' },
  { id: 'media', label: 'Brand lab' },
];

export const ROLES: Role[] = [
  {
    id: 'a',
    category: 'design',
    title: '3D Apparel Designer (CLO 3D Specialist)',
    type: 'Full-time · Central Studio',
    team: 'Commercial ready-to-wear and neo-luxury atelier',
    experience: '2+ years, strong portfolio',
    summary:
      'Translate creative concepts into accurate 3D digital garments, testing drape physics across silk, lace, structured linen and tailored suiting before physical sampling.',
    requirements: [
      'Advanced CLO 3D or Marvelous Designer, fabric physics calibration and avatar fit grading.',
      'A degree or diploma in fashion or textile design (UoM Fashion & Textile, AOD, LIFT or equivalent).',
      'An eye for both high-rotation contemporary silhouettes and neo-luxury evening and tailored wear.',
    ],
  },
  {
    id: 'b',
    category: 'design',
    title: 'Senior Pattern Maker (Womenswear & Tailoring)',
    type: 'Full-time · Central Studio',
    team: 'Technical core, all divisions',
    experience: '5+ years apparel pattern engineering',
    summary:
      'Draft master blocks, fluid bias drapes and structured menswear and womenswear tailoring, with uncompromising fit consistency.',
    requirements: [
      'A proven record in manual drafting and CAD pattern systems (Lectra, Gerber, Optitex or CLO DXF).',
      'Deep understanding of shrinkage tolerances, delicate lace and silk handling, and size grading.',
      'Able to work closely with 3D designers and guide sample machinists on construction sequences.',
    ],
  },
  {
    id: 'c',
    category: 'craft',
    title: 'Master Sample Machinist / Atelier Tailor',
    type: 'Full-time · Central Studio',
    team: 'Prototype and golden-seal lab',
    experience: '5+ years high-finish sample room',
    summary:
      'Construct showroom-grade golden-seal prototypes with couture-level internal finishes: French seams, rolled hems and custom metal hardware.',
    requirements: [
      'Mastery of single-needle lockstitch, delicate lightweight fabrics, invisible zips and structured lining.',
      'Experience in export-grade sample rooms, or luxury bridal or tailoring ateliers in Sri Lanka.',
      'Shortlisted candidates complete a 1-day paid studio practical trial, with full statutory benefits on appointment.',
    ],
  },
  {
    id: 'd',
    category: 'craft',
    title: 'Quality Assurance & Sourcing Executive',
    type: 'Full-time · Partner network and HQ',
    team: 'Outsourced manufacturing control',
    experience: '3–6 years apparel QC and merchandising',
    summary:
      'Enforce strict inline and final AQL quality standards across vetted Sri Lankan partner factories, and source specialty textiles, custom trims and rigid packaging.',
    requirements: [
      'Strong command of garment construction defects, measurement audits and factory compliance.',
      'Able to negotiate with vendors for luxury fabrics, custom engraved hardware and boutique batch runs.',
      'Willing to travel between the Central Studio and partner production facilities.',
    ],
  },
  {
    id: 'e',
    category: 'media',
    title: 'Cinematographer & Visual Content Creator',
    type: 'Upcoming intake · Brand lab',
    team: 'Pre-launch content',
    experience: '2–5 years editorial or luxury film',
    summary:
      'Capture atmospheric behind-the-atelier craft films, faceless micro-cinema reels and high-contrast editorial campaigns ahead of our 2027 flagship launch.',
    requirements: [
      'Mastery of moody low-key lighting (2700K warm cinema), macro lens storytelling and colour grading.',
      'Proficiency in Premiere Pro or DaVinci Resolve, with a feel for spatial sound design.',
      'Strict care with pre-launch assets and embargoed content.',
    ],
  },
];

export const ROLE_FOOTNOTE = `Statutory EPF/ETF · Appointment letter from ${COMPANY}`;

export const OPEN_APPLICATION = 'Open application';
export const ROLE_OPTIONS = [...ROLES.map((r) => r.title), OPEN_APPLICATION];

export const OPEN_APPLICATION_CARD = {
  title: 'Exceptional craftsperson outside these roles?',
  text: 'Textile technologists, luxury retail hospitality hosts and boutique manufacturing partners can send a confidential application.',
};

/* ------------------------------------------------------------------
   Apply
   ------------------------------------------------------------------ */
export const EXPERIENCE_OPTIONS = [
  '1–2 years (associate or graduate)',
  '3–5 years (mid-senior specialist)',
  '6–10 years (lead or master craft)',
  '10+ years (executive or head)',
];

/** What happens next: from the original preview's careers and confirmation text. */
export const AFTER_YOU_APPLY = [
  'Our hiring team reviews your application.',
  'Shortlisted candidates are invited to an interview and NDA briefing.',
  'Technical candidates complete a 1-day paid studio practical trial.',
  `Successful candidates receive an appointment letter from ${COMPANY}.`,
];

export const NDA_ACKNOWLEDGEMENT = `I understand that pre-launch brand names, designs and division briefings shared by ${COMPANY} during the interview and paid practical trial are confidential under NDA.`;
