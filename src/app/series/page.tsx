
import Navbar from "@/components/lumina/Navbar";
import MediaCard from "@/components/lumina/MediaCard";
import { getTrending, type Media } from "@/lib/tmdb";
import { Tv } from "lucide-react";

export default async function SeriesPage() {
  const trendingData = await getTrending('tv');
  const series: Media[] = trendingData.results || [];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-32 px-6 md:px-12 pb-24 max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
               <Tv size={24} />
             </div>
             <h1 className="text-5xl font-headline font-bold">Séries</h1>
          </div>
          <p className="text-xl text-muted-foreground">As melhores séries e programas de TV para maratonar.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {series.map((item) => (
            <MediaCard
              key={item.id}
              id={item.id}
              title={item.title || item.name || ""}
              posterPath={item.poster_path}
              rating={item.vote_average}
              type="tv"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
