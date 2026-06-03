
"use client";

import { useState, useEffect } from "react";
import { Play, Loader2, Maximize2, ExternalLink } from "lucide-react";
import { getImageUrl } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";

interface OmniPlayerProps {
  tmdbId: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  title: string;
  backdropPath?: string;
}

export default function OmniPlayer({ tmdbId, type, season = 1, episode = 1, title, backdropPath }: OmniPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  const playerUrl = type === "movie" 
    ? `https://mgeb.top/embed/${tmdbId}`
    : `https://mgeb.top/embed/${tmdbId}/${season}/${episode}`;

  return (
    <div className="space-y-6">
      <div className="relative aspect-video w-full bg-black rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-primary/20 border border-white/5">
        {!isPlaying ? (
          <>
            <div className="absolute inset-0">
              <img
                src={getImageUrl(backdropPath || "", 'original')}
                alt={title}
                className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 p-6 text-center">
              <button 
                onClick={() => setIsPlaying(true)}
                className="group/play relative flex items-center justify-center w-28 h-28 bg-primary text-primary-foreground rounded-full shadow-2xl shadow-primary/40 hover:scale-110 transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
                <Play className="fill-primary-foreground ml-1" size={48} />
              </button>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-headline font-bold text-white drop-shadow-lg">
                  {title}
                </h2>
                <p className="text-muted-foreground font-medium bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full inline-block">
                  {type === 'movie' ? 'Filme Completo' : `Série • T${season} E${episode}`}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-black relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Loader2 className="animate-spin text-primary/40" size={48} />
            </div>
            <iframe
              src={playerUrl}
              className="absolute inset-0 w-full h-full border-none z-10"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            />
          </div>
        )}

        <div className="absolute bottom-6 left-6 pointer-events-none z-20">
          <div className="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
            Player Lumina v3
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-card border border-white/5">
        <p className="text-xs text-muted-foreground font-medium text-center md:text-left">
          Se o player acima mostrar erro de "Sandbox", é uma restrição do ambiente de visualização. <br className="hidden md:block" />
          Nesse caso, clique no botão ao lado para assistir sem bloqueios.
        </p>
        <Button 
          onClick={() => window.open(playerUrl, '_blank')}
          variant="secondary"
          className="h-12 px-6 rounded-xl font-bold shadow-lg shadow-secondary/10 shrink-0"
        >
          <Maximize2 className="mr-2" size={18} />
          Abrir em Nova Aba
          <ExternalLink className="ml-2 opacity-50" size={14} />
        </Button>
      </div>
    </div>
  );
}
