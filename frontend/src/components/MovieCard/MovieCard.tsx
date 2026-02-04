import { FC, useState } from 'react'
import { Play, Info, Star } from 'lucide-react'
import type { Movie } from '../../types/movie'

interface MovieCardProps {
  movie: Movie
  onClick?: (movie: Movie) => void
}

export const MovieCard: FC<MovieCardProps> = ({ movie, onClick }) => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const handleClick = () => {
    onClick?.(movie)
  }

  return (
    <div 
      className="group relative bg-disney-gray rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
      onClick={handleClick}
    >
      {/* Movie Poster */}
      <div className="relative aspect-2/3 overflow-hidden">
        <img
          src={imageError ? `https://via.placeholder.com/500x750/0a0e27/ffffff?text=${encodeURIComponent(movie.title)}` : movie.imageUrl}
          alt={movie.title}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-3">
            <button className="bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-colors">
              <Play size={24} fill="currentColor" />
            </button>
            <button className="bg-white bg-opacity-20 text-white p-3 rounded-full hover:bg-opacity-30 transition-colors">
              <Info size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-disney-blue transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-disney-blue text-white px-2 py-1 rounded">
            {movie.rating}
          </span>
          <span className="text-gray-400 text-sm">
            {movie.releaseYear}
          </span>
          {movie.tmdbId && (
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span className="text-gray-400 text-xs">TMDB</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {movie.genre.slice(0, 2).map((genre, index) => (
            <span 
              key={index} 
              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
            >
              {genre}
            </span>
          ))}
        </div>

        <p className="text-gray-400 text-sm line-clamp-3">
          {movie.description}
        </p>
      </div>
    </div>
  )
}

export default MovieCard
