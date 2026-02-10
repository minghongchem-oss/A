import { useMemo, useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart,
  PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer,
  Scatter, ScatterChart, Tooltip, XAxis, YAxis,
} from 'recharts';
import { LoadingBlock } from '../components/LoadingBlock';
import { framingTerms, omissionRadar, reliabilityScatter, topics } from '../data/mockData';
import { type OutletConfig } from '../lib/appConfig';
import { type NewsArticle, useNewsVolume } from '../hooks/useNewsVolume';

type Props = {
  config: { outlets: OutletConfig[] };
  onPromptPremium: () => void;
};

const pieData = omissionRadar.map((item) => ({ name: item.topic, value: Math.abs(item.Left - item.Right) }));

export const DashboardPage = ({ config, onPromptPremium }: Props) => {
  const selectedTopic = topics[0];
  const volume = useNewsVolume(selectedTopic, config.outlets);
  const [selectedSide, setSelectedSide] = useState<'Left' | 'Center' | 'Right' | null>(null);

  const sideArticles = useMemo(
    () => (selectedSide ? volume.articles.filter((a) => a.side === selectedSide).slice(0, 12) : []),
    [selectedSide, volume.articles]
  );

  const openSourceList = (side: 'Left' | 'Center' | 'Right') => setSelectedSide(side);

  return (
    <section className="space-y-4">
      {!!volume.error && (
        <details className="rounded-xl border border-amber-500/70 bg-amber-500/15 p-3 text-sm text-amber-100">
          <summary>Live fetch failed. Using mock data. See details.</summary>
          <p className="mt-2">{volume.error}</p>
        </details>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-cyan-100">
        <div>
          <p className="font-medium">Topic focus: {selectedTopic}</p>
          <p className="mt-1 text-cyan-50/90">Data source: <strong>{volume.source.toUpperCase()}</strong>{volume.reason ? ` · ${volume.reason}` : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void volume.refresh()} className="rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400">Refresh data</button>
          <button onClick={onPromptPremium} className="rounded-lg border border-amber-500 px-3 py-2 text-xs font-semibold text-amber-200">Save dashboard (Premium)</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="chart-card">
          <h2 className="text-sm font-semibold">Coverage volume timeline</h2>
          {volume.loading ? <LoadingBlock rows={6} /> : (
            <div className="mt-3 h-64 w-full">
              <ResponsiveContainer>
                <LineChart data={volume.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#cbd5e1" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#cbd5e1" />
                  <Tooltip />
                  <Legend onClick={(evt) => { if (evt.dataKey) openSourceList(evt.dataKey as 'Left' | 'Center' | 'Right'); }} />
                  <Line type="monotone" dataKey="Left" stroke="#22d3ee" strokeWidth={2} activeDot={{ onClick: () => openSourceList('Left') }} />
                  <Line type="monotone" dataKey="Center" stroke="#cbd5e1" strokeWidth={2} activeDot={{ onClick: () => openSourceList('Center') }} />
                  <Line type="monotone" dataKey="Right" stroke="#f97316" strokeWidth={2} activeDot={{ onClick: () => openSourceList('Right') }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="method-note">Sources: Netlify proxy → NewsAPI/RSS2JSON/GNews fallback chain. Data date: {volume.fetchedAt.slice(0, 19)}.</p>
        </article>

        <article className="chart-card"><h2 className="text-sm font-semibold">Framing term intensity (proxy heatmap)</h2><div className="mt-3 h-64 w-full"><ResponsiveContainer><BarChart data={framingTerms}><CartesianGrid strokeDasharray="3 3" stroke="#334155" /><XAxis dataKey="term" stroke="#cbd5e1" tick={{ fontSize: 11 }} /><YAxis stroke="#cbd5e1" /><Tooltip /><Legend /><Bar dataKey="Left" fill="#22d3ee" /><Bar dataKey="Center" fill="#94a3b8" /><Bar dataKey="Right" fill="#f97316" /></BarChart></ResponsiveContainer></div><p className="method-note">Method: loaded-term frequency in sampled headlines/ledes per outlet cohort.</p></article>
        <article className="chart-card"><h2 className="text-sm font-semibold">Omission radar + asymmetry pie</h2><div className="mt-3 grid gap-2 sm:grid-cols-2"><div className="h-60"><ResponsiveContainer><RadarChart data={omissionRadar}><PolarGrid /><PolarAngleAxis dataKey="topic" tick={{ fontSize: 10 }} /><Radar name="Left" dataKey="Left" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} /><Radar name="Right" dataKey="Right" stroke="#f97316" fill="#f97316" fillOpacity={0.25} /><Legend /></RadarChart></ResponsiveContainer></div><div className="h-60"><ResponsiveContainer><PieChart><Pie data={pieData} dataKey="value" nameKey="name" outerRadius={85} fill="#14b8a6" label /><Tooltip /></PieChart></ResponsiveContainer></div></div><p className="method-note">Omission score = |left coverage - right coverage| in same 7-day window.</p></article>
        <article className="chart-card"><h2 className="text-sm font-semibold">Engagement vs reliability scatter</h2><div className="mt-3 h-64 w-full"><ResponsiveContainer><ScatterChart><CartesianGrid stroke="#334155" /><XAxis type="number" dataKey="reliability" unit="%" stroke="#cbd5e1" /><YAxis type="number" dataKey="engagement" unit="pts" stroke="#cbd5e1" /><Tooltip cursor={{ strokeDasharray: '3 3' }} /><Scatter name="Stories" data={reliabilityScatter} fill="#38bdf8" /></ScatterChart></ResponsiveContainer></div><p className="method-note">Reliability: MBFC/AllSides-style proxy. Engagement: social mention/index proxy.</p></article>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-3 text-xs text-slate-300">Methodology + source links: <a className="text-cyan-300 underline" href="https://newsapi.org" target="_blank" rel="noreferrer">NewsAPI</a>, <a className="text-cyan-300 underline" href="https://www.allsides.com/media-bias" target="_blank" rel="noreferrer">AllSides</a>, <a className="text-cyan-300 underline" href="https://mediabiasfactcheck.com" target="_blank" rel="noreferrer">Media Bias/Fact Check</a>. Ownership references: <a className="text-cyan-300 underline" href="https://www.axios.com/2024/11/01/media-ownership-map" target="_blank" rel="noreferrer">Media ownership map</a>, <a className="text-cyan-300 underline" href="https://www.fcc.gov/media/ownership" target="_blank" rel="noreferrer">FCC ownership resources</a>.</div>

      {selectedSide && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedSide(null)}>
          <div className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-xl border border-slate-700 bg-slate-950 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-semibold">{selectedSide} source articles</h3><button className="rounded border border-slate-600 px-2 py-1 text-xs" onClick={() => setSelectedSide(null)}>Close</button></div>
            {(sideArticles.length ? sideArticles : [] as NewsArticle[]).map((article) => <a key={article.url} href={article.url} target="_blank" rel="noreferrer" className="mb-2 block rounded border border-slate-700 p-2 text-sm hover:border-cyan-500"><p>{article.title}</p><p className="text-xs text-slate-400">{article.source} · {article.date}</p></a>)}
            {!sideArticles.length && <p className="text-xs text-slate-300">No live article URLs available in fallback mode.</p>}
          </div>
        </div>
      )}
    </section>
  );
};
