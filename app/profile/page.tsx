export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return <p>未登录。游客成绩保存在 localStorage，可稍后认领。</p>;
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { gameRuns: true } });
  const totalGames = user?.gameRuns.length ?? 0;
  const avg = totalGames ? Math.round(user!.gameRuns.reduce((s, r) => s + r.totalScore, 0) / totalGames) : 0;
  return <div className="space-y-2"><h2 className="text-2xl font-semibold">个人统计</h2><p>总局数: {totalGames}</p><p>平均分: {avg}</p></div>;
}
