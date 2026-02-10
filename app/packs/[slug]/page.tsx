export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function PackDetail({ params }: { params: { slug: string } }) {
  const pack = await prisma.pack.findUnique({ where: { slug: params.slug } });
  if (!pack) return notFound();
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">{pack.name}</h2>
      <p>{pack.description}</p>
      <p className="text-sm text-muted-foreground">/play/classic?pack={pack.slug}</p>
    </div>
  );
}
