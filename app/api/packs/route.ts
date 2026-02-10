import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const packs = await prisma.pack.findMany({ where: { visibility: 'PUBLIC' }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(packs);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const pack = await prisma.pack.create({ data: { slug: body.slug, name: body.name, description: body.description, visibility: body.visibility ?? 'PRIVATE', regionIds: body.regionIds ?? ['world'], ownerId: user.id } });
  return NextResponse.json(pack);
}
