'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Navbar from '@/components/lumina/Navbar';
import MediaCard from '@/components/lumina/MediaCard';
import { getTrending, type Media } from '@/lib/tmdb';
import { Film, Tv } from 'lucide-react';

interface PageProps {
  params: Promise<{
    type: 'movies' | 'series';
  }>;
}

export default function BrowsePage({ params }: PageProps) {
  const [type, setType] = useState<'movies' | 'series'>('movies');
  const [items, setItems] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setType(resolvedParams.type);
      setPage(1);
      setItems([]);
      setHasMore(true);
    };
    loadParams();
  }, [params]);

  const loadMoreItems = useCallback(async () => {
    if (!type || isLoading || isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const data = await getTrending(type === 'series' ? 'tv' : 'movie');
      const newItems = data.results || [];
      
      // Simula paginação ao embaralhar os resultados
      const itemsPerPage = 20;
      const startIdx = page * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      
      if (newItems.length > 0) {
        const paginatedItems = newItems.slice(startIdx, endIdx);
        if (paginatedItems.length > 0) {
          setItems((prev) => [...prev, ...paginatedItems]);
          setPage((prev) => prev + 1);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar mais itens:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [type, page, isLoading, isLoadingMore, hasMore]);

  // Carrega itens iniciais
  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true);
        const data = await getTrending(type === 'series' ? 'tv' : 'movie');
        const initialItems = (data.results || []).slice(0, 20);
        setItems(initialItems);
        setPage(1);
        setHasMore((data.results || []).length > 20);
      } catch (error) {
        console.error('Erro ao carregar itens:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (type) {
      loadItems();
    }
  }, [type]);

  // Intersection Observer para carregar mais quando chegar perto do final
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMoreItems();
        }
      },
      {
        rootMargin: '200px',
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMoreItems, hasMore, isLoadingMore, isLoading]);

  const title = type === 'movies' ? 'Filmes' : 'Séries';
  const Icon = type === 'movies' ? Film : Tv;
  const mediaType = type === 'movies' ? 'movie' : 'tv';

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-32 px-6 md:px-12 pb-24 max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon size={24} />
            </div>
            <h1 className="text-5xl font-headline font-bold">{title}</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Explore todos os {title.toLowerCase()} populares e aclamados do momento.
          </p>
        </div>

        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="text-muted-foreground">Carregando {title.toLowerCase()}...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/2">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
              <Icon size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-bold">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Nenhum {title.toLowerCase()} disponível no momento. Tente novamente mais tarde.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {items.map((item) => (
                <MediaCard
                  key={item.id}
                  id={item.id}
                  title={item.title || item.name || ''}
                  posterPath={item.poster_path}
                  rating={item.vote_average}
                  type={mediaType as 'movie' | 'tv'}
                />
              ))}
            </div>

            {/* Loader para infinite scroll */}
            <div ref={loaderRef} className="py-12 flex flex-col items-center justify-center">
              {isLoadingMore && (
                <div className="text-muted-foreground animate-pulse">
                  Carregando mais {title.toLowerCase()}...
                </div>
              )}
              {!hasMore && items.length > 0 && (
                <div className="text-muted-foreground text-sm">
                  Fim da lista
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
