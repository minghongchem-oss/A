import { useCallback, useEffect, useState } from 'react';
import { radarCards } from '../data/mockData';

type RadarCard = (typeof radarCards)[number] & { xEngagement?: number };

export const useRadarFeed = () => {
  const [cards, setCards] = useState<RadarCard[]>(radarCards);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState(new Date().toISOString());
  const [source, setSource] = useState<'rss2json' | 'mock'>('mock');
  const [reason, setReason] = useState('Using mock radar cards.');

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/.netlify/functions/radar?t=${Date.now()}`);
      if (!response.ok) throw new Error(`Proxy status ${response.status}`);
      const payload: { live: boolean; provider: 'rss2json' | 'mock'; fallbackReason?: string; cards: RadarCard[]; fetchedAt: string; error?: string } = await response.json();

      setSource(payload.live ? payload.provider : 'mock');
      setReason(payload.fallbackReason || (payload.live ? 'RSS2JSON live feed.' : 'Using mock cards.'));
      setCards(payload.live && payload.cards.length > 0 ? payload.cards : radarCards);
      setError(payload.live ? null : payload.error ? `${payload.error} Using mock data.` : 'Live radar unavailable. Using mock data.');
      setFetchedAt(payload.fetchedAt ?? new Date().toISOString());
    } catch (err) {
      setSource('mock');
      setReason('Proxy request failed.');
      setCards(radarCards);
      setError(`Live fetch failed (${(err as Error).message}). Using mock data.`);
      setFetchedAt(new Date().toISOString());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { cards, loading, error, fetchedAt, source, reason, refresh };
};
