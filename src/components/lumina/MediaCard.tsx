"use client";

import Link from "next/link";
import { Star, Play, Bookmark, X } from "lucide-react";
import { getImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface MediaCardProps {
  id: number;
  title: string;
  posterPath: string;
  rating?: number;
  type: "movie" | "tv";
  className?: string;
}

export default function MediaCard({ id, title, posterPath, rating, type, className }: MediaCardProps) {
  const { user } = useAuth();
  const { addItem } = useWatchlist();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isInList, setIsInList] = useState(false);

  const handleAddToWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login com Google para adicionar itens à sua lista",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    try {
      await addItem({
        mediaId: id.toString(),
        mediaType: type === 'tv' ? 'series' : 'movie',
        title: title,
        posterPath: posterPath,
      });
      setIsInList(true);
      toast({
        title: "Adicionado!",
        description: `"${title}" foi adicionado à sua lista`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar item",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={cn("group relative block aspect-[2/3] overflow-hidden rounded-2xl bg-muted card-hover", className)}>
      <Link
        href={`/watch/${type}/${id}`}
        className="block w-full h-full"
      >
        <img
          src={getImageUrl(posterPath)}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-4 flex flex-col justify-between">
          <div></div>
          <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 bg-primary px-2 py-0.5 rounded-lg">
                <Star size={12} className="fill-primary-foreground text-primary-foreground" />
                <span className="text-xs font-bold text-primary-foreground">
                  {rating != null ? rating.toFixed(1) : "-"}
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground bg-white/10 px-2 py-0.5 rounded-lg border border-white/5">
                {type === 'movie' ? 'Filme' : 'Série'}
              </span>
            </div>
            <h3 className="font-headline font-bold text-lg line-clamp-2 leading-tight">
              {title}
            </h3>
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={18} className="fill-primary-foreground text-primary-foreground ml-1" />
              </div>
              <button
                onClick={handleAddToWatchlist}
                disabled={isAdding || isInList}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100",
                  isInList
                    ? "bg-green-500/80 shadow-green-500/40"
                    : "bg-secondary shadow-secondary/40 hover:scale-110"
                )}
              >
                {isInList ? (
                  <X size={18} className="text-white" />
                ) : (
                  <Bookmark size={18} className="text-secondary-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
