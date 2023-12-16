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
  const [txtFile, setTxtFile] = useState(localStorage.getItem("manifest") ? localStorage.getItem("manifest") : null)
  const [op, setOp] = useState(localStorage.getItem("opType") ? localStorage.getItem("opType") : "")

  // in the event if there is an operation in progress and we want to start over
  const handleStartOver = () => { 
    const activitytime = handleTimestamp()
    setCachedState({
      ...cachedState,
      inProgress: false, 
      lastActivityTime: activitytime
    })
    localStorage.setItem('inProgress', false)
  }

  const handleContinue = () => {
    const activitytime = handleTimestamp()
  
  }

  // parse manigest list 
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


  // save data into cached state 
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
    const logouttime = handleTimestamp()
    localStorage.setItem('lastActivityTime', logouttime)
    nav('/')
  }


  useEffect(() => {
    console.log(cachedState)
  }, [cachedState])

  return (
    <div>
      {cachedState.inProgress ? (
        <Alert>
            This is currently an operation in progress. would you like to continue? 
            <Button color="success"  onClick={handleContinue}>Yes</Button>
            <Button color="warning" onClick={handleStartOver}>No</Button>
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
