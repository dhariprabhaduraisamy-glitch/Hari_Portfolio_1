# AI/ML Portfolio — "Signal Intelligence" Theme

No Python, no Streamlit, no framework, no build step. Pure HTML/CSS/JS —
a professional AI/ML & Data Analytics themed portfolio.

## Design concept
- **Palette:** deep indigo-navy background, violet→cyan gradient as the
  signature "signal" accent (represents AI + data), amber/green used only
  for status pills.
- **Type:** Sora for headings (clean, geometric, tech-forward), Inter for
  body copy. No monospace, no terminal styling.
- **Signature elements:**
  - A subtle animated neural-mesh (nodes + connecting lines) behind the hero,
    representing AI/ML.
  - Circular progress rings for your top 5 skills — a real chart, not a
    decoration — reinforcing the data-analytics identity.
  - Clean card-based layout throughout (About, Skills, Experience, Projects,
    Education) instead of "log" or "console" framing.
- Resume download button in the nav bar, next to the profile photo, and in
  the footer.

## Files
```
portfolio_web/
├── index.html
├── styles.css
├── script.js
├── data.json        # ← the ONLY file you edit to update content
└── assets/
    ├── profile.jpg
    ├── intro.mp4
    └── resume.pdf   # powers the "Download Resume" buttons
```

## Updating your content
Edit `data.json` — skills, projects, experience, education, links, resume
path. Save and refresh. `index.html`, `styles.css`, and `script.js` don't
need to change for content updates.

To update your resume file: replace `assets/resume.pdf` with your latest
PDF, keeping the same filename — the download buttons already point to it.

## Making it self-updating from GitHub (optional)
1. Push `data.json` to a public GitHub repo.
2. Copy its **raw** URL.
3. In `script.js`, set:
   ```js
   const REMOTE_DATA_URL = "https://raw.githubusercontent.com/USER/REPO/main/data.json";
   ```
4. The live site will now re-fetch from GitHub on every visit. If that
   fetch fails, it falls back to the local `data.json`, then to a hardcoded
   snapshot as a last resort.

## Test locally before deploying
Browsers block `fetch()` on files opened directly via `file://`.
```bash
cd portfolio_web
python -m http.server 8000
```
(This is just a static file server — no app logic runs in Python.)
Open `http://localhost:8000` and check:
- Neural-mesh background renders behind the hero
- Skill rings animate in on scroll
- Resume button in the nav and footer downloads the PDF
- LinkedIn / GitHub / Mail icons in the nav and next to the photo work
- Skill tabs switch, bars animate
- Project cards, timeline entries render correctly
- Resize to mobile width — layout adapts cleanly

## Deploy (pick one, all free)
- **GitHub Pages:** push this folder to a repo → Settings → Pages → deploy
  from `main` branch, root folder.
- **Netlify:** drag-and-drop the `portfolio_web` folder onto
  [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel:** `vercel deploy` from inside the folder.

## Tool stack
| Layer | Choice | Why |
|---|---|---|
| Structure | Semantic HTML5 | No framework overhead for a mostly-static page |
| Styling | Plain CSS3, custom properties | Full control over the visual identity, zero build step |
| Interactivity | Vanilla JavaScript | Tabs, animated rings/bars, scroll reveals — no framework needed |
| Content | `data.json` | Human-editable, git-versioned, decoupled from layout code |
| Fonts | Sora + Inter (Google Fonts) | Geometric display type for a modern tech identity, humanist sans for readability |
| Hosting | GitHub Pages / Netlify / Vercel | Free static hosting |
