'use client';

export function MockViewer({ imageUrl }: { imageUrl: string }) {
  return <img src={imageUrl} alt="mock scene" className="h-[400px] w-full rounded-xl border object-cover" />;
}
