import { useEffect, useState } from 'react'
import type { FC } from 'react'
import { useAuth } from '../../contexts/useAuth'
import { useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { movieService } from '../../services/movieService'
import FeaturedMovie from '../FeaturedMovie/FeaturedMovie'
import MovieCard from '../MovieCard/MovieCard'
import type { Movie, MovieCategories } from '../../types/movie'

export const Dashboard: FC = () => {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  
  // Movie state
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)
  const [categories, setCategories] = useState<MovieCategories | null>(null)
  const [moviesLoading, setMoviesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  // Fetch movie data
  useEffect(() => {
    const fetchMovieData = async () => {
      if (!user) return

      try {
        setMoviesLoading(true)
        setError(null)

        // Fetch featured movie and categories in parallel
        const [featured, movieCategories] = await Promise.all([
          movieService.getFeaturedMovie(),
          movieService.getMovieCategories()
        ])

        setFeaturedMovie(featured)
        setCategories(movieCategories)
      } catch (err) {
        console.error('Failed to fetch movie data:', err)
        setError('Failed to load movies. Please try again later.')
      } finally {
        setMoviesLoading(false)
      }
    }

    fetchMovieData()
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleMovieClick = (movie: Movie) => {
    console.log('Movie clicked:', movie)
    // TODO: Implement movie details modal or navigation
  }

  const handlePlayClick = (movie: Movie) => {
    console.log('Play clicked for:', movie)
    // TODO: Implement video player
  }

  const handleInfoClick = (movie: Movie) => {
    console.log('Info clicked for:', movie)
    // TODO: Implement movie details modal
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-disney-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-disney-blue"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Loading state for movies
  if (moviesLoading) {
    return (
      <div className="min-h-screen bg-disney-dark">
        <header className="bg-disney-gray/80 backdrop-blur-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold text-disney-blue">Disney+</h1>
                <nav className="hidden md:flex space-x-6">
                  <a href="#" className="text-white hover:text-disney-blue transition-colors">Home</a>
                  <a href="#" className="text-gray-300 hover:text-disney-blue transition-colors">Movies</a>
                  <a href="#" className="text-gray-300 hover:text-disney-blue transition-colors">Series</a>
                  <a href="#" className="text-gray-300 hover:text-disney-blue transition-colors">Watchlist</a>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-300" />
                  <span className="text-sm text-gray-300">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-disney-blue mx-auto mb-4"></div>
            <p className="text-gray-400">Loading amazing content...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-disney-dark text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-disney-blue text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-disney-dark text-white">
      <header className="bg-disney-gray/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-disney-blue">Disney+</h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-white hover:text-disney-blue transition-colors">Home</a>
                <a href="#" className="text-gray-300 hover:text-disney-blue transition-colors">Movies</a>
                <a href="#" className="text-gray-300 hover:text-disney-blue transition-colors">Series</a>
                <a href="#" className="text-gray-300 hover:text-disney-blue transition-colors">Watchlist</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-300" />
                <span className="text-sm text-gray-300">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Movie - Full Width */}
      {featuredMovie && (
        <FeaturedMovie
          movie={featuredMovie}
          onPlayClick={handlePlayClick}
          onInfoClick={handleInfoClick}
        />
      )}

      {/* Movie Categories - Constrained Width */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {categories && Object.entries(categories).map(([categoryName, movies]) => (
          <section key={categoryName} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white">{categoryName}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {movies.map((movie: Movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={handleMovieClick}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
