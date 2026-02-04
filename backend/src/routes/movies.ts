import { Router } from 'express'
import { tmdbService, type Movie } from '../services/tmdb.js'

const router = Router()

// Cache for storing API results (simple in-memory cache)
let movieCache: {
  featured: Movie | null
  disney: Movie[]
  marvel: Movie[]
  lastFetch: number
} = {
  featured: null,
  disney: [],
  marvel: [],
  lastFetch: 0
}

const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

async function getMovieData() {
  const now = Date.now()
  
  // Use cache if it's fresh
  if (movieCache.lastFetch && (now - movieCache.lastFetch < CACHE_DURATION)) {
    console.log('📦 Using cached movie data')
    return movieCache
  }

  console.log('🌐 Fetching fresh movie data from TMDB...')
  
  try {
    // Fetch all data in parallel for better performance
    const [featured, disney, marvel] = await Promise.all([
      tmdbService.getFeaturedMovie(),
      tmdbService.getDisneyMovies(),
      tmdbService.getMarvelMovies()
    ])

    movieCache = {
      featured,
      disney,
      marvel,
      lastFetch: now
    }

    console.log('✅ Movie data refreshed from TMDB')
  } catch (error) {
    console.log('❌ Failed to fetch from TMDB, using existing cache or fallbacks')
  }

  return movieCache
}

// Get featured movie
router.get('/featured', async (req, res) => {
  try {
    console.log('🎬 Fetching featured movie')
    const movieData = await getMovieData()
    res.json(movieData.featured)
  } catch (error) {
    console.error('Error fetching featured movie:', error)
    res.status(500).json({ error: 'Failed to fetch featured movie' })
  }
})

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    console.log('📂 Fetching movie categories')
    const movieData = await getMovieData()
    
    const categories = {
      'Disney Originals': movieData.disney,
      'Marvel': movieData.marvel
    }
    
    res.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// Get movies by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params
    console.log(`🎭 Fetching movies for category: ${category}`)
    
    const movieData = await getMovieData()
    
    let movies: Movie[] = []
    if (category === 'Disney Originals') {
      movies = movieData.disney
    } else if (category === 'Marvel') {
      movies = movieData.marvel
    }
    
    if (movies.length === 0) {
      return res.status(404).json({ error: 'Category not found or no movies available' })
    }
    
    res.json(movies)
  } catch (error) {
    console.error('Error fetching category movies:', error)
    res.status(500).json({ error: 'Failed to fetch category movies' })
  }
})

// Get all movies (flat list)
router.get('/', async (req, res) => {
  try {
    console.log('🎥 Fetching all movies')
    const movieData = await getMovieData()
    const allMovies = [...movieData.disney, ...movieData.marvel]
    res.json(allMovies)
  } catch (error) {
    console.error('Error fetching all movies:', error)
    res.status(500).json({ error: 'Failed to fetch movies' })
  }
})

export { router as movieRoutes }
