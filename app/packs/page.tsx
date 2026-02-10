export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function PacksPage() {
  const packs = await prisma.pack.findMany({ where: { visibility: 'PUBLIC' }, take: 20, orderBy: { createdAt: 'desc' } });
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">地图包</h2>
      {packs.map((pack) => (
        <Link key={pack.id} href={`/packs/${pack.slug}`} className="block rounded border p-3 hover:bg-muted">
          <p className="font-medium">{pack.name}</p>
          <p className="text-sm text-muted-foreground">{pack.description}</p>
        </Link>
      ))}
    </div>
  );
}
