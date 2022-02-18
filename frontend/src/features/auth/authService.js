// Does all of our HTTP requests and sending the data back and setting any data in local storage

import axios from 'axios' //axios is a library that we can use to make HTTP requests. Can also send our token if we need to.

const API_URL = '/api/users/'

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData) //we need to send our data. This makes the request and puts the response into our variable. 

  // when we use axios, it puts the data inside of an object called 'data'
  // so here we check for that, and set our local storage. 
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data)) // we use stringify here because we can only save strings to local storage.
    //response.data will include our token.
  }

  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}

const authService = {
  register,
  logout,
  login,
}

export default authService
