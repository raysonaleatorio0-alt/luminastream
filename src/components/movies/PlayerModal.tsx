
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface PlayerModalProps {
  tmdbId: string | number;
  type: 'movie' | 'tv';
  title: string;
  season?: number;
  episode?: number;
  variant?: 'default' | 'outline' | 'ghost';
  children?: React.ReactNode;
}

export default function PlayerModal({ 
  tmdbId, 
  type, 
  title, 
  season = 1, 
  episode = 1,
  variant = 'default',
  children
}: PlayerModalProps) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const storageKey = `playpos:${type}:${tmdbId}:s${season}:e${episode}`;

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      try {
        const data = e.data || {};
        console.log('[PlayerModal embed message]', e.origin, data);
        if (data && typeof data.currentTime === 'number') {
          localStorage.setItem(storageKey, String(data.currentTime));
        }
      } catch (err) {}
    }

    function saveNow() {
      try {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'requestTime' }, '*');
        }
      } catch (e) {}
    }

    window.addEventListener('message', onMessage);
    const interval = setInterval(() => {
      saveNow();
    }, 2000);

    function onVisibility() {
      if (document.visibilityState === 'hidden') saveNow();
    }

    window.addEventListener('beforeunload', saveNow);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('message', onMessage);
      window.removeEventListener('beforeunload', saveNow);
      document.removeEventListener('visibilitychange', onVisibility);
      clearInterval(interval);
    };
  }, [storageKey]);

  const embedUrl = type === 'movie' 
    ? `https://mgeb.top/embed/${tmdbId}#color:purple`
    : `https://mgeb.top/embed/${tmdbId}/${season}/${episode}#color:purple`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button 
            size="sm" 
            variant={variant}
            className={variant === 'default' ? "bg-primary hover:bg-primary/90 rounded-full font-bold px-6 h-10 gap-2 shadow-lg" : "rounded-full font-bold h-10 gap-2"}
          >
            <Play size={16} fill="currentColor" /> Assistir
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-[95vw] h-[85vh] p-0 bg-black border-none overflow-hidden sm:rounded-2xl">
        <div className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Reproduzindo {title} {type === 'tv' ? `(T${season} E${episode})` : ''}
          </DialogDescription>
        </div>
        
        <div className="relative w-full h-full flex flex-col">
          <header className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/90 to-transparent flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-white text-sm font-black uppercase tracking-tight line-clamp-1">{title}</h2>
              {type === 'tv' && (
                <span className="text-primary text-[10px] font-bold">TEMPORADA {season} • EPISÓDIO {episode}</span>
              )}
            </div>
          </header>
          
          <div className="flex-1 w-full bg-black flex items-center justify-center">
            {open && (
              <iframe 
                ref={iframeRef}
                src={embedUrl}
                className="w-full h-full border-none"
                allowFullScreen
                mozAllowFullScreen
                webkitAllowFullScreen
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
