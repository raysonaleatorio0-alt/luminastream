"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, Maximize, Settings, SkipForward, SkipBack, Share2, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface OmniPlayerProps {
  title: string;
  sourceType?: string;
}

export default function OmniPlayer({ title, sourceType = "HLS Stream" }: OmniPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [volume, setVolume] = useState([80]);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = () => {
    setIsHovering(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsHovering(false), 3000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div 
      className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden group cursor-none"
      onMouseMove={handleMouseMove}
      style={{ cursor: isHovering ? 'default' : 'none' }}
    >
      {/* Fake Video Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/movie/1280/720')] bg-cover bg-center opacity-40 grayscale" />
        <div className="relative z-10 flex flex-col items-center gap-4 text-center animate-pulse">
           <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <Play className="fill-primary text-primary ml-1" size={32} />
           </div>
           <div className="space-y-1">
             <p className="text-sm font-bold tracking-widest text-primary uppercase">Omni-Player Buffering</p>
             <p className="text-xs text-muted-foreground uppercase tracking-widest">Manifesto Master .txt: {sourceType}</p>
           </div>
        </div>
      </div>

      {/* Controls Overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 flex flex-col justify-between p-6 transition-opacity duration-500",
        isHovering ? "opacity-100" : "opacity-0"
      )}>
        {/* Top Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 bg-primary rounded-lg text-xs font-bold text-primary-foreground">AO VIVO</div>
             <div>
               <h3 className="font-headline font-bold text-lg leading-none">{title}</h3>
               <p className="text-xs text-muted-foreground mt-1">Stream Universal • 4K ULTRA HD</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-2 hover:bg-white/10 rounded-xl transition-colors"><Share2 size={20} /></button>
             <button className="p-2 hover:bg-white/10 rounded-xl transition-colors"><Info size={20} /></button>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Slider 
              value={[progress]} 
              onValueChange={(v) => setProgress(v[0])} 
              max={100} 
              step={0.1}
              className="[&>.relative>.bg-primary]:bg-primary"
            />
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground tracking-widest">
              <span>24:15</span>
              <span>1:58:30</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button className="hover:text-primary transition-colors"><SkipBack size={24} /></button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
              >
                {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
              </button>
              <button className="hover:text-primary transition-colors"><SkipForward size={24} /></button>
              <div className="flex items-center gap-3 ml-4">
                <Volume2 size={20} />
                <div className="w-24">
                  <Slider value={volume} onValueChange={setVolume} max={100} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button className="hover:text-primary transition-colors flex items-center gap-2">
                <Settings size={20} />
                <span className="text-xs font-bold">1080p</span>
              </button>
              <button className="hover:text-primary transition-colors"><Maximize size={24} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
