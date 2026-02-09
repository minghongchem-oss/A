import { useMemo, useState } from 'react';
import { LoadingBlock } from '../components/LoadingBlock';
import { sampleAnnotations, sampleArticleText } from '../data/mockData';
import { useFactCheckLookup } from '../hooks/useFactCheckLookup';

type Props = {
  config: { factCheckers: Record<string, boolean> };
  onPromptPremium: () => void;
};

const outlets = [
  { name: 'CNN', headline: 'Certification timeline faces fresh legal scrutiny', bias: 'Left', ownership: 'Warner Bros. Discovery' },
  { name: 'Fox News', headline: 'Election confidence erodes amid unresolved process questions', bias: 'Right', ownership: 'Fox Corporation' },
  { name: 'Reuters', headline: 'State officials debate election controls as disputes continue', bias: 'Center', ownership: 'Thomson Reuters' },
];

const markAnnotatedText = (text: string) => {
  let content = text;
  sampleAnnotations.forEach((annotation) => {
    content = content.replace(annotation.quote, `<mark class="rounded bg-amber-500/30 px-1 text-amber-100" title="${annotation.label}">${annotation.quote}</mark>`);
  });
  return content;
};

export const AnnotatorPage = ({ config, onPromptPremium }: Props) => {
  const [input, setInput] = useState('https://www.reuters.com/world/us/');
  const [submitted, setSubmitted] = useState('election process claims');
  const [showCompare, setShowCompare] = useState(false);
  const [analyzeCount, setAnalyzeCount] = useState(0);
  const factCheck = useFactCheckLookup(submitted);
  const renderedText = useMemo(() => markAnnotatedText(sampleArticleText), []);
  const isUrl = input.startsWith('http://') || input.startsWith('https://');
  const enabledCheckers = Object.entries(config.factCheckers).filter(([, enabled]) => enabled).map(([name]) => name);

  return (
    <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
      <article className="chart-card">
        {factCheck.error?.includes('API key missing') && <div className="mb-3 rounded-lg border border-amber-500/70 bg-amber-500/15 p-2 text-xs text-amber-100">{factCheck.error}</div>}
        <h2 className="text-sm font-semibold">Article Annotator</h2>
        <p className="mt-1 text-xs text-slate-300">Paste URL or text. This page highlights contested framing and surfaces external fact-check references.</p>

        <form className="mt-3 space-y-2" onSubmit={(event) => { event.preventDefault(); setSubmitted(input); setAnalyzeCount((v) => v + 1); }}>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-20 w-full rounded-xl border border-slate-700 bg-slate-950/70 p-2 text-sm" placeholder="Paste article URL or text" />
          <div className="flex gap-2">
            <button className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400">Analyze (MVP)</button>
            <button type="button" onClick={() => setShowCompare((v) => !v)} className="rounded-lg border border-slate-600 px-3 py-2 text-sm">Compare coverage</button>
          </div>
        </form>

        {analyzeCount > 5 && (
          <div className="mt-3 flex items-center justify-between rounded-lg border border-fuchsia-500/70 bg-fuchsia-500/10 p-2 text-xs text-fuchsia-100">
            <span>Heavy usage detected. Unlimited annotations are in Premium.</span>
            <button className="rounded bg-fuchsia-400 px-2 py-1 font-semibold text-slate-950" onClick={onPromptPremium}>Upgrade to Premium</button>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-3">
          <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">Embedded viewer</p>
          {isUrl ? <iframe title="article preview" src={input} className="h-72 w-full rounded border border-slate-700" /> : <p className="text-sm leading-7 text-slate-100" dangerouslySetInnerHTML={{ __html: renderedText }} />}
        </div>

        {showCompare && (
          <div className="mt-3 grid gap-2 rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-xs sm:grid-cols-3">
            <div className="rounded border border-slate-700 p-2"><p className="text-slate-400">Left coverage</p><p className="text-lg font-bold text-cyan-300">62</p></div>
            <div className="rounded border border-slate-700 p-2"><p className="text-slate-400">Center coverage</p><p className="text-lg font-bold text-slate-200">39</p></div>
            <div className="rounded border border-slate-700 p-2"><p className="text-slate-400">Right coverage</p><p className="text-lg font-bold text-orange-300">74</p></div>
          </div>
        )}

        <p className="method-note">Method: regex + mock claim spans + selected fact-checker labels. Users must verify via source links.</p>
      </article>

      <aside className="space-y-4">
        <article className="chart-card">
          <h3 className="text-sm font-semibold">Claim flags</h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-200">
            {sampleAnnotations.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-700 bg-slate-950/60 p-2">
                <p className="font-medium text-amber-300">{item.label}</p>
                <p className="mt-1">"{item.quote}"</p>
                <div className="mt-2 space-y-1 text-slate-300">{item.factChecks.filter((fc) => enabledCheckers.some((name) => fc.includes(name))).map((fc) => <p key={fc}>• {fc}</p>)}</div>
              </li>
            ))}
          </ul>
        </article>

        <article className="chart-card">
          <h3 className="text-sm font-semibold">Alternative headlines + why this spin?</h3>
          <div className="mt-3 space-y-2 text-xs">
            {outlets.map((outlet) => (
              <div key={outlet.name} className="rounded-lg border border-slate-700 bg-slate-950/60 p-2">
                <p className="font-medium">{outlet.name} ({outlet.bias})</p>
                <p className="mt-1">{outlet.headline}</p>
                <p className="mt-1 text-slate-400">Ownership: {outlet.ownership}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="chart-card">
          <h3 className="text-sm font-semibold">Live fact-check lookup (GNews proxy)</h3>
          {factCheck.loading ? <LoadingBlock rows={3} /> : (
            <div className="mt-2 space-y-2 text-xs">
              {factCheck.data.length > 0 ? factCheck.data.map((item) => (
                <a key={item.url} href={item.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-slate-700 p-2 hover:border-cyan-500">
                  <p className="font-medium">{item.claim}</p>
                  <p className="text-slate-400">{item.claimant} · {item.reviewDate} · {item.textualRating}</p>
                </a>
              )) : <p className="text-slate-300">No live data yet. Add API key for live claim lookups.</p>}
            </div>
          )}
          {factCheck.error && !factCheck.error.includes('API key missing') && <p className="mt-2 text-xs text-amber-300">{factCheck.error}</p>}
          <p className="method-note">Sources: GNews index + active checkers ({enabledCheckers.join(', ') || 'none selected'}).</p>
        </article>
      </aside>
    </section>
  );
};
