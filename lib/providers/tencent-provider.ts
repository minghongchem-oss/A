import { StreetViewProvider, Scene } from '@/lib/types';

export class TencentProvider implements StreetViewProvider {
  id = 'tencent' as const;
  key = process.env.TENCENT_KEY;

  async getRandomScene(): Promise<Scene> {
    if (!this.key) throw new Error('TENCENT_KEY missing');
    const lat = 21 + Math.random() * 18;
    const lng = 102 + Math.random() * 20;
    const url = `https://apis.map.qq.com/ws/streetview/v1/getpano?location=${lat},${lng}&key=${this.key}`;
    const res = await fetch(url).then((r) => r.json());
    const pano = res.detail?.[0];
    if (!pano?.id) throw new Error('No tencent pano');
    return {
      providerId: 'tencent',
      sceneId: pano.id,
      lat: pano.location.lat,
      lng: pano.location.lng,
      clientViewerPayload: { panoId: pano.id, heading: 0, pitch: 0, fov: 90 },
      attribution: { text: '© Tencent Street View', link: 'https://lbs.qq.com/' },
      meta: { isPano: true, country: 'CN' }
    };
  }

  async getSceneById(sceneId: string): Promise<Scene> {
    return {
      providerId: 'tencent',
      sceneId,
      lat: 31.2304,
      lng: 121.4737,
      clientViewerPayload: { panoId: sceneId, heading: 0, pitch: 0, fov: 90 },
      attribution: { text: '© Tencent Street View', link: 'https://lbs.qq.com/' },
      meta: { isPano: true, country: 'CN' }
    };
  }
}

export function buildTencentStaticImage(panoId: string, heading: number, pitch: number, fov: number) {
  const key = process.env.TENCENT_KEY;
  return `/api/tencent/image?pano=${encodeURIComponent(panoId)}&heading=${heading}&pitch=${pitch}&fov=${fov}&sig=${key ? 'server' : 'missing'}`;
}
