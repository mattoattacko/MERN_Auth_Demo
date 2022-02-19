//Heres our reducers and initial state pertaining to authtication

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user ? user : null, //if there is a user in localStorage, set it to user, otherwise set it to null
  isError: false, //if we get an error back from the server, then "isError" becomes true.
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      return await authService.register(user)
    } catch (error) { // the errors could come from anywhere, so we need to check for them in multiple places.
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString()
    return thunkAPI.rejectWithValue(message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout()
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => { //resets things to their initial values
      //we want to dispatch this function after we register or login
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },

  // we need to account for pending state, fulfilled, and rejected if there is an error.
  extraReducers: (builder) => {
    builder

      // Register user
      .addCase(register.pending, (state) => {
        state.isLoading = true //true because its pending and fetching the data.
      })
      .addCase(register.fulfilled, (state, action) => { // we get data back when its fulfilled, such as the user token
        state.isLoading = false 
        state.isSuccess = true
        state.user = action.payload //action.payload is the payload (eg: user token)
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload //thunks 'rejectWithValue' will return the reject message as its payload
        state.user = null // we set the user to null because something obviously went wrong when registering.
      })

      // Login 
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload //action.payload is the response from the backend
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })

      // Logout
      .addCase(logout.fulfilled, (state) => { //if logout is fulfilled, we set the user to null. Without this, we would need to reload for logout to occur.
        state.user = null
      })
  },
})

export const { reset } = authSlice.actions //allows us to bring 'reset' into components where we want to fire it off.
export default authSlice.reducer
