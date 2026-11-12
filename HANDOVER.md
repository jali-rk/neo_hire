# Handover: Aphrodite careers site

Last updated: 2026-11-12, session 1 (after owner review round 1)

This document is for anyone taking over the project. It covers what the site is, what's been decided, what's done and checked, and the full plan for what's left. You shouldn't need any other context.

**Preview:** https://jali-rk.github.io/neo_hire/ (GitHub Pages; redeploys on every push to `main` that touches `site/`; hidden from search engines).

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
| Fonts and feel | **Luxurious and readable, balanced.** Bodoni everywhere was hard to read, and plain Source Serif everywhere lost the luxury feel. Now: an elegant serif (Cormorant Garamond) for large headings only, with italic accents; a modern geometric sans (Jost, in the Futura lineage) for all reading text |
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
- [x] Luxury pass, kept readable:
  - dark hero and header with a champagne accent
  - Cormorant Garamond headings with italic accent phrases
  - tracked uppercase labels, buttons and navigation
  - Jost body text at 18px, AA contrast
  - the jacket drawing in cream lines on a dark pattern sheet
- [x] **Hero wow moment** (`SilkCanvas.tsx`):
  - fine stone and gold threads flowing like draped silk over a near-black field, drawn with a WebGL shader; they ripple around the cursor
  - the threads stay quiet behind the headline and catch light towards the right
  - this replaced an earlier full-screen garnet satin that the owner found too heavy
  - headline lines rise out of masks on load; the rest fades up
  - a "Scroll to explore" cue
  - the header is see-through over the hero and turns to smoked glass on scroll
  - the hero text drifts away as you scroll (in browsers that support CSS scroll timelines)
  - performance: rendered at reduced resolution, paused off-screen and in background tabs
  - reduced motion: one still frame. No WebGL: a CSS gradient
- [x] **Scroll experience:**
  - sections and cards rise in as they enter the screen, staggered (`data-reveal` / `data-reveal="stagger"`, wired up in `App.tsx`)
  - a slow italic band of craft phrases under the hero (`Marquee.tsx`, phrases from the preview, pauses on hover)
  - the key figures count up (`CountUp.tsx`)
  - in the 3D studio, the stage at the middle of the screen lights up with a champagne rule while the film stays pinned
  - role cards have a soft light that follows the cursor; cards lift on hover
  - the neo-luxury division is a dark featured card
  - nothing is hidden without JavaScript or under reduced motion
- [x] **Scroll choreography, round 2** (`styles.css`, "Luxury scroll choreography"):
  - section heads (`data-reveal="head"`): the label's rule draws in, the title sweeps up from behind a mask, the intro comes into focus from a soft blur
  - blocks and cards (`data-reveal` / `"stagger"`) rise 48px and un-blur
  - the film opens like a curtain from the centre (`data-reveal="curtain"`)
  - hairlines draw across under the key figures
  - numbers drift gently with scroll (`.drift`)
  - an oversized outlined APHRODITE wordmark in the footer tightens its letter-spacing as it comes into view
  - scroll-linked effects use CSS scroll timelines where supported (Chrome, Edge); other browsers get the reveals without the drift
- [x] **Film autoplay:**
  - muted is set on the element, so autoplay is allowed; it plays whenever it's on screen
  - if the browser blocks autoplay (Safari or iPhone in Low Power Mode), a large "Play film" button shows, and the first click, tap or key press anywhere starts it (tested by simulating a blocking browser)
  - it doesn't autoplay under reduced motion
  - asset paths are relative, so the site works from a sub-folder
- **Note for testing:** macOS **Low Power Mode** blocks autoplay in Safari and slows animations. The owner saw a "static" site with it on; with it off, everything animates. Test with it off, and remember some visitors will have it on.
- [x] Hero content restored from the original preview: "Incorporated in Sri Lanka · House of Modern Attire", "The Architecture of *Modern Attire.*", its subline, and the "Explore founding careers" and "Corporate overview" buttons
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
- **Fonts:** Cormorant Garamond (headings) and Jost (text) load; body text is 18px.
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
- **A 1080p film.** The current film is 360p and soft; a 1080p regeneration is pending (§6)

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
pnpm video <file>  # turn a source film into the web-optimised fit-on video files (needs ffmpeg; §6)
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

### Preview hosting (GitHub Pages)

- **URL:** https://jali-rk.github.io/neo_hire/
- **Workflow:** `.github/workflows/deploy-preview.yml` builds `site/` with pnpm 8 and Node 24, then deploys `site/dist` to Pages.
  - It runs on every push to `main` that changes `site/`, or manually: Actions → "Deploy preview to GitHub Pages" → Run workflow.
- **Build settings:** `SITE_URL=https://jali-rk.github.io/neo_hire` and **`NOINDEX=1`**. NOINDEX adds `<meta name="robots" content="noindex">` and a `Disallow: /` robots.txt, so search engines skip the preview while it still has placeholder content.
- **Pages setting:** Settings → Pages → Source: GitHub Actions. This was switched on on 2026-11-12.
- **The form on the preview:** it shows "Online applications aren't switched on yet" until `CONFIG.careersEmail` is set. Once it's set, FormSubmit works from the preview URL too.
- **For the real launch:** deploy to the final domain with `SITE_URL=<domain>` and **without** `NOINDEX`. Either point a custom domain at Pages (Settings → Pages → Custom domain, then update `SITE_URL` in the workflow and remove `NOINDEX`), or use Netlify, Vercel or Cloudflare Pages (§10, Phase 3).

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
    ├── video-source/          ← original film(s), not deployed; `pnpm video` turns them into public/video/
    ├── public/                ← favicon.svg, og-image.png, robots.txt, video/ (generated by `pnpm video`)
    ├── scripts/
    │   ├── prerender.mjs      ← build-time pre-render and SITE_URL tags
    │   ├── qa-browser.mjs     ← `pnpm qa`
    │   └── optimize-video.sh  ← `pnpm video`: source film → 4:5 MP4, WebM and poster
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
            ├── Hero.tsx          the preview's headline, subline and buttons over the silk
            ├── SilkCanvas.tsx    the hero thread animation (WebGL shader; colours, spacing and motion in FRAG)
            ├── Marquee.tsx       the craft-phrase band under the hero (phrases in CRAFT_WORDS)
            ├── CountUp.tsx       key figures that count up when they scroll into view
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

The 3D studio section has a web-optimised video player (`FitOnVideo.tsx`). It was tested end to end with a sample clip on 2026-11-12:

- nothing downloads at page load
- when the film scrolls into view, only the smaller WebM file loads, and it plays
- the pause button works, and the film pauses when scrolled away
- it never autoplays under reduced motion

Without a film configured, it shows the jacket drawing.

### Current film (2026-11-12)

- **Source:** `site/video-source/fit-on-source.mp4`, an AI-generated, illustrative clip made in Google AI Studio. It's 8 seconds, 360×640 (9:16), 24 fps.
- **What it shows:**
  - a faceless mannequin in a charcoal base layer, with garnet wrap-dress pieces floating around it
  - gold seam lines sew the pieces on
  - the camera turns to a side view of the finished dress
- **Looping:** the first and last frames are very different (front view in the base layer, side view in the dress), so a plain loop would visibly jump. It's therefore made into a **boomerang**: it plays forward, holds on the finished dress for 0.8 s, then plays backward, about 16.75 s in total. Both joins were checked frame by frame and are seamless.
- **Command:** `pnpm video video-source/fit-on-source.mp4 --boomerang`.
- **Output:** 330 KB WebM and 490 KB MP4, at the film's own 9:16 shape. The frame fits the screen height.
- **To improve:**
  - **Resolution:** 360p looks soft. Regenerate at **1080p**, or at least 720p, with the same prompt.
  - **A natively seamless loop:** the "fit-on loop prompt" below. The pieces sew on, then release back to their starting places, so the motion never reverses.

### Adding the film (one command)

```bash
cd site
pnpm video path/to/source.mp4                 # needs ffmpeg (brew install ffmpeg)
pnpm video path/to/source.mp4 --boomerang     # forward, hold, backward: loops when first and last frames differ
pnpm video path/to/source.mp4 --start 0.5 --end 7.5   # trim first
```

This writes `public/video/fit-on.mp4` (H.264), `fit-on.webm` (VP9) and `fit-on-poster.jpg`:

- keeps the film's own shape, never upscales, caps the height at 1920
- no audio, MP4 set to fast-start

It prints the line to paste into `src/content.ts`, for example:

```ts
fitOnVideo: { src: 'video/fit-on.mp4', webm: 'video/fit-on.webm', poster: 'video/fit-on-poster.jpg', width: 1080, height: 1920 }
```

Then run `pnpm build`. Keep the source film in `site/video-source/`, not in `public/`: everything in `public/` is deployed.

Aim for an MP4 under ~6 MB. If it's bigger, raise `-crf` in `scripts/optimize-video.sh` (e.g. 26) or shorten the clip.

### Where the film should come from

**Claude can't generate video.** It can write the prompt, prepare the files and wire the film in, as above. If you have an API key for a video model (for example Google's Gemini API for Veo), a script could call it from this project, but the account and its cost are yours.

1. **Best (authentic): a CLO 3D export of a real Aphrodite garment.**
   - CLO 3D can record the simulation and turntables of a garment on an avatar, and render them photorealistically.
   - This is genuinely what the page describes.
   - It's an ideal first task for the 3D Apparel Designer once hired.
2. **Now (illustrative): an AI video model.** Current leaders for realistic fashion video:
   - **Google Veo 3.1:** recommended. It's in Google Flow and the Gemini app (paid Google AI plan), which the owner already uses. It produces very realistic short clips, supports vertical 9:16 and **first and last frame control**.
   - **Kling:** strong cloth motion; good image-to-video.
   - **OpenAI Sora 2:** realistic, longer clips.
   - **Runway:** good editing tools.
   - Check each provider's current pricing and commercial-use terms before using a clip publicly.
3. **Avoid stock footage of other brands' products.** It would misrepresent the company.

**Honesty note:** an AI film is illustrative, not footage of an Aphrodite garment. The caption is worded to describe the process, so it stays true either way: "Virtual fitting: every style is draped and fitted on a 3D avatar before any cloth is cut." Don't add a caption claiming the film is a real collection piece unless it is.

### How to generate it (best results)

Generate a still image first, then animate it. Going straight from text to video gives less control.

1. Make two stills, both 9:16 (Gemini image generation, Imagen, Midjourney, etc.):
   - **Start frame:** the avatar on a platform with the flat garment pieces floating around them.
   - **End frame:** the same avatar wearing the finished garment.
2. In Veo 3.1 (Flow), use **first and last frame** mode with the prompt below. In Kling, use image-to-video with the start frame.
3. Generate 3–4 takes, pick the best, then run `pnpm video take.mp4`. The script crops 9:16 to 4:5, so keep the subject centred with headroom.

### Main prompt (womenswear)

> Photorealistic luxury fashion-tech film, vertical 9:16, 8 seconds, slow and elegant.
>
> A realistic 3D digital avatar of a woman (calm neutral expression, dark hair in a low bun, seamless nude base layer) stands in a relaxed A-pose on a slowly turning circular platform in a dark, minimal studio. A soft warm key light falls from the upper left, with deep charcoal shadows.
>
> Flat pattern pieces of a garnet-red silk wrap dress float in the air around her, like a CLO 3D virtual sewing simulation. Thin glowing champagne-gold seam lines link matching edges. The pieces glide onto her body and stitch together along the seams. The silk then drapes and settles with true-to-life cloth physics: weight, gentle sway, soft specular highlights running along each fold.
>
> A faint wireframe mesh shows on the fabric at first and dissolves as the cloth settles into a perfectly fitted dress. The camera makes one slow, smooth 90-degree orbit at chest height, with shallow depth of field.
>
> Palette: deep charcoal, garnet silk, champagne-gold accents. High detail, cinematic, premium.
>
> No text, no logos, no watermark, no other people, no music or sound.

### Menswear variant

> Same scene and style, but a realistic 3D male avatar, and the pieces form a tailored ivory single-breasted jacket with a garnet satin lining. The lapels roll naturally and the shoulders settle cleanly as the jacket fits.

### Fit-on loop prompt (natively seamless, keeps the fit-on effect)

An earlier "loop prompt" kept the dress on the whole time, which loses the fit-on effect. The owner rejected it. This version tells a full cycle instead: the pieces sew on, then release and float back to where they started, so the clip ends on its own first frame.

Settings: 9:16, **1080p** (at least 720p), **12 seconds**.

> Luxury fashion-technology film, vertical 9:16, 12 seconds, seamless loop: the final frame is identical to the first frame. A stylised 3D fashion display mannequin with a smooth, simplified, abstract form (no anatomical detail), a calm faceless head, and a modest long-sleeved high-neck charcoal bodysuit and leggings stands on a circular platform in a dark, minimal studio with a soft warm key light from the upper left. The camera is locked off at chest height, facing the mannequin, and does not move.
>
> 0–2 s: flat pattern pieces of a garnet-red silk wrap dress float in the air around the mannequin, gently drifting.
> 2–6 s: thin glowing champagne-gold seam lines connect matching edges; the pieces glide onto the mannequin over the charcoal base layer and stitch together along the seams, then the silk drapes and settles with realistic cloth physics into a beautifully fitted long wrap dress. A faint wireframe mesh shows on the fabric and fades as it settles.
> 6–8 s: the finished dress sways softly; the platform turns gently left and back to face the camera.
> 8–12 s: the gold seam lines glow again, the seams release, and the pieces lift off and float back out to exactly the same positions they started in, ready to begin again.
>
> Palette: deep charcoal, garnet silk, champagne-gold accents. Photoreal cloth, cinematic, premium. Silent, no text, no logos, no watermark.

**To guarantee the loop:** use image-to-video with the **same image as both the first and the last frame** (Google Flow / Veo 3.1 first-and-last-frame mode). Make the image first:

> Vertical 9:16 photoreal studio image. A stylised 3D fashion display mannequin, smooth abstract form with no anatomical detail, faceless head, wearing a modest long-sleeved high-neck charcoal bodysuit and leggings, stands facing the camera on a dark circular platform in a dark, minimal studio with a soft warm key light from the upper left. Flat garnet-red silk wrap-dress pattern pieces (bodice fronts, sleeves, two skirt panels) float in the air on both sides, each with a thin champagne-gold outline. Cinematic, premium, no text.

Then run `pnpm video take.mp4` with no `--boomerang`, and use `--end` if the last frame needs trimming. If the ends don't match well, use `--boomerang`: it already shows the fit-on.

### Extra lines that help

- **If the motion is too fast:** "slow motion, unhurried, graceful".
- **If the avatar looks uncanny:** "stylised photoreal avatar with a smooth, matte, mannequin-like finish".
- **If the result is a loop clip:** ask for "starts and ends on the same frame (seamless loop)", or cut a loop in any editor.

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

- **Direction:** a luxury fashion house that's still easy to read.
  - **Dark:** the header, hero, 3D studio, apply section and footer (ink, with a champagne accent).
  - **Light:** the company, divisions and careers sections (shell and paper, with a garnet accent).
- **Type:** keep the balance. The owner rejected both extremes.
  - **Cormorant Garamond** (weight 500–600) only for large headings: page and section titles, card titles, key figures, stage numbers, the wordmark. One phrase per title is set in *italic* in the accent colour.
  - **Jost** for all reading text: body at 18px, form fields, details.
  - **Labels** (eyebrows, buttons, navigation, filters, statuses): sans, uppercase, letter-spaced (0.12–0.22em), 12.5–14.5px, weight 600–700. Eyebrows have a short rule before them.
  - Don't set Cormorant below about 1.6rem, and don't use it for body text.
  - Both fonts are self-hosted through `@fontsource`.

| Token | Value | Use |
|---|---|---|
| `--shell` | `#F6ECE9` | Page background |
| `--paper` | `#FCF8F6` | Cards, alternate sections |
| `--ink` | `#1C1517` | Headings; dark sections |
| `--ink-2` | `#2E2427` | Body text |
| `--muted` | `#5B4A4D` | Secondary text |
| `--line` | `#E0CFCB` | Hairlines |
| `--garnet` | `#7A1F33` | The single accent |
| `--rose` | `#F0B8C3` | Error text on dark |
| `--champagne` | `#CDB088` | Accent on dark: eyebrows, italic accents, stage numbers, drawing details |
| `--bronze` | `#8A6A42` | Fine rules and division numbers on light |

- **Details:**
  - small garnet "notch" triangle bullets (from pattern pieces)
  - the dot-and-cross pattern-paper background behind the jacket drawing
  - a dashed "cutting line" border on the open-application card
- **Motion:**
  - the hero silk, the headline rise and the hero drifting away on scroll
  - the craft band
  - section and card reveals
  - counting key figures
  - the 3D studio stage highlight
  - role-card spotlight and hover lift
  - the jacket drawing draws itself in
  - the role panel slides in
  - Keep motion slow and eased (`cubic-bezier(.19, 1, .22, 1)`). Avoid bouncy or fast effects.
  - all of it is off, or a still frame, under reduced motion
  - The preview's "CLO 3D Mesh Simulation Active" label is deliberately left out: the silk is decorative, not a CLO 3D simulation.
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

1. **A 1080p virtual fitting film** (§6). The current 360p film is in place as a boomerang loop. Ideally regenerate with the loop prompt, or export from CLO 3D.
2. The **careers inbox** (and optionally a corporate address).
3. The **domain** (for `SITE_URL`) and where to host.
4. Decisions on the "left out" and "worth confirming" lists in §8.
5. Agreement that CVs may pass through FormSubmit.

### Phase 3: Go live

1. Set `CONFIG`, add the film, run `pnpm build && pnpm preview && pnpm qa`, and check the screenshots.
2. **Deploy.** Set the environment variable `SITE_URL=https://<domain>` on the host, and make sure `NOINDEX` is **not** set. (The GitHub Pages preview sets it.)
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
| 2026-11-12 | **Owner review round 1:**<br>• fonts hard to read → Source Serif 4 + Jost<br>• "hiring five people" unprofessional → no headcount anywhere<br>• "+" expanders → role cards with a "View role details" side panel<br>• "don't invent content" → rebuilt from the original preview's text, with the invented items listed in §8<br>• 3D section must play a virtual-fitting video → video player added, film to be supplied<br>• follow the original preview's section order → done<br>• spec-sheet hero, "Why join", "How we hire" and FAQ removed |
| 2026-11-12 | **Owner review round 6:** the body font (Source Sans 3) felt plain → **Jost**, a geometric sans in the Futura lineage that pairs with Cormorant for a fashion-editorial look; bold values softened to weight 500; link-preview image updated |
| 2026-11-12 | **Owner review round 5:** the full-screen garnet silk felt too heavy ("a lot filling") → replaced with fine silk threads on near-black (stone threads, with every fourth in gold; light catches them; mostly empty space); headline side kept clean |
| 2026-11-12 | **Preview hosted on GitHub Pages** (https://jali-rk.github.io/neo_hire/) via Actions, with noindex while placeholders remain |
| 2026-11-12 | **Owner review round 4:** "film must start automatically" → muted forced, autoplay fallback on first interaction with a large play button. "More scroll animation, luxury feel" → masked title sweeps, focus-pull reveals, film curtain, drawing hairlines, scroll-linked drift, footer wordmark. The "static" look and click-to-play were caused by macOS Low Power Mode |
| 2026-11-12 | **Fit-on film added:** an AI-generated 8 s clip (360p, 9:16) whose first and last frames differ, so it's made into a boomerang loop. The player keeps the film's own shape. Next: a 1080p regeneration with the fit-on loop prompt in §6 (the dress-always-on loop prompt was rejected: no fit-on effect) |
| 2026-11-12 | **Owner review round 3:** "more interactive, a wow animation in the first section, more luxury and modern" and "the preview's hero content is better" → live WebGL silk hero; the preview's hero wording restored; see-through header; scroll reveals, craft band, counting figures, studio stage highlight, card spotlight; web-optimised video player (lazy, plays only on screen) and the video brief in §6 |
| 2026-11-12 | **Owner review round 2:** "the plain text lost the luxury feeling; make it balanced" → Cormorant Garamond for large headings with italic accents; dark hero and header; champagne accent; tracked uppercase labels and buttons; body text kept in Jost at 18px for readability; section titles use the original preview's phrasing |
