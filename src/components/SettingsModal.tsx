import { useEffect, useState } from 'react';
import { type AppConfig, type OutletConfig, type OutletSide } from '../lib/appConfig';

type Props = {
  open: boolean;
  onClose: () => void;
  config: AppConfig;
  onSave: (next: AppConfig) => void;
};

const sides: OutletSide[] = ['Left', 'Center', 'Right'];

export const SettingsModal = ({ open, onClose, config, onSave }: Props) => {
  const [draft, setDraft] = useState<AppConfig>(config);

  useEffect(() => {
    setDraft(config);
  }, [config, open]);

  if (!open) return null;

  const onDrop = (outletName: string, nextSide: OutletSide) => {
    setDraft((prev) => ({
      ...prev,
      outlets: prev.outlets.map((o) => (o.name === outletName ? { ...o, side: nextSide } : o)),
    }));
  };

  const grouped = (side: OutletSide): OutletConfig[] => draft.outlets.filter((o) => o.side === side);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl border border-slate-700 bg-slate-950 p-4" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lens Settings</h2>
          <button className="rounded border border-slate-600 px-2 py-1 text-xs" onClick={onClose}>Close</button>
        </div>

        <section className="mb-4 rounded-xl border border-slate-700 bg-slate-900/50 p-3">
          <h3 className="text-sm font-semibold">Active Fact-checkers</h3>
          <p className="text-xs text-slate-400">Controls which checker labels appear in Annotator/Radar references.</p>
          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            {Object.entries(draft.factCheckers).map(([name, enabled]) => (
              <label key={name} className="inline-flex items-center gap-2 rounded border border-slate-700 px-2 py-1">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setDraft((prev) => ({ ...prev, factCheckers: { ...prev.factCheckers, [name]: e.target.checked } }))}
                />
                {name}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-3">
          <h3 className="text-sm font-semibold">Outlet manager (drag between columns)</h3>
          <p className="text-xs text-slate-400">These assignments are used in Dashboard bias cohort grouping. Persisted in localStorage.</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {sides.map((side) => (
              <div
                key={side}
                className="min-h-40 rounded-lg border border-slate-700 p-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const outletName = e.dataTransfer.getData('text/plain');
                  if (outletName) onDrop(outletName, side);
                }}
              >
                <h4 className="mb-2 text-sm font-semibold">{side}</h4>
                <div className="space-y-2">
                  {grouped(side).map((outlet) => (
                    <div
                      key={outlet.name}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', outlet.name)}
                      className="cursor-grab rounded border border-slate-700 bg-slate-950/70 px-2 py-1 text-sm"
                    >
                      {outlet.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded border border-slate-600 px-3 py-1.5 text-sm" onClick={onClose}>Cancel</button>
          <button className="rounded bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-slate-950" onClick={() => { onSave(draft); onClose(); }}>Apply live</button>
        </div>
      </div>
    </div>
  );
};
