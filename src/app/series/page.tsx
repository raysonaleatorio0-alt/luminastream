
import Navbar from "@/components/lumina/Navbar";
import MediaCard from "@/components/lumina/MediaCard";
import { getPopular, type Media } from "@/lib/tmdb";
import { Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function SeriesPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = parseInt(pageParam || "1");
  const data = await getPopular('tv', currentPage);
  const series: Media[] = data.results || [];
  const totalPages = data.total_pages || 1;

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
          <p className="text-xl text-muted-foreground">Explore todas as séries disponíveis no TMDB.</p>
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

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 pt-8">
          {currentPage > 1 && (
            <Link href={`/series?page=${currentPage - 1}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <ChevronLeft size={16} />
                Anterior
              </Button>
            </Link>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Página <span className="font-bold text-foreground">{currentPage}</span> de <span className="font-bold text-foreground">{totalPages}</span>
            </span>
          </div>

          {currentPage < totalPages && (
            <Link href={`/series?page=${currentPage + 1}`}>
              <Button variant="outline" size="sm" className="gap-2">
                Próxima
                <ChevronRight size={16} />
              </Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
