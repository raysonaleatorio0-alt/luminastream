import Navbar from "@/components/lumina/Navbar";
import HeroCarousel from "@/components/lumina/HeroCarousel";
import ContentCarousel from "@/components/lumina/ContentCarousel";
import { getTrending, type Media } from "@/lib/tmdb";

export default async function Home() {
  const trendingData = await getTrending();
  const trending: Media[] = trendingData.results || [];
  
  const heroMovies = trending.slice(0, 5).filter(m => m.backdrop_path);

  const categories = [
    { title: "Filmes Mais Votados", type: "movie" as const },
    { title: "Séries em Alta", type: "tv" as const },
  ];

  return (
    <div className="min-h-screen">
      <Navbar showLogo={false} />
      
      {heroMovies.length > 0 && <HeroCarousel movies={heroMovies} />}
      
      <main className="px-6 md:px-12 py-24 space-y-20 max-w-7xl mx-auto">
        {categories.map((cat) => {
          const items = trending.filter(i => i.media_type === cat.type || !i.media_type).slice(1, 21);
          const browseUrl = cat.type === 'tv' ? '/browse/series' : '/browse/movies';
          return (
            <ContentCarousel
              key={cat.title}
              title={cat.title}
              description="Seleção escolhida a dedo do melhor conteúdo."
              items={items}
              viewAllUrl={browseUrl}
              type="media"
            />
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
