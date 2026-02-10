import { describe, expect, it } from 'vitest';
import { haversineDistanceKm, scoreFromDistance } from '@/lib/game';

describe('game scoring', () => {
  it('computes zero distance', () => {
    expect(haversineDistanceKm(0, 0, 0, 0)).toBe(0);
  });

  it('decays score by distance', () => {
    expect(scoreFromDistance(0)).toBe(5000);
    expect(scoreFromDistance(10000)).toBeLessThan(100);
  });
});
