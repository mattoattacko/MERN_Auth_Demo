import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa' //fa = font awesome
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux' // need to get user from state
import { logout, reset } from '../features/auth/authSlice'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth) //gets our user from state. It takes in a function with our state, and we define which part of the state we want it from (the auth).

  const onLogout = () => {
    dispatch(logout()) //dispatches the logout action
    dispatch(reset()) //resets the state to default values
    navigate('/') // navigates back to the dashboard
  }

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/'>GoalSetter</Link>
      </div>
      <ul>
        {user ? (
          <li>
            <button className='btn' onClick={onLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to='/login'>
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to='/register'>
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  )
}

export default Header
