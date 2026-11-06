# Nova — Independent Digital Studio

A high-craft, editorial landing page for **Nova**, an independent digital studio specializing in **Strategy**, **Design**, and **Technology**.

Built with pure vanilla web standards — zero JavaScript frameworks, zero CSS preprocessors, zero build steps, and zero external runtime dependencies.

---

## Project Overview

Nova is a portfolio and client acquisition landing page designed to introduce the studio's positioning (*"Make your next digital move matter"*), validate credibility through proof metrics, outline its three core service disciplines, showcase selected work, articulate its delivery process, answer common client questions, and capture project inquiries through an interactive intake form.

### Problem Statement
Growth-stage businesses often struggle to communicate a clear, compelling digital presence. Nova exists to solve that for its clients — and this site demonstrates Nova's own craft: sharp copywriting, editorial design, and clean engineering delivered as a single-page static site with no unnecessary complexity.

### Objectives
- Establish the studio's brand positioning and visual identity
- Present Strategy, Design, and Technology services clearly
- Showcase conceptual client work with clear categorisation and technology tags
- Outline the 4-stage studio process from initial discovery to final delivery
- Provide an interactive, accessible FAQ answering essential prospective client questions
- Capture high-intent project inquiries via a validated contact form
- Achieve production-ready accessibility (WCAG AA) with zero external dependencies
- Deploy instantly to any static hosting platform

---

## Technologies

| Layer | Technology |
|:--- |:--- |
| Markup | HTML5 (semantic, accessible) |
| Styles | CSS3 (custom properties, Grid, Flexbox, `clamp()`) |
| Interactivity | Vanilla ES6 JavaScript (no libraries) |
| Form backend | [Formspree](https://formspree.io) (requires free account — see setup below) |
| Hosting | Any static host (Netlify, GitHub Pages, Cloudflare Pages, Vercel) |

---

## Website Sections (In Order)

1. **Home (`#home`)**: Asymmetric hero layout with display typography, dual conversion CTAs, and custom geometric SVG diagram artwork.
2. **About (`#about`)**: Two-column studio ethos narrative with border-delimited proof strip featuring 4 quantitative studio metrics.
3. **What We Do (`#services`)**: Full-width inverted dark theme (`--ink` background) presenting 3 core disciplines (01 Strategy, 02 Design, 03 Technology) in an asymmetrical ledger.
4. **Selected Work (`#work`)**: Portfolio showcase featuring 3 curated conceptual projects with category metadata, descriptions, technology badges, and concept preview cues.
5. **Our Process (`#process`)**: 4-stage sequential project methodology (01 Discover, 02 Strategize, 03 Create, 04 Deliver) in a clean numbered ledger.
6. **FAQ (`#faq`)**: Interactive, keyboard-accessible accordion answering 5 common questions with single-open toggle behavior and smooth CSS transitions.
7. **Contact (`#contact`)**: Open intake desk layout with client-side validated 4-field inquiry form, direct email fallback, and Formspree async delivery.

---

## Features

- **Sticky header** with wordmark, desktop navigation with 6 section links, and persistent "Start a project" CTA
- **Hero section** with asymmetric split layout, custom SVG-based abstract art, and dual CTAs
- **About section** with studio narrative and four quantitative proof metrics
- **Services section** with full-width dark theme and three discipline rows (Strategy, Design, Technology)
- **Selected Work showcase** with 3 project cards, technology tags, and bespoke geometric art
- **Our Process ledger** presenting 4 project delivery phases (Discover, Strategize, Create, Deliver)
- **Accessible FAQ accordion** with semantic buttons, `aria-expanded`, `aria-controls`, and `role="region"` bindings
- **Contact section** with client-side validated intake form and Formspree submission
- **Active scrollspy navigation** via `IntersectionObserver` — highlights the active section in the nav as the user scrolls
- **Mobile navigation drawer** — toggles on ≤680px with Escape key, outside-click, and focus-return handling
- **Duplicate-submission guard** — prevents double POSTs while a form request is in-flight
- **Accessible focus management** — focus shifts to the first invalid field on failed submission; universal `:focus-visible` rings
- **Reduced-motion support** — CSS collapses all animation durations; JS uses `behavior: 'auto'` for smooth scrolls
- **Skip-to-content link** for keyboard users
- **Inline SVG favicon** (no external asset required)

---

## Project Structure

```text
Nova/
├── index.html        # Semantic HTML5 markup, metadata, all 7 sections
├── Style.css         # Design system tokens, editorial layout, media queries
├── script.js         # Vanilla ES6: mobile menu, scrollspy, FAQ accordion, form validation
├── robots.txt        # Search engine crawl directives (update domain before launch)
├── sitemap.xml       # XML sitemap (update domain and lastmod before launch)
├── README.md         # This file
├── PRD.md            # Product requirements document and technical specification
├── package-lock.json # Minimal lock file (no npm dependencies)
└── .vscode/
    ├── settings.json # Live Server port configuration (5501)
    └── launch.json   # Chrome debug launch target
```

---

## Running Locally

No installation or compilation step is needed.

### Option 1 — VS Code Live Server (Recommended)
1. Open the `Nova` folder in VS Code.
2. Install the **Live Server** extension if not already installed.
3. Right-click `index.html` → **"Open with Live Server"** (or click **Go Live** in the status bar).
4. Browser opens automatically at `http://localhost:5501`.

### Option 2 — Python Static Server
```bash
python -m http.server 3000
```
Then open `http://localhost:3000`.

### Option 3 — Node / npx serve
```bash
npx serve .
```

### Option 4 — Direct File
Double-click `index.html` to open via the `file://` protocol. All features work except the Formspree form submission (blocked by CORS on `file://`). Use Live Server or Python for form testing.

---

## Deployment Guide

### Netlify (Drag & Drop — Recommended)
1. Log in to [Netlify](https://app.netlify.com).
2. Go to **Sites** and drag the entire `Nova` folder into the upload dropzone.
3. Your site is published instantly with an HTTPS URL.
4. *(Optional)* Under **Domain Settings**, connect your custom domain.

### GitHub Pages
1. Push this directory to a GitHub repository (e.g. `username/nova`).
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select `main` and folder `/ (root)`. Click **Save**.
5. Live at `https://<username>.github.io/<repo>/`.

### Cloudflare Pages or Vercel
1. Connect your repository.
2. Leave **Build Command** blank and set **Output Directory** to `.` (root).
3. Click **Deploy**.

---

## Connecting the Contact Form (Formspree)

The form sends inquiries directly to [Formspree](https://formspree.io) — a free service that forwards submissions to your email inbox. **No backend server required.**

### Setup Steps
1. Go to [formspree.io](https://formspree.io) and create a free account.
2. Click **+ New Form**, name it (e.g. *Nova Studio Inquiries*), and enter your recipient email address.
3. Formspree generates a form ID (e.g. `mqazknyz`).
4. Replace `YOUR_ID` in **two places**:

   **`index.html`** (line ~398, the `<form>` tag's `action` attribute):
   ```html
   <form ... action="https://formspree.io/f/mqazknyz" ...>
   ```

   **`script.js`** (line ~260, inside `initContactForm`):
   ```js
   fetch('https://formspree.io/f/mqazknyz', { ... })
   ```

5. Test by submitting the form in your browser. You should receive an email at your Formspree-registered address.
6. If JavaScript is disabled in the browser, the form falls back to a native `method="post"` submission to the same Formspree endpoint.

---

## Pre-Launch Checklist

Before going live, update all items marked `<!-- TODO -->` in the source:

- [ ] **Formspree ID** — Replace `YOUR_ID` in `index.html` (action attr) and `script.js` (fetch URL).
- [ ] **Contact email** — Replace `hello@nova.studio` in `index.html` with your verified studio inbox.
- [ ] **Canonical URL** — Replace `https://yourdomain.com` in `index.html` with your production domain.
- [ ] **og:url** — Replace `https://yourdomain.com` in the `og:url` meta tag in `index.html`.
- [ ] **og:image** — Create a 1200×630px social preview image, host it, and uncomment the `og:image` meta tag in `index.html`.
- [ ] **robots.txt** — Replace `https://yourdomain.com` with your production domain in the `Sitemap:` directive.
- [ ] **sitemap.xml** — Replace `https://yourdomain.com` with your production domain and update `<lastmod>`.
- [ ] **Studio metrics** (`index.html` proof-strip section) — Replace placeholder figures (25+ Projects, 10+ Industries, 98% satisfaction, 5+ Years) with verified data.

---

## Known Limitations

| Limitation | Detail |
|:--- |:--- |
| Form submission | Requires a configured Formspree account. With `YOUR_ID` placeholder, the fetch request will return a 404. Client-side validation and UI feedback still work without it. |
| Social preview image | No `og:image` asset is included. Social sharing cards will render without a preview image until you add one. |
| Proof metrics | The figures in the About section (25+ projects, 10+ industries, etc.) are placeholder values. Replace with verified studio data before launch. |
| Contact email | `hello@nova.studio` is a placeholder. Update to your real studio inbox. |
| Custom domain | `https://yourdomain.com` appears in the canonical URL, `og:url`, `robots.txt`, and `sitemap.xml`. All four must be updated before launch. |
| Portfolio projects | The 3 projects in Selected Work are conceptual showcase entries representing studio capabilities, not client-verified case studies. Replace with live client work when available. |
