import { useEffect } from 'react'
import type { FC } from 'react'
import { useAuth } from '../../contexts/useAuth'
import { useNavigate } from 'react-router-dom'
import { LogOut, Play, Plus, User } from 'lucide-react'

export const Dashboard: FC = () => {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
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

  // Mock movie data for demonstration
  const featuredMovie = {
    title: "The Little Mermaid",
    description: "A young mermaid dreams of life on land in this beloved Disney classic.",
    image: "https://via.placeholder.com/1920x800/0a0e27/ffffff?text=The+Little+Mermaid"
  }

  const categories = [
    {
      title: "Disney Originals",
      movies: [
        { title: "Encanto", image: "https://via.placeholder.com/300x450/0a0e27/ffffff?text=Encanto" },
        { title: "Frozen II", image: "https://via.placeholder.com/300x450/0a0e27/ffffff?text=Frozen+II" },
        { title: "Moana", image: "https://via.placeholder.com/300x450/0a0e27/ffffff?text=Moana" },
        { title: "Soul", image: "https://via.placeholder.com/300x450/0a0e27/ffffff?text=Soul" },
      ]
    },
    {
      title: "Marvel",
      movies: [
        { title: "Spider-Man", image: "https://via.placeholder.com/300x450/0a0e27/ffffff?text=Spider-Man" },
        { title: "Black Panther", image: "https://via.placeholder.com/300x450/0a0e27/ffffff?text=Black+Panther" },
        { title: "The Avengers", image: "https://via.placeholder.com/300x450/0a0e27/ffffff?text=Avengers" },
        { title: "Iron Man", image: "https://via.placeholder.com/300x450/0a0e27/ffffff?text=Iron+Man" },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-disney-dark text-white">
      {/* Header */}
      <header className="bg-disney-gray/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-disney-blue">Disney+</h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-white hover:text-disney-blue transition-colors">Home</a>
                <a href="#" className="text-gray-300 hover:text-disney-blue transition-colors">Movies</a>
                <a href="#" className="text-gray-300 hover:text-disney-blue transition-colors">Series</a>
                <a href="#" className="text-gray-300 hover:text-disney-blue transition-colors">Watchlist</a>
              </nav>
            </div>

            {/* User Menu */}
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

      {/* Hero Section */}
      <section className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: `url(${featuredMovie.image})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-disney-dark via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
          <h2 className="text-5xl font-bold mb-4">{featuredMovie.title}</h2>
          <p className="text-lg text-gray-200 mb-6">{featuredMovie.description}</p>
          <div className="flex space-x-4">
            <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-200 transition-colors">
              <Play className="h-5 w-5" fill="currentColor" />
              <span>Play</span>
            </button>
            <button className="bg-gray-600/80 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-600 transition-colors">
              <Plus className="h-5 w-5" />
              <span>Watchlist</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categories.map((category, categoryIndex) => (
          <section key={categoryIndex} className="mb-12">
            <h3 className="text-2xl font-bold mb-6">{category.title}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {category.movies.map((movie, movieIndex) => (
                <div key={movieIndex} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-gray-800">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 p-4">
                        <h4 className="text-sm font-semibold">{movie.title}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
