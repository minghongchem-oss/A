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
  const [source, setSource] = useState<'gnews' | 'mock'>('mock');
  const [reason, setReason] = useState('Using mock labels.');

  useEffect(() => {
    const run = async () => {
      if (!query.trim()) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/.netlify/functions/annotate?query=${encodeURIComponent(query)}&t=${Date.now()}`);
        if (!response.ok) throw new Error(`Proxy status ${response.status}`);
        const payload: { live: boolean; provider: 'gnews' | 'mock'; fallbackReason?: string; items: FactCheckItem[]; error?: string } = await response.json();

        setSource(payload.live ? payload.provider : 'mock');
        setReason(payload.fallbackReason || (payload.live ? 'GNews live lookup.' : 'Using mock labels.'));
        setData(payload.live ? payload.items : []);
        if (!payload.live) {
          setError(payload.error ? `${payload.error} Using mock data.` : 'Live annotate unavailable. Using mock data.');
        }
      } catch (err) {
        setSource('mock');
        setReason('Proxy request failed.');
        setData([]);
        setError(`Live fetch failed (${(err as Error).message}). Using mock data.`);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [query]);

  return { data, loading, error, source, reason };
};
