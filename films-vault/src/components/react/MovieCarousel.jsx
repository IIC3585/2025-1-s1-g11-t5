import React, { useState, useRef, useEffect } from 'react';

const MovieCarousel = ({ movies, title = "Featured Movies", showViewAll = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const carouselRef = useRef(null);
  const containerRef = useRef(null);

  // Intersection Observer for client:visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= Math.ceil(movies.length / 4) ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? Math.ceil(movies.length / 4) - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleMovieClick = (movie) => {
    window.location.href = `/movies/${movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${movie.id}`;
  };

  if (!isVisible) {
    return (
      <div ref={carouselRef} className="py-12 px-6">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-vault-light/30 border-t-vault-light rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-vault-light/60">Loading carousel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={carouselRef} className="py-12 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-vault-cream">{title}</h2>
          {showViewAll && (
            <a 
              href="/movies" 
              className="text-vault-light hover:text-vault-cream transition-colors duration-200 font-medium"
            >
              View All →
            </a>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-vault-dark/90 border border-vault-light/30 rounded-full flex items-center justify-center text-vault-light hover:bg-vault-medium hover:text-vault-dark transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-vault"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-vault-dark/90 border border-vault-light/30 rounded-full flex items-center justify-center text-vault-light hover:bg-vault-medium hover:text-vault-dark transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-vault"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          {/* Movies Grid */}
          <div 
            ref={containerRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`
            }}
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                {/* Movie Card */}
                <div className="bg-vault-dark/80 border border-vault-light/20 rounded-xl overflow-hidden hover:border-vault-light/40 transition-all duration-300">
                  {/* Poster */}
                  <div className="relative aspect-[2/3] overflow-hidden">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-vault-medium/20 flex items-center justify-center">
                        <svg className="w-12 h-12 text-vault-light/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-vault-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Rating Badge */}
                    {movie.vote_average && (
                      <div className="absolute top-2 right-2 bg-vault-medium/90 text-vault-dark px-2 py-1 rounded-full text-xs font-semibold">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-vault-cream font-semibold text-lg mb-2 line-clamp-2 group-hover:text-vault-light transition-colors duration-200">
                      {movie.title}
                    </h3>
                    <p className="text-vault-light/80 text-sm mb-2">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                    </p>
                    {movie.overview && (
                      <p className="text-vault-light/60 text-xs line-clamp-2">
                        {movie.overview}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {movies.length > 4 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(movies.length / 4) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-vault-medium' 
                    : 'bg-vault-light/30 hover:bg-vault-light/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCarousel; 