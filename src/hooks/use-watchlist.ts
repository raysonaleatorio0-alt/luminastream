import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import {
  getUserWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  WatchlistItem,
} from '@/lib/watchlistService';

export function useWatchlist() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar watchlist quando o usuário fizer login
  useEffect(() => {
    if (user) {
      loadWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [user]);

  const loadWatchlist = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      const items = await getUserWatchlist(user.uid);
      setWatchlist(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar watchlist');
      console.error('Erro ao carregar watchlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (item: Omit<WatchlistItem, 'id' | 'userId' | 'addedAt'>) => {
    if (!user) {
      setError('Você precisa estar logado para adicionar itens');
      return;
    }
    try {
      setError(null);
      const id = await addToWatchlist(user.uid, item);
      setWatchlist([...watchlist, { ...item, id, userId: user.uid }]);
      return id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao adicionar item';
      setError(message);
      throw err;
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setError(null);
      await removeFromWatchlist(itemId);
      setWatchlist(watchlist.filter(item => item.id !== itemId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao remover item';
      setError(message);
      throw err;
    }
  };

  const checkIfInWatchlist = async (mediaId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      return await isInWatchlist(user.uid, mediaId);
    } catch (err) {
      console.error('Erro ao verificar item na watchlist:', err);
      return false;
    }
  };

  return {
    watchlist,
    isLoading,
    error,
    addItem,
    removeItem,
    checkIfInWatchlist,
    refetch: loadWatchlist,
  };
}
