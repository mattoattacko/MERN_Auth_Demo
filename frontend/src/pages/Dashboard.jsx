// We dont need to import React, because we are using the default export.

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux' // need to get user from state. Need useDispatch to get goals
import GoalForm from '../components/GoalForm'
import GoalItem from '../components/GoalItem'
import Spinner from '../components/Spinner'
import { getGoals, reset } from '../features/goals/goalSlice'

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth) //gets our "user" from state. It takes in a function with our state, and we define which part of the state we want it from (the auth).

  const { goals, isLoading, isError, message } = useSelector(
    (state) => state.goals
  )

  useEffect(() => {
    if (isError) {
      console.log(message)
    }

    if (!user) {
      navigate('/login')
    }

    dispatch(getGoals()) // get goals from the server. aka fetches our goals from the backend. Then we put it in the above 'const' so we have access to it.

    return () => { //resets the state on unmount, so when we leave the dashboard we want the goals to clear. 
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch]) //dependencies array. If anything in this array changes, it will fire the useEffect

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className='heading'>
        <h1>Welcome {user && user.name}</h1>
        <p>Goals Dashboard</p>
      </section>

      <GoalForm />

      <section className='content'>
        {goals.length > 0 ? ( // if there are goals, we want to display them
          <div className='goals'>
            {goals.map((goal) => (
              <GoalItem key={goal._id} goal={goal} />
            ))}
          </div>
        ) : (
          <h3>You have not set any goals</h3>
        )}
      </section>
    </>
  )
}

export default Dashboard