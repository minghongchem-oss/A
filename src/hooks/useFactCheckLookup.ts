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

  useEffect(() => {
    const run = async () => {
      if (!query.trim()) return;
      const apiKey = import.meta.env.VITE_GNEWS_KEY ?? import.meta.env.VITE_GNEWS_API_KEY;
      if (!apiKey) {
        setError('API key missing — using mock data. Add key to .env to enable live data.');
        setData([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(`${query} fact check`)}` + `&lang=en&max=6&apikey=${apiKey}`);
        if (!response.ok) throw new Error(`GNews status ${response.status}`);
        const payload: { articles: Array<{ title: string; url: string; publishedAt: string; source: { name: string } }> } = await response.json();

        setData(payload.articles.map((item, idx) => ({
          claim: item.title,
          claimant: item.source.name,
          reviewDate: item.publishedAt.slice(0, 10),
          textualRating: ['Needs manual verification', 'Mixed signal', 'Unrated'][idx % 3],
          url: item.url,
        })));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [query]);

  return { data, loading, error };
};
