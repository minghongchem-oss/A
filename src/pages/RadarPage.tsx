import { LoadingBlock } from '../components/LoadingBlock';
import { useRadarFeed } from '../hooks/useRadarFeed';

type Props = {
  config: { factCheckers: Record<string, boolean> };
};

const checkerLinks: Record<string, string> = {
  PolitiFact: 'https://www.politifact.com/',
  Snopes: 'https://www.snopes.com/',
  'FactCheck.org': 'https://www.factcheck.org/',
};

export const RadarPage = ({ config }: Props) => {
  const { cards, loading, error, fetchedAt, refresh } = useRadarFeed();
  const enabledCheckers = Object.entries(config.factCheckers).filter(([, enabled]) => enabled).map(([name]) => name);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border-2 border-red-500 bg-red-500/20 p-4 text-sm text-red-100">
        <p className="font-bold">RAW SIGNAL WARNING: Alternative-platform virality may include misinformation — verify independently. Not endorsement.</p>
        <p className="mt-1 text-red-100/90">Sort order = virality gap descending. <a href="#" className="underline">Report inaccurate card</a></p>
      </div>

      {error?.includes('API key missing') && <div className="rounded-lg border border-amber-500/70 bg-amber-500/15 p-2 text-xs text-amber-100">{error}</div>}

      <article className="chart-card">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Hidden News Radar feed</h2>
          <button onClick={() => void refresh()} className="rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950">Refresh data</button>
        </div>
        <p className="mt-1 text-xs text-slate-300">Includes curated undercovered cards + optional RSS pull + public X follower-derived proxy.</p>

        {loading ? <div className="mt-4"><LoadingBlock rows={6} /></div> : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <article key={card.id} className="rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-sm">
                <a className="font-medium text-cyan-200 hover:underline" href={card.sourceUrl} target="_blank" rel="noreferrer">{card.headline}</a>
                <p className="mt-2 text-xs text-slate-400">{card.source} · {card.date}</p>
                <div className="mt-2 rounded-lg border border-red-500/60 bg-red-500/10 p-2">
                  <p className="text-[10px] uppercase tracking-wider text-red-200">Virality gap</p>
                  <p className="text-2xl font-bold text-red-300">{card.viralityGap}</p>
                  <div className="mt-1 h-2 rounded bg-slate-800"><div className="h-2 rounded bg-red-400" style={{ width: `${Math.min(card.viralityGap, 100)}%` }} /></div>
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded border border-slate-700 p-2"><dt className="text-slate-400">Mainstream hits</dt><dd>{card.mainstreamHits}</dd></div>
                  <div className="rounded border border-slate-700 p-2"><dt className="text-slate-400">Alt engagement</dt><dd>{card.altEngagement.toLocaleString()}</dd></div>
                  <div className="rounded border border-slate-700 p-2"><dt className="text-slate-400">X proxy</dt><dd>{card.xEngagement?.toLocaleString() ?? 'n/a'}</dd></div>
                  <div className="rounded border border-slate-700 p-2"><dt className="text-slate-400">Credibility</dt><dd>{card.credibility}</dd></div>
                </dl>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {enabledCheckers.map((checker) => (
                    <a key={checker} className="text-cyan-300 underline" href={checkerLinks[checker]} target="_blank" rel="noreferrer">{checker}</a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="method-note">Data date: {fetchedAt.slice(0, 10)}. Metric method: scaled rank difference (alternative engagement rank − mainstream citation rank). X proxy derived from public follower endpoint and used only as coarse scale reference.</p>
        {error && !error.includes('API key missing') && <p className="mt-2 text-xs text-amber-300">{error}</p>}
      </article>
    </section>
  );
};
