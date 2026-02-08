import { useCallback, useEffect, useState } from 'react';
import { radarCards } from '../data/mockData';

type RadarCard = (typeof radarCards)[number];

export const useRadarFeed = () => {
  const [cards, setCards] = useState<RadarCard[]>(radarCards);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState(new Date().toISOString());

  const refresh = useCallback(async () => {
    const key = import.meta.env.VITE_RSS2JSON_KEY ?? import.meta.env.VITE_RSS2JSON_API_KEY;
    if (!key) {
      setCards(radarCards);
      setError('API key missing — using mock data. Add key to .env to enable live data.');
      setLoading(false);
      setFetchedAt(new Date().toISOString());
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const feeds = [
        'https://www.reuters.com/world/us/politics/rss',
        'https://feeds.feedburner.com/Talking-Points-Memo',
      ];

      const live: RadarCard[] = [];
      for (const feed of feeds) {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}&api_key=${key}`);
        if (!response.ok) throw new Error(`RSS2JSON status ${response.status}`);
        const payload: { items: Array<{ title: string; link: string; pubDate: string }> } = await response.json();
        payload.items.slice(0, 3).forEach((item, idx) => {
          const base = 780000 - idx * 70000;
          live.push({
            id: `${feed}-${idx}`,
            headline: item.title,
            source: feed.includes('reuters') ? 'Reuters Politics RSS' : 'TPM RSS',
            sourceUrl: item.link,
            mainstreamHits: 2 + idx,
            altEngagement: base,
            viralityGap: 79 - idx * 4,
            credibility: feed.includes('reuters') ? 'High credibility (wire)' : 'Mostly factual',
            factCheck: 'https://www.factcheck.org/',
            date: item.pubDate.slice(0, 10),
          });
        });
      }

      setCards([...radarCards, ...live].sort((a, b) => b.viralityGap - a.viralityGap));
    } catch (err) {
      setCards(radarCards);
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setFetchedAt(new Date().toISOString());
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { cards, loading, error, fetchedAt, refresh };
};
