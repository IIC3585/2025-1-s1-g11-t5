<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { tmdbService } from '../../services/tmdb';
  
  export let genres = [];
  
  const dispatch = createEventDispatcher();
  
  let isVisible = false;
  let searchQuery = '';
  let selectedGenres = [];
  let selectedYear = '';
  let minRating = '';
  let maxRating = '';
  let sortBy = 'popularity';
  let sortOrder = 'desc';
  let includeAdult = false;
  let searchResults = [];
  let isSearching = false;
  let currentPage = 1;
  let totalPages = 0;
  let totalResults = 0;
  let debounceTimer;
  
  // Generate year options (last 50 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);
  
  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'vote_average', label: 'Rating' },
    { value: 'release_date', label: 'Release Date' },
    { value: 'title', label: 'Title' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'vote_count', label: 'Vote Count' }
  ];
  
  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '9', label: '9+ Stars' },
    { value: '8', label: '8+ Stars' },
    { value: '7', label: '7+ Stars' },
    { value: '6', label: '6+ Stars' },
    { value: '5', label: '5+ Stars' }
  ];
  
  // Intersection Observer for client:visible
  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible = true;
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.querySelector('#advanced-search');
    if (element) {
      observer.observe(element);
    }
    
    return () => observer.disconnect();
  });
  
  async function performSearch(page = 1) {
    if (!isVisible) return;
    
    isSearching = true;
    currentPage = page;
    
    try {
      const params = new URLSearchParams();
      
      if (searchQuery.trim()) {
        params.append('query', searchQuery.trim());
      }
      
      if (selectedGenres.length > 0) {
        params.append('with_genres', selectedGenres.join(','));
      }
      
      if (selectedYear) {
        params.append('primary_release_year', selectedYear);
      }
      
      if (minRating) {
        params.append('vote_average.gte', minRating);
      }
      
      if (maxRating) {
        params.append('vote_average.lte', maxRating);
      }
      
      if (includeAdult) {
        params.append('include_adult', 'true');
      }
      
      params.append('sort_by', `${sortBy}.${sortOrder}`);
      params.append('page', page.toString());
      
      const response = await tmdbService.searchMovies(searchQuery, page, params);
      searchResults = response.results;
      totalPages = response.total_pages;
      totalResults = response.total_results;
      
      dispatch('results', { results: searchResults, total: totalResults });
    } catch (error) {
      console.error('Advanced search error:', error);
      searchResults = [];
      totalPages = 0;
      totalResults = 0;
    } finally {
      isSearching = false;
    }
  }
  
  function handleSearch() {
    performSearch(1);
  }
  
  function clearFilters() {
    searchQuery = '';
    selectedGenres = [];
    selectedYear = '';
    minRating = '';
    maxRating = '';
    sortBy = 'popularity';
    sortOrder = 'desc';
    includeAdult = false;
    searchResults = [];
    currentPage = 1;
    totalPages = 0;
    totalResults = 0;
    dispatch('cleared');
  }
  
  function toggleGenre(genreId) {
    const index = selectedGenres.indexOf(genreId);
    if (index > -1) {
      selectedGenres = selectedGenres.filter(id => id !== genreId);
    } else {
      selectedGenres = [...selectedGenres, genreId];
    }
  }
  
  function loadMore() {
    if (currentPage < totalPages) {
      performSearch(currentPage + 1);
    }
  }
  
  function handleMovieClick(movie) {
    window.location.href = `/movies/${movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${movie.id}`;
  }
  
  // Reactive statement for auto-search with debounce
  $: if (isVisible && (searchQuery || selectedGenres.length > 0 || selectedYear || minRating || maxRating)) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch(1);
    }, 500);
  }
</script>

<div id="advanced-search" class="bg-vault-dark/80 border border-vault-light/20 rounded-xl p-6">
  <div class="flex items-center justify-between mb-6">
    <h3 class="text-xl font-semibold text-vault-cream">Advanced Search</h3>
    <button
      on:click={clearFilters}
      class="text-vault-light/80 hover:text-vault-light text-sm font-medium transition-colors duration-200"
    >
      Clear All
    </button>
  </div>
  
  <!-- Search Form -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
    <!-- Search Query -->
    <div class="lg:col-span-2">
      <label class="block text-vault-light/80 text-sm font-medium mb-2">
        Search Query
      </label>
      <input
        bind:value={searchQuery}
        type="text"
        placeholder="Search movies, actors, directors..."
        class="w-full px-4 py-3 bg-vault-dark/60 border border-vault-light/30 rounded-lg text-vault-cream placeholder-vault-light/60 focus:outline-none focus:border-vault-light transition-colors duration-200"
      />
    </div>
    
    <!-- Year -->
    <div>
      <label class="block text-vault-light/80 text-sm font-medium mb-2">
        Release Year
      </label>
      <select
        bind:value={selectedYear}
        class="w-full px-4 py-3 bg-vault-dark/60 border border-vault-light/30 rounded-lg text-vault-cream focus:outline-none focus:border-vault-light transition-colors duration-200"
      >
        <option value="">Any Year</option>
        {#each yearOptions as year}
          <option value={year}>{year}</option>
        {/each}
      </select>
    </div>
  </div>
  
  <!-- Filters Row -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <!-- Min Rating -->
    <div>
      <label class="block text-vault-light/80 text-sm font-medium mb-2">
        Min Rating
      </label>
      <select
        bind:value={minRating}
        class="w-full px-4 py-3 bg-vault-dark/60 border border-vault-light/30 rounded-lg text-vault-cream focus:outline-none focus:border-vault-light transition-colors duration-200"
      >
        {#each ratingOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>
    
    <!-- Max Rating -->
    <div>
      <label class="block text-vault-light/80 text-sm font-medium mb-2">
        Max Rating
      </label>
      <select
        bind:value={maxRating}
        class="w-full px-4 py-3 bg-vault-dark/60 border border-vault-light/30 rounded-lg text-vault-cream focus:outline-none focus:border-vault-light transition-colors duration-200"
      >
        {#each ratingOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>
    
    <!-- Sort By -->
    <div>
      <label class="block text-vault-light/80 text-sm font-medium mb-2">
        Sort By
      </label>
      <select
        bind:value={sortBy}
        class="w-full px-4 py-3 bg-vault-dark/60 border border-vault-light/30 rounded-lg text-vault-cream focus:outline-none focus:border-vault-light transition-colors duration-200"
      >
        {#each sortOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>
    
    <!-- Sort Order -->
    <div>
      <label class="block text-vault-light/80 text-sm font-medium mb-2">
        Sort Order
      </label>
      <select
        bind:value={sortOrder}
        class="w-full px-4 py-3 bg-vault-dark/60 border border-vault-light/30 rounded-lg text-vault-cream focus:outline-none focus:border-vault-light transition-colors duration-200"
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  </div>
  
  <!-- Genres -->
  <div class="mb-6">
    <label class="block text-vault-light/80 text-sm font-medium mb-3">
      Genres ({selectedGenres.length} selected)
    </label>
    <div class="flex flex-wrap gap-2">
      {#each genres as genre}
        <button
          on:click={() => toggleGenre(genre.id)}
          class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 {selectedGenres.includes(genre.id) 
            ? 'bg-vault-medium text-vault-dark' 
            : 'bg-vault-dark/60 border border-vault-light/30 text-vault-light hover:border-vault-light/50'}"
        >
          {genre.name}
        </button>
      {/each}
    </div>
  </div>
  
  <!-- Additional Options -->
  <div class="mb-6">
    <label class="flex items-center gap-3 text-vault-light/80 text-sm">
      <input
        bind:checked={includeAdult}
        type="checkbox"
        class="w-4 h-4 text-vault-medium bg-vault-dark/60 border-vault-light/30 rounded focus:ring-vault-light focus:ring-2"
      />
      Include Adult Content
    </label>
  </div>
  
  <!-- Search Button -->
  <div class="flex justify-center mb-6">
    <button
      on:click={handleSearch}
      disabled={isSearching}
      class="px-8 py-3 bg-vault-medium hover:bg-vault-light text-vault-dark rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {#if isSearching}
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 border-2 border-vault-dark/30 border-t-vault-dark rounded-full animate-spin"></div>
          Searching...
        </div>
      {:else}
        Search Movies
      {/if}
    </button>
  </div>
  
  <!-- Results -->
  {#if searchResults.length > 0}
    <div class="border-t border-vault-light/10 pt-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-semibold text-vault-cream">
          Results ({totalResults.toLocaleString()} movies found)
        </h4>
        <span class="text-vault-light/60 text-sm">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      
      <!-- Results Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {#each searchResults as movie}
          <div
            on:click={() => handleMovieClick(movie)}
            class="bg-vault-dark/40 border border-vault-light/20 rounded-lg overflow-hidden cursor-pointer hover:border-vault-light/40 transition-all duration-200 hover:scale-105"
          >
            <div class="aspect-[2/3] relative">
              {#if movie.poster_path}
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  class="w-full h-full object-cover"
                />
              {:else}
                <div class="w-full h-full bg-vault-medium/20 flex items-center justify-center">
                  <svg class="w-12 h-12 text-vault-light/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              {/if}
              
              {#if movie.vote_average}
                <div class="absolute top-2 right-2 bg-vault-dark/90 text-vault-cream px-2 py-1 rounded-full text-xs font-semibold">
                  ⭐ {movie.vote_average.toFixed(1)}
                </div>
              {/if}
            </div>
            
            <div class="p-4">
              <h5 class="font-semibold text-vault-cream text-sm line-clamp-2 mb-1">
                {movie.title}
              </h5>
              <p class="text-vault-light/60 text-xs">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              </p>
            </div>
          </div>
        {/each}
      </div>
      
      <!-- Load More -->
      {#if currentPage < totalPages}
        <div class="text-center">
          <button
            on:click={loadMore}
            disabled={isSearching}
            class="px-6 py-3 bg-vault-dark/60 border border-vault-light/30 text-vault-light rounded-lg font-medium transition-all duration-200 hover:border-vault-light/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isSearching}
              Loading...
            {:else}
              Load More Results
            {/if}
          </button>
        </div>
      {/if}
    </div>
  {:else if isSearching}
    <div class="text-center py-12">
      <div class="w-12 h-12 border-4 border-vault-light/30 border-t-vault-light rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-vault-light/80">Searching for movies...</p>
    </div>
  {:else if totalResults === 0 && (searchQuery || selectedGenres.length > 0 || selectedYear || minRating || maxRating)}
    <div class="text-center py-12">
      <svg class="w-16 h-16 text-vault-light/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <p class="text-vault-light/80">No movies found matching your criteria</p>
      <p class="text-vault-light/60 text-sm mt-2">Try adjusting your search filters</p>
    </div>
  {/if}
</div>

<style>
  /* Custom checkbox styling */
  input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(148, 180, 193, 0.3);
    border-radius: 0.25rem;
    background-color: rgba(33, 52, 72, 0.6);
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
  }
  
  input[type="checkbox"]:checked {
    background-color: #547792;
    border-color: #547792;
  }
  
  input[type="checkbox"]:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #213448;
    font-size: 0.75rem;
    font-weight: bold;
  }
  
  input[type="checkbox"]:focus {
    outline: none;
    ring: 2px;
    ring-color: rgba(148, 180, 193, 0.5);
  }
</style> 