import { GameMode } from '@prisma/client';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getProvider } from '@/lib/providers';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { startSchema } from '@/lib/server/schemas';
import { createRun } from '@/lib/server/run-store';

export async function POST(request: Request) {
  const ip = headers().get('x-forwarded-for') ?? 'local';
  if (!checkRateLimit(`start:${ip}`)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  const parsed = startSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const seed = parsed.data.mode === 'daily' ? new Date().toISOString().slice(0, 10) : undefined;
  const scene = await getProvider(parsed.data.providerId).getRandomScene({ seed });

  if (process.env.MOCK_IMAGERY === '1') {
    const run = createRun(parsed.data.mode, scene, seed);
    return NextResponse.json({ runId: run.id, round: { runId: run.id, idx: 0, providerId: scene.providerId, sceneId: scene.sceneId, viewerPayload: scene.clientViewerPayload, attribution: scene.attribution } });
  }

  const run = await prisma.gameRun.create({ data: { mode: mapMode(parsed.data.mode), seed, rounds: { create: { idx: 0, providerId: scene.providerId, sceneId: scene.sceneId, trueLat: scene.lat, trueLng: scene.lng, countryCode: scene.meta.country } } } });
  return NextResponse.json({ runId: run.id, round: { runId: run.id, idx: 0, providerId: scene.providerId, sceneId: scene.sceneId, viewerPayload: scene.clientViewerPayload, attribution: scene.attribution } });
}

function mapMode(mode: string): GameMode {
  switch (mode) {
    case 'daily': return 'DAILY';
    case 'timetrial': return 'TIMETRIAL';
    case 'streak': return 'STREAK';
    case 'battle': return 'BATTLE';
    default: return 'CLASSIC';
  }
}
