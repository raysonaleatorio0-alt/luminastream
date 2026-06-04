'use client';

import Navbar from "@/components/lumina/Navbar";
import { Bookmark, Search, X } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { getUserWatchlist, removeFromWatchlist, WatchlistItem } from "@/lib/watchlistService";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function WatchlistPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadWatchlist();
    }
  }, [user]);

  const loadWatchlist = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const items = await getUserWatchlist(user.uid);
      setWatchlist(items);
    } catch (error) {
      console.error('Erro ao carregar watchlist:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar sua lista",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromWatchlist(itemId);
      setWatchlist(watchlist.filter(item => item.id !== itemId));
      toast({
        title: "Removido",
        description: "Item removido da sua lista",
      });
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast({
        title: "Erro",
        description: "Falha ao remover item",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-32 px-6 md:px-12 max-w-7xl mx-auto flex items-center justify-center">
          <div className="text-muted-foreground">Carregando...</div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-32 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Bookmark size={24} />
              </div>
              <h1 className="text-5xl font-headline font-bold">Minha Lista</h1>
            </div>
            <p className="text-xl text-muted-foreground">Mantenha o controle dos filmes e séries que você quer ver depois.</p>
          </div>

          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/2">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
              <Bookmark size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-bold">Faça login para ver sua lista</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Você precisa estar logado para adicionar e acompanhar seus filmes e séries favoritos.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-32 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Bookmark size={24} />
            </div>
            <h1 className="text-5xl font-headline font-bold">Minha Lista</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            {watchlist.length > 0 
              ? `Você tem ${watchlist.length} ${watchlist.length === 1 ? 'item' : 'itens'} na sua lista` 
              : 'Sua lista está vazia'}
          </p>
        </div>

        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="text-muted-foreground">Carregando sua lista...</div>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/2">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
              <Bookmark size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-headline font-bold">Nenhum título adicionado</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Comece a explorar nosso catálogo e clique no botão "Adicionar à Lista" em qualquer filme ou série.
              </p>
            </div>
            <Link 
              href="/" 
              className="flex items-center gap-2 px-8 h-14 bg-primary text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
            >
              <Search size={20} />
              Começar a Explorar
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {watchlist.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <Link
                  href={`/watch/${item.mediaType === 'movie' ? 'movie' : 'tv'}/${item.mediaId}`}
                  className="block aspect-[2/3] relative overflow-hidden bg-white/5"
                >
                  <img
                    src={
                      item.posterPath
                        ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
                        : "https://via.placeholder.com/500x300?text=No+Image"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="space-y-2 w-full">
                      <p className="text-xs text-white/60 uppercase tracking-wider">
                        {item.mediaType === 'movie' ? 'Filme' : 'Série'}
                      </p>
                      <h3 className="text-sm font-bold text-white line-clamp-2">{item.title}</h3>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemoveItem(item.id!)}
                  className="absolute top-2 right-2 p-2 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 z-10"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
