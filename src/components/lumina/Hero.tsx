"use client";

import { Play, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl, type Media } from "@/lib/tmdb";
import Link from "next/link";

interface HeroProps {
  movie: Media;
}

export default function Hero({ movie }: HeroProps) {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs font-bold text-primary tracking-widest uppercase">
              Trending Now
            </span>
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <span className="text-secondary font-bold">{movie.vote_average.toFixed(1)}</span> Rating
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-none">
            {movie.title || movie.name}
          </h1>
          
          <p className="text-lg text-muted-foreground/90 line-clamp-3 leading-relaxed max-w-xl">
            {movie.overview}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link href={`/watch/movie/${movie.id}`}>
              <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-transform group">
                <Play className="mr-2 fill-primary-foreground" size={20} />
                Watch Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 font-bold transition-all">
              <Plus className="mr-2" size={20} />
              Add to Queue
            </Button>
            <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10">
              <Info size={24} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}