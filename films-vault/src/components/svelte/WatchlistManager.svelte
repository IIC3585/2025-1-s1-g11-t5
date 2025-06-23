<script>
  import { onMount, createEventDispatcher } from 'svelte';
  
  export let movie = null;
  
  const dispatch = createEventDispatcher();
  
  let watchlists = [];
  let selectedWatchlist = '';
  let newWatchlistName = '';
  let showCreateForm = false;
  let isLoading = false;
  
  // Load watchlists from localStorage on mount
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
    } catch (error) {
      console.error('Error loading watchlists:', error);
      watchlists = [
        { id: 'default', name: 'My Watchlist', movies: [] },
        { id: 'favorites', name: 'Favorites', movies: [] }
      ];
    }
  }
  
  function saveWatchlists() {
    try {
      localStorage.setItem('filmVaultWatchlists', JSON.stringify(watchlists));
    } catch (error) {
      console.error('Error saving watchlists:', error);
    }
  }
  
  function addToWatchlist(watchlistId) {
    if (!movie) return;
    
    isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
      const watchlist = watchlists.find(w => w.id === watchlistId);
      if (watchlist) {
        // Check if movie is already in the watchlist
        const exists = watchlist.movies.some(m => m.id === movie.id);
        if (!exists) {
          watchlist.movies.push({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path || movie.posterPath,
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
            addedAt: new Date().toISOString()
          });
          saveWatchlists();
          dispatch('added', { watchlistId, movie });
        }
      }
      isLoading = false;
      watchlists = [...watchlists]; // Trigger reactivity
    }, 200);
  }
  
  function removeFromWatchlist(watchlistId, movieId) {
    isLoading = true;
    
    setTimeout(() => {
      const watchlist = watchlists.find(w => w.id === watchlistId);
      if (watchlist) {
        watchlist.movies = watchlist.movies.filter(m => m.id !== movieId);
        saveWatchlists();
        dispatch('removed', { watchlistId, movieId });
      }
      isLoading = false;
      watchlists = [...watchlists]; // Trigger reactivity
    }, 200);
  }
  
  function createWatchlist() {
    if (!newWatchlistName.trim()) return;
    
    const newWatchlist = {
      id: `watchlist_${Date.now()}`,
      name: newWatchlistName.trim(),
      movies: []
    };
    
    watchlists.push(newWatchlist);
    saveWatchlists();
    newWatchlistName = '';
    showCreateForm = false;
    watchlists = [...watchlists]; // Trigger reactivity
    dispatch('created', { watchlist: newWatchlist });
  }
  
  function deleteWatchlist(watchlistId) {
    if (watchlistId === 'default' || watchlistId === 'favorites') return;
    
    if (confirm('Are you sure you want to delete this watchlist?')) {
      watchlists = watchlists.filter(w => w.id !== watchlistId);
      saveWatchlists();
      dispatch('deleted', { watchlistId });
    }
  }
  
  function isMovieInWatchlist(watchlistId) {
    if (!movie) return false;
    const watchlist = watchlists.find(w => w.id === watchlistId);
    return watchlist ? watchlist.movies.some(m => m.id === movie.id) : false;
  }
  
  function getWatchlistCount(watchlistId) {
    const watchlist = watchlists.find(w => w.id === watchlistId);
    return watchlist ? watchlist.movies.length : 0;
  }
  
  function handleMovieClick(movie) {
    const movieSlug = movie.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    window.location.href = `/movies/${movieSlug}-${movie.id}`;
  }
</script>

<div class="bg-vault-dark/90 border border-vault-light/20 rounded-xl p-6 backdrop-blur-sm">
  <div class="flex items-center justify-between mb-6">
    <h3 class="text-xl font-semibold text-vault-cream">Watchlist Manager</h3>
    <button
      on:click={() => showCreateForm = !showCreateForm}
      class="text-vault-light hover:text-vault-cream transition-colors duration-200 p-2 rounded-lg hover:bg-vault-dark/60"
      title="Create new watchlist"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
    </button>
  </div>
  
  <!-- Create New Watchlist Form -->
  {#if showCreateForm}
    <div class="mb-6 p-4 bg-vault-dark/60 border border-vault-light/20 rounded-lg">
      <h4 class="text-vault-cream font-medium mb-3">Create New Watchlist</h4>
      <div class="flex gap-3">
        <input
          bind:value={newWatchlistName}
          type="text"
          placeholder="Watchlist name..."
          class="flex-1 px-3 py-2 bg-vault-dark border border-vault-light/30 rounded-lg text-vault-cream placeholder-vault-light/60 focus:outline-none focus:border-vault-light transition-colors duration-200"
          on:keydown={(e) => e.key === 'Enter' && createWatchlist()}
          maxlength="50"
        />
        <button
          on:click={createWatchlist}
          disabled={!newWatchlistName.trim()}
          class="px-4 py-2 bg-vault-medium hover:bg-vault-light text-vault-dark rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create
        </button>
        <button
          on:click={() => showCreateForm = false}
          class="px-4 py-2 border border-vault-light/30 text-vault-light hover:border-vault-light/50 rounded-lg font-medium transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  {/if}
  
  <!-- Watchlists -->
  <div class="space-y-4">
    {#each watchlists as watchlist}
      <div class="bg-vault-dark/60 border border-vault-light/20 rounded-lg p-4 hover:border-vault-light/30 transition-colors duration-200">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <h4 class="text-vault-cream font-semibold">{watchlist.name}</h4>
            <span class="px-2 py-1 bg-vault-medium/20 text-vault-light rounded-full text-xs font-medium">
              {getWatchlistCount(watchlist.id)} movies
            </span>
          </div>
          
          {#if watchlist.id !== 'default' && watchlist.id !== 'favorites'}
            <button
              on:click={() => deleteWatchlist(watchlist.id)}
              class="text-vault-light/60 hover:text-red-400 transition-colors duration-200 p-1 rounded hover:bg-red-500/10"
              title="Delete watchlist"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          {/if}
        </div>
        
        <!-- Add/Remove Movie Button -->
        {#if movie}
          {#if isMovieInWatchlist(watchlist.id)}
            <button
              on:click={() => removeFromWatchlist(watchlist.id, movie.id)}
              disabled={isLoading}
              class="w-full px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg font-medium transition-all duration-200 hover:bg-red-600/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if isLoading}
                <div class="flex items-center justify-center gap-2">
                  <div class="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                  Removing...
                </div>
              {:else}
                <div class="flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Remove from {watchlist.name}
                </div>
              {/if}
            </button>
          {:else}
            <button
              on:click={() => addToWatchlist(watchlist.id)}
              disabled={isLoading}
              class="w-full px-4 py-2 bg-vault-medium/20 border border-vault-light/30 text-vault-light rounded-lg font-medium transition-all duration-200 hover:bg-vault-medium/30 hover:border-vault-light/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if isLoading}
                <div class="flex items-center justify-center gap-2">
                  <div class="w-4 h-4 border-2 border-vault-light/30 border-t-vault-light rounded-full animate-spin"></div>
                  Adding...
                </div>
              {:else}
                <div class="flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add to {watchlist.name}
                </div>
              {/if}
            </button>
          {/if}
        {:else}
          <div class="text-center py-3 text-vault-light/60 text-sm border border-vault-light/20 rounded-lg bg-vault-dark/40">
            Select a movie to manage watchlists
          </div>
        {/if}
        
        <!-- Recent Movies Preview -->
        {#if watchlist.movies.length > 0}
          <div class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <h5 class="text-vault-light/80 text-sm font-medium">Recent additions:</h5>
              <a 
                href="/watchlist" 
                class="text-vault-light/60 hover:text-vault-light text-xs transition-colors duration-200"
              >
                View all →
              </a>
            </div>
            <div class="flex gap-2 overflow-x-auto pb-2">
              {#each watchlist.movies.slice(-5) as movieItem}
                <div 
                  class="flex-shrink-0 w-12 h-16 bg-vault-medium/20 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
                  on:click={() => handleMovieClick(movieItem)}
                  role="button"
                  tabindex="0"
                  on:keydown={(e) => e.key === 'Enter' && handleMovieClick(movieItem)}
                  title={movieItem.title}
                >
                  {#if movieItem.poster}
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movieItem.poster}`}
                      alt={movieItem.title}
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  {:else}
                    <div class="w-full h-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-vault-light/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>
  
  <!-- Quick Actions -->
  <div class="mt-6 pt-4 border-t border-vault-light/10">
    <div class="flex items-center justify-between">
      <span class="text-vault-light/60 text-sm">
        {watchlists.reduce((total, w) => total + w.movies.length, 0)} total movies in watchlists
      </span>
      <a
        href="/watchlist"
        class="text-vault-light hover:text-vault-cream transition-colors duration-200 text-sm font-medium"
      >
        View All Watchlists →
      </a>
    </div>
  </div>
</div>

<style>
  /* Custom scrollbar for movie previews */
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
</style>