# Product Requirements Document (PRD) — Nova Digital Studio

**Project**: Nova Web Presence  
**Version**: 1.0 (Pre-Launch Baseline)  
**Status**: Ready for Verification & Content Replacement  
**Stack**: Vanilla HTML5, CSS3, ES6 JavaScript (Zero Frameworks, Zero Build Dependencies)

---

## 1. Product Purpose & Target Audience

### 1.1 Purpose
Nova is a portfolio and client acquisition landing page for an independent digital studio offering **Strategy**, **Design**, and **Technology** services. The site introduces the studio's positioning (*"Make your next digital move matter"*), validates credibility through proof metrics, outlines its core service disciplines, and captures project inquiries via an interactive intake form.

### 1.2 Target Audience *(Design Assumption)*
- **Primary**: Founders, CMOs, and product leaders at growth-stage startups and established businesses seeking a clearer, premium digital presence.
- **Secondary**: Prospective agency collaborators, design peers, and talent looking for an independent, craft-led studio culture.

---

## 2. Information Architecture & Section Goals

| Section | Identifier | Visual Treatment | Primary Goal |
| :--- | :--- | :--- | :--- |
| **Site Header** | `.site-header` | Sticky, `--paper` background, hairline border | Maintain brand presence (`nova®`), provide accessible mobile/desktop navigation, and offer a persistent conversion CTA (*Start a project ↗*). |
| **Hero** | `#home` | Asymmetric split layout (copy left, diagram right) | Hook visitors with display typography (*"Make your next digital move matter."*), establish editorial tone, offer dual CTAs, and showcase custom vector art. |
| **About** | `#about` | 2-column narrative with border-delimited proof strip | Articulate studio ethos (*"A good idea deserves a better digital life"*), establish craft philosophy, and display four quantitative proof metrics. |
| **Services** | `#services` | Full-width inverted dark theme (`--ink` background) | Present the 3 core disciplines (01 Strategy, 02 Design, 03 Technology) in an asymmetrical ledger format with direct inquiry cues. |
| **Contact** | `#contact` | Open intake desk layout with fallback email | Convert high-intent leads via an interactive 4-field inquiry form, with real-time error hints and submission feedback. |
| **Site Footer** | `.site-footer` | Minimal border-top grid | Provide brand mark, studio motto, accessible back-to-top scroll jump, and copyright. |

---

## 3. Features & Interactive Logic

### 3.1 Mobile Navigation Drawer
- **Implementation**: Vanilla JS in `script.js` (`initMobileMenu()`).
- **Behavior**:
  - Visible only on viewports $\le 680\text{px}$ via `.nav-toggle` button. Hidden on desktop ($> 680\text{px}$).
  - Toggles `aria-expanded="true/false"` and controls the `.is-open` class on `#nav-links`.
  - Automatically dismisses when any navigation anchor link is clicked, when the `Escape` key is pressed (returning focus to the toggle button), or when clicking outside the menu.

### 3.2 Client-Side Form Validation & Submission
- **Implementation**: Vanilla JS in `script.js` (`initContactForm()`).
- **Fields Validated**:
  1. **Name** (`#contact-name`): Trimmed length $\ge 2$ characters.
  2. **Email** (`#contact-email`): Validated via standard email regex pattern (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
  3. **Discipline** (`#contact-service`): Requires selection from Strategy, Design, Technology, or Full-spectrum.
  4. **Message** (`#contact-message`): Trimmed length $\ge 10$ characters.
- **Error Handling**: Displays inline error text in dedicated `.field-error` elements, sets `aria-invalid="true"`, and automatically shifts keyboard focus to the first invalid field. Errors clear dynamically on input.
- **Submission**: Disables submit button during flight, executes an asynchronous `fetch` POST to Formspree (`https://formspree.io/f/YOUR_ID`) using `FormData`, and displays a clean confirmation message in `#form-feedback`.
- **No-JS Fallback**: `<form>` contains native `action="https://formspree.io/f/YOUR_ID"` and `method="post"` to ensure submissions succeed even if JavaScript is disabled.

### 3.3 Active ScrollSpy Navigation
- **Implementation**: Vanilla JS in `script.js` (`initScrollspy()`) using browser-native `IntersectionObserver`.
- **Behavior**: Observes viewport entry of `#home`, `#about`, `#services`, and `#contact` (with `-25% 0px -65% 0px` root margin) to apply `.is-active` and `aria-current="page"` to the header navigation links.

### 3.4 Reduced-Motion Awareness
- **Implementation**: CSS `@media (prefers-reduced-motion: reduce)` collapses all animation and transition durations to `0.01ms`. JavaScript checks `window.matchMedia('(prefers-reduced-motion: reduce)')` to force instant scrolling (`behavior: 'auto'`) on form feedback jumps.

---

## 4. Design System & Tokens

### 4.1 Color Palette
Restrained editorial palette strictly defined in `Style.css`:
* `--paper`: `#f3f0e8` (Primary background, light warm cream)
* `--paper-deep`: `#e9e4d9` (Secondary background, input fields, diagram art fill)
* `--ink`: `#171715` (Deep charcoal body text, primary buttons, services section background)
* `--muted`: `#595650` (Secondary text, kickers, captions, labels — verified 6.42:1 contrast)
* `--rule`: `#c9c3b7` (Subtle 1px hairline dividing borders)
* `--accent`: `#e64a2e` (Signature safety vermilion orange)
* `--accent-contrast`: `#c7381d` (High-contrast accent for small text on light paper — 5.12:1)
* `--accent-on-dark`: `#ff5f40` (High-contrast accent for numbers on dark background — 6.22:1)

### 4.2 Typography & Scale
* **Serif Stack** (`--serif`): `"Iowan Old Style", "Charter", "Baskerville Old Face", Baskerville, "Georgia", serif` (Max 1 display typeface with cross-platform OS fallbacks).
* **Sans Stack** (`--sans`): `"Avenir Next", Avenir, system-ui, -apple-system, "Segoe UI", sans-serif` (Max 1 interface typeface).
* **Modular Type Scale**:
  * `--text-2xs`: `0.62rem` (Eyebrow kickers, diagram index)
  * `--text-xs`: `0.72rem` (Metadata, captions, footer copy)
  * `--text-sm`: `0.80rem` (Buttons, navigation links)
  * `--text-base`: `0.92rem` (Body copy, intro text)
  * `--text-lg`: `1.05rem` (Hero intro lede)
  * `--text-xl`: `1.40rem` (About lede headline)
  * `--text-2xl`: `clamp(1.8rem, 3vw, 3rem)` (Service row titles)
  * `--text-3xl`: `clamp(3.2rem, 6vw, 6.5rem)` (Display section headings)

### 4.3 Spacing Scale
Modular 8pt-based token scale:
* `--space-2xs`: `4px`
* `--space-xs`: `8px`
* `--space-sm`: `14px`
* `--space-md`: `20px`
* `--space-lg`: `28px`
* `--space-xl`: `40px`
* `--space-2xl`: `60px`
* `--space-3xl`: `clamp(88px, 9vw, 132px)` (Section vertical padding)

### 4.4 Micro-Interactions
- Directional arrow shifts: `translate(3px, -3px)` on diagonal links and `translateY(2px)` on explore/scroll links.
- Tactile button press: `translateY(1px)` on `:active`.
- Editorial text selection: Dual-palette highlights (`--ink` selection on paper, `--accent` on dark).
- Text balancing: `text-wrap: balance` on headings and `text-wrap: pretty` on copy.

---

## 5. Accessibility & SEO Compliance

### 5.1 Accessibility Checklist
- [x] **WCAG AA Color Contrast**: All text elements exceed the 4.5:1 ratio (small muted text at 6.42:1; dark section copy at 8.21:1; dark accent at 6.22:1).
- [x] **Visible Focus Rings**: Universal `outline: 2px solid var(--accent); outline-offset: 4px;` on all interactive elements via `:focus-visible`.
- [x] **Keyboard Navigation**: Accessible skip-to-content link (`.skip-link`), keyboard tab indexing, and Escape key listeners.
- [x] **Screen Reader Architecture**:
  - `role="img"` with direct caption association (`aria-labelledby`) on the abstract hero illustration.
  - `role="region"` with `aria-label` on proof points strip.
  - Decorative marks, glyphs, and slashes filtered via `aria-hidden="true"`.
  - Form fields connected to labels via `for`/`id` and error messages via `aria-describedby` with `aria-live="polite"`.

### 5.2 SEO Baseline
- [x] Language attribute declared (`<html lang="en">`).
- [x] Primary display heading (`<h1>`) unique to the page.
- [x] Descriptive meta tags: `<title>`, `<meta name="description">`, `<meta name="theme-color">`.
- [x] Open Graph protocol tags (`og:title`, `og:description`, `og:type`).
- [x] Canonical link tag configured with a placeholder domain (`https://yourdomain.com`).
- [x] Inline SVG data URI favicon.

---

## 6. Future Work *(Post-Launch Enhancements)*

These features are intentionally excluded from the initial release to maintain an unbloated codebase, and can be added once real assets exist:
1. **Selected Work / Case Studies**: A visual grid or horizontal scroll showcase placed between *Services* and *Contact* once 2–3 client case studies and high-resolution imagery are available.
2. **Client Testimonials / Quotes**: Editorial quote callouts from past clients embedded into the *About* or *Services* section.
3. **Interactive Budget / Timeline Selectors**: Segmented pill selectors inside the contact form for project budget ranges.
4. **Custom Domain Hosting Assets**: Production `robots.txt`, XML sitemap (`sitemap.xml`), and a dedicated 1200x630px social preview image (`og:image`).
