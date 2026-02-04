import { FC, useState, useRef } from 'react'
import { Play, Info, Star, Volume2, VolumeX } from 'lucide-react'
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
  const [videoError, setVideoError] = useState(false)
  const [showVideo, setShowVideo] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleImageError = () => {
    setImageError(true)
  }

  const handleVideoError = () => {
    setVideoError(true)
    setShowVideo(false)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const backgroundImage = imageError 
    ? `https://via.placeholder.com/1920x1080/0a0e27/ffffff?text=${encodeURIComponent(movie.title)}`
    : movie.backdropUrl || movie.imageUrl

  // For demo purposes, I'll add some sample trailer URLs
  // In production, these would come from TMDB API or your video service
  const getTrailerUrl = (movieTitle: string) => {
    const trailerUrls: { [key: string]: string } = {
      'Avengers: Endgame': 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      'The Lion King': 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      'Frozen II': 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    }
    
    // For now, let's use a sample video URL or fall back to a generic one
    return movie.trailerUrl || movie.videoUrl || trailerUrls[movieTitle] || 
           'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  }

  return (
    <div className="relative h-[70vh] min-h-125 overflow-hidden mb-8">
      {/* Video Background */}
      {showVideo && !videoError && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          onError={handleVideoError}
        >
          <source src={getTrailerUrl(movie.title)} type="video/mp4" />
        </video>
      )}

      {/* Fallback Background Image */}
      {(!showVideo || videoError) && (
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
      )}
      
      {/* Enhanced Gradient Overlay - stronger for video backgrounds */}
      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-black/20" />
      <div className="absolute inset-0 bg-linear-to-t from-disney-dark/90 via-transparent to-black/30" />

      {/* Volume Control - only show if video is playing */}
      {showVideo && !videoError && (
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-20 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm"
          title={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <VolumeX size={20} className="text-white" />
          ) : (
            <Volume2 size={20} className="text-white" />
          )}
        </button>
      )}

      {/* Content */}
      <div className="relative h-full flex items-center px-4 sm:px-8 lg:px-16 xl:px-24 z-10">
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
