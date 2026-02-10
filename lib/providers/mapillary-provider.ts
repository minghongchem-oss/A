import regions from '@/data/regions.json';
import { Scene, StreetViewProvider } from '@/lib/types';

export class MapillaryProvider implements StreetViewProvider {
  id = 'mapillary' as const;
  token = process.env.MAPILLARY_TOKEN;

  async getRandomScene(options?: { regionId?: string; seed?: string }): Promise<Scene> {
    if (!this.token) throw new Error('MAPILLARY_TOKEN not set');
    const region = regions.find((r) => r.id === options?.regionId) ?? regions[Math.floor(Math.random() * regions.length)];
    const bbox = region.bbox.join(',');
    const url = `https://graph.mapillary.com/images?access_token=${this.token}&fields=id,computed_geometry,captured_at&limit=50&bbox=${bbox}`;
    const response = await fetch(url);
    const json = await response.json();
    const items = json.data ?? [];
    if (!items.length) throw new Error('No mapillary scenes found');
    const pick = items[Math.floor(Math.random() * items.length)];
    return {
      providerId: 'mapillary',
      sceneId: pick.id,
      lat: pick.computed_geometry.coordinates[1],
      lng: pick.computed_geometry.coordinates[0],
      clientViewerPayload: { imageId: pick.id },
      attribution: { text: '© Mapillary', link: 'https://www.mapillary.com/' },
      meta: { isPano: true, capturedAt: pick.captured_at }
    };
  }

  async getSceneById(sceneId: string): Promise<Scene> {
    if (!this.token) throw new Error('MAPILLARY_TOKEN not set');
    const url = `https://graph.mapillary.com/${sceneId}?access_token=${this.token}&fields=id,computed_geometry,captured_at`;
    const response = await fetch(url);
    const pick = await response.json();
    return {
      providerId: 'mapillary',
      sceneId: pick.id,
      lat: pick.computed_geometry.coordinates[1],
      lng: pick.computed_geometry.coordinates[0],
      clientViewerPayload: { imageId: pick.id },
      attribution: { text: '© Mapillary', link: 'https://www.mapillary.com/' },
      meta: { isPano: true, capturedAt: pick.captured_at }
    };
  }
}
