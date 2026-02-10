import { useCallback, useEffect, useMemo, useState } from 'react';
import { coverageTimeline } from '../data/mockData';
import type { OutletConfig } from '../lib/appConfig';

export type NewsArticle = {
  title: string;
  url: string;
  source: string;
  date: string;
  side: 'Left' | 'Center' | 'Right';
};

type DataPoint = { date: string; Left: number; Center: number; Right: number };

export const useNewsVolume = (topic: string, outlets: OutletConfig[]) => {
  const [data, setData] = useState<DataPoint[]>(coverageTimeline);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState(new Date().toISOString());
  const [source, setSource] = useState<'newsapi' | 'rss2json' | 'gnews' | 'mock'>('mock');
  const [reason, setReason] = useState<string>('Using mock baseline.');

  const sourceBias = useMemo<Record<string, 'Left' | 'Center' | 'Right'>>(
    () => Object.fromEntries(outlets.map((o) => [o.name, o.side])) as Record<string, 'Left' | 'Center' | 'Right'>,
    [outlets]
  );

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/.netlify/functions/news?topic=${encodeURIComponent(topic)}&t=${Date.now()}`);
      if (!response.ok) throw new Error(`Proxy status ${response.status}`);
      const payload: {
        live: boolean;
        provider: 'newsapi' | 'rss2json' | 'gnews' | 'mock';
        fallbackReason?: string | null;
        fetchedAt: string;
        articles: Array<{ title: string; url: string; source: string; publishedAt: string; sideHint?: 'Left' | 'Center' | 'Right' }>;
        error?: string;
      } = await response.json();

      const grouped = new Map<string, { Left: number; Center: number; Right: number }>();
      const mappedArticles: NewsArticle[] = (payload.articles ?? []).slice(0, 40).map((article) => {
        const side = article.sideHint ?? sourceBias[article.source] ?? 'Center';
        const day = (article.publishedAt || '').slice(0, 10);
        const current = grouped.get(day) ?? { Left: 0, Center: 0, Right: 0 };
        current[side] += 1;
        grouped.set(day, current);
        return { title: article.title, url: article.url, source: article.source, date: day, side };
      });

      const transformed = [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, c]) => ({ date, ...c }));
      const useLiveDataset = payload.live && transformed.length > 2;

      setSource(useLiveDataset ? payload.provider : 'mock');
      setReason(payload.fallbackReason || (useLiveDataset ? `${payload.provider} live data` : 'Live dataset sparse, using mock baseline.'));
      setData(useLiveDataset ? transformed : coverageTimeline);
      setArticles(useLiveDataset ? mappedArticles : []);
      setError(useLiveDataset ? null : payload.error ? `${payload.error} Using mock data.` : 'Live fetch unavailable. Using mock data.');
      setFetchedAt(payload.fetchedAt ?? new Date().toISOString());
    } catch (err) {
      setSource('mock');
      setReason('Proxy request failed.');
      setData(coverageTimeline);
      setArticles([]);
      setError(`Live fetch failed (${(err as Error).message}). Using mock data.`);
      setFetchedAt(new Date().toISOString());
    } finally {
      setLoading(false);
    }
  }, [topic, sourceBias]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, articles, loading, error, fetchedAt, source, reason, refresh };
};
