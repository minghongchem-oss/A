export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export default async function LeaderboardsPage() {
  const rows = await prisma.gameRun.findMany({ where: { mode: 'CLASSIC' }, take: 10, orderBy: { totalScore: 'desc' }, include: { user: true } });
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">排行榜</h2>
      <ol className="space-y-2">
        {rows.map((row) => (
          <li key={row.id} className="rounded border p-2 text-sm">{row.user?.name ?? 'Guest'} - {row.totalScore} 分</li>
        ))}
      </ol>
    </div>
  );
}
