export type ProviderId = 'mapillary' | 'tencent' | 'baidu' | 'google' | 'mock';

export interface Scene {
  providerId: ProviderId;
  sceneId: string;
  lat: number;
  lng: number;
  clientViewerPayload: Record<string, unknown>;
  attribution: { text: string; link: string };
  meta: { country?: string; isPano: boolean; capturedAt?: string };
}

export interface StreetViewProvider {
  id: ProviderId;
  getRandomScene(options?: { regionId?: string; seed?: string }): Promise<Scene>;
  getSceneById(sceneId: string): Promise<Scene>;
}
