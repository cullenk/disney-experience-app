import { FC, useState } from 'react'
import { Play, Info, Star } from 'lucide-react'
import type { Movie } from '../../types/movie'

interface FeaturedMovieProps {
  movie: Movie
  onPlayClick?: (movie: Movie) => void
  onInfoClick?: (movie: Movie) => void
}

export const FeaturedMovie: FC<FeaturedMovieProps> = ({ 
  movie, 
  onPlayClick, 
  onInfoClick 
}) => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const backgroundImage = imageError 
    ? `https://via.placeholder.com/1920x1080/0a0e27/ffffff?text=${encodeURIComponent(movie.title)}`
    : movie.backdropUrl || movie.imageUrl

  return (
    <div className="relative h-[70vh] min-h-125 overflow-hidden rounded-lg mb-8">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <img
          src={backgroundImage}
          alt={movie.title}
          onError={handleImageError}
          className="hidden"
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-disney-dark via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center px-8 lg:px-16">
        <div className="max-w-2xl space-y-6">
          {/* Movie Title */}
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
            {movie.title}
          </h1>

          {/* Movie Details */}
          <div className="flex items-center gap-4 text-sm">
            <span className="bg-disney-blue text-white px-3 py-1 rounded font-medium">
              {movie.rating}
            </span>
            <span className="text-gray-300">{movie.releaseYear}</span>
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="text-gray-300">Featured</span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {movie.genre.map((genre, index) => (
              <span 
                key={index}
                className="text-gray-300 bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-sm"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-200 text-lg leading-relaxed max-w-xl line-clamp-4">
            {movie.description}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => onPlayClick?.(movie)}
              className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition-colors text-lg"
            >
              <Play size={24} fill="currentColor" />
              Play
            </button>
            
            <button
              onClick={() => onInfoClick?.(movie)}
              className="flex items-center gap-3 bg-white/20 text-white px-8 py-3 rounded font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm text-lg"
            >
              <Info size={24} />
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedMovie
