export const LoadingBlock = ({ rows = 4 }: { rows?: number }) => (
  <div className="animate-pulse space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-4 rounded bg-slate-700/60" />
    ))}
  </div>
);
