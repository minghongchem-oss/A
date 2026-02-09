import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Footer } from './components/Footer';
import { Navbar, type AppTab } from './components/Navbar';
import { PremiumModal } from './components/PremiumModal';
import { SettingsModal } from './components/SettingsModal';
import { useLiveStatus } from './hooks/useLiveStatus';
import { defaultConfig, configStorageKey, type AppConfig } from './lib/appConfig';
import { AnnotatorPage } from './pages/AnnotatorPage';
import { DashboardPage } from './pages/DashboardPage';
import { RadarPage } from './pages/RadarPage';

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [showSplash, setShowSplash] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const liveStatus = useLiveStatus();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const stored = localStorage.getItem(configStorageKey);
    if (stored) {
      try {
        setConfig(JSON.parse(stored) as AppConfig);
      } catch {
        setConfig(defaultConfig);
      }
    }
  }, []);

  const applyConfig = (next: AppConfig) => {
    setConfig(next);
    localStorage.setItem(configStorageKey, JSON.stringify(next));
  };

  const tabMap: Record<AppTab, ReactNode> = useMemo(() => ({
    dashboard: <DashboardPage config={config} onPromptPremium={() => setPremiumOpen(true)} />,
    annotator: <AnnotatorPage config={config} onPromptPremium={() => setPremiumOpen(true)} />,
    radar: <RadarPage config={config} />,
  }), [config]);

  return (
    <div className="min-h-screen">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((v) => !v)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <main className="mx-auto max-w-6xl px-4 py-5">
        <div className={`mb-4 rounded-xl border p-3 text-xs ${liveStatus.status.live ? 'border-emerald-500/70 bg-emerald-500/10 text-emerald-100' : 'border-amber-500/70 bg-amber-500/10 text-amber-100'}`}>
          <div className="flex items-center justify-between gap-2">
            <p>
              {liveStatus.status.live ? 'Live data mode active.' : 'Mock data mode active.'} {liveStatus.status.message}
              {' '}Providers: newsapi={String(liveStatus.status.providers.newsapi)}, gnews={String(liveStatus.status.providers.gnews)}, rss2json={String(liveStatus.status.providers.rss2json)}.
            </p>
            <button className="rounded border border-slate-600 px-2 py-1" onClick={() => void liveStatus.refresh()}>Refresh status</button>
          </div>
          {(liveStatus.error || liveStatus.loading) && <p className="mt-1">{liveStatus.loading ? 'Checking live status...' : `Status check failed: ${liveStatus.error}`}</p>}
        </div>

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
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} config={config} onSave={applyConfig} />
      <PremiumModal open={premiumOpen} onClose={() => setPremiumOpen(false)} />
    </div>
  );
}

export default App;
