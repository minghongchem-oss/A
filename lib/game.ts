export function haversineDistanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const sa =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(sa), Math.sqrt(1 - sa));
  return R * c;
}

export function scoreFromDistance(distanceKm: number, decayKm = 2000, maxPerRound = 5000) {
  const raw = Math.round(maxPerRound * Math.exp(-distanceKm / decayKm));
  return Math.max(0, Math.min(maxPerRound, raw));
}

function toRad(v: number) {
  return (v * Math.PI) / 180;
}
