const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler') //handles exceptions
const User = require('../models/userModel')

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  } 

  // Check if user exists
  const userExists = await User.findOne({ email }) //finds the user by the email passed in

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  // Check for user password
  if (user && (await bcrypt.compare(password, user.password))) { // 'password' is from the user input form or postman. 'user.password' is the hashed password from the database.
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id) //req.user.id is the id from the token, which we put in the payload. We set it in the protect middleware.
  // 'req.user.id' would be whichever user is authenticated. 

  res.status(200).json({ // when a user is logged in and they hit this route, we want to send back the user data.
    id: _id,
    name,
    email,
  })
})

// Generate JWT
const generateToken = (id) => { //id is the user id, which we put as the payload
  return jwt.sign({ id }, process.env.JWT_SECRET, { // when we sign it, we are setting the ID
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
}
