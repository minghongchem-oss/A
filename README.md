# Unspun Politics (BiasLens / RawSignal) MVP

Transparency-first political media analysis tooling. The app intentionally **does not generate forced neutral summaries** and does not editorialize. It exposes mechanics (coverage volume, framing, omission, virality gaps, claim flags) and links sources so users can judge.

## Netlify production architecture (proxy-first)
The browser **never** calls NewsAPI / GNews / RSS2JSON directly.
All live requests go through Netlify Functions:
- `/.netlify/functions/health` (live status + providers)
- `/.netlify/functions/methodology`
- `/.netlify/functions/news`
- `/.netlify/functions/annotate`
- `/.netlify/functions/radar`


## Provider fallback policy (production-safe)
- NewsAPI is treated as optional and may fail in production with 401/403/426 on free tiers.
- Fallback chain for Dashboard/news endpoint: **NewsAPI → RSS2JSON (recommended) → GNews → Mock**.
- If fallback occurs, UI shows source + reason (example: `NewsAPI 426 → using RSS2JSON`).

## Environment variables
### Local Vite convenience (optional)
Used only if you run custom experiments in client-side code:
```bash
VITE_NEWSAPI_KEY=
VITE_GNEWS_KEY=
VITE_RSS2JSON_KEY=
```

### Netlify server-only (required for production live mode)
Set in Netlify Site settings → Environment variables:
```bash
NEWSAPI_KEY=
GNEWS_KEY=
RSS2JSON_KEY=
```

If server-only keys are missing or provider calls fail, UI now shows:
- `Live fetch failed (...). Using mock data. See details.`

## Netlify Drop deployment (no CLI / no Git required)
1. Build locally:
   ```bash
   npm install
   npm run build
   ```
2. Upload `dist/` to Netlify Drop.
3. Ensure `netlify.toml` is included in project root with:
   - `publish = "dist"`
   - `functions.directory = "netlify/functions"`
   - SPA redirect to `/index.html`
4. Add `NEWSAPI_KEY`, `GNEWS_KEY`, `RSS2JSON_KEY` in Netlify env settings.
5. Redeploy the site after adding keys.

## Test checklist
- Visit `/.netlify/functions/health` → returns `live:true` when at least one server key is set.
- Refresh Dashboard → timestamp updates and request re-runs (cache busting with `?t=...`).
- Annotator no longer shows key-missing if health says live mode is active.
- Hidden Radar loads live cards when RSS2JSON is available.

## Current UI behavior
- Single shared live/mock status banner across all pages.
- Explicit per-page fallback details (no silent mock fallback).
- Refresh buttons issue uncached server calls.

## Screenshot Proof (captured in prior validation)
- Dashboard: `artifacts/dashboard-new.png`
- Settings modal: `artifacts/settings-modal.png`
- Premium modal: `artifacts/premium-modal.png`
- Mobile dark mode (iPhone 14): `artifacts/mobile-dark.png`
