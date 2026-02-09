import { useEffect, useState } from 'react';

export type FactCheckItem = {
  claim: string;
  claimant: string;
  reviewDate: string;
  textualRating: string;
  url: string;
};

export const useFactCheckLookup = (query: string) => {
  const [data, setData] = useState<FactCheckItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!query.trim()) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/.netlify/functions/annotate?query=${encodeURIComponent(query)}&t=${Date.now()}`);
        if (!response.ok) throw new Error(`Proxy status ${response.status}`);
        const payload: { live: boolean; items: FactCheckItem[]; error?: string } = await response.json();

        setLive(Boolean(payload.live));
        setData(payload.live ? payload.items : []);
        if (!payload.live) {
          setError(payload.error ? `${payload.error} Using mock data.` : 'Live annotate unavailable. Using mock data.');
        }
      } catch (err) {
        setLive(false);
        setData([]);
        setError(`Live fetch failed (${(err as Error).message}). Using mock data.`);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [query]);

  return { data, loading, error, live };
};
