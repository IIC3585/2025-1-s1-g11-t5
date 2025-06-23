import React, { useState, useEffect } from 'react';

const FilterBar = ({ onFiltersChange, genres = [] }) => {
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sortBy: 'popularity'
  });
  const [isExpanded, setIsExpanded] = useState(false);

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

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

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

  return (
    <div className="bg-vault-dark/80 border border-vault-light/20 rounded-xl p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-vault-cream">Filters</h3>
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
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-vault-light hover:text-vault-cream transition-colors duration-200"
          >
            <span className="text-sm font-medium">
              {isExpanded ? 'Hide' : 'Show'} Filters
            </span>
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
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
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
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
      <div className={`flex items-center justify-between pt-4 border-t border-vault-light/10 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
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
  );
};

export default FilterBar; 