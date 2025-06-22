// src/content/config.ts - Astro v5.0 Content Layer API
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const movieCollection = defineCollection({
  loader: glob({ 
    pattern: '*.json', 
    base: './src/content/movies' 
  }),
  schema: z.object({
    id: z.number(),
    title: z.string(),
    originalTitle: z.string(),
    overview: z.string(),
    posterPath: z.string().nullable(),
    backdropPath: z.string().nullable(),
    releaseDate: z.string(),
    voteAverage: z.number(),
    voteCount: z.number(),
    runtime: z.number().nullable(),
    budget: z.number(),
    revenue: z.number(),
    genres: z.array(z.object({
      id: z.number(),
      name: z.string()
    })),
    credits: z.object({
      cast: z.array(z.object({
        id: z.number(),
        name: z.string(),
        character: z.string(),
        profilePath: z.string().nullable().optional(),
        order: z.number()
      })),
      crew: z.array(z.object({
        id: z.number(),
        name: z.string(),
        job: z.string(),
        department: z.string(),
        profilePath: z.string().nullable().optional()
      }))
    }).optional(),
    popularity: z.number(),
    status: z.string(),
    tagline: z.string().nullable(),
    homepage: z.string().nullable(),
    imdbId: z.string().nullable()
  })
});

const genreCollection = defineCollection({
  loader: glob({ 
    pattern: '*.json', 
    base: './src/content/genres' 
  }),
  schema: z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    movieCount: z.number().optional()
  })
});

export const collections = {
  movies: movieCollection,
  genres: genreCollection
};