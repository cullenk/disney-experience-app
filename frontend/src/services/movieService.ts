import type { Movie, MovieCategories } from '../types/movie'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

class MovieService {
  private async fetchFromAPI<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/movies${endpoint}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('🚫 Movie API error:', error)
      throw error
    }
  }

  async getFeaturedMovie(): Promise<Movie> {
    return this.fetchFromAPI<Movie>('/featured')
  }

  async getAllMovies(): Promise<Movie[]> {
    return this.fetchFromAPI<Movie[]>('')
  }

  async getMovieCategories(): Promise<MovieCategories> {
    return this.fetchFromAPI<MovieCategories>('/categories')
  }

  async getMoviesByCategory(category: string): Promise<Movie[]> {
    return this.fetchFromAPI<Movie[]>(`/category/${encodeURIComponent(category)}`)
  }
}

export const movieService = new MovieService()
