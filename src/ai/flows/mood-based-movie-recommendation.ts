'use server';
/**
 * @fileOverview Um fluxo Genkit para recomendar filmes ou séries baseados no humor ou preferências do usuário.
 *
 * - moodBasedMovieRecommendation - Função que lida com o processo de recomendação baseado no humor.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TMDB_API_KEY = '39613603847eace58c510bb0a4e43856';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MoodBasedRecommendationInputSchema = z.object({
  moodDescription: z.string().describe("Uma descrição do humor atual do usuário ou preferências de conteúdo."),
});
export type MoodBasedMovieRecommendationInput = z.infer<typeof MoodBasedRecommendationInputSchema>;

const TmdbDetailsOutputSchema = z.object({
  title: z.string().describe('O título do filme ou série.'),
  type: z.enum(['movie', 'series']).describe('Se o conteúdo é um filme ou uma série.'),
  overview: z.string().describe('Uma breve sinopse ou visão geral do conteúdo.'),
  releaseDate: z.string().optional().describe('A data de lançamento para filmes.'),
  firstAirDate: z.string().optional().describe('A primeira data de exibição para séries.'),
  posterPath: z.string().optional().describe('O caminho para o poster no TMDB.'),
  voteAverage: z.number().describe('A média de votos do TMDB.'),
  id: z.number().describe('O ID do TMDB do conteúdo.'),
});

const MoodBasedMovieRecommendationOutputSchema = z.array(TmdbDetailsOutputSchema);
export type MoodBasedMovieRecommendationOutput = z.infer<typeof MoodBasedMovieRecommendationOutputSchema>;

const getTmdbDetails = ai.defineTool(
  {
    name: 'getTmdbDetails',
    description: 'Busca detalhes de filmes ou séries no TMDB com base no título e tipo.',
    inputSchema: z.object({
      query: z.string().describe('O título do filme ou série para buscar.'),
      type: z.enum(['movie', 'series']).describe('O tipo de conteúdo para buscar (filme ou série).'),
    }),
    outputSchema: TmdbDetailsOutputSchema.nullable(),
  },
  async ({ query, type }) => {
    const mediaType = type === 'movie' ? 'movie' : 'tv';
    const searchUrl = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`;

    try {
      const response = await fetch(searchUrl);
      if (!response.ok) {
        return null;
      }
      const data = await response.json();

      const result = data.results.find(
        (item: any) =>
          item.media_type === mediaType &&
          (item.title?.toLowerCase() === query.toLowerCase() || item.name?.toLowerCase() === query.toLowerCase())
      );

      if (result) {
        return {
          id: result.id,
          title: result.title || result.name,
          type: result.media_type === 'movie' ? 'movie' : 'series',
          overview: result.overview,
          releaseDate: result.release_date,
          firstAirDate: result.first_air_date,
          posterPath: result.poster_path ? `${TMDB_IMAGE_BASE_URL}${result.poster_path}` : undefined,
          voteAverage: result.vote_average,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }
);

const moodBasedRecommendationPrompt = ai.definePrompt({
  name: 'moodBasedRecommendationPrompt',
  input: { schema: MoodBasedRecommendationInputSchema },
  output: { schema: z.array(z.object({ title: z.string(), type: z.enum(['movie', 'series']) })) },
  prompt: `Com base no humor e nas preferências do usuário descritos como: "{{{moodDescription}}}", sugira uma lista de 3 a 5 filmes ou séries distintos que seriam uma boa opção.

Para cada sugestão, forneça apenas o título (em português se disponível) e especifique se é um 'movie' ou uma 'series'.

A saída deve ser um array JSON de objetos, onde cada objeto tem duas chaves: 'title' (string) e 'type' (string, 'movie' ou 'series').

Exemplo:
[
  {
    "title": "Um Sonho de Liberdade",
    "type": "movie"
  },
  {
    "title": "Band of Brothers",
    "type": "series"
  }
]`, 
});

export async function moodBasedMovieRecommendation(
  input: MoodBasedMovieRecommendationInput
): Promise<MoodBasedMovieRecommendationOutput> {
  return moodBasedMovieRecommendationFlow(input);
}

const moodBasedMovieRecommendationFlow = ai.defineFlow(
  {
    name: 'moodBasedMovieRecommendationFlow',
    inputSchema: MoodBasedRecommendationInputSchema,
    outputSchema: MoodBasedMovieRecommendationOutputSchema,
    tools: [getTmdbDetails],
  },
  async (input) => {
    const { output: rawSuggestions } = await moodBasedRecommendationPrompt(input);

    if (!rawSuggestions || rawSuggestions.length === 0) {
      return [];
    }

    const detailedSuggestions: MoodBasedMovieRecommendationOutput = [];
    for (const item of rawSuggestions) {
      const details = await getTmdbDetails({ query: item.title, type: item.type });
      if (details) {
        detailedSuggestions.push(details);
      }
    }
    return detailedSuggestions;
  }
);
