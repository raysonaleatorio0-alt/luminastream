import Navbar from "@/components/lumina/Navbar";
import HeroCarousel from "@/components/lumina/HeroCarousel";
import MediaCard from "@/components/lumina/MediaCard";
import { getTrending, type Media } from "@/lib/tmdb";
import Link from "next/link";

export default async function Home() {
  const trendingData = await getTrending();
  const trending: Media[] = trendingData.results || [];
  
  // Pega os primeiros 5 para o carrossel do banner
  const heroMovies = trending.slice(0, 5).filter(m => m.backdrop_path);

  const categories = [
    { title: "Filmes Mais Votados", type: "movie" as const },
    { title: "Séries em Alta", type: "tv" as const },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {heroMovies.length > 0 && <HeroCarousel movies={heroMovies} />}
      
      <main className="px-6 md:px-12 py-24 space-y-20 max-w-7xl mx-auto">
        {categories.map((cat) => {
          const items = trending.filter(i => i.media_type === cat.type || !i.media_type).slice(1, 11);
          const browseUrl = cat.type === 'tv' ? '/browse/series' : '/browse/movies';
          return (
            <section key={cat.title} className="space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-headline font-bold">{cat.title}</h2>
                  <p className="text-muted-foreground mt-2">Seleção escolhida a dedo do melhor conteúdo.</p>
                </div>
                <Link href={browseUrl} className="text-primary font-bold text-sm hover:underline underline-offset-4">
                  Ver Tudo
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {items.map((item) => (
                  <MediaCard
                    key={item.id}
                    id={item.id}
                    title={item.title || item.name || ""}
                    posterPath={item.poster_path}
                    rating={item.vote_average}
                    type={cat.type === 'tv' ? 'tv' : 'movie'}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <footer className="border-t border-white/5 py-12 px-6 bg-card/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">L</span>
            </div>
            <span className="font-headline font-bold text-xl">LuminaStream</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground font-medium">
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Termos</a>
            <a href="#" className="hover:text-primary transition-colors">Suporte</a>
            <a href="#" className="hover:text-primary transition-colors">Contato</a>
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            © 2024 LuminaStream. Sinta a magia do cinema.
          </p>
        </div>
      </footer>
    </div>
  );
}
