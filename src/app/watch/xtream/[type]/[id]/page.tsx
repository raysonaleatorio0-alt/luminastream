import Navbar from "@/components/lumina/Navbar";
import XtreamPlayer from "@/components/lumina/XtreamPlayer";
import { getXtreamVODs, getXtreamSeries, getXtreamStreamUrl } from "@/lib/xtream";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    type: "vod" | "series";
    id: string;
  }>;
}

export default async function XtreamWatchPage({ params }: PageProps) {
  const { type, id } = await params;
  const [vodData, seriesData] = await Promise.all([getXtreamVODs(), getXtreamSeries()]);

  const vodItem = Array.isArray(vodData)
    ? vodData.find((item: any) => String(item.stream_id) === id)
    : null;

  const seriesItem = Array.isArray(seriesData)
    ? seriesData.find((item: any) => String(item.series_id) === id)
    : null;

  const item = type === "series" ? seriesItem : vodItem;
  const streamUrl = type === "vod" ? getXtreamStreamUrl(id) : undefined;

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="rounded-3xl bg-card p-12 text-center shadow-lg shadow-black/10">
          <h1 className="text-2xl font-bold">Conteúdo não encontrado</h1>
          <p className="mt-3 text-muted-foreground">Verifique se o item ainda existe no catálogo Xtream.</p>
          <Link href="/">
            <Button className="mt-6">Voltar para a home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <Navbar showLogo={false} />

      <div className="pt-28 px-6 md:px-12 max-w-7xl mx-auto space-y-10">
        <div className="space-y-6">
          <XtreamPlayer
            title={item.name || item.title}
            posterPath={item.cover || item.stream_icon}
            streamUrl={streamUrl}
          />

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6 rounded-[2rem] bg-card border border-white/5 p-6 shadow-xl shadow-black/10">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    {type === "series" ? "Série Xtream" : "Filme Xtream"}
                  </span>
                  {item.year && <span className="text-xs text-muted-foreground">{item.year}</span>}
                  {item.genre && <span className="text-xs text-muted-foreground">{item.genre}</span>}
                </div>
                <h1 className="text-4xl font-headline font-bold">{item.name || item.title}</h1>
                <p className="text-sm leading-7 text-muted-foreground">{item.plot || item.description || "Descrição não disponível."}</p>
              </div>
            </div>

            <aside className="space-y-4 rounded-[2rem] bg-card border border-white/5 p-6 shadow-xl shadow-black/10">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Classificação</span>
                  <span>{item.rating_5based || item.rating || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Categoria</span>
                  <span>{type === "series" ? "Série" : "Filme"}</span>
                </div>
                {item.releaseDate && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Lançamento</span>
                    <span>{item.releaseDate}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/">
                  <Button className="w-full">← Voltar</Button>
                </Link>
                {streamUrl && (
                <a
                  href={streamUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full"
                >
                  <Button variant="secondary" className="w-full">
                    Abrir stream direto
                  </Button>
                </a>
              )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
