
"use client";

import { useState, useEffect } from "react";
import { Play, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { getImageUrl } from "@/lib/tmdb";

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
  
  // Seguindo exatamente o padrão solicitado pelo usuário
  const playerUrl = type === "movie" 
    ? `https://mgeb.top/embed/${tmdbId}`
    : `https://mgeb.top/embed/${tmdbId}/${season}/${episode}`;

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden group shadow-2xl shadow-primary/10 border border-white/5">
        {!isPlaying ? (
          <>
            <div className="absolute inset-0">
              <img
                src={getImageUrl(backdropPath || "", 'original')}
                alt={title}
                className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 p-6 text-center">
              <button 
                onClick={() => setIsPlaying(true)}
                className="group/play relative flex items-center justify-center w-24 h-24 bg-primary text-primary-foreground rounded-full shadow-2xl shadow-primary/40 hover:scale-110 transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
                <Play className="fill-primary-foreground ml-1" size={40} />
              </button>
              
              <div className="space-y-1">
                <h2 className="text-2xl font-headline font-bold text-white drop-shadow-md">
                  Pronto para assistir?
                </h2>
                <p className="text-muted-foreground text-sm font-medium">
                  {type === 'movie' ? 'Filme' : `Série • Temporada ${season}, Episódio ${episode}`}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-black relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Loader2 className="animate-spin text-primary/20" size={48} />
            </div>
            <iframe
              key={playerUrl}
              src={playerUrl}
              className="relative z-10 w-full h-full border-none"
              allowFullScreen
              // Removido o atributo sandbox para evitar a mensagem de "restrições estritas"
              // Adicionado referrerPolicy para garantir que o player receba o contexto necessário
              referrerPolicy="no-referrer"
              allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            />
          </div>
        )}

        <div className="absolute bottom-6 left-6 pointer-events-none z-20">
          <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[10px] font-bold tracking-widest text-primary uppercase">
            MegaEmbed Player • {type === 'movie' ? 'VOD' : `S${season}:E${episode}`}
          </div>
        </div>
      </div>

      {isPlaying && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/5">
            <AlertCircle size={10} className="text-secondary" />
            <span>Dica: Se o player não carregar, pode ser necessário desativar o bloqueador de anúncios ou proteção contra rastreamento.</span>
          </div>
          <a 
            href={playerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1 transition-all"
          >
            <ExternalLink size={12} />
            Abrir player em tela cheia (aba externa)
          </a>
        </div>
      )}
    </div>
  );
}
