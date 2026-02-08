import { type ReactNode, useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { type AppTab, Navbar } from './components/Navbar';
import { AnnotatorPage } from './pages/AnnotatorPage';
import { DashboardPage } from './pages/DashboardPage';
import { RadarPage } from './pages/RadarPage';

const tabMap: Record<AppTab, ReactNode> = {
  dashboard: <DashboardPage />,
  annotator: <AnnotatorPage />,
  radar: <RadarPage />,
};

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [showSplash, setShowSplash] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} darkMode={darkMode} onToggleDarkMode={() => setDarkMode((v) => !v)} />
      <main className="mx-auto max-w-6xl px-4 py-5">
        {showSplash && (
          <section className="mb-4 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Expose the mechanics. You decide.</h2>
                <p className="text-sm text-slate-200">No forced neutral rewrites — just tools and source-linked evidence.</p>
              </div>
              <button className="rounded-lg border border-slate-600 px-2 py-1 text-xs" onClick={() => setShowSplash(false)}>Dismiss</button>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-3 text-sm">Track amplification and omission patterns.</div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-3 text-sm">Annotate claims and compare outlet framing.</div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-3 text-sm">Scan undercovered stories with virality gaps.</div>
            </div>
          </section>
        )}
        {tabMap[activeTab]}
      </main>
      <Footer />
    </div>
  );
}

export default App;
