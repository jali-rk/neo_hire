/* ==================================================================
   Site content and settings.
   Everything on the page that you might want to change lives here.
   ================================================================== */

export interface SiteConfig {
  /** Inbox that receives applications. Also shown to people who prefer to email. */
  careersEmail: string;
  /**
   * Optional. After you confirm FormSubmit's activation email, it gives you a
   * random ID. Put it here to keep the address out of the form's code.
   */
  formsubmitId: string;
  /** Largest CV accepted, in MB. FormSubmit allows about 10 MB in total. */
  maxUploadMB: number;
}

export const CONFIG: SiteConfig = {
  careersEmail: 'careers@example.com', // ← replace before publishing
  formsubmitId: '',
  maxUploadMB: 10,
};

export const COMPANY = 'Aphrodite (Pvt) Ltd';

/* ------------------------------------------------------------------
   Roles. The letter links each role to its point on the jacket drawing.
   ------------------------------------------------------------------ */
export type RoleId = 'a' | 'b' | 'c' | 'd' | 'e';

export interface Role {
  id: RoleId;
  letter: string;
  /** Full title, used in the role list and the application form. */
  title: string;
  /** Short title for the spec sheet and the studio workflow. */
  shortTitle: string;
  /** What this person owns, shown on the spec sheet. */
  responsibility: string;
  /** One-line summary shown before the role is opened. */
  summary: string;
  type: string;
  place: string;
  experience: string;
  doing: string[];
  bringing: string[];
  note?: string;
}

export const ROLES: Role[] = [
  {
    id: 'a',
    letter: 'A',
    title: '3D Apparel Designer (CLO 3D)',
    shortTitle: '3D Apparel Designer',
    responsibility: 'Drape and fit, in CLO 3D',
    summary: 'Build and fit every new style in CLO 3D before fabric is cut.',
    type: 'Full-time',
    place: 'Central Studio',
    experience: '2+ years',
    doing: [
      'Turn design concepts into accurate 3D garments for both the ready-to-wear and neo-luxury divisions.',
      'Calibrate fabric physics for silk, lace, linen and suiting, and check fit on graded avatars.',
      'Work with the pattern maker to move approved 3D styles into production patterns.',
      'Produce renders for design reviews and range meetings.',
    ],
    bringing: [
      'Advanced CLO 3D or Marvelous Designer, including fabric calibration and avatar fitting.',
      'A degree or diploma in fashion or textile design (UoM, AOD, LIFT or equivalent).',
      'A portfolio that shows both everyday commercial pieces and tailored or evening wear.',
    ],
  },
  {
    id: 'b',
    letter: 'B',
    title: 'Senior Pattern Maker (Womenswear & Tailoring)',
    shortTitle: 'Senior Pattern Maker',
    responsibility: 'Blocks and grading',
    summary: 'Draft, grade and own the master blocks for every division.',
    type: 'Full-time',
    place: 'Central Studio',
    experience: '5+ years',
    doing: [
      'Draft and maintain the studio’s master blocks for womenswear and tailoring.',
      'Engineer bias-cut drapes and structured jackets with consistent fit across sizes.',
      'Grade patterns and export DXF files for partner factories.',
      'Guide sample machinists on construction order and seam allowances.',
    ],
    bringing: [
      'Manual drafting skills plus a CAD pattern system: Lectra, Gerber, Optitex or CLO.',
      'A working knowledge of shrinkage, delicate fabrics like lace and silk, and size grading.',
      'Comfort working closely with a 3D designer.',
    ],
  },
  {
    id: 'c',
    letter: 'C',
    title: 'Master Sample Machinist / Atelier Tailor',
    shortTitle: 'Master Sample Machinist',
    responsibility: 'Seams and finish',
    summary: 'Sew the golden sample: the prototype every unit is checked against.',
    type: 'Full-time',
    place: 'Central Studio',
    experience: '5+ years',
    doing: [
      'Construct showroom-quality prototypes for both divisions.',
      'Finish garments to a couture standard: French seams, rolled hems, invisible zips and full linings.',
      'Attach custom metal hardware and test it under wear.',
      'Feed back to the pattern maker on how each pattern sews.',
    ],
    bringing: [
      'Mastery of the single-needle lockstitch machine and lightweight, delicate fabrics.',
      'Experience in an export sample room, or a bridal or tailoring atelier in Sri Lanka.',
      'Care with detail that shows on the inside of a garment as well as the outside.',
    ],
    note: 'Shortlisted candidates spend one paid day in the studio on a practical task. No CV? Apply anyway and tell us about your experience in the message.',
  },
  {
    id: 'd',
    letter: 'D',
    title: 'QA & Sourcing Executive',
    shortTitle: 'QA & Sourcing Executive',
    responsibility: 'Measurements and quality',
    summary: 'Keep partner production true to the golden sample, and source the materials.',
    type: 'Full-time',
    place: 'Studio & factories',
    experience: '3–6 years',
    doing: [
      'Run inline and final AQL inspections at our partner factories in Sri Lanka.',
      'Audit garment measurements and construction against tech packs and the golden sample.',
      'Source specialty fabrics, trims, custom hardware and packaging.',
      'Negotiate small, limited production runs with suppliers.',
    ],
    bringing: [
      'Experience in apparel QC or merchandising, including measurement audits and factory compliance.',
      'A sharp eye for construction defects.',
      'Confidence negotiating with fabric and trim suppliers, and willingness to travel between the studio and factories.',
    ],
  },
  {
    id: 'e',
    letter: 'E',
    title: 'Cinematographer & Visual Content Creator',
    shortTitle: 'Cinematographer',
    responsibility: 'How it looks on film',
    summary: 'Film the craft and the collections ahead of the 2027 launch.',
    type: 'Next intake',
    place: 'Brand team',
    experience: '2–5 years',
    doing: [
      'Film the making of each collection: macro craft details, studio process, finished pieces.',
      'Build a library of content ready for the July 2027 launch.',
      'Shoot, edit and grade campaign films and short reels.',
    ],
    bringing: [
      'A reel showing low-key lighting, macro work and confident colour grading.',
      'Premiere Pro or DaVinci Resolve, and an ear for sound design.',
      'Discretion: everything you shoot stays private until launch.',
    ],
    note: 'This role joins with our next intake. Apply now to be considered first.',
  },
];

export const OPEN_APPLICATION = 'Open application';
export const ROLE_OPTIONS = [...ROLES.map((r) => r.title), OPEN_APPLICATION];

/* ------------------------------------------------------------------
   Other sections
   ------------------------------------------------------------------ */
export const HIGHLIGHTS = [
  'Full-time roles',
  `Appointment letter from ${COMPANY}`,
  'EPF & ETF',
  'Paid one-day studio trial for technical roles',
];

export const REASONS = [
  {
    title: 'Shape it from the start',
    text: 'You’ll set the blocks, standards and ways of working the studio uses for years, rather than inheriting someone else’s.',
  },
  {
    title: 'Backed by a working business',
    text: 'Our ready-to-wear division already supplies around twenty retail chains across Sri Lanka, so the studio runs on real orders from day one.',
  },
  {
    title: 'Digital first, craft led',
    text: 'Styles are built and fitted in CLO 3D before cloth is cut, then finished to a high standard: French seams, silk linings, engraved hardware.',
  },
  {
    title: 'Employed properly',
    text: `A direct appointment letter from ${COMPANY}, structured pay, and EPF and ETF contributions.`,
  },
];

export type DivisionStage = 'live' | 'soon' | 'later';

export const DIVISIONS: { stage: DivisionStage; status: string; name: string; text: string }[] = [
  {
    stage: 'live',
    status: 'In stores now',
    name: 'Ready-to-wear',
    text: 'Contemporary everyday clothing for around twenty retail chains across the island, with about ten new styles each month.',
  },
  {
    stage: 'soon',
    status: 'Launching July 2027',
    name: 'Neo-luxury label',
    text: 'Menswear and womenswear in limited, numbered runs, priced from LKR 7,500 to 50,000, with its own flagship store. You’ll learn the name at interview.',
  },
  {
    stage: 'later',
    status: 'Later phase',
    name: 'Couture house',
    text: 'Sculptural tailoring, experimental textiles and private commissions, built once the first two divisions are established.',
  },
];

export const FLOW: { title: string; text: string; roleId: RoleId }[] = [
  { title: 'Built in 3D', text: 'Every style is draped and fitted in CLO 3D before fabric is cut.', roleId: 'a' },
  { title: 'Pattern engineered', text: 'Blocks are drafted, graded and exported as DXF for production.', roleId: 'b' },
  { title: 'Golden sample made', text: 'The approved prototype is sewn in-house and becomes the reference for every unit.', roleId: 'c' },
  { title: 'Production checked', text: 'Partner factories make against the golden sample, with inline and final AQL inspections.', roleId: 'd' },
  { title: 'Story filmed', text: 'The making and the finished pieces are filmed for launch.', roleId: 'e' },
];

export const HIRING_STEPS: { title: string; text: string; tag?: string }[] = [
  { title: 'Apply', text: 'Use the form on this page or email your CV. A portfolio link helps for design, pattern and film roles.' },
  { title: 'We review', text: 'We read every application. If you’re shortlisted, we’ll call you to arrange an interview.' },
  {
    title: 'Interview',
    text: 'Meet the team, see the studio and hear the plans for each division. You’ll sign an NDA before we share brand names and collections.',
  },
  {
    title: 'Paid practical trial',
    tag: 'Technical roles',
    text: 'One paid day in the studio, working on a real task. You see how we work, and we see how you work.',
  },
  { title: 'Offer', text: `A written appointment letter from ${COMPANY}, setting out your pay, start date and benefits.` },
];

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'Why don’t you name the brands?',
    a: 'Our new labels stay private until they launch. At interview you’ll sign a non-disclosure agreement (NDA), and then we’ll show you the brand names, collections and plans.',
  },
  {
    q: 'Can I apply for more than one role?',
    a: 'Yes. Choose the role closest to your experience, and mention the other one in your message.',
  },
  {
    q: 'What is the paid practical trial?',
    a: 'For technical roles, shortlisted candidates spend one paid day in the studio on a real task, like drafting a block or sewing a sample. It’s the fairest way for both sides to judge the fit.',
  },
  {
    q: 'I don’t have a CV. Can I still apply?',
    a: 'Yes. The CV is optional. Tell us about your experience in the message box: where you’ve worked, what you’ve made and which machines you use.',
  },
  {
    q: 'How will you use my details?',
    a: 'Only to assess your application and contact you about it.',
  },
];

export const EXPERIENCE_OPTIONS = ['Less than 2 years', '2–4 years', '5–9 years', '10 years or more'];

export const APPLY_TIPS = [
  'Your CV, or a short summary of your experience',
  'A portfolio, Behance or reel link for design, pattern and film roles',
  'Photos of garments you’ve made, for sample and tailoring roles',
  'Your notice period',
];
