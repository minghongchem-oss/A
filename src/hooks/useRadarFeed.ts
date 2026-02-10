import { useCallback, useEffect, useState } from 'react';
import { radarCards } from '../data/mockData';

type RadarCard = (typeof radarCards)[number] & { xEngagement?: number };

export const useRadarFeed = () => {
  const [cards, setCards] = useState<RadarCard[]>(radarCards);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState(new Date().toISOString());

  const pullPublicXSignal = async () => {
    try {
      const resp = await fetch('https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=Reuters');
      if (!resp.ok) return null;
      const payload: Array<{ followers_count: number }> = await resp.json();
      return payload?.[0]?.followers_count ?? null;
    } catch {
      return null;
    }
  };

  const refresh = useCallback(async () => {
    const key = import.meta.env.VITE_RSS2JSON_KEY ?? import.meta.env.VITE_RSS2JSON_API_KEY;
    const xFollowers = await pullPublicXSignal();

    if (!key) {
      setCards(radarCards.map((c, i) => ({ ...c, xEngagement: xFollowers ? Math.round(xFollowers / (300 + i * 30)) : undefined })));
      setError('API key missing — using mock data. Add key to .env to enable live data.');
      setLoading(false);
      setFetchedAt(new Date().toISOString());
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const feeds = ['https://www.reuters.com/world/us/politics/rss', 'https://feeds.feedburner.com/Talking-Points-Memo'];
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
            xEngagement: xFollowers ? Math.round(xFollowers / (600 + idx * 50)) : undefined,
          });
        });
      }

      setCards([...radarCards.map((c, i) => ({ ...c, xEngagement: xFollowers ? Math.round(xFollowers / (300 + i * 30)) : undefined })), ...live].sort((a, b) => b.viralityGap - a.viralityGap));
    } catch (err) {
      setCards(radarCards.map((c, i) => ({ ...c, xEngagement: xFollowers ? Math.round(xFollowers / (300 + i * 30)) : undefined })));
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
