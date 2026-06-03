
"use client";

import { useState, useEffect } from "react";
import { Play, Loader2, ExternalLink } from "lucide-react";
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
  
  const playerUrl = type === "movie" 
    ? `https://mgeb.top/embed/${tmdbId}`
    : `https://mgeb.top/embed/${tmdbId}/${season}/${episode}`;

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden group shadow-2xl shadow-primary/10 border border-white/5">
        {!isPlaying ? (
          <>
            {/* Capa de Pré-carregamento */}
            <div className="absolute inset-0">
              <img
                src={getImageUrl(backdropPath || "", 'original')}
                alt={title}
                className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>
            
            {/* Botão de Play Central */}
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
          /* Player Real com sandbox ultra-permissivo */
          <div className="w-full h-full bg-black relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Loader2 className="animate-spin text-primary/20" size={48} />
            </div>
            <iframe
              src={playerUrl}
              className="relative z-10 w-full h-full border-none"
              allowFullScreen
              // O atributo sandbox abaixo é o mais permissivo possível para evitar a mensagem de "restrições estritas"
              sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation"
              allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            />
          </div>
        )}

        {/* Badge Inferior */}
        <div className="absolute bottom-6 left-6 pointer-events-none z-20">
          <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[10px] font-bold tracking-widest text-primary uppercase">
            MegaEmbed Player • {type === 'movie' ? 'VOD' : `S${season}:E${episode}`}
          </div>
        </div>
      </div>

      {/* Link de contingência se o player ainda falhar no ambiente de preview */}
      {isPlaying && (
        <div className="flex justify-center">
          <a 
            href={playerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
          >
            <ExternalLink size={12} />
            Problemas com o player interno? Abrir em nova aba
          </a>
        </div>
      )}
    </div>
  );
}
