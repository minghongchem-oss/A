'use client';

export function MapillaryViewer({ imageId }: { imageId: string }) {
  return (
    <div className="flex h-[400px] items-center justify-center rounded-xl border bg-black text-white">
      <p>Mapillary 场景: {imageId}</p>
    </div>
  );
}
