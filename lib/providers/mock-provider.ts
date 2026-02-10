import scenes from '@/data/mock-scenes.json';
import { Scene, StreetViewProvider } from '@/lib/types';

export class MockProvider implements StreetViewProvider {
  id = 'mock' as const;

  async getRandomScene(options?: { seed?: string }): Promise<Scene> {
    const idx = Math.abs(hash(options?.seed ?? `${Date.now()}`)) % scenes.length;
    const item = scenes[idx];
    return {
      providerId: 'mock',
      sceneId: item.sceneId,
      lat: item.lat,
      lng: item.lng,
      clientViewerPayload: { imageUrl: item.image },
      attribution: { text: 'Mock imagery (Picsum)', link: 'https://picsum.photos/' },
      meta: { country: item.country, isPano: false }
    };
  }

  async getSceneById(sceneId: string): Promise<Scene> {
    const found = scenes.find((s) => s.sceneId === sceneId) ?? scenes[0];
    return {
      providerId: 'mock',
      sceneId: found.sceneId,
      lat: found.lat,
      lng: found.lng,
      clientViewerPayload: { imageUrl: found.image },
      attribution: { text: 'Mock imagery (Picsum)', link: 'https://picsum.photos/' },
      meta: { country: found.country, isPano: false }
    };
  }
}

function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (Math.imul(31, h) + value.charCodeAt(i)) | 0;
  return h;
}
