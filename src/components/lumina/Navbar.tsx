"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Film, Tv, Bookmark, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { name: "Descobrir", href: "/", icon: Sparkles },
    { name: "Filmes", href: "/movies", icon: Film },
    { name: "Séries", href: "/series", icon: Tv },
    { name: "Minha Lista", href: "/watchlist", icon: Bookmark },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-primary/40">
            <span className="text-primary-foreground font-headline font-bold text-xl">L</span>
          </div>
          <span className="font-headline font-bold text-2xl tracking-tight hidden sm:block">
            LuminaStream
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isSearchOpen ? (
          <form onSubmit={handleSearch} className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="relative">
              <Input
                autoFocus
                type="text"
                placeholder="Buscar filmes ou séries..."
                className="w-48 md:w-64 h-10 rounded-full bg-white/5 border-white/10 pl-4 pr-10 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 bg-white/5 border border-white/10 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          >
            <Search size={20} />
          </button>
        )}
        
        <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden cursor-pointer hover:border-primary transition-colors">
          <img src="https://picsum.photos/seed/user/100/100" alt="Perfil" className="w-full h-full object-cover" />
        </div>
      </div>
    </nav>
  );
}
