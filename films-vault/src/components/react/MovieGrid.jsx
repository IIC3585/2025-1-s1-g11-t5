import React, { useState } from 'react';
import FavoriteButton from './FavoriteButton.jsx';

// Copia de las utilidades de imagen
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};
const getPosterUrl = (path, size = 'w342') => getImageUrl(path, size);
const getPlaceholderImage = (title) => {
  const encodedTitle = encodeURIComponent(title);
  return `https://via.placeholder.com/342x513/213448/ECEFCA?text=${encodedTitle}`;
};

const MovieGrid = ({ movies, initialCount = 12, step = 12 }) => {
  const [shown, setShown] = useState(initialCount);
  const total = movies.length;

  const handleLoadMore = () => {
    setShown(prev => Math.min(prev + step, total));
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {movies.slice(0, shown).map((movie) => {
          const posterUrl = getPosterUrl(movie.data.posterPath) || getPlaceholderImage(movie.data.title);
          const movieSlug = `${movie.data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${movie.data.id}`;
          return (
            <article className="group relative" key={movie.data.id}>
              <a href={`/movies/${movieSlug}`} className="block">
                <div className="bg-vault-dark/60 border border-vault-light/20 rounded-xl overflow-hidden hover:border-vault-light/40 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="aspect-[2/3] relative overflow-hidden">
                    <img 
                      src={posterUrl} 
                      alt={movie.data.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-vault-dark/90 text-vault-cream px-2 py-1 rounded-lg text-sm font-medium">
                      {movie.data.voteAverage.toFixed(1)}
                    </div>
                    <div className="absolute top-3 left-3">
                      <FavoriteButton 
                        movieId={movie.data.id}
                        movieTitle={movie.data.title}
                        moviePoster={posterUrl}
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-vault-cream group-hover:text-vault-light transition-colors line-clamp-2 text-sm">
                      {movie.data.title}
                    </h3>
                    <p className="text-vault-light/60 text-xs mt-1">
                      {new Date(movie.data.releaseDate).getFullYear()}
                    </p>
                  </div>
                </div>
              </a>
            </article>
          );
        })}
      </div>
      <div className="text-center mt-12">
        <p className="text-vault-light/60 mb-4">
          Showing {shown} of {total} movies
        </p>
        {shown < total && (
          <button onClick={handleLoadMore} className="bg-vault-medium hover:bg-vault-light text-vault-dark px-6 py-3 rounded-lg font-semibold transition-colors">
            Load More Movies
          </button>
        )}
      </div>
    </>
  );
};

export default MovieGrid; 