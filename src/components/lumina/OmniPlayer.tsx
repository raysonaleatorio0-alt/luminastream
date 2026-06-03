
"use client";

import { useState, useEffect } from "react";
import { Play, Loader2, ExternalLink, AlertCircle, Maximize2 } from "lucide-react";
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

  const handleOpenExternal = () => {
    window.open(playerUrl, '_blank', 'noopener,noreferrer');
  };

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
                  Pronto para o show?
                </h2>
                <p className="text-muted-foreground font-medium bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full inline-block">
                  {type === 'movie' ? 'Filme completo' : `Série • Temporada ${season}, Episódio ${episode}`}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-black relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
              <Loader2 className="animate-spin text-primary/40 mb-4" size={48} />
              <p className="text-muted-foreground text-sm">Carregando player...</p>
            </div>
            <iframe
              key={playerUrl}
              src={playerUrl}
              className="relative z-10 w-full h-full border-none"
              allowFullScreen
              referrerPolicy="no-referrer"
              allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            />
          </div>
        )}

        <div className="absolute bottom-6 left-6 pointer-events-none z-20">
          <div className="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
            MegaEmbed V3 • Estreia
          </div>
        </div>
      </div>

      {/* Opções de Resgate caso o Sandbox bloqueie */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-white/5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0 mt-1">
            <AlertCircle size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Problemas com o carregamento?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              Alguns navegadores bloqueiam o player por segurança (Sandbox). Se o vídeo não aparecer, use o botão ao lado para abrir em uma janela dedicada sem restrições.
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleOpenExternal}
          variant="secondary"
          className="w-full md:w-auto h-12 px-6 rounded-xl font-bold shadow-lg shadow-secondary/10 group"
        >
          <Maximize2 className="mr-2 group-hover:scale-110 transition-transform" size={18} />
          Abrir em Tela Cheia
          <ExternalLink className="ml-2 opacity-50" size={14} />
        </Button>
      </div>
    </div>
  );
}
