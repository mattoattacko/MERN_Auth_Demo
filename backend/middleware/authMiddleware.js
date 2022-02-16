const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// "Token" is sent in the headers
// In the http headers, we have an authorization object.
// The authorization object is what we want to check
// Express lets us view the headers
const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1] //split turns it into an array, and we want the second element of the array. 
      // The above array will have "Bearer" as its first item (0 index) and the "token" as the 2nd item (1st index). 

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET) //verify checks the token against the secret key, giving us the payload (which we use below in findByID and is the 'id').

      // Get user from the token, because the token has the user ID as the payload.
      // We want to assign it to 'req.user' so that we can access it in any route that requires authentication/is protected.
      // reads: await from the User modal and findById(), which is in the decoded user object. Find the user by the ID in the token, but not the password hash.
      req.user = await User.findById(decoded.id).select('-password')

      next() // at the end of our middleware, we call next() to move on to the next middleware.
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

module.exports = { protect }
