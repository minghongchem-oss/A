import { LoadingBlock } from '../components/LoadingBlock';
import { useRadarFeed } from '../hooks/useRadarFeed';

export const RadarPage = () => {
  const { cards, loading, error, fetchedAt } = useRadarFeed();

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border-2 border-red-500 bg-red-500/15 p-4 text-sm text-red-100">
        <p className="font-semibold">Raw signal from alternative platforms — verify yourself. Not endorsement.</p>
        <p className="mt-1 text-red-100/80">Sort order: virality gap descending (alternative engagement vs mainstream coverage hits).</p>
      </div>

      <article className="chart-card">
        <h2 className="text-sm font-semibold">Hidden News Radar feed</h2>
        <p className="mt-1 text-xs text-slate-300">Includes curated mock undercovered stories + optional Reuters RSS ingestion.</p>

        {loading ? (
          <div className="mt-4">
            <LoadingBlock rows={6} />
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <article key={card.id} className="rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-sm">
                <a className="font-medium text-cyan-200 hover:underline" href={card.sourceUrl} target="_blank" rel="noreferrer">
                  {card.headline}
                </a>
                <p className="mt-2 text-xs text-slate-400">{card.source} · {card.date}</p>
                <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded border border-slate-700 p-2">
                    <dt className="text-slate-400">Virality gap</dt>
                    <dd className="font-semibold text-red-300">{card.viralityGap}</dd>
                  </div>
                  <div className="rounded border border-slate-700 p-2">
                    <dt className="text-slate-400">Mainstream hits</dt>
                    <dd>{card.mainstreamHits}</dd>
                  </div>
                  <div className="rounded border border-slate-700 p-2">
                    <dt className="text-slate-400">Alt engagement</dt>
                    <dd>{card.altEngagement.toLocaleString()}</dd>
                  </div>
                  <div className="rounded border border-slate-700 p-2">
                    <dt className="text-slate-400">Credibility</dt>
                    <dd>{card.credibility}</dd>
                  </div>
                </dl>
                <a className="mt-2 inline-block text-xs text-cyan-300 underline" href={card.factCheck} target="_blank" rel="noreferrer">
                  Fact-check reference
                </a>
              </article>
            ))}
          </div>
        )}

        <p className="method-note">Data date: {fetchedAt.slice(0, 10)}. Virality gap = scaled(alt engagement rank - mainstream citation rank).</p>
        {error && <p className="mt-2 text-xs text-amber-300">{error}</p>}
      </article>
    </section>
  );
};
