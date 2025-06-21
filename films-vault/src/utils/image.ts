// Image utility functions for TMDB
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export type ImageSize = 
  | 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original'
  | 'h632' // for backdrops

export const getImageUrl = (
  path: string | null, 
  size: ImageSize = 'w500'
): string | null => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (path: string | null, size: ImageSize = 'w342'): string | null => {
  return getImageUrl(path, size);
};

export const getBackdropUrl = (path: string | null, size: ImageSize = 'w780'): string | null => {
  return getImageUrl(path, size);
};

export const getProfileUrl = (path: string | null, size: ImageSize = 'w185'): string | null => {
  return getImageUrl(path, size);
};

// Placeholder image when no poster available
export const getPlaceholderImage = (title: string): string => {
  const encodedTitle = encodeURIComponent(title);
  return `https://via.placeholder.com/342x513/213448/ECEFCA?text=${encodedTitle}`;
}; 