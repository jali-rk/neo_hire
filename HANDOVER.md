# Handover: Aphrodite careers site

Last updated: 2026-11-12

This document is for anyone taking over the project. It covers what the site is, what's been decided, what's done, and the full plan for what's left. You shouldn't need any other context.

---

## 1. What this is

A **one-page recruitment website** for **Aphrodite (Pvt) Ltd**, a Sri Lankan apparel group. The page has one job: make it clear the company is hiring **five founding roles** for its Central Studio, and get qualified people to apply.

The five roles:

| Point | Role | Owns |
|---|---|---|
| A | 3D Apparel Designer (CLO 3D) | Drape and fit, in CLO 3D |
| B | Senior Pattern Maker (Womenswear & Tailoring) | Blocks and grading |
| C | Master Sample Machinist / Atelier Tailor | Seams and finish |
| D | QA & Sourcing Executive | Measurements and quality |
| E | Cinematographer & Visual Content Creator | How it looks on film |

**Where it came from:** the owner had a Gemini chat that produced a mock "luxury corporate" page (shared at `https://share.gemini.google/aNLIacbLeUuf`). Its HTML is kept for reference in [`reference/gemini-original.html`](reference/gemini-original.html). That mock had serious problems: the application form sent nothing anywhere, and it showed made-up facts (a company registration number, `@aphrodite.lk` emails, a "reply in 72 hours" promise, "encrypted transmission"). This site is a full rebuild. Only the business idea and role list were kept.

---

## 2. Decisions made with the owner

| Decision | Choice |
|---|---|
| How applications arrive | Both: an **email** option (mailto) and an **on-page form** that emails each application, CV attached, to the owner |
| Tone | **Hiring-first, premium.** Plain language about the roles, why join and the process. Sub-brand names stay private, with a light NDA mention |
| Roles | Keep the **five roles** from the Gemini version |
| Language | **English only** |
| Stack | **React + TypeScript + pnpm** (Vite) |
| Page structure | Must stay a **one-pager** |

---

## 3. Current status

### Done

- [x] Content and copy for every section (hero, why join, studio, roles, hiring process, FAQ, apply, footer)
- [x] Visual design and signature element (see §7)
- [x] React + TypeScript project in [`site/`](site/), managed with pnpm
- [x] All editable content in one file: [`site/src/content.ts`](site/src/content.ts)
- [x] Application form: validation, CV upload (PDF/Word, size check), consent, honeypot, success state after submit
- [x] Delivery through FormSubmit (form-to-email service). The form refuses to send while the email is still the placeholder
- [x] Mailto links that open an email with subject and body already filled in, per role
- [x] Build-time pre-rendering: the built `index.html` contains the full page content (for SEO and link previews), and React hydrates it
- [x] Self-hosted fonts (no Google Fonts requests)
- [x] Accessibility basics: skip link, visible focus, labelled fields, native `<details>` for roles and FAQ, reduced-motion support

### Verified

- `pnpm typecheck` passes with no errors
- `pnpm build` succeeds and the pre-render step writes the full page into `site/dist/index.html`

### Not verified yet

- How the **React build** looks in a browser. The design was checked against a single-file prototype, but the React version hasn't been screenshotted
- Hydration warnings in the browser console
- Mobile layout, keyboard-only use, reduced-motion behaviour
- A real form submission end to end. That needs a real inbox and a hosted site

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
```

`pnpm build` runs four steps:

1. `tsc --noEmit` type-checks the code.
2. `vite build` builds the client bundle into `dist/`.
3. `vite build --ssr src/entry-server.tsx --outDir dist-ssr` builds a server-render bundle.
4. `node scripts/prerender.mjs` renders `<App/>` into the `<!--app-html-->` placeholder in `dist/index.html`, then deletes `dist-ssr/`.

`site/dist/` is a plain static site with relative paths (`base: './'`), so it can be hosted anywhere, including a sub-folder.

---

## 5. Project layout

```
.
├── HANDOVER.md                ← this document
├── README.md
├── reference/
│   └── gemini-original.html   ← the Gemini mock, for reference only (not deployed)
└── site/                      ← the website
    ├── index.html             ← HTML shell: <title>, meta description, Open Graph tags
    ├── package.json           ← scripts and dependencies
    ├── vite.config.ts
    ├── tsconfig.json
    ├── public/favicon.svg
    ├── scripts/prerender.mjs  ← build-time pre-render
    └── src/
        ├── content.ts         ← ★ settings and all list content (edit here first)
        ├── App.tsx            ← page composition and shared state
        ├── main.tsx           ← client entry: fonts, CSS, hydrate or render
        ├── entry-server.tsx   ← render-to-string for the pre-render
        ├── styles.css         ← all styles, design tokens at the top
        ├── lib/
        │   ├── mailto.ts      ← mailto links; placeholder-email check
        │   └── validate.ts    ← form values, validation rules, error messages
        └── components/
            ├── Header.tsx         sticky header, nav, mobile menu (NAV_LINKS shared with footer)
            ├── Hero.tsx           headline, intro, highlights, spec sheet
            ├── JacketFlat.tsx     the SVG jacket drawing with pins A–E
            ├── WhyJoin.tsx        four reasons
            ├── Studio.tsx         three divisions and the 5-stage workflow
            ├── Roles.tsx          expandable role details and open application
            ├── Process.tsx        five hiring steps
            ├── Faq.tsx
            ├── Apply.tsx          form, email card, success state
            ├── Footer.tsx
            ├── MobileApplyBar.tsx floating "Apply now" on phones
            └── Icons.tsx
```

### Where to change things

| To change… | Edit |
|---|---|
| Careers email, FormSubmit ID, max CV size | `CONFIG` in `src/content.ts` |
| A role's title, summary, duties, requirements, experience | `ROLES` in `src/content.ts` |
| Hero highlights, reasons, divisions, workflow, hiring steps, FAQ, experience options, "what helps us decide" | The matching export in `src/content.ts` |
| Hero headline and intro, section headings and intros | The section's component in `src/components/` |
| Page title, meta description, link-preview text | `site/index.html` |
| Colours, fonts, spacing | Tokens at the top of `src/styles.css` |

### Adding or removing a role (several places are coupled)

1. Add or remove the entry in `ROLES` (`src/content.ts`) and extend the `RoleId` type (`'a' | … | 'e'`).
2. Add or remove its point in `POINTS` in `src/components/JacketFlat.tsx` (pin position, the point on the garment, and the leader line).
3. Update `ROLE_HASH` in `src/App.tsx` (currently `/^#role-([a-e])$/`).
4. Update `FLOW` in `content.ts` if the workflow changes.
5. Update copy that says "five": hero headline (`Hero.tsx`), roles heading (`Roles.tsx`), process intro (`Process.tsx`), meta tags (`index.html`).

---

## 6. How applications are delivered

### Form → email (FormSubmit)

- The form posts **natively** (`multipart/form-data`, not fetch) to `https://formsubmit.co/<careersEmail or formsubmitId>`, so the CV is sent as an email attachment.
- After sending, FormSubmit redirects back to `<page>?applied=1#apply`. The page then shows "Application sent", personalised from `sessionStorage`, and tidies the URL.
- Hidden settings fields: `_subject` (role and name), `_template=table`, `_captcha=false`, `_next` (redirect), `_autoresponse` (confirmation email to the applicant), `_honey` (spam honeypot).
- The applicant's fields arrive as: Role, Name, email (also used as reply-to), Phone, Experience, Based in, Portfolio, attachment (CV), Message, Consent.
- **Guards:**
  - While `careersEmail` ends in `@example.com`, the form shows "Online applications aren't switched on yet" and doesn't send.
  - When the page is opened from a file (`file://`), the form shows a preview notice and doesn't send.

### Email (mailto)

- "Or apply by email" on each role, "Write an email", and the FAQ and footer links all open the visitor's email app. The subject (`Application: <role>`) and a short template body are filled in.

### Go-live setup (in order)

1. Set `CONFIG.careersEmail` in `src/content.ts` to the real careers inbox.
2. Build and deploy (see §9).
3. Submit one test application on the live site. FormSubmit emails that inbox an **activation link**. Click it. Applications are not delivered until this is done.
4. Optional: FormSubmit then provides a random ID. Put it in `CONFIG.formsubmitId` so the address isn't in the form's code. The address is still shown on the page for people who prefer email.
5. Test again, with and without a CV (see Phase 3 in §9).

### Known caveats (check before launch)

- **Attachment size:** third-party write-ups say FormSubmit accepts roughly **10 MB in total**. This hasn't been checked against FormSubmit's own documentation. The form limits CVs to `CONFIG.maxUploadMB` (10).
- **`_autoresponse`** (the confirmation email to the applicant) hasn't been tested. It may not be available on the free tier.
- **Spam:** the captcha is off for a smoother experience, so the honeypot is the only protection. If spam arrives, set `_captcha` to `true` in `Apply.tsx`.
- **Privacy:** CVs pass through FormSubmit, a third party. The owner should be comfortable with that, or see Phase 4 for an alternative.

---

## 7. Design system

**Direction:** a premium fashion house with a tailor's workroom vocabulary. The page reads like a garment **spec sheet**: each open role is a **point of measure** (A–E) on a tailored jacket.

**Signature element (keep it):** the hero spec sheet. A technical drawing of a jacket (`JacketFlat.tsx`) sits on dot-and-cross pattern paper, with pins A–E. Next to it is a table of the five roles. Hovering or focusing a row highlights its pin, and the reverse. The letters A–E identify the roles everywhere: spec sheet, studio workflow owners, role list.

| Token | Value | Use |
|---|---|---|
| `--shell` | `#F6ECE9` | Page background (pale shell pink) |
| `--paper` | `#FCF8F6` | Cards, spec sheet, alternate sections |
| `--ink` | `#1C1517` | Text; dark Apply section and footer |
| `--ink-2` | `#3A2E31` | Body copy |
| `--muted` | `#6E5B5E` | Secondary text |
| `--line` | `#E3D3CF` | Hairlines |
| `--garnet` | `#7A1F33` | The single brand accent |
| `--rose` | `#E9A9B5` | Accent on dark backgrounds |

- **Type:**
  - Bodoni Moda (display; italic for emphasis)
  - Hanken Grotesk (body)
  - IBM Plex Mono (labels and spec details)
  - All three are self-hosted through `@fontsource` packages.
- **Small rules:**
  - Bullets are small garnet "notch" triangles, like the notches on pattern pieces.
  - Numbers are used only for real sequences: the studio workflow and the hiring steps.
  - The dashed border on the open-application card is a cutting line.
  - Only one accent colour.
  - No Tailwind; plain CSS in one file.
- **Motion:** only the jacket drawing animates (it draws itself on load, then the pins appear). It's turned off under `prefers-reduced-motion`.

---

## 8. Content to confirm with the owner

These facts came from the Gemini version, which was built from the owner's earlier brief. Some may have been invented by Gemini. **Check each before launch.**

- [ ] Ready-to-wear supplies "around twenty retail chains" with "about ten new styles each month"
- [ ] Neo-luxury label launches **July 2027**, priced **LKR 7,500–50,000**, limited numbered runs, its own flagship store
- [ ] A third "couture house" division is planned for later
- [ ] **Paid one-day practical trial** for technical roles
- [ ] **EPF & ETF**, appointment letter, structured pay
- [ ] Experience ranges per role (2+, 5+, 5+, 3–6, 2–5 years)
- [ ] Education examples for the 3D designer role (UoM, AOD, LIFT)
- [ ] Cinematographer is a "next intake" role, not immediate
- [ ] The CV is optional (a deliberate choice, so sample machinists and tailors without CVs can apply)
- [ ] Studio location: the site only says "Sri Lanka". **Add the city** if the owner agrees

Deliberately **removed** from the Gemini version: the registration number "PV 00318492", `careers@aphrodite.lk` and `corporate@aphrodite.lk`, the "reviewed within 72 hours" promise, and the "encrypted transmission" claim. Re-add any of them only if the owner confirms they're real.

---

## 9. The plan

### Phase 1: QA and polish (no owner input needed)

1. **Visual review** of `pnpm build && pnpm preview` at 1440px, 820px and 390px wide. Check:
   - the jacket drawing, pin positions and leader lines
   - spec-sheet table alignment
   - role details layout
   - the form on dark
   - the mobile "Apply now" bar (hidden over the hero and the form)
2. **Console check:** no hydration warnings or errors when loading the built site.
3. **Keyboard pass:**
   - the skip link works
   - Tab reaches the nav, spec rows, pins, role summaries, form fields and buttons, with a visible focus ring
   - Escape closes the mobile menu
   - clicking a spec row, pin or workflow owner opens that role
4. **Reduced motion:** with `prefers-reduced-motion: reduce`, the drawing shows fully with no animation.
5. **Lighthouse:** aim for 95+ on Performance, Accessibility, Best Practices and SEO.
6. **Link-preview image:** create a 1200×630 `og:image` (for example, the headline and the jacket drawing), add it to `site/public/`, and reference it in `index.html`. Add `og:url` and a `canonical` link once the domain is known.
7. Optional: add ESLint and Prettier.

### Phase 2: Needs the owner

1. The real **careers inbox** address.
2. The **domain** and where to host.
3. Confirm the facts in §8, and the studio city.
4. Optional: **salary ranges** per role. Publishing them usually raises response rates.
5. Agreement that CVs may pass through FormSubmit (see §6).

### Phase 3: Go live

1. Set `CONFIG.careersEmail`, then build.
2. **Deploy.** Any static host works. With the repo connected:
   - Netlify: base directory `site`, build command `pnpm build`, publish directory `site/dist`
   - Vercel: root directory `site`, framework preset "Vite", output `dist`
   - Cloudflare Pages: root `site`, build `pnpm build`, output `dist`
3. Activate FormSubmit (see §6, steps 3–4).
4. **End-to-end tests on the live URL:**
   - Application with a ~2 MB PDF CV: email arrives with all fields and the attachment, and the applicant sees "Application sent"
   - Application without a CV: arrives
   - Invalid inputs: the right inline errors show, and focus moves to the first one
   - An 11 MB file: rejected with a clear message
   - Mailto links: open an email addressed correctly, with the role in the subject
   - The applicant confirmation email (`_autoresponse`): note whether it arrives
5. Share the link on LinkedIn and check the preview card.

### Phase 4: After launch (optional)

- **Privacy-friendly analytics** (for example Plausible or Umami) to see visits, "Apply" clicks and submissions.
- **Own form endpoint** (a serverless function plus an email service) if FormSubmit's limits, spam or privacy become a problem.
- **Google for Jobs:** Google's JobPosting structured data belongs on individual job pages, not list pages. That conflicts with the one-pager decision, so revisit only if that changes.
- **Housekeeping:** upgrade pnpm (the local version 8.8 is old) and add a `packageManager` field to `package.json`. TypeScript 7 is used. If any tool has trouble with it, pinning `typescript@5.9` is safe.

---

## 10. Decision log

| Date | Decision |
|---|---|
| 2026-11-12 | Extracted the Gemini mock; found the non-working form and invented facts |
| 2026-11-12 | Owner chose: email and on-page form, hiring-first premium tone, keep five roles, English only |
| 2026-11-12 | Built a single-file HTML prototype to settle the design (spec-sheet signature, garnet/shell palette, Bodoni Moda) |
| 2026-11-12 | Owner asked for React + TypeScript + pnpm, kept as a one-pager. Rebuilt in Vite with build-time pre-rendering; content moved into `content.ts` |
| 2026-11-12 | FormSubmit chosen for form-to-email: no server, free, supports CV attachments via a normal form post. Web3Forms was ruled out because attachments need a paid plan |
| 2026-11-12 | First version committed and pushed to `github.com/jali-rk/neo_hire` |
