import handleTimestamp from './Timestamp'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'


function Login ({ cachedState, setCachedState }) {
  const [user, setCurrentUser] = useState({
    name: '',
    ti: ''
  })

  const nav = useNavigate()
  
  const handleChange = e => {
    e.preventDefault()
    const tim = handleTimestamp()
    setCurrentUser({
      ...user,
      name: e.target.value,
      ti: tim
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    const tim = handleTimestamp()
    setCurrentUser({
      ...user,
      name: e.target.value,
      ti: tim
    })
    localStorage.setItem('user', user.name)
setCachedState({
  ...cachedState,
  user: user.name

})

    localStorage.setItem('lastActivityTime', user.ti)
    // logging
    nav('/home')
  }

  const handleLogout = e => {
    const to = handleTimestamp()
    localStorage.setItem('lastActivityTime', to)
    // logging
  }
  return (
<div id='main'>
  <form id='login-form' onSubmit={handleSubmit}>
    <label htmlFor='username'>Name</label>
    <input
      type='text'
      id='username'
      name='username'
      value={cachedState.name}
      onChange={handleChange}
    ></input>

    <button type='submit'>Login</button>
  </form>
</div>



  )
}
export default Login

