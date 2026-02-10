const countries = ['CN', 'US', 'FR', 'JP', 'BR', 'DE'];

export default function StreakPage() {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">国家连胜</h2>
      <p className="text-sm text-muted-foreground">猜国家，不用精确落点。错误即结束。</p>
      <select className="rounded border p-2" aria-label="country-select">
        {countries.map((country) => (
          <option key={country}>{country}</option>
        ))}
      </select>
    </div>
  );
}
