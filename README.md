# Nova — Independent Digital Studio

A high-craft, editorial landing page for **Nova**, an independent digital studio specializing in **Strategy**, **Design**, and **Technology**.

Built with pure vanilla web standards—zero JavaScript frameworks, zero CSS preprocessors, zero build steps, and zero external runtime dependencies.

---

## Workspace Structure

```text
Nova/
├── index.html        # Main semantic HTML5 markup & metadata
├── Style.css         # Design system tokens, editorial layout & media queries
├── script.js         # Vanilla ES6 interactivity (menu, validation, scrollspy)
├── README.md         # Project setup, deployment guide & launch checklist
└── PRD.md            # Product requirements document & technical specification
```

---

## Running Locally

Because this project uses vanilla HTML, CSS, and modern JavaScript, no installation or compilation step is needed.

### Option 1: VS Code Live Server (Recommended)
1. Open the `Nova` folder in VS Code.
2. Ensure the **Live Server** extension is installed (settings already pre-configured in `.vscode/settings.json`).
3. Right-click `index.html` and select **"Open with Live Server"** (or click **Go Live** in the status bar).
4. Browser opens automatically at `http://localhost:5501`.

### Option 2: Python Static Server
Run from terminal inside the `Nova` directory:
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000`.

### Option 3: Node / npx
```bash
npx serve .
```

### Option 4: Direct File Inspection
Double-click `index.html` to open it directly via the `file://` protocol in any modern browser.

---

## Deployment Guide

### Deploying to Netlify (Drag & Drop)
1. Log in to [Netlify](https://app.netlify.com).
2. Go to **Sites** and drag the entire `Nova` folder into the upload dropzone.
3. Your site will be published instantly with an HTTPS URL.
4. (Optional) In **Domain Settings**, add your custom domain.

### Deploying to GitHub Pages
1. Push this directory to a GitHub repository (e.g. `username/nova`).
2. Go to **Settings** > **Pages**.
3. Under **Build and deployment > Source**, choose **Deploy from a branch**.
4. Select `main` (or `master`) and folder `/ (root)`. Click **Save**.
5. Your site will be live at `https://<username>.github.io/<repo>/`.

### Deploying to Cloudflare Pages or Vercel
1. Connect your repository.
2. Leave **Build Command** blank and set **Output Directory** to `.` (root).
3. Click **Deploy**.

---

## Connecting the Formspree Contact Form

The project is configured to send inquiry submissions directly to [Formspree](https://formspree.io):

1. Go to [formspree.io](https://formspree.io) and create a free account.
2. Create a **New Form**, name it (e.g., *Nova Studio Inquiries*), and set your recipient email address.
3. Formspree will provide a form ID (e.g., `mqazknyz`).
4. Replace `YOUR_ID` in two locations:
   - **`index.html`**:
     ```html
     <form class="contact-form" id="contact-form" action="https://formspree.io/f/YOUR_ID" method="post" ...>
     ```
   - **`script.js`**:
     ```javascript
     fetch('https://formspree.io/f/YOUR_ID', { ... })
     ```
5. Test the form in your browser. Submissions will validate client-side, submit via fetch, and deliver formatted inquiry emails to your inbox. If JavaScript is disabled, the form gracefully falls back to native browser submission.

---

## Pre-Launch Placeholder Checklist

Before going live, update the following placeholders marked with `<!-- TODO -->` comments:

- [ ] **Studio Metrics** (`index.html` lines 98–111):
  - `25+ Projects delivered` $\rightarrow$ Replace with your actual project count.
  - `10+ Industries served` $\rightarrow$ Replace with your actual industry count.
  - `98% Client satisfaction` $\rightarrow$ Replace with your actual client satisfaction rate.
  - `5+ Years in the work` $\rightarrow$ Replace with your actual studio tenure.
- [ ] **Contact Email** (`index.html` line 205):
  - Replace `hello@nova.studio` with your verified studio contact email.
- [ ] **Formspree Form ID** (`index.html` line 160 & `script.js` line 201):
  - Replace `YOUR_ID` with your registered Formspree endpoint ID.
- [ ] **Canonical URL** (`index.html` line 18):
  - Replace `https://yourdomain.com` with your production domain URL.
- [ ] **Social Sharing Image** (Optional / Nice-to-have):
  - Add `<meta property="og:image" content="https://yourdomain.com/og-image.jpg">` in `index.html` `<head>`.
