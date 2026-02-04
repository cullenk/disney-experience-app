import { Router } from 'express'

const router = Router()

// Mock movie data for demo purposes
const mockMovies = {
  featured: {
    id: 'featured-1',
    title: 'The Little Mermaid',
    description: 'A young mermaid dreams of life on land in this beloved Disney classic.',
    imageUrl: 'https://via.placeholder.com/1920x800/0a0e27/ffffff?text=The+Little+Mermaid',
    genre: ['Animation', 'Family', 'Fantasy'],
    releaseYear: 2023,
    rating: 'G'
  },
  categories: {
    'Disney Originals': [
      { id: '1', title: 'Encanto', imageUrl: 'https://via.placeholder.com/300x450/0a0e27/ffffff?text=Encanto', genre: ['Animation', 'Family'] },
      { id: '2', title: 'Frozen II', imageUrl: 'https://via.placeholder.com/300x450/0a0e27/ffffff?text=Frozen+II', genre: ['Animation', 'Family'] },
      { id: '3', title: 'Moana', imageUrl: 'https://via.placeholder.com/300x450/0a0e27/ffffff?text=Moana', genre: ['Animation', 'Family'] },
      { id: '4', title: 'Soul', imageUrl: 'https://via.placeholder.com/300x450/0a0e27/ffffff?text=Soul', genre: ['Animation', 'Drama'] },
    ],
    'Marvel': [
      { id: '5', title: 'Spider-Man', imageUrl: 'https://via.placeholder.com/300x450/0a0e27/ffffff?text=Spider-Man', genre: ['Action', 'Adventure'] },
      { id: '6', title: 'Black Panther', imageUrl: 'https://via.placeholder.com/300x450/0a0e27/ffffff?text=Black+Panther', genre: ['Action', 'Adventure'] },
      { id: '7', title: 'The Avengers', imageUrl: 'https://via.placeholder.com/300x450/0a0e27/ffffff?text=Avengers', genre: ['Action', 'Adventure'] },
      { id: '8', title: 'Iron Man', imageUrl: 'https://via.placeholder.com/300x450/0a0e27/ffffff?text=Iron+Man', genre: ['Action', 'Adventure'] },
    ]
  }
}

// Get featured movie
router.get('/featured', (req, res) => {
  console.log('🎬 Fetching featured movie')
  res.json(mockMovies.featured)
})

// Get all categories
router.get('/categories', (req, res) => {
  console.log('📂 Fetching movie categories')
  res.json(mockMovies.categories)
})

// Get movies by category
router.get('/category/:category', (req, res) => {
  const { category } = req.params
  console.log(`🎭 Fetching movies for category: ${category}`)
  
  const movies = mockMovies.categories[category as keyof typeof mockMovies.categories]
  
  if (!movies) {
    return res.status(404).json({ error: 'Category not found' })
  }
  
  res.json(movies)
})

// Get all movies (flat list)
router.get('/', (req, res) => {
  console.log('🎥 Fetching all movies')
  const allMovies = Object.values(mockMovies.categories).flat()
  res.json(allMovies)
})

export { router as movieRoutes }
