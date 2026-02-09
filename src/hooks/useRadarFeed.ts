import { useCallback, useEffect, useState } from 'react';
import { radarCards } from '../data/mockData';

type RadarCard = (typeof radarCards)[number] & { xEngagement?: number };

export const useRadarFeed = () => {
  const [cards, setCards] = useState<RadarCard[]>(radarCards);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState(new Date().toISOString());
  const [live, setLive] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/.netlify/functions/radar?t=${Date.now()}`);
      if (!response.ok) throw new Error(`Proxy status ${response.status}`);
      const payload: { live: boolean; cards: RadarCard[]; fetchedAt: string; error?: string } = await response.json();

      setLive(Boolean(payload.live));
      setCards(payload.live && payload.cards.length > 0 ? payload.cards : radarCards);
      setError(payload.live ? null : payload.error ? `${payload.error} Using mock data.` : 'Live radar unavailable. Using mock data.');
      setFetchedAt(payload.fetchedAt ?? new Date().toISOString());
    } catch (err) {
      setLive(false);
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

  return { cards, loading, error, fetchedAt, live, refresh };
};
