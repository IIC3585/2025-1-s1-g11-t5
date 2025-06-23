<script>
  import { onMount, createEventDispatcher } from 'svelte';
  
  export let movie = null;
  export let isOpen = false;
  
  const dispatch = createEventDispatcher();
  
  let modalElement;
  let isVisible = false;
  let isClient = false;
  
  // Intersection Observer for client:visible
  onMount(() => {
    isClient = true;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible = true;
        }
      },
      { threshold: 0.1 }
    );
    
    if (modalElement) {
      observer.observe(modalElement);
    }
    
    return () => observer.disconnect();
  });
  
  function closeModal() {
    dispatch('close');
  }
  
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }
  
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
  
  // Only add event listeners when component is mounted and modal is open
  $: if (isClient && isOpen) {
    document.addEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'hidden';
  } else if (isClient) {
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'unset';
  }
</script>

{#if isOpen && movie && isVisible}
  <div 
    bind:this={modalElement}
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    on:click={handleBackdropClick}
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-vault-dark/90 backdrop-blur-sm"></div>
    
    <!-- Modal Content -->
    <div class="relative w-full max-w-4xl max-h-[90vh] bg-vault-dark border border-vault-light/20 rounded-xl overflow-hidden shadow-vault-lg">
      <!-- Close Button -->
      <button
        on:click={closeModal}
        class="absolute top-4 right-4 z-10 w-10 h-10 bg-vault-dark/80 border border-vault-light/30 rounded-full flex items-center justify-center text-vault-light hover:bg-vault-medium hover:text-vault-dark transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      
      <!-- Movie Header -->
      <div class="relative h-64 md:h-80 overflow-hidden">
        {#if movie.backdropPath}
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`}
            alt={movie.title}
            class="w-full h-full object-cover"
          />
        {:else}
          <div class="w-full h-full bg-vault-medium/20 flex items-center justify-center">
            <svg class="w-16 h-16 text-vault-light/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        {/if}
        
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-vault-dark via-vault-dark/80 to-transparent"></div>
        
        <!-- Movie Info Overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-6">
          <div class="flex items-end gap-6">
            <!-- Poster -->
            <div class="w-24 h-36 md:w-32 md:h-48 flex-shrink-0">
              {#if movie.posterPath}
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                  alt={movie.title}
                  class="w-full h-full object-cover rounded-lg shadow-vault"
                />
              {:else}
                <div class="w-full h-full bg-vault-medium/20 rounded-lg flex items-center justify-center">
                  <svg class="w-8 h-8 text-vault-light/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              {/if}
            </div>
            
            <!-- Title and Basic Info -->
            <div class="flex-1 min-w-0">
              <h1 class="text-3xl md:text-4xl font-bold text-vault-cream mb-2">{movie.title}</h1>
              <p class="text-vault-light/80 text-lg mb-3">
                {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                {#if movie.runtime}
                  • {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                {/if}
                {#if movie.voteAverage}
                  • ⭐ {movie.voteAverage.toFixed(1)}
                {/if}
              </p>
              
              <!-- Genres -->
              {#if movie.genres && movie.genres.length > 0}
                <div class="flex flex-wrap gap-2 mb-4">
                  {#each movie.genres as genre}
                    <span class="px-3 py-1 bg-vault-medium/20 text-vault-light rounded-full text-sm">
                      {genre.name}
                    </span>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Movie Details -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-320px)]">
        <!-- Tagline -->
        {#if movie.tagline}
          <p class="text-vault-light/80 italic text-lg mb-4">"{movie.tagline}"</p>
        {/if}
        
        <!-- Overview -->
        {#if movie.overview}
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-vault-cream mb-3">Overview</h3>
            <p class="text-vault-light/80 leading-relaxed">{movie.overview}</p>
          </div>
        {/if}
        
        <!-- Cast -->
        {#if movie.credits && movie.credits.cast && movie.credits.cast.length > 0}
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-vault-cream mb-3">Cast</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              {#each movie.credits.cast.slice(0, 6) as person}
                <div class="flex items-center gap-3 p-3 bg-vault-dark/40 rounded-lg">
                  {#if person.profilePath}
                    <img
                      src={`https://image.tmdb.org/t/p/w45${person.profilePath}`}
                      alt={person.name}
                      class="w-10 h-10 rounded-full object-cover"
                    />
                  {:else}
                    <div class="w-10 h-10 bg-vault-medium/20 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-vault-light/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                  {/if}
                  <div class="flex-1 min-w-0">
                    <p class="text-vault-cream font-medium text-sm truncate">{person.name}</p>
                    <p class="text-vault-light/60 text-xs truncate">{person.character}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
        
        <!-- Crew -->
        {#if movie.credits && movie.credits.crew && movie.credits.crew.length > 0}
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-vault-cream mb-3">Crew</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              {#each movie.credits.crew.slice(0, 4) as person}
                <div class="flex items-center gap-3 p-3 bg-vault-dark/40 rounded-lg">
                  {#if person.profilePath}
                    <img
                      src={`https://image.tmdb.org/t/p/w45${person.profilePath}`}
                      alt={person.name}
                      class="w-10 h-10 rounded-full object-cover"
                    />
                  {:else}
                    <div class="w-10 h-10 bg-vault-medium/20 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-vault-light/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                  {/if}
                  <div class="flex-1 min-w-0">
                    <p class="text-vault-cream font-medium text-sm truncate">{person.name}</p>
                    <p class="text-vault-light/60 text-xs truncate">{person.job}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
        
        <!-- Additional Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#if movie.budget > 0}
            <div>
              <h4 class="text-vault-cream font-semibold mb-2">Budget</h4>
              <p class="text-vault-light/80">${movie.budget.toLocaleString()}</p>
            </div>
          {/if}
          
          {#if movie.revenue > 0}
            <div>
              <h4 class="text-vault-cream font-semibold mb-2">Revenue</h4>
              <p class="text-vault-light/80">${movie.revenue.toLocaleString()}</p>
            </div>
          {/if}
          
          {#if movie.status}
            <div>
              <h4 class="text-vault-cream font-semibold mb-2">Status</h4>
              <p class="text-vault-light/80">{movie.status}</p>
            </div>
          {/if}
          
          {#if movie.homepage}
            <div>
              <h4 class="text-vault-cream font-semibold mb-2">Website</h4>
              <a 
                href={movie.homepage} 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-vault-medium hover:text-vault-light transition-colors duration-200"
              >
                Visit Official Site
              </a>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Custom scrollbar for modal content */
  :global(.overflow-y-auto::-webkit-scrollbar) {
    width: 6px;
  }
  
  :global(.overflow-y-auto::-webkit-scrollbar-track) {
    background: rgba(148, 180, 193, 0.1);
    border-radius: 3px;
  }
  
  :global(.overflow-y-auto::-webkit-scrollbar-thumb) {
    background: rgba(148, 180, 193, 0.3);
    border-radius: 3px;
  }
  
  :global(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
    background: rgba(148, 180, 193, 0.5);
  }
</style> 