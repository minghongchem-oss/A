import { Scene } from '@/lib/types';

type Round = { idx: number; providerId: string; sceneId: string; trueLat: number; trueLng: number; countryCode?: string; guessLat?: number; guessLng?: number; distanceKm?: number; score?: number; payload: Scene['clientViewerPayload']; attribution: Scene['attribution'] };
const runs = new Map<string, { id: string; mode: string; seed?: string; rounds: Round[]; totalScore: number; totalDistance: number }>();

export function createRun(mode: string, scene: Scene, seed?: string) {
  const id = crypto.randomUUID();
  runs.set(id, { id, mode, seed, totalScore: 0, totalDistance: 0, rounds: [{ idx: 0, providerId: scene.providerId, sceneId: scene.sceneId, trueLat: scene.lat, trueLng: scene.lng, countryCode: scene.meta.country, payload: scene.clientViewerPayload, attribution: scene.attribution }] });
  return runs.get(id)!;
}

export function getRun(id: string) { return runs.get(id); }

export function appendRound(id: string, scene: Scene) {
  const run = runs.get(id);
  if (!run) return null;
  const idx = run.rounds.length;
  run.rounds.push({ idx, providerId: scene.providerId, sceneId: scene.sceneId, trueLat: scene.lat, trueLng: scene.lng, countryCode: scene.meta.country, payload: scene.clientViewerPayload, attribution: scene.attribution });
  return run.rounds[idx];
}
