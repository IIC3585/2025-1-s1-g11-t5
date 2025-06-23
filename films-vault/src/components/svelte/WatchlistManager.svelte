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
            poster: movie.posterPath,
            addedAt: new Date().toISOString()
          });
          saveWatchlists();
          dispatch('added', { watchlistId, movie });
        }
      }
      isLoading = false;
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
    dispatch('created', { watchlist: newWatchlist });
  }
  
  function deleteWatchlist(watchlistId) {
    if (watchlistId === 'default' || watchlistId === 'favorites') return;
    
    watchlists = watchlists.filter(w => w.id !== watchlistId);
    saveWatchlists();
    dispatch('deleted', { watchlistId });
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
</script>

<div class="bg-vault-dark/80 border border-vault-light/20 rounded-xl p-6">
  <div class="flex items-center justify-between mb-6">
    <h3 class="text-xl font-semibold text-vault-cream">Watchlist Manager</h3>
    <button
      on:click={() => showCreateForm = !showCreateForm}
      class="text-vault-light hover:text-vault-cream transition-colors duration-200"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
    </button>
  </div>
  
  <!-- Create New Watchlist Form -->
  {#if showCreateForm}
    <div class="mb-6 p-4 bg-vault-dark/40 border border-vault-light/20 rounded-lg">
      <div class="flex gap-3">
        <input
          bind:value={newWatchlistName}
          type="text"
          placeholder="New watchlist name..."
          class="flex-1 px-3 py-2 bg-vault-dark/60 border border-vault-light/30 rounded-lg text-vault-cream placeholder-vault-light/60 focus:outline-none focus:border-vault-light transition-colors duration-200"
          on:keydown={(e) => e.key === 'Enter' && createWatchlist()}
        />
        <button
          on:click={createWatchlist}
          disabled={!newWatchlistName.trim()}
          class="px-4 py-2 bg-vault-medium text-vault-dark rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create
        </button>
        <button
          on:click={() => showCreateForm = false}
          class="px-4 py-2 border border-vault-light/30 text-vault-light rounded-lg font-medium transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  {/if}
  
  <!-- Watchlists -->
  <div class="space-y-4">
    {#each watchlists as watchlist}
      <div class="bg-vault-dark/40 border border-vault-light/20 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <h4 class="text-vault-cream font-semibold">{watchlist.name}</h4>
            <span class="px-2 py-1 bg-vault-medium/20 text-vault-light rounded-full text-xs">
              {getWatchlistCount(watchlist.id)} movies
            </span>
          </div>
          
          {#if watchlist.id !== 'default' && watchlist.id !== 'favorites'}
            <button
              on:click={() => deleteWatchlist(watchlist.id)}
              class="text-vault-light/60 hover:text-vault-light transition-colors duration-200"
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
              class="w-full px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg font-medium transition-all duration-200 hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if isLoading}
                <div class="flex items-center justify-center gap-2">
                  <div class="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                  Removing...
                </div>
              {:else}
                Remove from {watchlist.name}
              {/if}
            </button>
          {:else}
            <button
              on:click={() => addToWatchlist(watchlist.id)}
              disabled={isLoading}
              class="w-full px-4 py-2 bg-vault-medium/20 border border-vault-light/30 text-vault-light rounded-lg font-medium transition-all duration-200 hover:bg-vault-medium/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if isLoading}
                <div class="flex items-center justify-center gap-2">
                  <div class="w-4 h-4 border-2 border-vault-light/30 border-t-vault-light rounded-full animate-spin"></div>
                  Adding...
                </div>
              {:else}
                Add to {watchlist.name}
              {/if}
            </button>
          {/if}
        {:else}
          <p class="text-vault-light/60 text-sm">Select a movie to add to this watchlist</p>
        {/if}
        
        <!-- Recent Movies Preview -->
        {#if watchlist.movies.length > 0}
          <div class="mt-4">
            <h5 class="text-vault-light/80 text-sm font-medium mb-2">Recent additions:</h5>
            <div class="flex gap-2 overflow-x-auto">
              {#each watchlist.movies.slice(-3) as movieItem}
                <div class="flex-shrink-0 w-12 h-16 bg-vault-medium/20 rounded-lg flex items-center justify-center">
                  {#if movieItem.poster}
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movieItem.poster}`}
                      alt={movieItem.title}
                      class="w-full h-full object-cover rounded-lg"
                    />
                  {:else}
                    <svg class="w-6 h-6 text-vault-light/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
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
      <button
        on:click={() => dispatch('viewAll')}
        class="text-vault-light hover:text-vault-cream transition-colors duration-200 text-sm font-medium"
      >
        View All Watchlists →
      </button>
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