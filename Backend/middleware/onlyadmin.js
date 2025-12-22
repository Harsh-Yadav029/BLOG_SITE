import jwt from 'jsonwebtoken'

export const onlyadmin = (req, res, next) => {
  try {
    const token = req.cookies?.access_token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided'
      })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decodedToken
    
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Admin access only'
      })
    }
   

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    })
  }
}


