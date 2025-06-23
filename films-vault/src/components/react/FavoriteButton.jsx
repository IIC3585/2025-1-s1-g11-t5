import React, { useState, useEffect } from 'react';

const FavoriteButton = ({ movieId, movieTitle, moviePoster }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load favorite status from localStorage on mount
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('filmVaultFavorites') || '[]');
    setIsFavorite(favorites.some(fav => fav.id === movieId));
  }, [movieId]);

  const toggleFavorite = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const favorites = JSON.parse(localStorage.getItem('filmVaultFavorites') || '[]');
      
      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter(fav => fav.id !== movieId);
        localStorage.setItem('filmVaultFavorites', JSON.stringify(updatedFavorites));
        setIsFavorite(false);
      } else {
        // Add to favorites
        const newFavorite = {
          id: movieId,
          title: movieTitle,
          poster: moviePoster,
          addedAt: new Date().toISOString()
        };
        const updatedFavorites = [...favorites, newFavorite];
        localStorage.setItem('filmVaultFavorites', JSON.stringify(updatedFavorites));
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`
        group relative inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${isFavorite 
          ? 'bg-vault-medium text-vault-dark shadow-vault' 
          : 'bg-vault-dark/80 border border-vault-light/30 text-vault-light hover:bg-vault-medium/20 hover:border-vault-light/50'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
      `}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-vault-light/30 border-t-vault-light rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Heart icon */}
      <svg 
        className={`w-5 h-5 transition-all duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        fill={isFavorite ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      
      {/* Text */}
      <span className={`transition-all duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {isFavorite ? 'Favorited' : 'Favorite'}
      </span>
      
      {/* Success animation */}
      {isFavorite && !isLoading && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-vault-light rounded-full animate-pulse"></div>
      )}
    </button>
  );
};

export default FavoriteButton; 