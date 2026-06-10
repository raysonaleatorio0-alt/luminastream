
"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Loader2, Maximize2, ExternalLink } from "lucide-react";
import { getImageUrl, getMediaDetails } from "@/lib/tmdb";
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
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // States for skip button logic
  const [episodeRuntimeSec, setEpisodeRuntimeSec] = useState<number | null>(null);
  const [startTs, setStartTs] = useState<number | null>(null);
  const [showSkip, setShowSkip] = useState(false);
  const [skipCountdown, setSkipCountdown] = useState<number>(0);
  const [seasonEpisodeCount, setSeasonEpisodeCount] = useState<number | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [embedResponded, setEmbedResponded] = useState(false);
  const [isStalled, setIsStalled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Reset player when episode or season changes
  useEffect(() => {
    setIsPlaying(false);
    setStartTs(null);
    setShowSkip(false);
    setSkipCountdown(0);
  }, [season, episode]);

  const playerUrl = type === "movie" 
    ? `https://mgeb.top/embed/${tmdbId}#color:purple`
    : `https://mgeb.top/embed/${tmdbId}/${season}/${episode}#color:purple`;

  const storageKey = `playpos:${type}:${tmdbId}:s${season}:e${episode}`;
  const showLoader = isPlaying && (!iframeLoaded || isStalled);

  // Fetch runtime and season info for TV shows
  useEffect(() => {
    let mountedFetch = true;
    async function loadDetails() {
      if (type === 'tv') {
        try {
          const data: any = await getMediaDetails(tmdbId, 'tv');
          if (!mountedFetch) return;
          const runMin = data?.episode_run_time && data.episode_run_time.length > 0 ? data.episode_run_time[0] : null;
          setEpisodeRuntimeSec(runMin ? runMin * 60 : 45 * 60); // fallback 45min
          const sObj = data?.seasons?.find((s: any) => s.season_number === season);
          setSeasonEpisodeCount(sObj?.episode_count || null);
        } catch (e) {
          setEpisodeRuntimeSec(45 * 60);
        }
      }
    }
    loadDetails();
    return () => { mountedFetch = false; };
  }, [tmdbId, type, season]);

  // Timer to show skip button based on assumed runtime and start timestamp
  useEffect(() => {
    if (!isPlaying || !episodeRuntimeSec || !startTs) return;
    let mountedTimer = true;
    const interval = setInterval(() => {
      if (!mountedTimer) return;
      const elapsed = (Date.now() - (startTs || 0)) / 1000;
      const remaining = (episodeRuntimeSec || 0) - elapsed;
      if (remaining <= 60) {
        setShowSkip(true);
        setSkipCountdown(Math.max(0, Math.ceil(remaining)));
      } else {
        setShowSkip(false);
      }
    }, 1000);

    return () => { mountedTimer = false; clearInterval(interval); };
  }, [isPlaying, episodeRuntimeSec, startTs]);

  // Try to restore saved position for native video
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (saved && videoRef.current) {
      const sec = Number(saved);
      if (!isNaN(sec) && sec > 0) {
        const setPos = () => {
          try { videoRef.current!.currentTime = sec; } catch (e) {}
        };
        videoRef.current.addEventListener('loadedmetadata', setPos, { once: true });
      }
    }

    // Listen for postMessage from embed that may report playback time
    function onMessage(e: MessageEvent) {
      try {
        const data = e.data || {};
        console.log('[OmniPlayer embed message]', e.origin, data);
        setEmbedResponded(true);
        if (data && typeof data.currentTime === 'number') {
          localStorage.setItem(storageKey, String(data.currentTime));
        }
      } catch (err) {
        // ignore
      }
    }

    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, [storageKey]);

  // Periodically request time from iframe (will only work if embed supports messaging)
  useEffect(() => {
    function saveNow() {
      try {
        if (videoRef.current) {
          localStorage.setItem(storageKey, String(videoRef.current.currentTime || 0));
        }
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'requestTime' }, '*');
        }
      } catch (e) {}
    }

    const interval = setInterval(() => {
      saveNow();
    }, 1000);

    function onVisibility() {
      if (document.visibilityState === 'hidden') saveNow();
    }

    window.addEventListener('beforeunload', saveNow);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', saveNow);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [storageKey]);

  useEffect(() => {
    if (!isPlaying || !iframeLoaded) return;
    // Keep embed stall detection logic active but do not display a reload prompt.
    if (embedResponded) return;
    const stallTimer = setTimeout(() => {
      // no UI action needed here
    }, 20000);
    return () => clearTimeout(stallTimer);
  }, [isPlaying, iframeLoaded, embedResponded]);

  return (
    <div className="space-y-6">
      <div className="relative aspect-video w-full bg-black rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-primary/20 border border-white/5">
        <div className="w-full h-full bg-black relative">
          {/* Iframe always mounted to avoid remounts that reset playback */}
          <iframe
            key={playerUrl}
            ref={iframeRef}
            src={playerUrl}
            onLoad={() => setIframeLoaded(true)}
            className={`absolute inset-0 w-full h-full border-none z-10 transition-opacity duration-300 ${isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            allowFullScreen
            mozAllowFullScreen
            webkitAllowFullScreen
            allow="autoplay *; fullscreen *; encrypted-media *; screen-wake-lock"
            referrerPolicy="no-referrer"
            scrolling="no"
          />


          {/* Poster + play button overlay (shown when not playing) */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
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
                onClick={() => { setIsPlaying(true); setStartTs(Date.now()); }}
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
          </div>

          {/* Loading spinner and skip overlay (shown above iframe) */}
          {showLoader && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <Loader2 className="animate-spin text-primary/40" size={48} />
            </div>
          )}

          {showSkip && (
            <div className="absolute top-4 right-4 z-30 pointer-events-auto">
              <button
                onClick={() => {
                  // compute next episode
                  let nextSeason = season;
                  let nextEpisode = episode + 1;
                  if (seasonEpisodeCount && nextEpisode > seasonEpisodeCount) {
                    nextSeason = season + 1;
                    nextEpisode = 1;
                  }
                  window.location.href = `/watch/tv/${tmdbId}?s=${nextSeason}&e=${nextEpisode}`;
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl shadow-lg"
              >
                Pular para próximo
                <span className="text-sm opacity-80">({skipCountdown}s)</span>
              </button>
            </div>
          )}
        </div>

        <div className="absolute bottom-6 left-6 pointer-events-none z-20">
          <div className="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
            Player MegaEmbed
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-card border border-white/5">
        <p className="text-xs text-muted-foreground font-medium text-center md:text-left">
          Se o player MegaEmbed mostrar erro de "Sandbox", é por causa das restrições do ambiente de visualização. <br className="hidden md:block" />
          Nesse caso, use o botão ao lado para assistir em uma aba limpa.
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
