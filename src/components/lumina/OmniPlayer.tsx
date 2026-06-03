
"use client";

import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface OmniPlayerProps {
  tmdbId: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  title: string;
  backdropPath?: string;
}

export default function OmniPlayer({ tmdbId, type, season = 1, episode = 1, title, backdropPath }: OmniPlayerProps) {
  const playerUrl = type === "movie" 
    ? `https://mgeb.top/embed/${tmdbId}`
    : `https://mgeb.top/embed/${tmdbId}/${season}/${episode}`;

  return (
    <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden group shadow-2xl shadow-primary/10 border border-white/5">
      {/* Background Image / Placeholder */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(backdropPath || "", 'original')}
          alt={title}
          className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </div>
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 p-6 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-white drop-shadow-md">
            Pronto para assistir?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md">
            Clique no botão abaixo para abrir o player externo e começar sua experiência cinematográfica.
          </p>
        </div>

        <a 
          href={playerUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block"
        >
          <Button 
            size="lg" 
            className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-transform group/btn"
          >
            <Play className="mr-3 fill-primary-foreground" size={24} />
            Reproduzir no MegaEmbed
            <ExternalLink className="ml-3 opacity-50 group-hover/btn:opacity-100 transition-opacity" size={18} />
          </Button>
        </a>

        <div className="absolute bottom-6 left-6 pointer-events-none opacity-60">
          <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[10px] font-bold tracking-widest text-primary uppercase">
            MegaEmbed Player • {type === 'movie' ? 'VOD' : `S${season}:E${episode}`}
          </div>
        </div>
      </div>
    </div>
  );
}
