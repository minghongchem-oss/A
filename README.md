# Unspun Politics (BiasLens / RawSignal) MVP

Transparency-first political media analysis tooling. The app intentionally **does not generate forced neutral summaries** and does not editorialize. It exposes mechanics (coverage volume, framing, omission, virality gaps, claim flags) and links sources so users can judge.

## Confirmed Working Status
- ✅ Frontend build succeeds (`npm run build`).
- ✅ Netlify Functions are configured under `netlify/functions`.
- ✅ Netlify Drop compatible output (`dist`) is generated.

## Netlify-compatible serverless setup
- Functions location: `netlify/functions/`
- Health endpoint (deployed): `/.netlify/functions/health`
- Methodology endpoint (deployed): `/.netlify/functions/methodology`
- Build config: `netlify.toml`

## Run locally

```bash
npm install
npm run dev
npm run build
```

## API Keys (.env)
Copy `.env.example` to `.env` and fill keys:

```bash
VITE_NEWSAPI_KEY=
VITE_GNEWS_KEY=
VITE_RSS2JSON_KEY=
```

If a key is missing, UI shows a yellow warning:
> API key missing — using mock data. Add key to .env to enable live data.

## Deploy with Netlify Drop (no Git integration)
1. Build locally:
   ```bash
   npm install
   npm run build
   ```
2. Open Netlify Drop UI.
3. Drag and drop the generated `dist/` folder.
4. In Netlify Site settings, add environment variables if rebuilding on Netlify:
   - `VITE_NEWSAPI_KEY`
   - `VITE_GNEWS_KEY`
   - `VITE_RSS2JSON_KEY`
5. Verify function URLs:
   - `https://<your-site>.netlify.app/.netlify/functions/health`
   - `https://<your-site>.netlify.app/.netlify/functions/methodology`

## Feature highlights
- User Settings modal with fact-checker toggles and draggable outlet cohort assignments.
- Premium placeholders (no payments): usage-based upsell and “Save dashboard (Premium)” CTA.
- Exposure enhancements with source/methodology notes and mock-first fallbacks.

## Screenshot Proof (captured during validation)
- Dashboard: `artifacts/dashboard-new.png`
- Settings modal: `artifacts/settings-modal.png`
- Premium modal: `artifacts/premium-modal.png`
- Mobile dark mode (iPhone 14): `artifacts/mobile-dark.png`
