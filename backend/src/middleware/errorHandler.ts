import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('🚨 Error occurred:', error)

  // Prisma errors
  if (error.message.includes('Unique constraint')) {
    return res.status(400).json({ error: 'Resource already exists' })
  }

  if (error.message.includes('Record to update not found')) {
    return res.status(404).json({ error: 'Resource not found' })
  }

  // Default error
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  })
}
