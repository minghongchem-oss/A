type Props = {
  open: boolean;
  onClose: () => void;
};

export const PremiumModal = ({ open, onClose }: Props) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-950 p-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold">Upgrade to Premium (Coming soon)</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
          <li>Unlimited annotations</li>
          <li>Ad-free interface</li>
          <li>Saved custom source configurations</li>
          <li>Advanced watchlist alerts</li>
        </ul>
        <p className="method-note">Placeholder only — no payments enabled in MVP.</p>
        <div className="mt-3 text-right">
          <button className="rounded bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-slate-950" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  );
};
