import jwt from 'jsonwebtoken'

export function protectRoute(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.split(' ')[1]
    
    if (!token) {
      console.error('No token provided')
      return res.status(401).json({ message: 'No authentication token provided' })
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
      req.user = decoded
      console.log('Authenticated user:', { id: decoded.id, role: decoded.role })
      next()
    } catch (err) {
      console.error('Token verification failed:', err.message)
      return res.status(401).json({ 
        message: 'Invalid or expired token',
        error: err.message 
      })
    }
  } catch (err) {
    console.error('Authentication error:', err)
    return res.status(500).json({ 
      message: 'Authentication error',
      error: err.message 
    })
  }
}

// Middleware to check if user is a counselor
export function isCounselor(req, res, next) {
  if (req.user?.role === 'counselor') {
    next()
  } else {
    console.error('Unauthorized access - Not a counselor:', req.user)
    res.status(403).json({ message: 'Access denied. Counselor role required.' })
  }
}
