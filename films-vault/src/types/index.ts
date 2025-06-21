export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  runtime?: number;
  budget?: number;
  revenue?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface UserRating {
  movieId: number;
  rating: number;
  timestamp: string;
}

export interface WatchlistItem {
  movieId: number;
  addedAt: string;
} 