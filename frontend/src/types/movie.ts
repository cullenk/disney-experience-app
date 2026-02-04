// Frontend types for movie data
export interface Movie {
  id: string
  title: string
  description: string
  imageUrl: string
  backdropUrl?: string
  genre: string[]
  releaseYear: number
  rating: string
  tmdbId: number
}

export interface MovieCategories {
  'Disney Originals': Movie[]
  'Marvel': Movie[]
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}
