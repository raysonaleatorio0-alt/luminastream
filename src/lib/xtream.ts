
/**
 * @fileOverview Serviço de integração com a API Xtream Codes.
 */

const BASE_URL = 'https://mgeb.top';
const USERNAME = 'rsnvo090';
const PASSWORD = 'raysonvo246@';

export interface XtreamVOD {
  num: number;
  name: string;
  stream_id: number;
  stream_icon: string;
  rating: string;
  rating_5: number;
  added: string;
  category_id: string;
  container_extension: string;
  direct_source: string;
}

export interface XtreamCategory {
  category_id: string;
  category_name: string;
  parent_id: number;
}

async function fetchXtream(action: string, params: Record<string, string> = {}) {
  const query = new URLSearchParams({
    username: USERNAME,
    password: PASSWORD,
    action,
    ...params
  });

  try {
    const res = await fetch(`${BASE_URL}/player_api.php?${query.toString()}`, {
      next: { revalidate: 3600 } // Cache por 1 hora
    });
    if (!res.ok) throw new Error('Xtream API request failed');
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Xtream Error:', error);
    return null;
  }
}

export async function getXtreamCategories() {
  const data = await fetchXtream('get_vod_categories');
  return Array.isArray(data) ? data : [];
}

export async function getXtreamVODs(categoryId?: string) {
  const params = categoryId ? { category_id: categoryId } : {};
  const data = await fetchXtream('get_vod_streams', params);
  // Importante: retornamos o dado bruto para que a Home possa detectar se é um erro (objeto) ou lista (array)
  return data;
}

export function getXtreamStreamUrl(streamId: number | string, extension: string = 'mp4') {
  return `${BASE_URL}/movie/${USERNAME}/${encodeURIComponent(PASSWORD)}/${streamId}.${extension}`;
}

export async function getXtreamSeries() {
  const data = await fetchXtream('get_series');
  return Array.isArray(data) ? data : [];
}
