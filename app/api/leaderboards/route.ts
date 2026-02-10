import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const mode = new URL(request.url).searchParams.get('mode') ?? 'CLASSIC';
  const runs = await prisma.gameRun.findMany({ where: { mode: mode as any }, include: { user: true }, orderBy: { totalScore: 'desc' }, take: 50 });
  return NextResponse.json(runs.map((run) => ({ user: run.user?.name ?? 'Guest', totalScore: run.totalScore, totalDistance: Number(run.totalDistance.toFixed(1)) })));
}
