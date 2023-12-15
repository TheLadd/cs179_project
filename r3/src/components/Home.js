// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import handleTimestamp from './Timestamp'
import { useNavigate } from 'react-router-dom'

function Home ({ cachedState, setCachedState }) {
  const nav = useNavigate()

  const [txtFile, setTxtFile] = useState(localStorage.getItem("manifest") ? localStorage.getItem("manifest") : null)
  const [op, setOp] = useState(localStorage.getItem("opType") ? localStorage.getItem("opType") : "")

  //const [txtFile, setTxtFile] = useState(null)
  //const [op, setOp] = useState(null)

  const handleStartOver = () => {
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

  const handleManipulatedManifest = (manifestData) => {
    console.log(manifestData);
    /*
    setCachedState({
        ...cachedState,
        manifest: manifestData,
      });
      */
    localStorage.setItem('manifest', manifestData)
    setCachedState({
      inProgress: localStorage.getItem("inProgress") ? localStorage.getItem("inProgress") : false, 
      opType: localStorage.getItem("opType") ? localStorage.getItem("opType") : "", 
      lastActivityTime: localStorage.getItem("lastActivityTime") ? localStorage.getItem("lastActivityTime"): "", 
      currStep: localStorage.getItem("currStep") ? localStorage.getItem("currStep") : 0, 
      totalSteps: localStorage.getItem("totalSteps") ? localStorage.getItem("totalSteps") : 0, 
      manifest: localStorage.getItem("manifest") ? localStorage.getItem("manifest") : null, 
      transferList: localStorage.getItem("transferList") ? localStorage.getItem("transferList") : null 
    });
    // You can now pass `manifestData` to your backend or perform other operations.
  };

  const handleSubmit = e => {
    // logging function goes here
    const uploadtime = handleTimestamp()
    e.preventDefault()

    /*
    setCachedState({
      ...cachedState,
      opType: op,
      manifest: txtFile,
      lastActivityTime: uploadtime
    })
    */
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

    /*
    setCachedState({
        ...currentState,
        opType: op,
        manifest: txtFile,
        lastActivityTime: uploadtime,
      });
    */
    localStorage.setItem('opType', op)
    localStorage.setItem('lastActivityTime', uploadtime)

    fileReader.readAsText(txtFile);
    //console.log(cachedState);
  }

  const handleLogout = () => {
    nav('/login')
  }

  /*
  useEffect(() => {
    if (cachedState.inProgress) {
      showAlert(cachedState.opType, cachedState.lastActivityTime)
    }
    console.log(cachedState)
  }, [cachedState,
    cachedState.inProgress,
    cachedState.opType,
    cachedState.lastActivityTime
  ])
  */
  useEffect(() => {
    console.log(cachedState)
  }, [cachedState])

  return (
    <div>
      {/*cachedState.inProgress*/false ? (
        <div>
          {/* You may display something specific for in-progress state here */}
        </div>
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
