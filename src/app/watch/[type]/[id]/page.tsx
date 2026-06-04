
import { getMediaDetails, getImageUrl } from "@/lib/tmdb";
import Navbar from "@/components/lumina/Navbar";
import OmniPlayer from "@/components/lumina/OmniPlayer";
import MediaCard from "@/components/lumina/MediaCard";
import { WatchDetails } from "@/components/lumina/WatchDetails";
import { Star, Calendar, Clock, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    type: "movie" | "tv";
    id: string;
  }>;
  searchParams: Promise<{
    s?: string;
    e?: string;
  }>;
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  const { type, id } = await params;
  const { s, e } = await searchParams;
  
  const season = parseInt(s || "1");
  const episode = parseInt(e || "1");
  
  const data = await getMediaDetails(id, type);

  if (!data) return <div className="min-h-screen flex items-center justify-center">Conteúdo não encontrado</div>;

  const title = data.title || data.name;
  const releaseYear = (data.release_date || data.first_air_date || "").split("-")[0];
  const runtime = data.runtime || (data.episode_run_time ? data.episode_run_time[0] : null);
  const credits = data.credits?.cast?.slice(0, 6) || [];
  const recommendations = data.recommendations?.results?.slice(0, 5) || [];

  return (
    <div className="min-h-screen pb-24">
      <Navbar />

      <div className="pt-28 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        {/* Player Section */}
        <div className="space-y-6">
          <OmniPlayer 
            tmdbId={id} 
            type={type} 
            season={season} 
            episode={episode} 
            title={title} 
            backdropPath={data.backdrop_path}
          />
          
          <WatchDetails 
            id={id}
            type={type}
            season={season}
            episode={episode}
            data={data}
          />
        </div>

        {/* Episode/Season Selector if TV */}
        {type === 'tv' && data.seasons && (
          <section className="space-y-6">
            <h3 className="text-2xl font-headline font-bold">Temporadas</h3>
            <div className="flex flex-wrap gap-3">
              {data.seasons.map((s: any) => (
                <Link key={s.id} href={`/watch/tv/${id}?s=${s.season_number}&e=1`}>
                  <Button 
                    variant={season === s.season_number ? "default" : "outline"}
                    className={cn(
                      "rounded-xl font-bold",
                      season === s.season_number && "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    )}
                  >
                    T{s.season_number}
                  </Button>
                </Link>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: data.seasons.find((s: any) => s.season_number === season)?.episode_count || 0 }).map((_, idx) => {
                const epNum = idx + 1;
                return (
                  <Link key={idx} href={`/watch/tv/${id}?s=${season}&e=${epNum}`}>
                    <div className={cn(
                      "p-4 rounded-2xl border transition-all flex items-center justify-between group",
                      episode === epNum 
                        ? "bg-primary/10 border-primary text-primary" 
                        : "bg-card border-white/5 hover:border-white/20"
                    )}>
                      <span className="font-bold">Episódio {epNum}</span>
                      <Play size={16} className={cn(
                        "transition-transform group-hover:scale-125",
                        episode === epNum ? "fill-primary" : "text-muted-foreground"
                      )} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cast */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-headline font-bold">Elenco Principal</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {credits.map((person: any) => (
                <div key={person.id} className="group flex items-center gap-4 p-3 rounded-2xl bg-card border border-white/5 hover:border-primary/50 transition-colors">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    <img 
                      src={getImageUrl(person.profile_path)} 
                      alt={person.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-none">{person.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{person.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar / More Info */}
          <div className="space-y-8">
            <div className="p-6 rounded-3xl bg-card border border-white/5 space-y-4">
              <h4 className="font-headline font-bold text-lg">Produção</h4>
              <div className="space-y-4 text-sm">
                 <div>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Status</p>
                    <p className="font-medium">{data.status === 'Released' ? 'Lançado' : data.status}</p>
                 </div>
                 {data.budget > 0 && (
                   <div>
                      <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Orçamento</p>
                      <p className="font-medium">${(data.budget).toLocaleString()}</p>
                   </div>
                 )}
                 <div>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Idioma Original</p>
                    <p className="font-medium uppercase">{data.original_language}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-3xl font-headline font-bold">Títulos Semelhantes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {recommendations.map((item: any) => (
                <MediaCard
                  key={item.id}
                  id={item.id}
                  title={item.title || item.name || ""}
                  posterPath={item.poster_path}
                  rating={item.vote_average}
                  type={type}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
