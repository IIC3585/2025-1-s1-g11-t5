import type { 
  TMDBMovie, 
  TMDBMovieDetails, 
  TMDBResponse, 
  TMDBGenre,
  TMDBCredits 
} from '../types/tmdb';

const API_KEY = import.meta.env.TMDB_API_KEY || 'fd559a92d9d1ee4498d567a7649b6f32';
const BASE_URL = 'https://api.themoviedb.org/3';

class TMDBService {
  private async fetch<T>(endpoint: string): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const separator = endpoint.includes('?') ? '&' : '?';
    const fullUrl = `${url}${separator}api_key=${API_KEY}`;
    
    try {
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('TMDB Service Error:', error);
      throw error;
    }
  }

  // Get popular movies
  async getPopularMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetch<TMDBResponse<TMDBMovie>>(`/movie/popular?page=${page}`);
  }

  // Get top rated movies
  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetch<TMDBResponse<TMDBMovie>>(`/movie/top_rated?page=${page}`);
  }

  // Get now playing movies
  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetch<TMDBResponse<TMDBMovie>>(`/movie/now_playing?page=${page}`);
  }

  // Get upcoming movies
  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetch<TMDBResponse<TMDBMovie>>(`/movie/upcoming?page=${page}`);
  }

  // Get movie details
  async getMovieDetails(id: number): Promise<TMDBMovieDetails> {
    return this.fetch<TMDBMovieDetails>(`/movie/${id}`);
  }

  // Get movie credits
  async getMovieCredits(id: number): Promise<TMDBCredits> {
    return this.fetch<TMDBCredits>(`/movie/${id}/credits`);
  }

  // Get genres
  async getGenres(): Promise<{ genres: TMDBGenre[] }> {
    return this.fetch<{ genres: TMDBGenre[] }>('/genre/movie/list');
  }

  // Search movies
  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetch<TMDBResponse<TMDBMovie>>(`/search/movie?query=${encodedQuery}&page=${page}`);
  }

  // Get movies by genre
  async getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetch<TMDBResponse<TMDBMovie>>(`/discover/movie?with_genres=${genreId}&page=${page}`);
  }

  // Advanced search with filters (discover endpoint)
  async discoverMovies(params: {
    query?: string;
    page?: number;
    with_genres?: string;
    primary_release_year?: string;
    'vote_average.gte'?: string;
    'vote_average.lte'?: string;
    sort_by?: string;
    include_adult?: string;
  }): Promise<TMDBResponse<TMDBMovie>> {
    const { query, ...discoverParams } = params;
    
    if (query && query.trim()) {
      // Use search endpoint if there's a text query
      const searchParams = new URLSearchParams({
        query: query.trim(),
        page: params.page?.toString() || '1'
      });
      return this.fetch<TMDBResponse<TMDBMovie>>(`/search/movie?${searchParams.toString()}`);
    } else {
      // Use discover endpoint for filtered browsing
      const queryParams = new URLSearchParams();
      
      Object.entries(discoverParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      return this.fetch<TMDBResponse<TMDBMovie>>(`/discover/movie?${queryParams.toString()}`);
    }
  }

}

export const tmdbService = new TMDBService(); 