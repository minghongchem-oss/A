import { useCallback, useEffect, useState } from 'react';

export type LiveStatus = {
  live: boolean;
  providers: {
    newsapi: boolean;
    gnews: boolean;
    rss2json: boolean;
  };
  lastFetch: string;
  message: string;
};

const fallback: LiveStatus = {
  live: false,
  providers: { newsapi: false, gnews: false, rss2json: false },
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
