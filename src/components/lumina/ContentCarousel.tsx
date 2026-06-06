"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MediaCard from "./MediaCard";
import XtreamCard from "./XtreamCard";
import { Media } from "@/lib/tmdb";

interface XtreamContentCarouselProps {
  title: string;
  description: string;
  items: any[];
  viewAllUrl?: string;
  type?: "xtream" | "media";
}

export default function ContentCarousel({
  title,
  description,
  items,
  viewAllUrl,
  type = "xtream",
}: XtreamContentCarouselProps) {
  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-headline font-bold">{title}</h2>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        {viewAllUrl && (
          <Link href={viewAllUrl} className="text-primary font-bold text-sm hover:underline underline-offset-4">
            Ver Tudo
          </Link>
        )}
      </div>

      <Carousel className="w-full">
        <CarouselContent className="-ml-4">
          {items.map((item, idx) => (
            <CarouselItem key={item.stream_id || item.id || idx} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
              {type === "xtream" ? (
                <XtreamCard
                  id={item.id}
                  title={item.title}
                  posterPath={item.posterPath}
                  rating={item.rating}
                  type={item.type}
                  description={item.description}
                  year={item.year}
                />
              ) : (
                <MediaCard
                  id={item.id}
                  title={item.title || item.name || ""}
                  posterPath={item.poster_path}
                  rating={item.vote_average}
                  type={item.media_type === 'tv' ? 'tv' : 'movie'}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}
