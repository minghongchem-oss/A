# Unspun Politics (BiasLens / RawSignal) MVP

Transparency-first political media analysis tooling. The app intentionally **does not generate forced neutral summaries** and does not editorialize. It exposes mechanics (coverage volume, framing, omission, virality gaps, claim flags) and links sources so users can judge.

## Confirmed Working Status
- ✅ Frontend dev server (`npm run dev`) starts on port `5173`.
- ✅ Backend dev server (`npm run dev:server`) starts on port `8787`.
- ✅ Combined mode (`npm run dev:full`) runs both concurrently.
- ✅ Production build completes (`npm run build`).

## New in this phase
- Vercel deploy-ready config (`vercel.json`) + serverless API routes in `/api`.
- User Settings modal:
  - Fact-checker checkbox controls (PolitiFact / Snopes / FactCheck.org)
  - Draggable outlet manager (Left / Center / Right) persisted to localStorage
- Premium placeholders:
  - Heavy annotation usage upsell banner
  - Dashboard “Save dashboard (Premium)” button
  - Premium modal (“coming soon”, no payments)
- Exposure enhancements:
  - Dashboard ownership footnote links
  - Hidden Radar X proxy engagement field (public endpoint fallback)

## Run locally

```bash
npm install
npm run dev:full
```

Open:
- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:8787/health`

## API Keys (.env)
Copy `.env.example` to `.env` and fill keys:

```bash
VITE_NEWSAPI_KEY=
VITE_GNEWS_KEY=
VITE_RSS2JSON_KEY=
```

If a key is missing, UI shows a yellow warning:
> API key missing — using mock data. Add key to .env to enable live data.

## Deploy to Vercel
1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel, click **Add New Project** and import repo.
3. Framework preset: **Vite** (auto-detected).
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables in Vercel Project Settings:
   - `VITE_NEWSAPI_KEY`
   - `VITE_GNEWS_KEY`
   - `VITE_RSS2JSON_KEY`
7. Deploy.

### One-click deploy button (replace YOUR_REPO_URL)
`https://vercel.com/new/clone?repository-url=YOUR_REPO_URL`

## Screenshot Proof (captured during validation)
- Dashboard: `artifacts/dashboard-new.png`
- Settings modal: `artifacts/settings-modal.png`
- Premium modal: `artifacts/premium-modal.png`
- Mobile dark mode (iPhone 14): `artifacts/mobile-dark.png`

## Feedback
Open an issue with:
- which outlet assignments feel off,
- which fact-checkers to add/remove,
- and which radar cards need better source links.

## Next Improvements (within same philosophy)
- User-configurable source lists and transparent bias mapping editor export/import
- Saved watchlists and virality alerts (premium-gated later)
- Optional premium gating with actual billing integration (future)
