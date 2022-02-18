import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser } from 'react-icons/fa'
import { register, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

function Register() {
  const [formData, setFormData] = useState({ 
    //everything in here is the default form fields state
    name: '',
    email: '',
    password: '',
    password2: '', //password2 is the confirm password field
  })

  const { name, email, password, password2 } = formData

  // Initializes navigate and dispatch
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Selects the stuff we want from state
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth // we need to specify the slice of state we want to use
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) { //if we are successful or if we are logged in, that user will include the token and some other stuff, and then we navigate them to the dashboard.
      navigate('/')
    }

    dispatch(reset()) // resets state to default values

  }, [user, isError, isSuccess, message, navigate, dispatch]) //if anything in this dependency array changes, it will fire the useEffect

  // in onChange, we are setting the state of the form fields.
  // this allows us to update the state of the form fields as the user types.
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState, //spreads the previous state
      [e.target.name]: e.target.value, //we get the key by whatever the name value is
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (password !== password2) { // checks for password match
      toast.error('Passwords do not match')
    } else {
      const userData = { // we want to try and register the user
        name,
        email,
        password,
      }

      dispatch(register(userData)) // dispatch the register function (brought in from "authSlice") and pass in the user
    }
  }

  // Checks if we are loading
  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className='heading'>
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              id='name'
              name='name'
              value={name}
              placeholder='Enter your name'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password2'
              name='password2'
              value={password2}
              placeholder='Confirm password'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Register
