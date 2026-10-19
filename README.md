# Houston Family HVAC — website

One-page static site: semantic HTML5 · Tailwind CSS v4 (CLI) · vanilla JS · Lenis smooth scroll · GSAP + ScrollTrigger.

## Run
```bash
npm install
npm run build      # copies Lenis/GSAP into js/vendor + compiles dist/styles.css
npm run serve      # http://localhost:5173
```
While editing styles: `npm run dev` (Tailwind watch).

## Structure
- `index.html`: the page (all content)
- `src/input.css`: design tokens (`@theme`) + components → `dist/styles.css`
- `js/main.js`: meander ring, Lenis, menu, anchors, quote form, GSAP motion
- `js/vendor/`: pinned copies of lenis 1.3.x, gsap 3.15.x, ScrollTrigger
- `assets/images/`: client logo, favicon

## Deploy
Upload `index.html`, `dist/`, `js/`, `assets/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages). No server needed.

Docs: `PROJECT_BRIEF.md`, `DESIGN_PROPOSAL.md`, `QA_REPORT.md`.
