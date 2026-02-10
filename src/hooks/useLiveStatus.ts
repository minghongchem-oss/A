import { useCallback, useEffect, useState } from 'react';

export type LiveStatus = {
  live: boolean;
  providers: {
    newsapi: boolean;
    gnews: boolean;
    rss2json: boolean;
  };
  preferredProvider: 'newsapi' | 'gnews' | 'rss2json' | 'mock';
  lastProvider: 'newsapi' | 'gnews' | 'rss2json' | 'mock';
  lastReason: string;
  lastFetch: string;
  message: string;
};

const fallback: LiveStatus = {
  live: false,
  providers: { newsapi: false, gnews: false, rss2json: false },
  preferredProvider: 'mock',
  lastProvider: 'mock',
  lastReason: 'Status unavailable.',
  lastFetch: new Date().toISOString(),
  message: 'Status unavailable. Assuming mock mode.',
};

export const useLiveStatus = () => {
  const [status, setStatus] = useState<LiveStatus>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/.netlify/functions/health?t=${Date.now()}`);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const payload = await response.json();
      setStatus({
        live: Boolean(payload.live),
        providers: payload.providers ?? fallback.providers,
        preferredProvider: payload.preferredProvider ?? 'mock',
        lastProvider: payload.lastProvider ?? 'mock',
        lastReason: payload.lastReason ?? 'No reason supplied.',
        lastFetch: payload.lastFetch ?? new Date().toISOString(),
        message: payload.message ?? 'Status loaded.',
      });
      setError(null);
    } catch (err) {
      setStatus(fallback);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { status, loading, error, refresh };
};
