import { useCallback, useEffect, useState } from 'react';
import { coverageTimeline } from '../data/mockData';

export type NewsArticle = {
  title: string;
  url: string;
  source: string;
  date: string;
  side: 'Left' | 'Center' | 'Right';
};

type DataPoint = { date: string; Left: number; Center: number; Right: number };

export const useNewsVolume = (topic: string) => {
  const [data, setData] = useState<DataPoint[]>(coverageTimeline);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState(new Date().toISOString());

  const refresh = useCallback(async () => {
    const key = import.meta.env.VITE_NEWSAPI_KEY ?? import.meta.env.VITE_NEWS_API_KEY;
    if (!key) {
      setData(coverageTimeline);
      setArticles([]);
      setError('API key missing — using mock data. Add key to .env to enable live data.');
      setLoading(false);
      setFetchedAt(new Date().toISOString());
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const sourceBias: Record<string, 'Left' | 'Center' | 'Right'> = {
        CNN: 'Left', MSNBC: 'Left', 'New York Times': 'Left',
        'Fox News': 'Right', Breitbart: 'Right', 'Daily Wire': 'Right',
        Reuters: 'Center', 'BBC News': 'Center', 'Associated Press': 'Center',
      };
      const endpoint = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&language=en&pageSize=50&sortBy=publishedAt&apiKey=${key}`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(`NewsAPI status ${response.status}`);
      const payload: { articles: Array<{ title: string; url: string; publishedAt: string; source: { name: string } }> } = await response.json();

      const grouped = new Map<string, { Left: number; Center: number; Right: number }>();
      const mappedArticles: NewsArticle[] = payload.articles.slice(0, 25).map((article) => {
        const side = sourceBias[article.source.name] ?? 'Center';
        const day = article.publishedAt.slice(0, 10);
        const current = grouped.get(day) ?? { Left: 0, Center: 0, Right: 0 };
        current[side] += 1;
        grouped.set(day, current);
        return { title: article.title, url: article.url, source: article.source.name, date: day, side };
      });

      const transformed = [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, c]) => ({ date, ...c }));
      setData(transformed.length > 2 ? transformed : coverageTimeline);
      setArticles(mappedArticles);
      if (transformed.length <= 2) setError('Live API returned sparse categorized data; merged with mock baseline.');
    } catch (err) {
      setData(coverageTimeline);
      setArticles([]);
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setFetchedAt(new Date().toISOString());
    }
  }, [topic]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, articles, loading, error, fetchedAt, refresh };
};
