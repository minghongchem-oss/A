'use client';

import { useMemo, useState } from 'react';

export function TencentStaticViewer({ panoId }: { panoId: string }) {
  const [heading, setHeading] = useState(0);
  const url = useMemo(() => `/api/tencent/image?pano=${panoId}&heading=${heading}&pitch=0&fov=90`, [panoId, heading]);
  return (
    <div className="space-y-2 rounded-xl border p-2">
      <img src={url} alt="Tencent street view" className="h-[380px] w-full rounded object-cover" />
      <input type="range" min={0} max={360} value={heading} onChange={(e) => setHeading(Number(e.target.value))} className="w-full" aria-label="heading" />
    </div>
  );
}
