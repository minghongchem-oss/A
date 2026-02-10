import { MapillaryProvider } from '@/lib/providers/mapillary-provider';
import { MockProvider } from '@/lib/providers/mock-provider';
import { TencentProvider } from '@/lib/providers/tencent-provider';
import { StreetViewProvider } from '@/lib/types';

export function getProvider(preferred?: string): StreetViewProvider {
  const mode = process.env.MOCK_IMAGERY === '1';
  if (mode) return new MockProvider();
  if (preferred === 'tencent') return new TencentProvider();
  if (preferred === 'mapillary') return new MapillaryProvider();
  return process.env.MAPILLARY_TOKEN ? new MapillaryProvider() : new MockProvider();
}
