"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Play, Bookmark, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useToast } from "@/hooks/use-toast";

interface XtreamCardProps {
  id: number;
  title: string;
  posterPath?: string;
  rating?: number;
  type: "vod" | "series";
  description?: string;
  year?: string;
}

export default function XtreamCard({
  id,
  title,
  posterPath,
  rating,
  type,
  description,
  year,
}: XtreamCardProps) {
  const { user } = useAuth();
  const { addItem, watchlist } = useWatchlist();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isInList, setIsInList] = useState(false);

  useEffect(() => {
    const mediaId = `xtream-${type}-${id}`;
    setIsInList(watchlist.some((item) => item.mediaId === mediaId));
  }, [watchlist, type, id]);

  const handleAddToWatchlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para salvar este conteúdo na sua lista.",
        variant: "destructive",
      });
      return;
    }

    if (isInList) {
      toast({
        title: "Já adicionado",
        description: "Este item já está na sua lista.",
      });
      return;
    }

    setIsAdding(true);
    try {
      await addItem({
        mediaId: `xtream-${type}-${id}`,
        mediaType: type === "series" ? "series" : "movie",
        title,
        posterPath,
      });
      setIsInList(true);
      toast({
        title: "Adicionado!",
        description: `${title} foi salvo na sua lista.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar",
        description: "Não foi possível salvar este item.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const watchUrl = `/watch/xtream/${type}/${id}`;
  const placeholder = `https://placehold.co/500x750/171414/white?text=${encodeURIComponent(title || "Xtream")}`;

  return (
    <Link href={watchUrl} className="group relative block rounded-3xl overflow-hidden bg-muted text-white shadow-xl shadow-black/20 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-full overflow-hidden">
        <img
          src={posterPath || placeholder}
          alt={title}
          className="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold bg-primary/90 text-primary-foreground px-2 py-1 rounded-full">
            {type === "series" ? "Série" : "Filme"}
          </span>
          {year && <span className="text-[10px] uppercase tracking-[0.3em] font-semibold bg-white/10 px-2 py-1 rounded-full">{year}</span>}
        </div>

        <div className="absolute bottom-4 left-4 right-4 z-20 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-black/70 px-2 py-1 rounded-full border border-white/10">
              <Star size={14} className="text-yellow-400" />
              <span className="text-xs font-bold">
                {rating != null ? rating.toFixed(1) : "--"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddToWatchlist}
              disabled={isAdding}
              className={cn(
                "rounded-full p-2 transition-all",
                isInList
                  ? "bg-emerald-500/90 hover:bg-emerald-500"
                  : "bg-white/10 hover:bg-white/20"
              )}
            >
              {isInList ? <X size={18} /> : <Bookmark size={18} />}
            </button>
          </div>
          <h3 className="text-base font-semibold line-clamp-2">{title}</h3>
          {description && <p className="text-[11px] text-muted-foreground line-clamp-3">{description}</p>}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold shadow-2xl shadow-primary/40">
            <Play size={16} />
            Assistir
          </div>
        </div>
      </div>
    </Link>
  );
}
