<script>
  import { onMount } from 'svelte';
  
  let isDarkMode = true; // Default to dark mode for Films Vault
  let isLoaded = false;
  
  onMount(() => {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('filmVaultTheme');
    if (savedTheme) {
      isDarkMode = savedTheme === 'dark';
    }
    
    applyTheme();
    isLoaded = true;
  });
  
  function toggleTheme() {
    isDarkMode = !isDarkMode;
    applyTheme();
    saveTheme();
  }
  
  function applyTheme() {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }
  
  function saveTheme() {
    localStorage.setItem('filmVaultTheme', isDarkMode ? 'dark' : 'light');
  }
</script>

{#if isLoaded}
  <button
    on:click={toggleTheme}
    class="relative w-12 h-12 bg-vault-dark/60 border border-vault-light/30 rounded-xl flex items-center justify-center text-vault-light hover:bg-vault-medium hover:text-vault-dark transition-all duration-300 group"
    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
  >
    <!-- Dark Mode Icon -->
    <svg
      class="w-5 h-5 transition-all duration-300 {isDarkMode ? 'opacity-100 scale-100' : 'opacity-0 scale-75 absolute'}"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      ></path>
    </svg>
    
    <!-- Light Mode Icon -->
    <svg
      class="w-5 h-5 transition-all duration-300 {!isDarkMode ? 'opacity-100 scale-100' : 'opacity-0 scale-75 absolute'}"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      ></path>
    </svg>
    
    <!-- Ripple Effect -->
    <div class="absolute inset-0 rounded-xl bg-vault-light/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
  </button>
{:else}
  <!-- Loading placeholder -->
  <div class="w-12 h-12 bg-vault-dark/60 border border-vault-light/30 rounded-xl flex items-center justify-center">
    <div class="w-5 h-5 border-2 border-vault-light/30 border-t-vault-light rounded-full animate-spin"></div>
  </div>
{/if}

<style>
  /* Ensure the component only renders on client */
  :global(.dark) {
    --vault-bg: #213448;
    --vault-dark: #1a2a3a;
    --vault-medium: #547792;
    --vault-light: #94b4c1;
    --vault-cream: #f5f5dc;
  }
  
  :global(.light) {
    --vault-bg: #f8f9fa;
    --vault-dark: #e9ecef;
    --vault-medium: #6c757d;
    --vault-light: #495057;
    --vault-cream: #212529;
  }
  
  /* Smooth transitions for theme changes */
  :global(*) {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }
</style> 