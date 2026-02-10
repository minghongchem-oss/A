import { NextResponse } from 'next/server';
import { getProvider } from '@/lib/providers';
import { prisma } from '@/lib/prisma';
import { appendRound, getRun } from '@/lib/server/run-store';

export async function POST(request: Request) {
  const body = await request.json();

  if (process.env.MOCK_IMAGERY === '1') {
    const run = getRun(body.runId);
    if (!run) return NextResponse.json({ error: 'Run not found' }, { status: 404 });
    const idx = run.rounds.length;
    if (idx >= 5 && run.mode !== 'timetrial') return NextResponse.json({ done: true });
    const scene = await getProvider().getRandomScene({ seed: `${run.seed ?? run.id}-${idx}` });
    const r = appendRound(run.id, scene);
    return NextResponse.json({ round: { runId: run.id, idx: r!.idx, providerId: r!.providerId, sceneId: r!.sceneId, viewerPayload: r!.payload, attribution: r!.attribution } });
  }

  const run = await prisma.gameRun.findUnique({ where: { id: body.runId }, include: { rounds: true } });
  if (!run) return NextResponse.json({ error: 'Run not found' }, { status: 404 });
  const idx = run.rounds.length;
  if (idx >= 5 && run.mode !== 'TIMETRIAL') {
    await prisma.gameRun.update({ where: { id: run.id }, data: { endedAt: new Date() } });
    return NextResponse.json({ done: true });
  }
  const scene = await getProvider().getRandomScene({ seed: `${run.seed ?? run.id}-${idx}` });
  await prisma.roundResult.create({ data: { runId: run.id, idx, providerId: scene.providerId, sceneId: scene.sceneId, trueLat: scene.lat, trueLng: scene.lng, countryCode: scene.meta.country } });
  return NextResponse.json({ round: { runId: run.id, idx, providerId: scene.providerId, sceneId: scene.sceneId, viewerPayload: scene.clientViewerPayload, attribution: scene.attribution } });
}
