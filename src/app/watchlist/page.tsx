import Navbar from "@/components/lumina/Navbar";
import { Bookmark, Search } from "lucide-react";

export default function WatchlistPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-32 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
               <Bookmark size={24} />
             </div>
             <h1 className="text-5xl font-headline font-bold">Your Queue</h1>
          </div>
          <p className="text-xl text-muted-foreground">Keep track of movies and series you want to watch later.</p>
        </div>

        {/* Empty State placeholder - for a real app we'd fetch from localStorage or a DB */}
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/2">
           <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
              <Bookmark size={40} />
           </div>
           <div className="space-y-2">
             <h3 className="text-2xl font-headline font-bold">No titles added yet</h3>
             <p className="text-muted-foreground max-w-xs mx-auto">
               Start exploring our catalog and click the "Add to Queue" button on any movie or series.
             </p>
           </div>
           <button className="flex items-center gap-2 px-8 h-14 bg-primary text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
             <Search size={20} />
             Start Exploring
           </button>
        </div>
      </main>
    </div>
  );
}