import fs from 'fs/promises';
import path from 'path';

// TMDB Service for Node.js environment
class TMDBGenerator {
  constructor() {
    this.apiKey = 'fd559a92d9d1ee4498d567a7649b6f32';
    this.baseUrl = 'https://api.themoviedb.org/3';
  }

  async fetch(endpoint) {
    const url = `${this.baseUrl}${endpoint}`;
    const separator = endpoint.includes('?') ? '&' : '?';
    const fullUrl = `${url}${separator}api_key=${this.apiKey}`;
    
    try {
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  async generateMovieContent() {
    const contentDir = './src/content/movies';
    
    // Ensure directory exists
    await fs.mkdir(contentDir, { recursive: true });

    console.log('🎬 Generating movie content...');

    // Get popular movies (multiple pages for 50+ movies)
    const pages = [1, 2, 3]; // Will get ~60 movies
    const allMovies = [];

    for (const page of pages) {
      console.log(`📄 Fetching page ${page}...`);
      const popularMovies = await this.fetch(`/movie/popular?page=${page}`);
      allMovies.push(...popularMovies.results);
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 250));
    }

    console.log(`📊 Processing ${allMovies.length} movies...`);

    // Process each movie
    for (let i = 0; i < allMovies.length; i++) {
      const movie = allMovies[i];
      
      try {
        // Get detailed movie info
        const details = await this.fetch(`/movie/${movie.id}`);
        const credits = await this.fetch(`/movie/${movie.id}/credits`);

        // Transform data for content collection
        const movieData = {
          id: details.id,
          title: details.title,
          originalTitle: details.original_title,
          overview: details.overview,
          posterPath: details.poster_path,
          backdropPath: details.backdrop_path,
          releaseDate: details.release_date,
          voteAverage: details.vote_average,
          voteCount: details.vote_count,
          runtime: details.runtime,
          budget: details.budget,
          revenue: details.revenue,
          genres: details.genres,
          credits: {
            cast: credits.cast.slice(0, 10).map(person => ({
              id: person.id,
              name: person.name,
              character: person.character,
              profilePath: person.profile_path || null, // <- ASEGURAR NULL
              order: person.order
            })),
            crew: credits.crew
              .filter(person => ['Director', 'Producer', 'Screenplay', 'Story'].includes(person.job))
              .slice(0, 10)
              .map(person => ({
                id: person.id,
                name: person.name,
                job: person.job,
                department: person.department,
                profilePath: person.profile_path || null // <- ASEGURAR NULL
              }))
          },
          popularity: details.popularity,
          status: details.status,
          tagline: details.tagline,
          homepage: details.homepage,
          imdbId: details.imdb_id
        };

        // Create slug from title
        const slug = details.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        // Write movie file
        const fileName = `${slug}-${details.id}.json`;
        const filePath = path.join(contentDir, fileName);
        
        await fs.writeFile(filePath, JSON.stringify(movieData, null, 2));
        
        console.log(`✅ Generated: ${fileName} (${i + 1}/${allMovies.length})`);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error processing movie ${movie.title}:`, error.message);
      }
    }

    console.log('🎉 Movie content generation complete!');
  }

  async generateGenreContent() {
    const contentDir = './src/content/genres';
    await fs.mkdir(contentDir, { recursive: true });

    console.log('🎭 Generating genre content...');

    const genresResponse = await this.fetch('/genre/movie/list');
    const genres = genresResponse.genres;

    for (const genre of genres) {
      const slug = genre.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const genreData = {
        id: genre.id,
        name: genre.name,
        slug: slug
      };

      const fileName = `${slug}.json`;
      const filePath = path.join(contentDir, fileName);
      
      await fs.writeFile(filePath, JSON.stringify(genreData, null, 2));
      console.log(`✅ Generated genre: ${genre.name}`);
    }

    console.log('🎉 Genre content generation complete!');
  }

  async generateAll() {
    try {
      await this.generateGenreContent();
      await this.generateMovieContent();
      console.log('🚀 All content generated successfully!');
    } catch (error) {
      console.error('❌ Content generation failed:', error);
    }
  }
}

// Run the generator
const generator = new TMDBGenerator();
generator.generateAll(); 