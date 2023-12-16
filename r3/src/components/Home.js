// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import handleTimestamp from './Timestamp'
import { useNavigate } from 'react-router-dom'
import { Alert, Stack } from '@mui/material'

// cached state is passed in the event of a crash. 
// nav is used for route switching between different link paths 

function Home ({ cachedState, setCachedState }) { 
  const nav = useNavigate() 

  // checks if there is a file present to see if we're in the middle of an operation, if not, takes you to home page 
  const [txtFile, setTxtFile] = useState(localStorage.getItem("manifest") ? localStorage.getItem("manifest") : null)
  const [op, setOp] = useState(localStorage.getItem("opType") ? localStorage.getItem("opType") : "")

  //const [txtFile, setTxtFile] = useState(null)
  //const [op, setOp] = useState(null)

  const handleStartOver = () => { // 
    const activitytime = handleTimestamp()
    setCachedState({
      ...cachedState,
      lastActivityTime: activitytime
    })
    localStorage.setItem('inProgress', false)
  }

  const handleContinue = () => {
    // do something here with cachedState
  }

  const showAlert = (currOp, recentActivity) => {
    const title = `There is already a "${currOp}" in progress from ${recentActivity}!`
    if (window.confirm(`${title}\n\nWould you like to continue?`)) {
      handleContinue()
    } else {
      handleStartOver()
    }
  }

  const testBackend = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/solve');
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        console.log('Backend is running and responsive!');
      } else {
        console.error('Backend is not responsive. Status:', response.status);
      }
    } catch (error) {
      console.error('Error while trying to reach the backend:', error.message);
    }
  };

  testBackend();
  
  const handleManifestFile = (manifestText) => {
    const lines = manifestText.split('\n');

    const manifestData = lines.map((line) => {
      const matches = line.match(/\[(\d+,\d+)\], \{(\d+)\}, (.+)/);

      if (matches) {
        const coordinates = matches[1].split(',').map(Number);
        const id = Number(matches[2]);
        const name = matches[3].trim();

        return { coordinates, id, name };
      }

      return null; // Skip lines that don't match the expected format
    }).filter(Boolean);

    // Call a function to handle the manipulated manifestData
    handleManipulatedManifest(manifestData);
  };


  // upload manifest list and parse 
  const handleManipulatedManifest = (manifestData) => {
    console.log(manifestData);
    localStorage.setItem('manifest', manifestData)
    setCachedState({
      ...cachedState,
      opType: op,
      manifest: txtFile,
      lastActivityTime: handleTimestamp()
    })
    
    // You can now pass `manifestData` to your backend or perform other operations.
  };

  const handleSubmit = e => {
    // logging function goes here
    const uploadtime = handleTimestamp()
    e.preventDefault()

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const manifestContent = e.target.result;

      // Set the manifest content in the state
      handleManifestFile(manifestContent);
    }
    console.log(cachedState);
    if (op === 'Offloading/Onloading') {
      nav('/upload-transfer')
    } else {
      nav('/ship-view')
    }


    localStorage.setItem('opType', op)
    localStorage.setItem('lastActivityTime', uploadtime)

    fileReader.readAsText(txtFile);
  }

  const handleLogout = () => {
    nav('/login')
  }


  useEffect(() => {
    console.log(cachedState)
  }, [cachedState])

  return (
    <div>
      {true ? (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert> 
            This is a success alert — check it out!
          </Alert>
    </Stack>
      
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
              required={true}
            />
            <label htmlFor='op-type'>
              Please select the type of operation:{' '}
            </label>
            <br />
            <input
              type='radio'
              id='onoff'
              name='op-type'
              value='Offloading/Onloading'
              onChange={e => setOp(e.target.value)}
            />
            <label htmlFor='loadbalancing'>Offloading/Onloading</label>
            <input
              type='radio'
              id='loadbalancing'
              name='op-type'
              value='Load-Balancing'
              onChange={e => setOp(e.target.value)}
            />
            <label htmlFor='loadbalancing'>Load-Balancing</label>
            <button type='submit'>Submit</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Home;
