import Navbar from "@/components/lumina/Navbar";
import MediaCard from "@/components/lumina/MediaCard";
import { searchMedia, type Media } from "@/lib/tmdb";
import { Search as SearchIcon } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query } = await searchParams;
  
  let results: Media[] = [];
  if (query) {
    const data = await searchMedia(query);
    results = data.results || [];
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-32 px-6 md:px-12 pb-24 max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
               <SearchIcon size={24} />
             </div>
             <h1 className="text-5xl font-headline font-bold">
               {query ? `Resultados para "${query}"` : "Pesquisar"}
             </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            {results.length > 0 
              ? `Encontramos ${results.length} resultados para sua busca.` 
              : query 
                ? "Nenhum resultado encontrado para sua pesquisa." 
                : "Digite algo na barra de busca para começar."}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((item) => (
              <MediaCard
                key={item.id}
                id={item.id}
                title={item.title || item.name || ""}
                posterPath={item.poster_path}
                rating={item.vote_average}
                type={item.media_type === 'tv' ? 'tv' : 'movie'}
              />
            ))}
          </div>
        ) : query ? (
          <div className="py-24 text-center space-y-4">
            <p className="text-muted-foreground">Tente buscar por termos mais genéricos ou verifique a ortografia.</p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
