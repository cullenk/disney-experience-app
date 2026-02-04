import axios from 'axios'

// TMDB API Configuration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'
const TMDB_API_KEY = process.env.TMDB_API_KEY 

// Image size options: w300, w500, w780, original
const POSTER_SIZE = 'w500'
const BACKDROP_SIZE = 'w1280'

interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  genre_ids: number[]
  adult: boolean
}

interface TMDBResponse {
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

interface Movie {
  id: string
  title: string
  description: string
  imageUrl: string
  backdropUrl?: string
  videoUrl?: string
  trailerUrl?: string
  genre: string[]
  releaseYear: number
  rating: string
  tmdbId: number
}

class TMDBService {
  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
        params: {
          api_key: TMDB_API_KEY,
          ...params
        },
        timeout: 5000
      })
      return response.data
    } catch (error) {
      console.log('🚫 TMDB API error:', error instanceof Error ? error.message : 'Unknown error')
      throw new Error('Failed to fetch from TMDB')
    }
  }

  private formatImageUrl(path: string | null, size: string): string {
    if (!path) return 'https://via.placeholder.com/500x750/0a0e27/ffffff?text=No+Image'
    return `${TMDB_IMAGE_BASE}/${size}${path}`
  }

  private mapTMDBToMovie(tmdbMovie: TMDBMovie): Movie {
    return {
      id: tmdbMovie.id.toString(),
      tmdbId: tmdbMovie.id,
      title: tmdbMovie.title,
      description: tmdbMovie.overview || 'No description available',
      imageUrl: this.formatImageUrl(tmdbMovie.poster_path, POSTER_SIZE),
      backdropUrl: this.formatImageUrl(tmdbMovie.backdrop_path, BACKDROP_SIZE),
      trailerUrl: this.getTrailerUrl(tmdbMovie.title, tmdbMovie.id),
      genre: this.mapGenreIds(tmdbMovie.genre_ids),
      releaseYear: new Date(tmdbMovie.release_date || '2000').getFullYear(),
      rating: tmdbMovie.adult ? 'R' : 'PG'
    }
  }

  // For demo purposes - in production, this would fetch from TMDB videos endpoint
  private getTrailerUrl(title: string, tmdbId: number): string | undefined {
    // Sample video URLs for demo - in production, you'd call TMDB /movie/{id}/videos endpoint
    const demoTrailers: Record<string, string> = {
      'Avengers: Endgame': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'The Lion King': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'Frozen II': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'Spider-Man: No Way Home': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'Black Panther': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    }
    
    return demoTrailers[title] || demoTrailers['Avengers: Endgame'] // Default trailer
  }

  private mapGenreIds(genreIds: number[]): string[] {
    const genreMap: Record<number, string> = {
      16: 'Animation',
      10751: 'Family',
      14: 'Fantasy',
      28: 'Action',
      12: 'Adventure',
      35: 'Comedy',
      18: 'Drama',
      27: 'Horror',
      10749: 'Romance',
      878: 'Sci-Fi',
      53: 'Thriller'
    }
    
    return genreIds.map(id => genreMap[id]).filter(Boolean).slice(0, 3)
  }

  // Get Disney animated movies
  async getDisneyMovies(): Promise<Movie[]> {
    try {
      const response: TMDBResponse = await this.makeRequest('/discover/movie', {
        with_companies: '2',  // Walt Disney Pictures
        with_genres: '16',    // Animation
        'vote_average.gte': 6.0,
        sort_by: 'popularity.desc',
        page: 1
      })

      return response.results.slice(0, 8).map(movie => this.mapTMDBToMovie(movie))
    } catch (error) {
      console.log('🎭 Using fallback Disney movies due to API error')
      return this.getFallbackDisneyMovies()
    }
  }

  // Get Marvel movies
  async getMarvelMovies(): Promise<Movie[]> {
    try {
      const response: TMDBResponse = await this.makeRequest('/discover/movie', {
        with_companies: '420',    // Marvel Studios
        'vote_average.gte': 6.0,
        sort_by: 'popularity.desc',
        page: 1
      })

      return response.results.slice(0, 8).map(movie => this.mapTMDBToMovie(movie))
    } catch (error) {
      console.log('🦸 Using fallback Marvel movies due to API error')
      return this.getFallbackMarvelMovies()
    }
  }

  // Get featured movie (highest rated recent Disney/Marvel)
  async getFeaturedMovie(): Promise<Movie> {
    try {
      const response: TMDBResponse = await this.makeRequest('/discover/movie', {
        with_companies: '2,420', // Disney + Marvel
        'primary_release_date.gte': '2020-01-01',
        'vote_average.gte': 7.0,
        sort_by: 'vote_average.desc',
        page: 1
      })

      if (response.results.length > 0) {
        return this.mapTMDBToMovie(response.results[0])
      }
      
      return this.getFallbackFeaturedMovie()
    } catch (error) {
      console.log('⭐ Using fallback featured movie due to API error')
      return this.getFallbackFeaturedMovie()
    }
  }

  // Fallback data when API is unavailable
  private getFallbackDisneyMovies(): Movie[] {
    return [
      { id: '1', tmdbId: 1, title: 'Encanto', description: 'A magical family story', imageUrl: 'https://via.placeholder.com/500x750/0a0e27/ffffff?text=Encanto', trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', genre: ['Animation', 'Family'], releaseYear: 2021, rating: 'PG' },
      { id: '2', tmdbId: 2, title: 'Frozen II', description: 'Elsa\'s adventure continues', imageUrl: 'https://via.placeholder.com/500x750/0a0e27/ffffff?text=Frozen+II', trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', genre: ['Animation', 'Family'], releaseYear: 2019, rating: 'PG' },
      { id: '3', tmdbId: 3, title: 'Moana', description: 'A Polynesian adventure', imageUrl: 'https://via.placeholder.com/500x750/0a0e27/ffffff?text=Moana', trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', genre: ['Animation', 'Family'], releaseYear: 2016, rating: 'PG' },
      { id: '4', tmdbId: 4, title: 'Soul', description: 'A musical journey of self-discovery', imageUrl: 'https://via.placeholder.com/500x750/0a0e27/ffffff?text=Soul', genre: ['Animation', 'Drama'], releaseYear: 2020, rating: 'PG' }
    ]
  }

  private getFallbackMarvelMovies(): Movie[] {
    return [
      { id: '5', tmdbId: 5, title: 'Spider-Man: No Way Home', description: 'The multiverse unleashed', imageUrl: 'https://via.placeholder.com/500x750/0a0e27/ffffff?text=Spider-Man', trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', genre: ['Action', 'Adventure'], releaseYear: 2021, rating: 'PG-13' },
      { id: '6', tmdbId: 6, title: 'Black Panther', description: 'Wakanda forever', imageUrl: 'https://via.placeholder.com/500x750/0a0e27/ffffff?text=Black+Panther', trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', genre: ['Action', 'Adventure'], releaseYear: 2018, rating: 'PG-13' },
      { id: '7', tmdbId: 7, title: 'Avengers: Endgame', description: 'The epic conclusion', imageUrl: 'https://via.placeholder.com/500x750/0a0e27/ffffff?text=Avengers', trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', genre: ['Action', 'Adventure'], releaseYear: 2019, rating: 'PG-13' },
      { id: '8', tmdbId: 8, title: 'Iron Man', description: 'The beginning of the MCU', imageUrl: 'https://via.placeholder.com/500x750/0a0e27/ffffff?text=Iron+Man', trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', genre: ['Action', 'Adventure'], releaseYear: 2008, rating: 'PG-13' }
    ]
  }

  private getFallbackFeaturedMovie(): Movie {
    return {
      id: 'featured-1',
      tmdbId: 123,
      title: 'The Little Mermaid',
      description: 'A young mermaid dreams of life on land in this beloved Disney classic reimagined for a new generation.',
      imageUrl: 'https://via.placeholder.com/500x750/0a0e27/ffffff?text=The+Little+Mermaid',
      backdropUrl: 'https://via.placeholder.com/1280x720/0a0e27/ffffff?text=The+Little+Mermaid',
      trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      genre: ['Animation', 'Family', 'Fantasy'],
      releaseYear: 2023,
      rating: 'PG'
    }
  }
}

export const tmdbService = new TMDBService()
export type { Movie }
