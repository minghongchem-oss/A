import type { ReactNode } from 'react';
import { BarChart3, Moon, RadioTower, ScanSearch, Settings, Sun } from 'lucide-react';
import { cn } from '../lib/cn';

export type AppTab = 'dashboard' | 'annotator' | 'radar';

type NavbarProps = {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSettings: () => void;
};

const tabItems: Array<{ id: AppTab; label: string; icon: ReactNode }> = [
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'annotator', label: 'Annotator', icon: <ScanSearch className="h-4 w-4" /> },
  { id: 'radar', label: 'Hidden Radar', icon: <RadioTower className="h-4 w-4" /> },
];

export const Navbar = ({ activeTab, onTabChange, darkMode, onToggleDarkMode, onOpenSettings }: NavbarProps) => (
  <header className="sticky top-0 z-30 border-b border-slate-700/80 bg-slate-950/85 backdrop-blur">
    <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">Unspun Politics / RawSignal</p>
        <h1 className="text-lg font-semibold">Expose the mechanics. You decide.</h1>
      </div>
      <div className="flex items-center gap-2">
        <nav className="flex flex-wrap gap-2">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition',
                activeTab === tab.id
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                  : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-slate-500'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
        <button aria-label="open settings" onClick={onOpenSettings} className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-200">
          <Settings className="h-4 w-4" />
        </button>
        <button
          aria-label="toggle dark mode"
          onClick={onToggleDarkMode}
          className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-200"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  </header>
);
