import { z } from 'zod';

export const startSchema = z.object({
  mode: z.enum(['classic', 'daily', 'timetrial', 'streak', 'battle']).default('classic'),
  providerId: z.enum(['mapillary', 'tencent', 'mock']).optional(),
  packSlug: z.string().optional()
});

export const guessSchema = z.object({
  runId: z.string().min(1),
  roundIdx: z.number().int().min(0),
  guessLat: z.number().min(-90).max(90),
  guessLng: z.number().min(-180).max(180)
});
