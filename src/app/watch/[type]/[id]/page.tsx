import { getMediaDetails, getImageUrl } from "@/lib/tmdb";
import Navbar from "@/components/lumina/Navbar";
import OmniPlayer from "@/components/lumina/OmniPlayer";
import MediaCard from "@/components/lumina/MediaCard";
import { Star, Calendar, Clock, Bookmark, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    type: "movie" | "tv";
    id: string;
  }>;
}

export default async function WatchPage({ params }: PageProps) {
  const { type, id } = await params;
  const data = await getMediaDetails(id, type);

  if (!data) return <div>Media not found</div>;

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
          <OmniPlayer title={title} sourceType={type === 'movie' ? 'VOD Master.txt' : 'EP Playlist'} />
          
          <div className="flex flex-col md:flex-row justify-between gap-8 py-6">
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="bg-primary/20 text-primary border-none font-bold uppercase tracking-wider px-3 py-1">
                  {type === 'movie' ? 'Feature Film' : 'TV Series'}
                </Badge>
                {data.genres?.map((g: any) => (
                  <Badge key={g.id} variant="outline" className="border-white/10 text-muted-foreground hover:bg-white/5 cursor-default">
                    {g.name}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-headline font-bold">{title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="text-secondary fill-secondary" />
                  <span className="text-foreground font-bold">{data.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  <span>{releaseYear}</span>
                </div>
                {runtime && (
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>{runtime} min</span>
                  </div>
                )}
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {data.overview}
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-64">
              <Button size="lg" className="w-full h-14 rounded-2xl bg-secondary text-secondary-foreground font-bold shadow-xl shadow-secondary/10 hover:scale-[1.02] transition-transform">
                <Bookmark className="mr-2" size={20} />
                Add to Watchlist
              </Button>
              <Button variant="outline" size="lg" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 font-bold hover:bg-white/10">
                <Share2 className="mr-2" size={20} />
                Share Title
              </Button>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cast */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-headline font-bold">Principal Cast</h3>
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
              <h4 className="font-headline font-bold text-lg">Production Info</h4>
              <div className="space-y-4 text-sm">
                 <div>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Status</p>
                    <p className="font-medium">{data.status}</p>
                 </div>
                 <div>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Budget</p>
                    <p className="font-medium">${(data.budget || 0).toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Language</p>
                    <p className="font-medium uppercase">{data.original_language}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-3xl font-headline font-bold">Similar Titles</h2>
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