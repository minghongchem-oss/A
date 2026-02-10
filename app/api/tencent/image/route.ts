import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const pano = url.searchParams.get('pano');
  const heading = url.searchParams.get('heading') ?? '0';
  const pitch = url.searchParams.get('pitch') ?? '0';
  const fov = url.searchParams.get('fov') ?? '90';
  const key = process.env.TENCENT_KEY;
  if (!pano || !key) return NextResponse.json({ error: 'missing params' }, { status: 400 });
  const upstream = `https://apis.map.qq.com/ws/streetview/v1/image?pano=${pano}&heading=${heading}&pitch=${pitch}&fov=${fov}&size=1200*700&key=${key}`;
  const image = await fetch(upstream);
  return new NextResponse(image.body, { headers: { 'Content-Type': image.headers.get('Content-Type') ?? 'image/jpeg', 'Cache-Control': 'public, max-age=3600' } });
}
