import { useEffect, useState } from 'react';
import { coverageTimeline } from '../data/mockData';

type ApiState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  fetchedAt: string;
};

const buildFallbackState = (): ApiState<typeof coverageTimeline> => ({
  data: coverageTimeline,
  loading: true,
  error: null,
  fetchedAt: new Date().toISOString(),
});

export const useNewsVolume = (topic: string) => {
  const [state, setState] = useState<ApiState<typeof coverageTimeline>>(buildFallbackState());

  useEffect(() => {
    const key = import.meta.env.VITE_NEWS_API_KEY;
    if (!key) {
      setState({ data: coverageTimeline, loading: false, error: 'Missing VITE_NEWS_API_KEY. Showing mock data.', fetchedAt: new Date().toISOString() });
      return;
    }

    const run = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const endpoint = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&language=en&pageSize=40&sortBy=publishedAt&apiKey=${key}`;
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`NewsAPI status ${response.status}`);
        }

        const payload: { articles: Array<{ publishedAt: string; source: { name: string } }> } = await response.json();
        const grouped = new Map<string, { Left: number; Center: number; Right: number }>();
        const sourceBias: Record<string, 'Left' | 'Center' | 'Right'> = {
          'CNN': 'Left',
          'MSNBC': 'Left',
          'New York Times': 'Left',
          'Fox News': 'Right',
          'Breitbart': 'Right',
          'Daily Wire': 'Right',
          'Reuters': 'Center',
          'Associated Press': 'Center',
          'BBC News': 'Center',
        };

        payload.articles.forEach((article) => {
          const day = article.publishedAt.slice(0, 10);
          const bias = sourceBias[article.source.name] ?? 'Center';
          const current = grouped.get(day) ?? { Left: 0, Center: 0, Right: 0 };
          current[bias] += 1;
          grouped.set(day, current);
        });

        const transformed = [...grouped.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, counts]) => ({ date, ...counts }));

        setState({
          data: transformed.length > 2 ? transformed : coverageTimeline,
          loading: false,
          error: transformed.length > 2 ? null : 'API returned too little categorized data. Using mock baseline.',
          fetchedAt: new Date().toISOString(),
        });
      } catch (error) {
        setState({ data: coverageTimeline, loading: false, error: (error as Error).message, fetchedAt: new Date().toISOString() });
      }
    };

    void run();
  }, [topic]);

  return state;
};
