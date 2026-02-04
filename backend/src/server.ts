import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authRoutes } from './routes/auth.js'
import { movieRoutes } from './routes/movies.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/movies', movieRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '🏰 Disney+ Backend API is running',
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Disney+ Backend server running on port ${PORT}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`)
})
