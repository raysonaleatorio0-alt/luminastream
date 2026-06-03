const TMDB_API_KEY = '39613603847eace58c510bb0a4e43856';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export type Media = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: 'movie' | 'tv';
};

export async function getTrending(type: 'all' | 'movie' | 'tv' = 'all') {
  const res = await fetch(`${TMDB_BASE_URL}/trending/${type}/day?api_key=${TMDB_API_KEY}`);
  if (!res.ok) return { results: [] };
  return res.json();
}

export async function getMediaDetails(id: string | number, type: 'movie' | 'tv') {
  const res = await fetch(`${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,recommendations`);
  if (!res.ok) return null;
  return res.json();
}

export function getImageUrl(path: string, size: 'w500' | 'original' = 'w500') {
  if (!path) return 'https://picsum.photos/seed/placeholder/500/750';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}