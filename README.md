# Unspun Politics (BiasLens / RawSignal) MVP

A transparency-first political media analysis tool. This MVP intentionally avoids forced neutral summaries and editorial voice. It provides raw comparative tooling so users can inspect coverage amplification, omission, framing, and credibility signals themselves.

## Stack
- React + Vite + TypeScript
- Tailwind CSS (shadcn-style utility primitives)
- Recharts for charting
- Public API integrations (NewsAPI, GNews, RSS2JSON) with mock-first fallbacks

## Implemented MVP Features

### 1) Bias Dashboard
- Coverage volume timeline (Left / Center / Right buckets)
- Framing term intensity chart
- Omission radar + asymmetry pie
- Engagement vs reliability scatter
- Methodology and source links on-page

### 2) Article Annotator
- URL/text input box
- Mock inline annotation rendering (contested claims + loaded framing)
- Sidebar with alternative headlines and ownership snippets
- Fact-check panel with live GNews-powered lookup fallback

### 3) Hidden News Radar
- Virality-gap sorted feed cards
- Heavy warning disclaimer banner
- Credibility badges + fact-check placeholders
- Mock feed + optional Reuters RSS bridge via RSS2JSON API

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Environment Variables
Copy `.env.example` to `.env` and add keys as available:

```bash
VITE_NEWS_API_KEY=
VITE_GNEWS_API_KEY=
VITE_RSS2JSON_API_KEY=
```

Without keys, the app still runs fully with curated mock data and explanatory warnings.

## Radical Transparency Rules in this MVP
- Every major section includes source or methodology notes.
- No auto-generated “balanced” rewrite summaries.
- Data timestamps and upstream source links are visible.

## Future Roadmap
- Expand bias-source mapping with a versioned public methodology file.
- Topic drill-down interactions and historical compare mode.
- Improved claim extraction + sentence-level annotation engine.
- Supabase auth and saved personal watchlists.
- Alerting for sharp virality-gap spikes.
