"use client";

import { useState } from "react";
import { Play, Loader2, Maximize2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface XtreamPlayerProps {
  title: string;
  posterPath?: string;
  streamUrl?: string;
}

export default function XtreamPlayer({ title, posterPath, streamUrl }: XtreamPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-6">
      <div className="relative aspect-video w-full bg-black rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-primary/20 border border-white/5">
        {!isPlaying ? (
          <>
            <div className="absolute inset-0">
              <img
                src={posterPath || `https://placehold.co/1280x720/171414/ffffff?text=${encodeURIComponent(title)}`}
                alt={title}
                className="w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center px-6">
              <button
                onClick={() => setIsPlaying(true)}
                className="relative flex items-center justify-center w-28 h-28 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 hover:scale-110 transition-transform duration-300"
              >
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                <Play size={48} className="fill-primary-foreground ml-1" />
              </button>
              <div className="space-y-2">
                <h2 className="text-3xl font-headline font-bold text-white drop-shadow-lg">{title}</h2>
                <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                  {streamUrl
                    ? "Clique em reproduzir para assistir no player do Xtream."
                    : "Este conteúdo ainda não possui stream direto configurado."}
                </p>
              </div>
            </div>
          </>
        ) : streamUrl ? (
          <div className="absolute inset-0 bg-black">
            <video
              controls
              autoPlay
              src={streamUrl}
              className="w-full h-full object-cover"
              controlsList="nodownload"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <div className="rounded-3xl bg-black/80 p-8 text-white">
              <p className="text-lg font-semibold">Stream não disponível</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Ainda não foi possível carregar o conteúdo direto para esta série.
              </p>
            </div>
          </div>
        )}

        <div className="absolute bottom-6 left-6 pointer-events-none z-20">
          <div className="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
            Player Xtream
          </div>
        </div>
      </div>

      {streamUrl && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-3xl bg-card border border-white/5">
          <p className="text-xs text-muted-foreground font-medium">
            Caso o player esteja bloqueado, abra em nova aba para assistir em tela cheia.
          </p>
          <Button
            variant="secondary"
            className="h-12 px-6 rounded-xl font-bold shadow-lg shadow-secondary/10"
            onClick={() => window.open(streamUrl, "_blank")}
          >
            <Maximize2 className="mr-2" size={18} />
            Abrir em Nova Aba
            <ExternalLink className="ml-2 opacity-50" size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}
