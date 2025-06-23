<script>
    import { onMount } from 'svelte';
    
    let watchlists = [];
    let selectedWatchlist = null;
    let isLoading = true;
    let searchQuery = '';
    let sortBy = 'addedAt'; // addedAt, title, year
    let sortOrder = 'desc'; // asc, desc
    
    onMount(() => {
      loadWatchlists();
    });
    
    function loadWatchlists() {
      try {
        const stored = localStorage.getItem('filmVaultWatchlists');
        watchlists = stored ? JSON.parse(stored) : [
          { id: 'default', name: 'My Watchlist', movies: [] },
          { id: 'favorites', name: 'Favorites', movies: [] }
        ];
        
        // Select first non-empty watchlist or default
        const nonEmptyWatchlist = watchlists.find(w => w.movies.length > 0);
        selectedWatchlist = nonEmptyWatchlist || watchlists[0];
      } catch (error) {
        console.error('Error loading watchlists:', error);
        watchlists = [
          { id: 'default', name: 'My Watchlist', movies: [] },
          { id: 'favorites', name: 'Favorites', movies: [] }
        ];
        selectedWatchlist = watchlists[0];
      } finally {
        isLoading = false;
      }
    }
    
    function saveWatchlists() {
      try {
        localStorage.setItem('filmVaultWatchlists', JSON.stringify(watchlists));
      } catch (error) {
        console.error('Error saving watchlists:', error);
      }
    }
    
    function removeMovieFromWatchlist(watchlistId, movieId) {
      const watchlist = watchlists.find(w => w.id === watchlistId);
      if (watchlist) {
        watchlist.movies = watchlist.movies.filter(m => m.id !== movieId);
        saveWatchlists();
        watchlists = [...watchlists]; // Trigger reactivity
      }
    }
    
    function handleMovieClick(movie) {
      // Navigate to movie page
      const movieSlug = movie.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      window.location.href = `/movies/${movieSlug}-${movie.id}`;
    }
    
    function clearWatchlist(watchlistId) {
      const watchlist = watchlists.find(w => w.id === watchlistId);
      if (watchlist && confirm(`Are you sure you want to clear all movies from "${watchlist.name}"?`)) {
        watchlist.movies = [];
        saveWatchlists();
        watchlists = [...watchlists]; // Trigger reactivity
      }
    }
    
    function exportWatchlist(watchlistId) {
      const watchlist = watchlists.find(w => w.id === watchlistId);
      if (watchlist) {
        const dataStr = JSON.stringify(watchlist, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${watchlist.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_watchlist.json`;
        link.click();
        URL.revokeObjectURL(url);
      }
    }
    
    // Computed properties
    $: filteredMovies = selectedWatchlist?.movies?.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
    
    $: sortedMovies = [...filteredMovies].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'year':
          const yearA = a.year || 0;
          const yearB = b.year || 0;
          comparison = yearA - yearB;
          break;
        case 'addedAt':
        default:
          comparison = new Date(a.addedAt) - new Date(b.addedAt);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    $: totalMovies = watchlists.reduce((total, w) => total + w.movies.length, 0);
  </script>
  
  {#if isLoading}
    <div class="text-center py-12">
      <div class="w-12 h-12 border-4 border-vault-light/30 border-t-vault-light rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-vault-light/80">Loading your watchlists...</p>
    </div>
  {:else}
    <div class="bg-vault-dark/90 border border-vault-light/20 rounded-xl overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-vault-light/10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-vault-cream mb-2">Watchlist Collection</h2>
            <p class="text-vault-light/80">
              {totalMovies} movies across {watchlists.length} watchlists
            </p>
          </div>
          
          <!-- Watchlist Selector -->
          <div class="flex items-center gap-3">
            <select
              bind:value={selectedWatchlist}
              class="px-4 py-2 bg-vault-dark border border-vault-light/30 rounded-lg text-vault-cream focus:outline-none focus:border-vault-light transition-colors duration-200"
            >
              {#each watchlists as watchlist}
                <option value={watchlist}>
                  {watchlist.name} ({watchlist.movies.length})
                </option>
              {/each}
            </select>
          </div>
        </div>
      </div>
      
      {#if selectedWatchlist && selectedWatchlist.movies.length > 0}
        <!-- Controls -->
        <div class="p-6 border-b border-vault-light/10">
          <div class="flex flex-col md:flex-row gap-4">
            <!-- Search -->
            <div class="flex-1">
              <input
                bind:value={searchQuery}
                type="text"
                placeholder="Search movies in this watchlist..."
                class="w-full px-4 py-2 bg-vault-dark border border-vault-light/30 rounded-lg text-vault-cream placeholder-vault-light/60 focus:outline-none focus:border-vault-light transition-colors duration-200"
              />
            </div>
            
            <!-- Sort Controls -->
            <div class="flex gap-2">
              <select
                bind:value={sortBy}
                class="px-3 py-2 bg-vault-dark border border-vault-light/30 rounded-lg text-vault-cream focus:outline-none focus:border-vault-light transition-colors duration-200"
              >
                <option value="addedAt">Date Added</option>
                <option value="title">Title</option>
                <option value="year">Year</option>
              </select>
              
              <button
                on:click={() => sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'}
                class="px-3 py-2 bg-vault-dark border border-vault-light/30 rounded-lg text-vault-light hover:text-vault-cream transition-colors duration-200"
                title="Toggle sort order"
              >
                {#if sortOrder === 'desc'}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                {:else}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  </svg>
                {/if}
              </button>
            </div>
          </div>
          
          <!-- Watchlist Actions -->
          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center gap-2 text-vault-light/60 text-sm">
              <span>Showing {sortedMovies.length} of {selectedWatchlist.movies.length} movies</span>
            </div>
            
            <div class="flex items-center gap-2">
              <button
                on:click={() => exportWatchlist(selectedWatchlist.id)}
                class="px-3 py-1 text-vault-light hover:text-vault-cream transition-colors duration-200 text-sm font-medium"
                title="Export watchlist"
              >
                Export
              </button>
              <button
                on:click={() => clearWatchlist(selectedWatchlist.id)}
                class="px-3 py-1 text-red-400 hover:text-red-300 transition-colors duration-200 text-sm font-medium"
                title="Clear watchlist"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
        
        <!-- Movies Grid -->
        <div class="p-6">
          {#if sortedMovies.length > 0}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {#each sortedMovies as movie}
                <div class="bg-vault-dark/60 border border-vault-light/20 rounded-lg overflow-hidden group hover:border-vault-light/40 transition-all duration-200 hover:scale-105">
                  <div class="relative">
                    <!-- Movie Poster -->
                    <div class="aspect-[2/3] relative">
                      {#if movie.poster}
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                          alt={movie.title}
                          class="w-full h-full object-cover cursor-pointer"
                          on:click={() => handleMovieClick(movie)}
                          loading="lazy"
                        />
                      {:else}
                        <div class="w-full h-full bg-vault-medium/20 flex items-center justify-center cursor-pointer"
                             on:click={() => handleMovieClick(movie)}>
                          <svg class="w-12 h-12 text-vault-light/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      {/if}
                      
                      <!-- Remove Button -->
                      <button
                        on:click={() => removeMovieFromWatchlist(selectedWatchlist.id, movie.id)}
                        class="absolute top-2 right-2 w-8 h-8 bg-red-600/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                        title="Remove from watchlist"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <!-- Movie Info -->
                    <div class="p-4">
                      <h3 class="font-semibold text-vault-cream text-sm line-clamp-2 mb-2 cursor-pointer hover:text-vault-light transition-colors"
                          on:click={() => handleMovieClick(movie)}>
                        {movie.title}
                      </h3>
                      
                      <div class="flex items-center justify-between text-xs text-vault-light/60">
                        <span>{movie.year || 'N/A'}</span>
                        <span>Added {new Date(movie.addedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <!-- No Results -->
            <div class="text-center py-12">
              <svg class="w-16 h-16 text-vault-light/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <p class="text-vault-light/80 mb-2">No movies found</p>
              <p class="text-vault-light/60 text-sm">Try adjusting your search or add some movies to this watchlist</p>
            </div>
          {/if}
        </div>
      {:else}
        <!-- Empty Watchlist -->
        <div class="p-12 text-center">
          <svg class="w-20 h-20 text-vault-light/40 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a1 1 0 011-1h1m0 0a1 1 0 011-1v1H9a1 1 0 00-1 1v1m0 0V5a1 1 0 011-1h1"></path>
          </svg>
          
          {#if selectedWatchlist}
            <h3 class="text-xl font-semibold text-vault-cream mb-2">
              "{selectedWatchlist.name}" is empty
            </h3>
            <p class="text-vault-light/80 mb-6 max-w-md mx-auto">
              Start building your collection by adding movies you want to watch. Browse our catalog and save your favorites!
            </p>
          {:else}
            <h3 class="text-xl font-semibold text-vault-cream mb-2">No watchlists yet</h3>
            <p class="text-vault-light/80 mb-6 max-w-md mx-auto">
              Create your first watchlist to start organizing your favorite movies.
            </p>
          {/if}
          
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/movies"
              class="px-6 py-3 bg-vault-medium hover:bg-vault-light text-vault-dark rounded-lg font-semibold transition-all duration-200"
            >
              Browse Movies
            </a>
            <a
              href="/search"
              class="px-6 py-3 border border-vault-light/30 text-vault-light hover:border-vault-light/50 rounded-lg font-semibold transition-all duration-200"
            >
              Advanced Search
            </a>
          </div>
        </div>
      {/if}
    </div>
  {/if}
  
  <style>
    /* Custom scrollbar */
    :global(.overflow-x-auto::-webkit-scrollbar) {
      height: 4px;
    }
    
    :global(.overflow-x-auto::-webkit-scrollbar-track) {
      background: rgba(148, 180, 193, 0.1);
      border-radius: 2px;
    }
    
    :global(.overflow-x-auto::-webkit-scrollbar-thumb) {
      background: rgba(148, 180, 193, 0.3);
      border-radius: 2px;
    }
    
    :global(.overflow-x-auto::-webkit-scrollbar-thumb:hover) {
      background: rgba(148, 180, 193, 0.5);
    }
    
    /* line-clamp-2 utility */
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    /* Custom select styling */
    select {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394B4C1' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.75rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
      padding-right: 2.5rem;
    }
    
    select option {
      background-color: var(--vault-dark);
      color: var(--vault-cream);
    }
  </style>