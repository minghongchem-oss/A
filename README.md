# Unspun Politics (BiasLens / RawSignal) MVP

Transparency-first political media analysis tooling. The app intentionally **does not generate forced neutral summaries** and does not editorialize. It exposes mechanics (coverage volume, framing, omission, virality gaps, claim flags) and links sources so users can judge.

## Confirmed Working Status
- ✅ Frontend dev server (`npm run dev`) starts on port `5173`.
- ✅ Backend dev server (`npm run dev:server`) starts on port `8787`.
- ✅ Combined mode (`npm run dev:full`) runs both concurrently.
- ✅ Production build completes (`npm run build`).

## Stack
- React + Vite + TypeScript
- Tailwind CSS
- Recharts
- Express (lightweight methodology + health endpoint)
- Mock-first data with optional live APIs

## MVP Features

### 1) Bias Dashboard
- Coverage volume timeline (Left / Center / Right)
- Framing term intensity chart
- Omission radar + asymmetry pie
- Engagement vs reliability scatter
- Clickable timeline legend to open source article links
- Refresh button + loading/error states

### 2) Article Annotator
- URL/text paste flow
- Embedded URL iframe viewer (or highlighted sample text fallback)
- Claim flags with multi-checker labels
- Alternative headlines + ownership snippets
- Live fact-check lookup panel (GNews proxy)
- “Compare coverage” mini-panel

### 3) Hidden News Radar
- Red warning banner + report-inaccurate placeholder link
- Virality-gap sorted feed cards (10+ seeded cards)
- Virality gap visual bar + credibility badge + fact-check links
- Refresh support + loading/error states

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

## Screenshot Proof (captured during validation)
- Dashboard: `artifacts/dashboard-full.png`
- Annotator: `artifacts/annotator-full.png`
- Hidden Radar: `artifacts/radar-full.png`
- Mobile (iPhone 14): `artifacts/mobile-iphone14.png`

## Next Improvements (within same philosophy)
- User-configurable source lists and transparent bias mapping editor
- Save/export watchlists and virality spikes
- Optional premium gating placeholder for advanced exports
