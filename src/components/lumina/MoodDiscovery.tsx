"use client";

import { useState } from "react";
import { Sparkles, Loader2, ArrowRight, Play } from "lucide-react";
import { moodBasedMovieRecommendation, type MoodBasedMovieRecommendationOutput } from "@/ai/flows/mood-based-movie-recommendation";
import MediaCard from "./MediaCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function MoodDiscovery() {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MoodBasedMovieRecommendationOutput>([]);

  const handleDiscovery = async () => {
    if (!mood.trim()) return;
    setLoading(true);
    try {
      const recommendations = await moodBasedMovieRecommendation({ moodDescription: mood });
      setResults(recommendations);
    } catch (error) {
      console.error("Discovery failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <Sparkles size={16} />
              <span className="text-sm font-bold tracking-tight uppercase">IA Discovery</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-headline font-bold leading-none">
              Como você está <br />
              <span className="text-primary">se sentindo</span> hoje?
            </h2>
            <p className="text-xl text-muted-foreground max-w-lg">
              Nossa ferramenta inteligente analisa seu humor para encontrar a combinação cinematográfica perfeita.
            </p>
          </div>

          <div className="relative group max-w-xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-focus-within:opacity-75 transition duration-1000"></div>
            <div className="relative bg-card border border-white/10 rounded-2xl p-4 space-y-4">
              <Textarea
                placeholder="Quero algo sombrio, atmosférico e que me faça pensar... talvez um thriller de ficção científica."
                className="bg-transparent border-none resize-none text-lg min-h-[120px] focus-visible:ring-0 p-0"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleDiscovery} 
                  disabled={loading || !mood.trim()}
                  className="rounded-xl px-6 h-12 bg-primary text-primary-foreground font-bold group shadow-xl shadow-primary/20"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Descobrir Conteúdos
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[400px] space-y-6">
          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {results.map((item) => (
                <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <MediaCard
                    id={item.id}
                    title={item.title}
                    posterPath={item.posterPath || ""}
                    rating={item.voteAverage}
                    type={item.type === 'movie' ? 'movie' : 'tv'}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-square rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-8 space-y-4 bg-white/2">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground">
                <Sparkles size={32} />
              </div>
              <div>
                <h4 className="font-headline font-bold text-lg">Aguardando Input</h4>
                <p className="text-sm text-muted-foreground">Conte-nos seu humor para gerar recomendações personalizadas.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
