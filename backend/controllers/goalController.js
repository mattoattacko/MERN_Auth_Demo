// 'controllers' is where we want to put our functions that could also be in the goalRouts.js file, but we put them here as best practice. 

const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalModel')
const User = require('../models/userModel')



// @desc    Get goals
// @route   GET /api/goals
// @access  Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id }) // find all goals that have the user id. This is the user that is logged in. We can access the 'req.user' because of the 'protect' middleware.

  res.status(200).json(goals)
})



// @desc    Set goal
// @route   POST /api/goals
// @access  Private
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Please add a text field')
  }

  const goal = await Goal.create({
    text: req.body.text,
    user: req.user.id,
  })

  res.status(200).json(goal)
})



// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id) // Gets the "goal" via the "id" in the URI/URL.

  if (!goal) { // If the goal doesn't exist, send a 404 error.
    res.status(400)
    throw new Error('Goal not found')
  }

  // const user = await User.findById(req.user.id) // gets the user that is logged in.
  // above code works, but all we need is the user id.
  // we remove it and add 'req' to 'user.id' in the code below  '!user' -> '!req.user' and '!== user.id' -> '!== req.user.id'

  // Check for user
  if (!req.user) { 
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) { // "goal" has a "user" field on it, which is an object ID (user). We need to convert it to a string before we check it.
    res.status(401)
    throw new Error('User not authorized')
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { // updates the goal via findByIdAndUpdate.
    new: true,
  })

  res.status(200).json(updatedGoal)
})



// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(400)
    throw new Error('Goal not found')
  }

  // const user = await User.findById(req.user.id) // removed for reasons stated in line 53

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
  }

  await goal.remove()

  res.status(200).json({ id: req.params.id })
})



module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
}
