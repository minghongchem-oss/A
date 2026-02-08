import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { coverageTimeline, framingTerms, omissionRadar, reliabilityScatter, topics } from '../data/mockData';
import { useNewsVolume } from '../hooks/useNewsVolume';
import { LoadingBlock } from '../components/LoadingBlock';

const pieData = omissionRadar.map((item) => ({ name: item.topic, value: Math.abs(item.Left - item.Right) }));

export const DashboardPage = () => {
  const selectedTopic = topics[0];
  const volume = useNewsVolume(selectedTopic);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-cyan-100">
        <p className="font-medium">Topic focus: {selectedTopic}</p>
        <p className="mt-1 text-cyan-50/90">Hardcoded + live overlay from NewsAPI. Click charts for story-level drill-down in next iteration.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="chart-card">
          <h2 className="text-sm font-semibold">Coverage volume timeline</h2>
          {volume.loading ? (
            <LoadingBlock rows={6} />
          ) : (
            <div className="mt-3 h-64 w-full">
              <ResponsiveContainer>
                <LineChart data={volume.data.length ? volume.data : coverageTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#cbd5e1" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#cbd5e1" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Left" stroke="#22d3ee" strokeWidth={2} />
                  <Line type="monotone" dataKey="Center" stroke="#cbd5e1" strokeWidth={2} />
                  <Line type="monotone" dataKey="Right" stroke="#f97316" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="method-note">Sources: NewsAPI + curated bias buckets (AllSides-style mapping). Data date: {volume.fetchedAt.slice(0, 10)}.</p>
          {volume.error && <p className="mt-2 text-xs text-amber-300">{volume.error}</p>}
        </article>

        <article className="chart-card">
          <h2 className="text-sm font-semibold">Framing term intensity (proxy heatmap)</h2>
          <div className="mt-3 h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={framingTerms}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="term" stroke="#cbd5e1" tick={{ fontSize: 11 }} />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Left" fill="#22d3ee" />
                <Bar dataKey="Center" fill="#94a3b8" />
                <Bar dataKey="Right" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="method-note">Method: term frequencies from sampled headline+lede text windows for left/center/right source cohorts.</p>
        </article>

        <article className="chart-card">
          <h2 className="text-sm font-semibold">Omission radar + asymmetry pie</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="h-60">
              <ResponsiveContainer>
                <RadarChart data={omissionRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="topic" tick={{ fontSize: 10 }} />
                  <Radar name="Left" dataKey="Left" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
                  <Radar name="Right" dataKey="Right" stroke="#f97316" fill="#f97316" fillOpacity={0.25} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-60">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={85} fill="#14b8a6" label />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="method-note">Omission score = absolute difference between left/right coverage counts for subtopics in same 7-day window.</p>
        </article>

        <article className="chart-card">
          <h2 className="text-sm font-semibold">Engagement vs reliability scatter</h2>
          <div className="mt-3 h-64 w-full">
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid stroke="#334155" />
                <XAxis type="number" dataKey="reliability" name="Reliability" unit="%" stroke="#cbd5e1" />
                <YAxis type="number" dataKey="engagement" name="Engagement" unit="pts" stroke="#cbd5e1" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Stories" data={reliabilityScatter} fill="#38bdf8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="method-note">Reliability proxy: MBFC/AllSides style scoring; engagement proxy from social mentions and comments.</p>
        </article>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-3 text-xs text-slate-300">
        Methodology + source links: <a className="text-cyan-300 underline" href="https://newsapi.org" target="_blank" rel="noreferrer">NewsAPI</a>,{' '}
        <a className="text-cyan-300 underline" href="https://www.allsides.com/media-bias" target="_blank" rel="noreferrer">AllSides Bias Ratings</a>,{' '}
        <a className="text-cyan-300 underline" href="https://mediabiasfactcheck.com" target="_blank" rel="noreferrer">Media Bias/Fact Check</a>.
      </div>
    </section>
  );
};
