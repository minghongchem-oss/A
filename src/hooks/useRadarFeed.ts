import { useEffect, useState } from 'react';
import { radarCards } from '../data/mockData';

type RadarCard = (typeof radarCards)[number];

export const useRadarFeed = () => {
  const [cards, setCards] = useState<RadarCard[]>(radarCards);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const key = import.meta.env.VITE_RSS2JSON_API_KEY;
      if (!key) {
        setError('Missing VITE_RSS2JSON_API_KEY. Loaded curated mock radar cards.');
        setLoading(false);
        return;
      }

      try {
        const rssUrl = encodeURIComponent('https://www.reuters.com/world/us/politics/rss');
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&api_key=${key}`);
        if (!response.ok) throw new Error(`RSS2JSON status ${response.status}`);
        const payload: { items: Array<{ title: string; link: string; pubDate: string }> } = await response.json();

        const merged = payload.items.slice(0, 4).map((item, index) => ({
          id: `live-${index}`,
          headline: item.title,
          source: 'Reuters Politics RSS',
          sourceUrl: item.link,
          mainstreamHits: 1,
          altEngagement: 600000 - index * 45000,
          viralityGap: 75 - index * 3,
          credibility: 'High credibility (wire source)',
          factCheck: 'https://www.factcheck.org/',
          date: item.pubDate.slice(0, 10),
        }));

        setCards([...radarCards, ...merged].sort((a, b) => b.viralityGap - a.viralityGap));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  return { cards, loading, error, fetchedAt: new Date().toISOString() };
};
