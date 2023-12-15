// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import handleTimestamp from './timestamp';
import { useNavigate } from 'react-router-dom';

function Home({ cachedState, setCachedState }) {
  const nav = useNavigate();
  const [txtFile, setTxtFile] = cachedState.manifest;
  const [op, setOp] = cachedState.opType;

  const handleStartOver = () => {
    const activitytime = handleTimestamp();
    setCachedState({
      ...cachedState,
      manifest: null,
      transferList: null,
      inProgress: false,
      lastActivityTime: activitytime,
      currStep: 0,
      totalSteps: 0,
    });
    localStorage.setItem('inProgress', false);
  };

  const handleContinue = () => {
    // do something here with cachedState
  };

  const showAlert = (currOp, recentActivity) => {
    const title = `There is already a "${currOp}" in progress from ${recentActivity}!`;
    if (window.confirm(`${title}\n\nWould you like to continue?`)) {
      handleContinue();
    } else {
      handleStartOver();
    }
  };

  const handleSubmit = (e) => {
    // logging function goes here
    const uploadtime = handleTimestamp();
    e.preventDefault();
    setCachedState({
      ...cachedState,
      opType: op,
      manifest: txtFile,
      lastActivityTime: uploadtime,
    });
    localStorage.setItem('opType', op);
    localStorage.setItem('lastActivityTime', uploadtime);
    localStorage.setItem('manifest', txtFile);

    if (op === 'Offloading/Onloading') {
      nav('/upload-transfer');
    } else {
      nav('/ship-view');
    }
  };

  const handleLogout = () => {
    nav('/login');
  };

  useEffect(() => {
    if (cachedState.inProgress) {
      showAlert(cachedState.opType, cachedState.lastActivityTime);
    }
  }, [cachedState.inProgress, cachedState.opType, cachedState.lastActivityTime, showAlert]);
  

  return (
    <div>
      {cachedState.inProgress ? (
        <div>{/* You may display something specific for in-progress state here */}</div>
      ) : (
        <div>
          <button type="button" onClick={handleLogout}>Logout</button>

          <form onSubmit={handleSubmit}>
            <label htmlFor="upload-manifest">Upload Manifest List</label>
            <input
              type="file"
              id="upload-manifest"
              accept=".txt"
              onChange={(e) => setTxtFile(e.target.files[0])}
              required={true}
            />
            <label htmlFor="op-type">Please select the type of operation: </label>
            <br />
            <input
              type="radio"
              id="onoff"
              name="op-type"
              value="Offloading/Onloading"
              onChange={(e) => setOp(e.target.value)}
            />
            <label htmlFor="loadbalancing">Offloading/Onloading</label>
            <input
              type="radio"
              id="loadbalancing"
              name="op-type"
              value="Load-Balancing"
              onChange={(e) => setOp(e.target.value)}
            />
            <label htmlFor="loadbalancing">Load-Balancing</label>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Home;
