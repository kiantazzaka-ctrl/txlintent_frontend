# Transaction Intent Security Layer — frontend

Marketing site + interactive demo for the Transaction Intent Security Layer.
Visual system follows the AgenticX reference (layout, Mattone/Switzer type scale,
palette, spacing, card system, section rhythm). Product scope and copy follow the product brief.

## Run
```bash
npm install
npm run dev      # dev server → http://localhost:5173
npm run build    # production build → dist/index.html (single self-contained file)
npm run preview  # serve the build → http://localhost:4173
```
- The root `index.html` is the **Vite source template** (it loads `src/main.jsx`, which
  browsers cannot run directly). Opened from disk it redirects to `dist/index.html`.
- `dist/index.html` has JS, CSS and fonts inlined, so it works by double-clicking it
  (file://), on any static server, and on Vercel.

Deploy: import the repo in Vercel (framework preset: Vite, output `dist`). `vercel.json` is included.

## Structure
- `src/content.js` — all copy (brand name `BRAND` is one constant)
- `src/lib/intent.js` — intent engine: calldata decoder → intent → security rules → structured output
- `src/components/` — one component per section (Nav, Hero, Engine, Flow, Demo, Bento, Features, See, Why, Builders, Faq, Roadmap, Access, Footer)
- `src/art/` — procedural canvas illustrations (pixel mosaic, bar field, dithering, ASCII)
- `src/styles.css` — design tokens + all styles; breakpoints 1199px (tablet) / 809px (mobile)
- `src/assets/fonts/` — Mattone, Switzer, Chivo Mono, Public Sans (check each font's licence before commercial launch)

## Demo
Decodes real EVM calldata for `approve`, `transfer`, `transferFrom`, `setApprovalForAll`,
`transferOwnership`; paste your own calldata into the input. Contract/label registry is demo data.
