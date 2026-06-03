"use client";

import Link from "next/link";
import { Star, Play } from "lucide-react";
import { getImageUrl } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  id: number;
  title: string;
  posterPath: string;
  rating: number;
  type: "movie" | "tv";
  className?: string;
}

export default function MediaCard({ id, title, posterPath, rating, type, className }: MediaCardProps) {
  return (
    <Link
      href={`/watch/${type}/${id}`}
      className={cn("group relative block aspect-[2/3] overflow-hidden rounded-2xl bg-muted card-hover", className)}
    >
      <img
        src={getImageUrl(posterPath)}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-4 flex flex-col justify-end">
        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1 bg-primary px-2 py-0.5 rounded-lg">
              <Star size={12} className="fill-primary-foreground text-primary-foreground" />
              <span className="text-xs font-bold text-primary-foreground">{rating.toFixed(1)}</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground bg-white/10 px-2 py-0.5 rounded-lg border border-white/5">
              {type === 'movie' ? 'Movie' : 'Series'}
            </span>
          </div>
          <h3 className="font-headline font-bold text-lg line-clamp-2 leading-tight">
            {title}
          </h3>
          <div className="mt-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={18} className="fill-primary-foreground text-primary-foreground ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}