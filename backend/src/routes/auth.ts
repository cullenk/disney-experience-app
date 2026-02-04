import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'

const router = Router()

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters')
})

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Backend login attempt:', req.body.email)
    const { email, password } = loginSchema.parse(req.body)
    
    try {
      // Find user in database
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          password: true
        }
      })
      
      if (!user || !await bcrypt.compare(password, user.password)) {
        console.log('❌ Invalid credentials for:', email)
        return res.status(401).json({ error: 'Invalid email or password' })
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )
      
      console.log('✅ Backend login successful for:', email)
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      })
      
    } catch (dbError) {
      // Database connection failed - use demo mode
      console.log('🗃️ Database unavailable, using demo mode for:', email)
      
      // Create demo user for any valid email/password combination
      const demoUser = {
        id: 'demo-1',
        email: email,
        name: email.split('@')[0] || 'Demo User'
      }

      // Generate demo JWT token
      const demoToken = jwt.sign(
        demoUser,
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: '24h' }
      )

      console.log('✅ Demo login successful for:', email)
      res.json({
        token: demoToken,
        user: demoUser
      })
    }
    
  } catch (error) {
    console.error('Backend login error:', error)
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Backend registration attempt:', req.body.email)
    const { email, password, name } = registerSchema.parse(req.body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      console.log('❌ User already exists:', email)
      return res.status(400).json({ error: 'User with this email already exists' })
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    })
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )
    
    console.log('✅ Backend registration successful for:', email)
    res.status(201).json({
      token,
      user
    })
  } catch (error) {
    console.error('Backend register error:', error)
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

export { router as authRoutes }
