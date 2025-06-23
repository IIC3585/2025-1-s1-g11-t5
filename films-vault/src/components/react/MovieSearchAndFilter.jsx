import React, { useState, useEffect } from 'react';
import { tmdbService } from '../../services/tmdb';

const MovieSearchAndFilter = ({ genres = [], onSearchResults, onFiltersChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sortBy: 'popularity'
  });
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Search functionality
  useEffect(() => {
    const searchMovies = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await tmdbService.searchMovies(searchQuery, 1);
        const results = response.results.slice(0, 8);
        setSearchResults(results);
        setShowSearchResults(true);
        
        // Notify parent component
        if (onSearchResults) {
          onSearchResults(results);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchMovies, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearchResults]);

  // Filter functionality
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  const handleMovieClick = (movie) => {
    window.location.href = `/movies/${movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${movie.id}`;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      year: '',
      rating: '',
      sortBy: 'popularity'
    });
  };

  const hasActiveFilters = filters.genre || filters.year || filters.rating || filters.sortBy !== 'popularity';

  // Generate year options (last 30 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'rating', label: 'Rating' },
    { value: 'release_date', label: 'Release Date' },
    { value: 'title', label: 'Title' }
  ];

  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '9', label: '9+ Stars' },
    { value: '8', label: '8+ Stars' },
    { value: '7', label: '7+ Stars' },
    { value: '6', label: '6+ Stars' }
  ];

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-vault-dark/60 border border-vault-light/20 rounded-xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-vault-cream mb-2">Search Movies</h2>
          <p className="text-vault-light/80">Find your next favorite film by title, actor, or director</p>
        </div>
        
        <div className="relative w-full max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies, actors, directors..."
            className="w-full px-6 py-4 pl-14 bg-vault-dark/80 border border-vault-light/30 rounded-xl text-vault-cream placeholder-vault-light/60 focus:outline-none focus:border-vault-light focus:bg-vault-dark transition-all duration-200"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <div className="w-6 h-6 border-2 border-vault-light/30 border-t-vault-light rounded-full animate-spin"></div>
            ) : (
              <svg className="w-6 h-6 text-vault-light/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && (searchResults.length > 0 || isSearching) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-vault-dark/95 border border-vault-light/20 rounded-xl shadow-vault-lg z-50 max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="p-6 text-center">
                <div className="w-8 h-8 border-2 border-vault-light/30 border-t-vault-light rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-vault-light/80">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((movie) => (
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
      </div>

      {/* Filter Section */}
      <div className="bg-vault-dark/80 border border-vault-light/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-vault-cream">Advanced Filters</h3>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-vault-light/80 hover:text-vault-light text-sm font-medium transition-colors duration-200"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="flex items-center gap-2 text-vault-light hover:text-vault-cream transition-colors duration-200"
            >
              <span className="text-sm font-medium">
                {isFilterExpanded ? 'Hide' : 'Show'} Filters
              </span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isFilterExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.genre && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-vault-medium/20 text-vault-light rounded-full text-sm">
                Genre: {genres.find(g => g.id.toString() === filters.genre)?.name || filters.genre}
                <button
                  onClick={() => handleFilterChange('genre', '')}
                  className="ml-1 hover:text-vault-cream"
                >
                  ×
                </button>
              </span>
            )}
            {filters.year && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-vault-medium/20 text-vault-light rounded-full text-sm">
                Year: {filters.year}
                <button
                  onClick={() => handleFilterChange('year', '')}
                  className="ml-1 hover:text-vault-cream"
                >
                  ×
                </button>
              </span>
            )}
            {filters.rating && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-vault-medium/20 text-vault-light rounded-full text-sm">
                Rating: {filters.rating}+
                <button
                  onClick={() => handleFilterChange('rating', '')}
                  className="ml-1 hover:text-vault-cream"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Filter Controls */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-300 ${isFilterExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          {/* Genre Filter */}
          <div>
            <label className="block text-vault-light/80 text-sm font-medium mb-2">
              Genre
            </label>
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="w-full px-3 py-2 bg-vault-dark/60 border border-vault-light/30 rounded-lg text-vault-cream focus:outline-none focus:border-vault-light transition-colors duration-200"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-vault-light/80 text-sm font-medium mb-2">
              Year
            </label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full px-3 py-2 bg-vault-dark/60 border border-vault-light/30 rounded-lg text-vault-cream focus:outline-none focus:border-vault-light transition-colors duration-200"
            >
              <option value="">Any Year</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-vault-light/80 text-sm font-medium mb-2">
              Minimum Rating
            </label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="w-full px-3 py-2 bg-vault-dark/60 border border-vault-light/30 rounded-lg text-vault-cream focus:outline-none focus:border-vault-light transition-colors duration-200"
            >
              {ratingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-vault-light/80 text-sm font-medium mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 bg-vault-dark/60 border border-vault-light/30 rounded-lg text-vault-cream focus:outline-none focus:border-vault-light transition-colors duration-200"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`flex items-center justify-between pt-4 border-t border-vault-light/10 transition-all duration-300 ${isFilterExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleFilterChange('sortBy', 'rating')}
              className="text-vault-light/80 hover:text-vault-light text-sm font-medium transition-colors duration-200"
            >
              Top Rated
            </button>
            <button
              onClick={() => handleFilterChange('year', currentYear.toString())}
              className="text-vault-light/80 hover:text-vault-light text-sm font-medium transition-colors duration-200"
            >
              This Year
            </button>
            <button
              onClick={() => handleFilterChange('year', (currentYear - 1).toString())}
              className="text-vault-light/80 hover:text-vault-light text-sm font-medium transition-colors duration-200"
            >
              Last Year
            </button>
          </div>
          
          <div className="text-vault-light/60 text-sm">
            {hasActiveFilters ? 'Filters applied' : 'No filters active'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieSearchAndFilter; 