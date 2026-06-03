'use server';
/**
 * @fileOverview A Genkit flow for recommending movies or series based on a user's mood or preferences.
 *
 * - moodBasedMovieRecommendation - A function that handles the mood-based recommendation process.
 * - MoodBasedMovieRecommendationInput - The input type for the moodBasedMovieRecommendation function.
 * - MoodBasedMovieRecommendationOutput - The return type for the moodBasedMovieRecommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TMDB_API_KEY = '39613603847eace58c510bb0a4e43856';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MoodBasedRecommendationInputSchema = z.object({
  moodDescription: z.string().describe("A description of the user's current mood or preferences for content."),
});
export type MoodBasedMovieRecommendationInput = z.infer<typeof MoodBasedRecommendationInputSchema>;

const TmdbDetailsOutputSchema = z.object({
  title: z.string().describe('The title of the movie or series.'),
  type: z.enum(['movie', 'series']).describe('Whether the content is a movie or a series.'),
  overview: z.string().describe('A brief synopsis or overview of the content.'),
  releaseDate: z.string().optional().describe('The release date for movies.'),
  firstAirDate: z.string().optional().describe('The first air date for series.'),
  posterPath: z.string().optional().describe('The path to the poster image on TMDB.'),
  voteAverage: z.number().describe('The average vote score from TMDB.'),
  id: z.number().describe('The TMDB ID of the content.'),
});

const MoodBasedMovieRecommendationOutputSchema = z.array(TmdbDetailsOutputSchema);
export type MoodBasedMovieRecommendationOutput = z.infer<typeof MoodBasedMovieRecommendationOutputSchema>;

const getTmdbDetails = ai.defineTool(
  {
    name: 'getTmdbDetails',
    description: 'Searches TMDB for movie or series details based on title and type.',
    inputSchema: z.object({
      query: z.string().describe('The title of the movie or series to search for.'),
      type: z.enum(['movie', 'series']).describe('The type of content to search for (movie or series).'),
    }),
    outputSchema: TmdbDetailsOutputSchema.nullable(),
  },
  async ({ query, type }) => {
    const mediaType = type === 'movie' ? 'movie' : 'tv';
    const searchUrl = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(searchUrl);
      if (!response.ok) {
        console.error(`TMDB search failed: ${response.statusText}`);
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
      console.error('Error fetching TMDB details:', error);
      return null;
    }
  }
);

const moodBasedRecommendationPrompt = ai.definePrompt({
  name: 'moodBasedRecommendationPrompt',
  input: { schema: MoodBasedRecommendationInputSchema },
  output: { schema: z.array(z.object({ title: z.string(), type: z.enum(['movie', 'series']) })) },
  prompt: `Based on the user's mood and preferences described as: "{{{moodDescription}}}", please suggest a list of 3-5 distinct movies or series that would be a good fit.

For each suggestion, provide only the title and specify whether it is a 'movie' or a 'series'.

The output should be a JSON array of objects, where each object has two keys: 'title' (string) and 'type' (string, either 'movie' or 'series').

Example:
[
  {
    "title": "The Shawshank Redemption",
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
    tools: [getTmdbDetails], // Register the tool to be available for use
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
