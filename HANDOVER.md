# Handover: Aphrodite careers site

Last updated: 2026-11-12, session 1 (after owner review round 1)

This document is for anyone taking over the project. It covers what the site is, what's been decided, what's done and checked, and the full plan for what's left. You shouldn't need any other context.

**Quick status:** the site is built and checked in Chrome on desktop, tablet and mobile. It is **not live yet**. Waiting on the owner for the virtual-fitting video, the careers email, the domain and a few fact confirmations (§9, Phase 2).

---

## 1. What this is

A **one-page recruitment website** for **Aphrodite (Pvt) Ltd**, a Sri Lankan fashion group. Its job: make it clear the company is recruiting its **founding team**, and get qualified people to apply.

Current roles:

- 3D Apparel Designer (CLO 3D Specialist)
- Senior Pattern Maker (Womenswear & Tailoring)
- Master Sample Machinist / Atelier Tailor
- Quality Assurance & Sourcing Executive
- Cinematographer & Visual Content Creator

**The source of truth for content** is the owner's original preview, a page made in a Gemini chat (`https://share.gemini.google/aNLIacbLeUuf`). Its HTML is in [`reference/gemini-original.html`](reference/gemini-original.html). The site follows that preview's **section order** and **wording**, made plainer. Its non-working form was replaced with a real one, and a few details were left out (see §8).

---

## 2. Decisions made with the owner

| Decision | Choice |
|---|---|
| How applications arrive | Both an **email** option (mailto) and an **on-page form** that emails each application, CV attached, to the owner |
| Tone | **Hiring-first, professional.** Brand names stay private (NDA) |
| Headcount | **Never state how many people we're hiring.** The owner found "hiring five people" unprofessional |
| Content | **Don't invent.** Use only the original preview's content. Anything new must be confirmed by the owner first |
| Section order | **Follow the original preview:** hero → the company → divisions → 3D studio → careers → apply → footer |
| Fonts | **Easy to read** (the first design's Bodoni display face was rejected as hard to read) |
| Role details | **Not** a plain "+" expander. Each role has a card with a "View role details" button that opens a side panel |
| 3D section | Must play a **video showing virtual 3D fitting** |
| Language | English only |
| Stack | React + TypeScript + pnpm (Vite), kept as a **one-pager** |
| Code location | `github.com/jali-rk/neo_hire`, branch `main`. Update this document, commit and push after every step |

---

## 3. Current status

### Done

- [x] Page in the original preview's order: hero, the company (with 4 key figures), three divisions, 3D studio (4 stages and a video slot), careers (filters, role cards, role details panel, open application), apply form, footer
- [x] All content from the original preview (see §8 for the audit)
- [x] Readable type: Source Serif 4 for headings, Source Sans 3 for text, 18px body, AA-contrast colours
- [x] Role cards with a **"View role details"** button that opens a side panel (native `<dialog>`):
  - full role details, plus "Apply for this role" and "Apply by email"
  - each role has a shareable link (`…/#role-c`)
- [x] Role filters from the original preview: All roles · 3D & pattern · Atelier & QC · Brand lab
- [x] **Video player** for the virtual fitting film: muted loop, pause button, no autoplay under reduced motion. Shows the jacket drawing until a film is added (§6)
- [x] Application form using the original preview's fields:
  - position, full name, phone (WhatsApp), email, industry experience
  - portfolio link, CV and portfolio file, technical strengths and notice period
  - NDA acknowledgement
- [x] Delivery through FormSubmit (form-to-email). It refuses to send while the email is still the placeholder
- [x] Build-time pre-rendering, `robots.txt`, link-preview image (`public/og-image.png`). `SITE_URL` adds canonical, `og:url`, `og:image` and a sitemap
- [x] `pnpm qa`: automated browser checks and screenshots

### Verified (`pnpm qa`, Chrome, local production build): all passing

- **Structure:** sections in the original preview's order. The page never mentions a headcount.
- **Fonts:** Source Serif 4 and Source Sans 3 load; body text is 18px.
- **Hydration:** React hydrates with no errors. The only console message is the intended "set `CONFIG.careersEmail`" warning.
- **Filters:** "Atelier & QC" shows only the two craft roles.
- **Role panel:**
  - opens as a modal, URL becomes `#role-b`
  - Escape closes it and the URL returns to `#careers`
  - "Apply for this role" closes it, scrolls to the form, pre-selects the role and focuses the name field
  - a shared `#role-e` link opens that role
- **Form:**
  - an empty submit shows 6 clear errors and focuses the first
  - a valid submit is blocked by the placeholder-email guard, with the link tidied to `https://`
  - the return from FormSubmit shows "Application sent. Thank you, Kavindi…"
- **Responsive:** no horizontal scroll at 390px (mobile) or 820px (tablet). The mobile menu opens and Escape closes it.
- **Keyboard:**
  - the skip link comes first
  - every stop shows a focus ring
  - Enter on "View role details" opens the panel with focus inside
  - closing it returns focus to the card
- **Accessibility tree:** no unnamed controls. The 26 headings have no skipped levels.
- **Reduced motion:** no animation.

### Not verified yet

- **Screen reader by ear** (VoiceOver)
- **Safari** (desktop and iPhone) and **Firefox**
- **Lighthouse** on the reworked site. Earlier scores (before the rework): Performance 92, Accessibility 96, Best Practices 100, SEO 91; the issues it raised were fixed
- **A real form submission end to end.** That needs the real inbox and hosting
- **The video player with a real film.** The code path exists, but no film has been supplied

---

## 4. Running the project

Requirements: Node 20.19+ (built with Node 24.10) and pnpm (built with pnpm 8.8; any newer version is fine).

```bash
cd site
pnpm install
pnpm dev          # development server with hot reload (no pre-render)
pnpm build        # type-check, build, pre-render → site/dist/
pnpm preview      # serve site/dist at http://localhost:4173
pnpm typecheck    # TypeScript only
pnpm qa           # browser checks + screenshots → site/qa-output/ (needs `pnpm preview` running and Chrome)
```

Production build with the real domain (adds canonical, `og:url`, `og:image` and the sitemap):

```bash
SITE_URL=https://careers.your-domain.lk pnpm build
```

`pnpm build` runs four steps:

1. `tsc --noEmit` type-checks the code.
2. `vite build` builds the client bundle.
3. `vite build --ssr src/entry-server.tsx --outDir dist-ssr` builds a server-render bundle.
4. `node scripts/prerender.mjs` renders the page into `dist/index.html` and adds the `SITE_URL` tags.

`site/dist/` is a plain static site with relative paths, so it can be hosted anywhere.

**`pnpm qa`** (`scripts/qa-browser.mjs`) uses only Node 22+ and a local Chrome; there are no test dependencies. Set `CHROME=/path/to/chrome` if Chrome isn't at the default macOS location.

---

## 5. Project layout

```
.
├── HANDOVER.md                ← this document
├── README.md
├── reference/
│   └── gemini-original.html   ← the owner's original preview: the content source (not deployed)
└── site/
    ├── index.html             ← <title>, meta description, link-preview text
    ├── package.json
    ├── og/og-image.html       ← source for the link-preview image (regenerate command inside)
    ├── public/                ← favicon.svg, og-image.png, robots.txt (+ video/ once supplied)
    ├── scripts/
    │   ├── prerender.mjs      ← build-time pre-render and SITE_URL tags
    │   └── qa-browser.mjs     ← `pnpm qa`
    └── src/
        ├── content.ts         ← ★ settings and ALL page text (edit here first)
        ├── App.tsx            ← section order; which role panel is open; apply requests
        ├── main.tsx           ← client entry: fonts, CSS, hydrate or render
        ├── entry-server.tsx   ← render-to-string for the pre-render
        ├── styles.css         ← all styles, design tokens at the top
        ├── lib/
        │   ├── mailto.ts      ← mailto links; placeholder-email check
        │   └── validate.ts    ← form values, validation rules, error messages
        └── components/
            ├── Header.tsx        sticky header and mobile menu (NAV_LINKS shared with footer)
            ├── Hero.tsx          headline, intro, benefits, jacket drawing
            ├── House.tsx         "The company": text, confidentiality note, 4 key figures
            ├── Divisions.tsx     three division cards
            ├── Atelier.tsx       "3D studio": 4 stages and the film
            ├── FitOnVideo.tsx    the video player (or the drawing until a film is added)
            ├── Careers.tsx       filters, role cards, open application
            ├── RoleDialog.tsx    the role details side panel
            ├── Apply.tsx         form, "after you apply", email card, success state
            ├── Footer.tsx
            ├── JacketDrawing.tsx decorative SVG of a jacket, drawn as a technical flat
            └── Icons.tsx
```

### Where to change things

| To change… | Edit |
|---|---|
| Careers email, corporate email, FormSubmit ID, max file size, **video files** | `CONFIG` in `src/content.ts` |
| Any page text: hero, company, figures, divisions, studio stages, roles, filters, form options, NDA wording, "after you apply" | `src/content.ts` |
| Section headings and short intros not in `content.ts` (e.g. "Three strategic divisions.") | The section's component |
| Page title, meta description, link-preview text | `site/index.html` |
| Link-preview image | `site/og/og-image.html`, then regenerate |
| Colours, fonts, spacing | Tokens at the top of `src/styles.css` |

### Adding or removing a role

1. Add or remove it in `ROLES` (`src/content.ts`) and extend the `RoleId` type (`'a' | … | 'e'`).
2. Update `ROLE_HASH` in `src/App.tsx` (currently `/^#role-([a-e])$/`).
3. Give it a `category` that matches a filter in `ROLE_FILTERS`.

---

## 6. The virtual fitting video

The 3D studio section has a video player. Until a film is supplied, it shows the jacket drawing instead.

**To add the film:**

1. Put the files in `site/public/video/`, for example `fit-on.mp4`, an optional `fit-on.webm`, and `fit-on-poster.jpg`.
2. In `src/content.ts`, set:

   ```ts
   fitOnVideo: { src: 'video/fit-on.mp4', webm: 'video/fit-on.webm', poster: 'video/fit-on-poster.jpg' }
   ```

3. Run `pnpm build`.

**Recommended spec:**

| Setting | Value |
|---|---|
| Aspect ratio | 4:5 portrait, e.g. 1080×1350 (the frame is 4:5; other ratios are cropped to fill) |
| Length | 10–20 seconds, designed to loop smoothly |
| Audio | None (it plays muted) |
| Format | MP4 (H.264), under ~8 MB; a WebM copy is optional and smaller |
| Poster | The first frame, as a JPG |

**Where the film can come from (the owner decides):**

- **Best: a CLO 3D export of a real Aphrodite garment.** CLO 3D can record a turntable or a fitting animation of the garment on an avatar. This is genuine, and it matches what the page says the studio does.
- **An AI video generator** (for example Google Veo, OpenAI Sora or Runway), if no CLO 3D export is available yet. It must not be presented as a real product, and the caption may need adjusting. Starting prompt:

  > Photorealistic studio film, 4:5 vertical, 12-second seamless loop. A grey 3D avatar stands on a slowly rotating turntable in a dark, softly lit studio. A tailored ivory jacket with a garnet-red lining drapes onto the avatar as a 3D garment simulation: visible fine mesh lines fade as the fabric settles, the cloth falls naturally and tension is shown subtly. Clean, minimal, luxury fashion-tech feel. No text, no logos, no people.

- **Not stock footage of someone else's product.** It would misrepresent the company.

---

## 7. How applications are delivered

### Form → email (FormSubmit)

- The form posts **natively** (`multipart/form-data`) to `https://formsubmit.co/<careersEmail or formsubmitId>`, so the CV or portfolio is sent as an email attachment.
- After sending, FormSubmit redirects back to `<page>?applied=1#apply`, which shows "Application sent".
- Hidden settings fields: `_subject`, `_template=table`, `_captcha=false`, `_next`, `_autoresponse`, `_honey` (spam honeypot).
- The applicant's fields arrive as: Position, Name, Phone, email (also used as reply-to), Experience, Portfolio, attachment, Technical strengths and notice period, NDA acknowledged.
- **Guards:** while `careersEmail` ends in `@example.com`, or the page is opened as a file, the form doesn't send and shows a notice.

### Email (mailto)

- "Apply by email" in each role panel, "Write an email", and the footer link open the visitor's email app with the subject filled in.

### Go-live setup

1. Set `CONFIG.careersEmail` (and optionally `corporateEmail`).
2. Build with `SITE_URL` and deploy (§10, Phase 3).
3. Submit one test application on the live site. FormSubmit emails that inbox an **activation link**. Click it.
4. Optional: put FormSubmit's random ID in `CONFIG.formsubmitId`.

### Caveats

- **Attachment size:** reportedly about 10 MB total (not checked against FormSubmit's docs). The original preview said 25 MB, but the form allows 10.
- **`_autoresponse`** (confirmation email to the applicant) hasn't been tested.
- **Spam:** the captcha is off. If spam arrives, set `_captcha` to `true` in `Apply.tsx`.
- **Privacy:** CVs pass through FormSubmit, a third party.

---

## 8. Content sources

**Rule:** all facts on the page come from the original preview (`reference/gemini-original.html`). The wording has been made plainer, but no new facts were added.

**Interface text** (button labels, form hints, error messages, "Application sent") is new, but it states no facts about the company.

### Invented in the first build and removed in round 1 (2026-11-12)

These were written by the previous build and are no longer on the site:

- **The headline** "We're hiring five people to build a fashion house from the first stitch", and every mention of "five".
- **The "Why join" section:**
  - "Shape it from the start"
  - "Backed by a working business… runs on real orders from day one"
  - "Digital first, craft led"
  - "Employed properly"
  - "A founding role, without the gamble"
- **Role duties not in the preview:**
  - "Produce renders for design reviews and range meetings"
  - "Feed back to the pattern maker on how each pattern sews"
  - "Attach custom metal hardware and test it under wear"
  - "Care with detail that shows on the inside of a garment"
  - "A reel showing low-key lighting…"
  - the expanded "What you'll do" lists in general
- **The "How we hire" timeline:**
  - "We read every application"
  - "we'll call you"
  - "Meet the team, see the studio"
  - "setting out your pay, start date and benefits"
  - "Five steps, with no surprises"
- **The whole FAQ, including these policies:**
  - "Can I apply for more than one role? Yes"
  - "The CV is optional / no CV needed"
  - "How will you use my details? Only to assess your application"
  - trial examples such as "drafting a block or sewing a sample"
- **Other:**
  - the fifth workflow stage "Story filmed"
  - the "What helps us decide" tips
  - the "Where you're based" form field
  - the data-use consent checkbox (replaced by the preview's NDA acknowledgement)
  - the applicant auto-reply "we read every one"

### In the original preview but left out: confirm with the owner before adding

- [ ] Company registration number "PV 00318492"
- [ ] Emails `careers@aphrodite.lk` and `corporate@aphrodite.lk` (placeholders are used instead)
- [ ] "Reviews technical submissions **within 72 hours**"
- [ ] "Encrypted transmission directly to Central Studio HR" (not true of FormSubmit)
- [ ] The decorative technical spec codes in the 3D section, e.g. "SPEC // CLO-MESH-V4.2", "± 0.5 mm Digital"

### From the preview, but worth the owner confirming

- [ ] Around twenty retail chains; 10 silhouettes a month; 14-day release cadence
- [ ] Neo-luxury launch **July 2027**, **LKR 7,500–50,000**
- [ ] 1-day paid studio practical trial; EPF/ETF; appointment letter
- [ ] Experience requirements per role; education examples (UoM, AOD, LIFT)
- [ ] Studio city (the page only says Sri Lanka)

---

## 9. Design system

- **Direction:** clear and professional first, with a quiet fashion-house feel. Pale shell-pink ground, garnet accent, dark sections for the 3D studio and the form.
- **Type:**
  - **Source Serif 4** (600) for headings
  - **Source Sans 3** for everything else, 18px body text
  - Labels are bold sans in uppercase with light letter-spacing
  - Both fonts are self-hosted through `@fontsource`
  - Don't go back to high-contrast display faces: the owner found them hard to read

| Token | Value | Use |
|---|---|---|
| `--shell` | `#F6ECE9` | Page background |
| `--paper` | `#FCF8F6` | Cards, alternate sections |
| `--ink` | `#1C1517` | Headings; dark sections |
| `--ink-2` | `#2E2427` | Body text |
| `--muted` | `#5B4A4D` | Secondary text |
| `--line` | `#E0CFCB` | Hairlines |
| `--garnet` | `#7A1F33` | The single accent |
| `--rose` | `#F0B8C3` | Accent on dark |

- **Details:**
  - small garnet "notch" triangle bullets (from pattern pieces)
  - the dot-and-cross pattern-paper background behind the jacket drawing
  - a dashed "cutting line" border on the open-application card
- **Motion:** only the jacket drawing (it draws itself in) and the role panel (it slides in). Both are off under reduced motion.
- **Mobile:** the header's "Apply now" is the always-visible call to action. Don't add a floating one.

---

## 10. The plan

### Phase 1: QA (no owner input needed)

- [x] Desktop, tablet and mobile review; console; interactions; keyboard; accessibility tree; reduced motion (all in `pnpm qa`)
- [ ] Lighthouse on the reworked site
- [ ] Screen reader by ear (VoiceOver): hero, a role panel, form errors
- [ ] Safari (desktop and iPhone) and Firefox, especially the `<dialog>` panel, the video and the file picker
- [ ] Optional: reduce JavaScript (React plus hydration is about 80 kB gzipped). Options: Preact (`@preact/preset-vite`), or hydrate only the interactive parts

### Phase 2: Needs the owner

1. **The virtual fitting film** (see §6), from a CLO 3D export or a generated film.
2. The **careers inbox** (and optionally a corporate address).
3. The **domain** (for `SITE_URL`) and where to host.
4. Decisions on the "left out" and "worth confirming" lists in §8.
5. Agreement that CVs may pass through FormSubmit.

### Phase 3: Go live

1. Set `CONFIG`, add the film, run `pnpm build && pnpm preview && pnpm qa`, and check the screenshots.
2. **Deploy.** Set the environment variable `SITE_URL=https://<domain>` on the host.
   - Netlify: base `site`, build `pnpm build`, publish `site/dist`
   - Vercel: root `site`, preset Vite, build `pnpm build`, output `dist`
   - Cloudflare Pages: root `site`, build `pnpm build`, output `dist`
3. Activate FormSubmit (§7).
4. **End-to-end tests on the live URL:**
   - application with a ~2 MB PDF: email arrives with all fields and the attachment
   - application without a file: arrives
   - invalid inputs: the right inline errors show
   - an 11 MB file: rejected with a clear message
   - mailto links: open an email with the role in the subject
   - `_autoresponse`: note whether it arrives
5. Lighthouse on the live URL. Check the LinkedIn preview with Post Inspector.

### Phase 4: After launch (optional)

- Privacy-friendly analytics (Plausible or Umami).
- Your own form endpoint, if FormSubmit's limits, spam or privacy become a problem.
- Upgrade pnpm and add `packageManager` to `package.json`. TypeScript 7 is used; pin `typescript@5.9` if any tool struggles.

---

## 11. Decision log

| Date | Decision |
|---|---|
| 2026-11-12 | Extracted the Gemini mock; found the non-working form |
| 2026-11-12 | Owner chose: email and on-page form, hiring-first tone, keep the five roles, English only |
| 2026-11-12 | First design (Bodoni Moda, spec-sheet hero with the roles as points A–E) built as a prototype, then in React + TypeScript + pnpm with pre-rendering |
| 2026-11-12 | FormSubmit chosen for form-to-email (free, CV attachments via a normal form post) |
| 2026-11-12 | QA rounds 1–2: layout fixes, link previews, `pnpm qa`, keyboard and accessibility fixes |
| 2026-11-12 | **Owner review round 1:**<br>• fonts hard to read → Source Serif 4 + Source Sans 3<br>• "hiring five people" unprofessional → no headcount anywhere<br>• "+" expanders → role cards with a "View role details" side panel<br>• "don't invent content" → rebuilt from the original preview's text, with the invented items listed in §8<br>• 3D section must play a virtual-fitting video → video player added, film to be supplied<br>• follow the original preview's section order → done<br>• spec-sheet hero, "Why join", "How we hire" and FAQ removed |
