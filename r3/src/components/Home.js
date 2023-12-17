// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import handleTimestamp from './Timestamp'
import { useNavigate } from 'react-router-dom'
import { Alert, Button } from '@mui/material'

// cached state is passed in the event of a crash.
// nav is used for route switching between different link paths

function Home ({ cachedState, setCachedState }) {
  const nav = useNavigate()

  // checks if there is a file present to see if we're in the middle of an operation, if not, takes you to home page
  const [txtFile, setTxtFile] = useState(
    localStorage.getItem('manifest') ? localStorage.getItem('manifest') : null
  )
  const [op, setOp] = useState(
    localStorage.getItem('opType') ? localStorage.getItem('opType') : ''
  )

  // in the event if there is an operation in progress and we want to start over
  const handleStartOver = () => {
    const defaultState = {
      inProgress: false,
      opType: '',
      lastActivityTime: cachedState.lastActivityTime,
      currStep: 0,
      totalSteps: 0,
      lastUser: cachedState.lastUser,
      manifest: null,
      loadList: [],
      offloadList: []
    }

    setCachedState(defaultState)

    Object.keys(defaultState).forEach(key => {
      localStorage.setItem(key, defaultState[key])
    })
    console.log(localStorage)
  }

  const handleContinue = () => {
    // const activitytime = handleTimestamp()
    console.log('continue')
    // do something here with reloading everything from local storage
  }

  // parse manifest list
  function parseManifestFile (manifestTxt) {
    const regexPattern = /\[(\d{2},\d{2})\],\s\{(\d{5})\},\s([^\r\n]+)/g

    // Initialize an array to store the parsed data
    const parsedData = []

    // Use a loop to match and extract data from the input string
    let match
    while ((match = regexPattern.exec(manifestTxt)) !== null) {
      // Extract matched groups and push them to the result array
      const [, position, weight, name] = match
      parsedData.push([`[${position}]`, weight, name])
    }

    //console.log(parsedData)

    /*
    setCachedState({
      ...cachedState,
      manifest: parsedData
    })
    localStorage.setItem(
      'manifest',
      cachedState.manifest
        ?.map(
          (innerArray, rowIndex, array) =>
            innerArray
              .map((str, index) => (index === 1 ? `{${str}}` : str))
              .join(', ') + (rowIndex === array.length - 1 ? '' : '\n')
        )
        .join('')
    )
    */
        
    setCachedState(prevCachedState => {
      const updatedManifest = parsedData
        .map(
          (innerArray, rowIndex, array) =>
            innerArray
              .map((str, index) => (index === 1 ? `{${str}}` : str))
              .join(', ') + (rowIndex === array.length - 1 ? '' : '\n')
        )
        .join('')

      // Set the updated manifest in localStorage
      localStorage.setItem('manifest', updatedManifest)

      // Return the updated state
      return {
        ...prevCachedState,
        manifest: parsedData
      }
    })

    if (op === 'Offloading/Onloading') {
      nav('/upload-transfer')
    } else {
      nav('/ship-view')
    }
  }

  const handleSubmit = e => {
    // logging function goes here
    const uploadtime = handleTimestamp()
    e.preventDefault()

    const fileReader = new FileReader()
    fileReader.onload = e => {
      const manifestContent = e.target.result
      // Set the manifest content in the state
      //console.log('MANIFEST CONTENT READ IN FROM FILE:\n', manifestContent)
      parseManifestFile(manifestContent)
    }

    localStorage.setItem('opType', op)
    localStorage.setItem('lastActivityTime', uploadtime)
    fileReader.readAsText(txtFile)
  }

  const handleLogout = () => {
    localStorage.setItem('lastActivityTime', handleTimestamp())
    localStorage.setItem('lastUser', '')
    nav('/')
  }

  const testBackend = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/')
      //const data = await response.json()
      if (response.ok) {
        //console.log(data)
        console.log('Backend is running and responsive!')
      } else {
        console.error('Backend is not responsive. Status:', response.status)
      }
    } catch (error) {
      console.error('Error while trying to reach the backend:', error.message)
    }
  }

  //testBackend();

  // refreshes every single time CachedState is changed.  async function

  return (
    <div>
      {cachedState.inProgress ? (
        <Alert>
          This is currently an operation in progress. would you like to
          continue?
          <Button color='success' onClick={handleContinue}>
            Yes
          </Button>
          <Button color='warning' onClick={handleStartOver}>
            No
          </Button>
        </Alert>
      ) : (
        <div>
          <button type='button' onClick={handleLogout}>
            Logout
          </button>

          <form onSubmit={handleSubmit}>
            <label htmlFor='upload-manifest'>Upload Manifest List</label>
            <input
              type='file'
              id='upload-manifest'
              accept='.txt'
              onChange={e => setTxtFile(e.target.files[0])}
              required
            />
            <label htmlFor='op-type'>
              Please select the type of operation:
            </label>
            <br />
            <input
              type='radio'
              id='onoff'
              name='op-type'
              value='Offloading/Onloading'
              onChange={e => setOp(e.target.value)}
              required
            />
            <label htmlFor='loadbalancing'>Offloading/Onloading</label>
            <input
              type='radio'
              id='loadbalancing'
              name='op-type'
              value='Load-Balancing'
              onChange={e => setOp(e.target.value)}
              required
            />
            <label htmlFor='loadbalancing'>Load-Balancing</label>
            <button type='submit'>Submit</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Home
