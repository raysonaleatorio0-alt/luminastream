import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface WatchlistItem {
  id?: string;
  userId: string;
  mediaId: string;
  mediaType: 'movie' | 'series';
  title: string;
  posterPath?: string;
  addedAt?: Timestamp;
}

// Adicionar item à watchlist
export async function addToWatchlist(
  userId: string,
  item: Omit<WatchlistItem, 'id' | 'userId' | 'addedAt'>
) {
  try {
    const docRef = await addDoc(collection(db, 'watchlist'), {
      ...item,
      userId,
      addedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar à watchlist:', error);
    throw error;
  }
}

// Remover item da watchlist
export async function removeFromWatchlist(itemId: string) {
  try {
    await deleteDoc(doc(db, 'watchlist', itemId));
  } catch (error) {
    console.error('Erro ao remover da watchlist:', error);
    throw error;
  }
}

// Obter watchlist do usuário
export async function getUserWatchlist(userId: string): Promise<WatchlistItem[]> {
  try {
    const q = query(collection(db, 'watchlist'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const items: WatchlistItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      } as WatchlistItem);
    });
    return items;
  } catch (error) {
    console.error('Erro ao obter watchlist:', error);
    throw error;
  }
}

// Verificar se um item está na watchlist
export async function isInWatchlist(userId: string, mediaId: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, 'watchlist'),
      where('userId', '==', userId),
      where('mediaId', '==', mediaId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Erro ao verificar watchlist:', error);
    return false;
  }
}
