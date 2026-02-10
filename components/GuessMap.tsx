'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';

export function GuessMap({ onPick, reveal }: { onPick: (lat: number, lng: number) => void; reveal?: { guess: [number, number]; truth: [number, number] } }) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 10],
      zoom: 1
    });
    let marker: maplibregl.Marker | null = null;
    map.on('click', (event) => {
      const { lat, lng } = event.lngLat;
      onPick(lat, lng);
      marker?.remove();
      marker = new maplibregl.Marker({ color: '#ef4444' }).setLngLat([lng, lat]).addTo(map);
    });
    return () => map.remove();
  }, [onPick]);

  useEffect(() => {
    if (!reveal || !mapRef.current) return;
  }, [reveal]);

  return <div className="h-[300px] w-full overflow-hidden rounded-xl border" ref={mapRef} aria-label="guess-map" />;
}
