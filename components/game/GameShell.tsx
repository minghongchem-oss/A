'use client';

import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { GuessMap } from '@/components/GuessMap';
import { MapillaryViewer } from '@/components/viewers/MapillaryViewer';
import { MockViewer } from '@/components/viewers/MockViewer';
import { TencentStaticViewer } from '@/components/viewers/TencentStaticViewer';

type RoundPayload = {
  idx: number;
  runId: string;
  providerId: string;
  sceneId: string;
  viewerPayload: Record<string, any>;
  attribution: { text: string; link: string };
};

export function GameShell({ mode }: { mode: 'classic' | 'daily' | 'timetrial' }) {
  const [round, setRound] = useState<RoundPayload | null>(null);
  const [guess, setGuess] = useState<{ lat: number; lng: number } | null>(null);
  const [result, setResult] = useState<any>(null);

  const start = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/game/start', {
        method: 'POST',
        body: JSON.stringify({ mode }),
        headers: { 'Content-Type': 'application/json' }
      });
      return res.json();
    },
    onSuccess: (data) => setRound(data.round)
  });

  const submit = useMutation({
    mutationFn: async () => {
      if (!round || !guess) throw new Error('missing guess');
      const res = await fetch('/api/game/guess', {
        method: 'POST',
        body: JSON.stringify({ runId: round.runId, roundIdx: round.idx, guessLat: guess.lat, guessLng: guess.lng }),
        headers: { 'Content-Type': 'application/json' }
      });
      return res.json();
    },
    onSuccess: (data) => setResult(data)
  });

  const next = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/game/next', {
        method: 'POST',
        body: JSON.stringify({ runId: round?.runId }),
        headers: { 'Content-Type': 'application/json' }
      });
      return res.json();
    },
    onSuccess: (data) => {
      setResult(null);
      setGuess(null);
      setRound(data.round);
    }
  });

  useEffect(() => {
    start.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && guess && !result) submit.mutate();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [guess, result, submit]);

  if (!round) return <p>加载中...</p>;

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div>
        {round.providerId === 'mapillary' ? (
          <MapillaryViewer imageId={String(round.viewerPayload.imageId)} />
        ) : round.providerId === 'tencent' ? (
          <TencentStaticViewer panoId={String(round.viewerPayload.panoId)} />
        ) : (
          <MockViewer imageUrl={String(round.viewerPayload.imageUrl)} />
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          影像来源：<a href={round.attribution.link}>{round.attribution.text}</a>
        </p>
      </div>
      <div className="space-y-3">
        <GuessMap onPick={(lat, lng) => setGuess({ lat, lng })} />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setGuess({ lat: 0, lng: 0 })}>快速猜测(0,0)</Button>
          <Button onClick={() => submit.mutate()} disabled={!guess || !!result}>提交猜测</Button>
          <Button variant="outline" onClick={() => next.mutate()} disabled={!result}>下一回合</Button>
        </div>
        {result && (
          <div className="rounded border p-3 text-sm">
            <p>距离: {result.distanceKm} km</p>
            <p>得分: {result.score}</p>
          </div>
        )}
      </div>
    </section>
  );
}
