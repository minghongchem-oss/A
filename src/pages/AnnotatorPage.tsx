import { useMemo, useState } from 'react';
import { LoadingBlock } from '../components/LoadingBlock';
import { sampleAnnotations, sampleArticleText } from '../data/mockData';
import { useFactCheckLookup } from '../hooks/useFactCheckLookup';

const outlets = [
  { name: 'CNN', headline: 'Election process faces renewed legal fights', bias: 'Left', ownership: 'Warner Bros. Discovery' },
  { name: 'Fox News', headline: 'Election trust collapses amid unanswered questions', bias: 'Right', ownership: 'Fox Corporation' },
  { name: 'Reuters', headline: 'Officials debate election safeguards as disputes continue', bias: 'Center', ownership: 'Thomson Reuters' },
];

const markAnnotatedText = (text: string) => {
  let content = text;
  sampleAnnotations.forEach((annotation) => {
    content = content.replace(
      annotation.quote,
      `<mark class="rounded bg-amber-500/30 px-1 text-amber-100" title="${annotation.label}">${annotation.quote}</mark>`
    );
  });
  return content;
};

export const AnnotatorPage = () => {
  const [input, setInput] = useState('https://example.com/politics-article');
  const [submitted, setSubmitted] = useState('election integrity claims');
  const factCheck = useFactCheckLookup(submitted);

  const renderedText = useMemo(() => markAnnotatedText(sampleArticleText), []);

  return (
    <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
      <article className="chart-card">
        <h2 className="text-sm font-semibold">Article Annotator</h2>
        <p className="mt-1 text-xs text-slate-300">Paste URL or text. MVP currently renders a sample article with mock inline flags + optional live fact-check search.</p>

        <form
          className="mt-3 space-y-2"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(input);
          }}
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-h-20 w-full rounded-xl border border-slate-700 bg-slate-950/70 p-2 text-sm"
            placeholder="Paste article URL or text"
          />
          <button className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400">Analyze (MVP)</button>
        </form>

        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-3">
          <p className="mb-2 text-xs uppercase tracking-wider text-slate-400">Embedded viewer (sample text)</p>
          <p className="text-sm leading-7 text-slate-100" dangerouslySetInnerHTML={{ __html: renderedText }} />
        </div>

        <p className="method-note">Annotation method: regex + hardcoded claim spans. Future: sentence segmentation + multi-checker entity matching.</p>
      </article>

      <aside className="space-y-4">
        <article className="chart-card">
          <h3 className="text-sm font-semibold">Claim flags</h3>
          <ul className="mt-3 space-y-2 text-xs text-slate-200">
            {sampleAnnotations.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-700 bg-slate-950/60 p-2">
                <p className="font-medium text-amber-300">{item.label}</p>
                <p className="mt-1">"{item.quote}"</p>
                <div className="mt-2 space-y-1 text-slate-300">
                  {item.factChecks.map((fc) => (
                    <p key={fc}>• {fc}</p>
                  ))}
                </div>
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
          {factCheck.loading ? (
            <LoadingBlock rows={3} />
          ) : (
            <div className="mt-2 space-y-2 text-xs">
              {factCheck.data.length > 0 ? (
                factCheck.data.map((item) => (
                  <a key={item.url} href={item.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-slate-700 p-2 hover:border-cyan-500">
                    <p className="font-medium">{item.claim}</p>
                    <p className="text-slate-400">{item.claimant} · {item.reviewDate} · {item.textualRating}</p>
                  </a>
                ))
              ) : (
                <p className="text-slate-300">No live data yet. Enter API key to enable.</p>
              )}
            </div>
          )}
          {factCheck.error && <p className="mt-2 text-xs text-amber-300">{factCheck.error}</p>}
          <p className="method-note">Sources: GNews search index + manual checker links (PolitiFact/Snopes/FactCheck.org).</p>
        </article>
      </aside>
    </section>
  );
};
