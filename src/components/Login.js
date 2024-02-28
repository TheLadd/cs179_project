import handleTimestamp from './Timestamp'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { handleLogMessage } from './BackendRoutes'; 
import Div from './Div'; 
import "../css/Login.css"; 
import "../css/Finish.css"; 

// assumption: if we logout, we are clearing all the user data 
function Login ({ cachedState, setCachedState }) {
  const nav = useNavigate(); 
  const [user, setCurrentUser] = useState({
    name: '',
    ti: ''
  })

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
    //localStorage.setItem('user', user.name); 

    setCachedState({
      ...cachedState,
      user: user.name
    });

    // have to manually set localstorage here because don't want to accidently override the backup in localstorage before logging in
    localStorage.setItem('user', user.name); 
    handleLogMessage(user.name + ' signed in.')
    nav('/home'); 
  }


  return (
    <div id='main'>
    <Div sx={{
      bgcolor: 'finish.main', 
      padding: '0.75%', 
      maxHeight: 1000, 
      margin: 'auto', 
      marginTop: '3%', 
      border: 80, 
      borderColor: 'finish.border', 
      borderRadius: 10, 
      fontWeight: 'bold', 
      fontSize: 40,  
      height: '80%', 
      width: '70%', 
      fontFamily: 'Raleway', 
      color: 'finish.text', 
      display: 'flex', 
      textAlign: 'center', 
      alignItems: 'center', 
     flexDirection: 'column', 
    }}> 
      <h1 className="header-styling" style={{marginBottom: '-5%'}}>R³ Solutions</h1>
        <h2 className='header-styling' style={{marginBottom: '-3%'}}><em>shipping container optimizer</em><br/></h2>
        <h5 style={{marginBottom: '2%'}}>sign in below to get started.</h5>
      <form id='login-form' onSubmit={handleSubmit}>
        <div>Name: </div><br/>
        <input
          type='text' 
          id='username'
          name='username'
          autoComplete='off'
          value={cachedState.name}
          onChange={handleChange}
          className='input-text'
        ></input><br/>
        <div onClick={handleSubmit} className='button-styling' style={{maxWidth: '100%', fontSize: '0.5em', padding: '0.3em', border: '5px solid #0A9396'}}>Login</div>
      </form>
      
    </Div> 
    </div>
  ); 
}



export default Login; 

