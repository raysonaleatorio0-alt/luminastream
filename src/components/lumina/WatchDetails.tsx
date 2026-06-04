'use client';

import { Star, Calendar, Clock, Bookmark, Share2, Play, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface WatchDetailsProps {
  id: string;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
  data: any;
}

export function WatchDetails({ id, type, season = 1, episode = 1, data }: WatchDetailsProps) {
  const { user } = useAuth();
  const { addItem, removeItem, checkIfInWatchlist } = useWatchlist();
  const { toast } = useToast();
  const [isInList, setIsInList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = data.title || data.name;
  const releaseYear = (data.release_date || data.first_air_date || "").split("-")[0];
  const runtime = data.runtime || (data.episode_run_time ? data.episode_run_time[0] : null);

  useEffect(() => {
    const checkStatus = async () => {
      if (user) {
        const inList = await checkIfInWatchlist(id);
        setIsInList(inList);
      }
    };
    checkStatus();
  }, [user, id, checkIfInWatchlist]);

  const handleToggleWatchlist = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login com Google para adicionar itens à sua lista",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isInList) {
        // Remover da lista
        const watchlistItem = data.watchlistItems?.find((item: any) => item.mediaId === id);
        if (watchlistItem?.id) {
          await removeItem(watchlistItem.id);
          setIsInList(false);
          toast({
            title: "Removido",
            description: "Removido da sua lista",
          });
        }
      } else {
        // Adicionar à lista
        await addItem({
          mediaId: id,
          mediaType: type === 'tv' ? 'series' : 'movie',
          title: title,
          posterPath: data.poster_path,
        });
        setIsInList(true);
        toast({
          title: "Adicionado!",
          description: `"${title}" foi adicionado à sua lista`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar lista",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-8 py-6">
      <div className="space-y-4 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="bg-primary/20 text-primary border-none font-bold uppercase tracking-wider px-3 py-1">
            {type === 'movie' ? 'Longa-Metragem' : `Série • T${season} E${episode}`}
          </Badge>
          {data.genres?.map((g: any) => (
            <Badge key={g.id} variant="outline" className="border-white/10 text-muted-foreground hover:bg-white/5 cursor-default">
              {g.name}
            </Badge>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-headline font-bold">{title}</h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <Star size={16} className="text-secondary fill-secondary" />
            <span className="text-foreground font-bold">{data.vote_average.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={16} />
            <span>{releaseYear}</span>
          </div>
          {runtime && (
            <div className="flex items-center gap-1.5">
              <Clock size={16} />
              <span>{runtime} min</span>
            </div>
          )}
        </div>
        
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          {data.overview}
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full md:w-64">
        <Button 
          size="lg" 
          onClick={handleToggleWatchlist}
          disabled={isLoading}
          className={cn(
            "w-full h-14 rounded-2xl font-bold shadow-xl transition-transform hover:scale-[1.02]",
            isInList
              ? "bg-red-600 text-white hover:bg-red-700 shadow-red-600/20"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary/10"
          )}
        >
          {isInList ? (
            <>
              <X className="mr-2" size={20} />
              Remover da Lista
            </>
          ) : (
            <>
              <Bookmark className="mr-2" size={20} />
              Salvar na Lista
            </>
          )}
        </Button>
        <Button variant="outline" size="lg" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 font-bold hover:bg-white/10">
          <Share2 className="mr-2" size={20} />
          Compartilhar
        </Button>
      </div>
    </div>
  );
}
