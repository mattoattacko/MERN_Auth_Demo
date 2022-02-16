const express = require('express')
const router = express.Router()
const {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
} = require('../controllers/goalController')

const { protect } = require('../middleware/authMiddleware') // protect middleware allows us to "protect" our routes

// Functions from the "goalController" file that we set to certain endpoints
router.route('/').get(protect, getGoals).post(protect, setGoal)
router.route('/:id').delete(protect, deleteGoal).put(protect, updateGoal)

// if we hit 'api/goals' form the front end, we want to redirect it to this file. So we can change it from 'api/goals' to '/'
// See notebook notes

module.exports = router
