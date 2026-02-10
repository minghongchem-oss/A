import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { haversineDistanceKm, scoreFromDistance } from '@/lib/game';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { guessSchema } from '@/lib/server/schemas';
import { getRun } from '@/lib/server/run-store';

export async function POST(request: Request) {
  const ip = headers().get('x-forwarded-for') ?? 'local';
  if (!checkRateLimit(`guess:${ip}`)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  const parsed = guessSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { runId, roundIdx, guessLat, guessLng } = parsed.data;

  if (process.env.MOCK_IMAGERY === '1') {
    const run = getRun(runId);
    const round = run?.rounds[roundIdx];
    if (!round) return NextResponse.json({ error: 'Round not found' }, { status: 404 });
    const distance = haversineDistanceKm(guessLat, guessLng, round.trueLat, round.trueLng);
    const score = scoreFromDistance(distance);
    round.guessLat = guessLat; round.guessLng = guessLng; round.distanceKm = Number(distance.toFixed(1)); round.score = score;
    run!.totalScore += score; run!.totalDistance += distance;
    return NextResponse.json({ score, distanceKm: Number(distance.toFixed(1)), trueLat: round.trueLat, trueLng: round.trueLng });
  }

  const round = await prisma.roundResult.findUnique({ where: { runId_idx: { runId, idx: roundIdx } } });
  if (!round) return NextResponse.json({ error: 'Round not found' }, { status: 404 });
  const distance = haversineDistanceKm(guessLat, guessLng, round.trueLat, round.trueLng);
  const score = scoreFromDistance(distance);
  await prisma.roundResult.update({ where: { id: round.id }, data: { guessLat, guessLng, distanceKm: Number(distance.toFixed(1)), score } });
  await prisma.gameRun.update({ where: { id: runId }, data: { totalScore: { increment: score }, totalDistance: { increment: distance } } });
  return NextResponse.json({ score, distanceKm: Number(distance.toFixed(1)), trueLat: round.trueLat, trueLng: round.trueLng });
}
