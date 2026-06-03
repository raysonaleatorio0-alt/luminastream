"use client";

import { cn } from "@/lib/utils";

interface OmniPlayerProps {
  tmdbId: string;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
  title: string;
}

export default function OmniPlayer({ tmdbId, type, season = 1, episode = 1, title }: OmniPlayerProps) {
  const embedUrl = type === "movie" 
    ? `https://mgeb.top/embed/${tmdbId}`
    : `https://mgeb.top/embed/${tmdbId}/${season}/${episode}`;

  return (
    <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden group shadow-2xl shadow-primary/10 border border-white/5">
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        frameBorder="0"
        scrolling="no"
        title={`Assistir ${title}`}
        sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
        allow="autoplay; encrypted-media; picture-in-picture"
      />
      
      {/* Overlay discreto de carregamento/identificação */}
      <div className="absolute top-4 left-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[10px] font-bold tracking-widest text-primary uppercase">
          MegaEmbed Player • {type === 'movie' ? 'VOD' : `S${season}:E${episode}`}
        </div>
      </div>
    </div>
  );
}
