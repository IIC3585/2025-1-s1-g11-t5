import React, { useState, useEffect } from 'react';
import { tmdbService } from '../../services/tmdb';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchMovies = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await tmdbService.searchMovies(query, 1);
        setResults(response.results.slice(0, 8)); // Limit to 8 results
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchMovies, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleMovieClick = (movie) => {
    // Navigate to movie detail page
    window.location.href = `/movies/${movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${movie.id}`;
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, actors, directors..."
          className="w-full px-6 py-4 pl-14 bg-vault-dark/80 border border-vault-light/30 rounded-xl text-vault-cream placeholder-vault-light/60 focus:outline-none focus:border-vault-light focus:bg-vault-dark transition-all duration-200"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-vault-light/30 border-t-vault-light rounded-full animate-spin"></div>
          ) : (
            <svg className="w-6 h-6 text-vault-light/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (results.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-vault-dark/95 border border-vault-light/20 rounded-xl shadow-vault-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="w-8 h-8 border-2 border-vault-light/30 border-t-vault-light rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-vault-light/80">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleMovieClick(movie)}
                  className="flex items-center gap-4 p-4 hover:bg-vault-medium/20 cursor-pointer transition-colors duration-200 border-b border-vault-light/10 last:border-b-0"
                >
                  <div className="w-12 h-16 flex-shrink-0">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-vault-medium/20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-vault-light/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-vault-cream font-semibold truncate">{movie.title}</h4>
                    <p className="text-vault-light/80 text-sm truncate">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                      {movie.vote_average && ` • ⭐ ${movie.vote_average.toFixed(1)}`}
                    </p>
                    {movie.overview && (
                      <p className="text-vault-light/60 text-xs mt-1 line-clamp-2">{movie.overview}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-vault-light/80">No movies found</p>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default SearchComponent; 