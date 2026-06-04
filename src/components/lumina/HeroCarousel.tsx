"use client";

import { Play, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl, type Media } from "@/lib/tmdb";
import Link from "next/link";
import { useState, useEffect } from "react";

interface HeroCarouselProps {
  movies: Media[];
}

export default function HeroCarousel({ movies }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const movie = movies[currentIndex];

  useEffect(() => {
    if (!isAutoPlay || movies.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000); // Troca a cada 6 segundos

    return () => clearInterval(timer);
  }, [isAutoPlay, movies.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlay(false);
    // Volta ao autoplay depois de 10 segundos de inatividade
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  if (!movie) return null;

  return (
    <section className="relative h-[90vh] w-full overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          key={movie.id}
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover transition-all duration-1000 animate-in fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs font-bold text-primary tracking-widest uppercase">
              Em Alta Hoje
            </span>
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              Avaliação <span className="text-secondary font-bold">{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-none">
            {movie.title || movie.name}
          </h1>
          
          <p className="text-lg text-muted-foreground/90 line-clamp-3 leading-relaxed max-w-xl">
            {movie.overview}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link href={`/watch/${movie.media_type || 'movie'}/${movie.id}`}>
              <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-transform group">
                <Play className="mr-2 fill-primary-foreground" size={20} />
                Assistir Agora
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 font-bold transition-all">
              <Plus className="mr-2" size={20} />
              Adicionar à Lista
            </Button>
            <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10">
              <Info size={24} />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {movies.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
          >
            ←
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
          >
            →
          </button>
        </>
      )}

      {/* Indicators */}
      {movies.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          {movies.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-white/40 w-2 hover:bg-white/60'
              }`}
            />
          ))}
          {movies.length > 5 && (
            <span className="text-xs text-white/40 ml-2">+{movies.length - 5}</span>
          )}
        </div>
      )}
    </section>
  );
}
