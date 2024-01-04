// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import handleTimestamp from "./Timestamp";
import { useNavigate } from "react-router-dom";
import { Alert, Button } from "@mui/material";
import { parseManifestFile } from "./manifestParser";
import "../css/Form.css";

// cached state is passed in the event of a crash.
// nav is used for route switching between different link paths

function Home ({ cachedState, setCachedState, updateCachedState }) {
  const nav = useNavigate()
  

  // checks if there is a file present to see if we're in the middle of an operation, if not, takes you to home page
  const [txtFile, setTxtFile] = useState(
    localStorage.getItem("manifest") ? localStorage.getItem("manifest") : null
  );
  const [op, setOp] = useState(
    localStorage.getItem("opType") ? localStorage.getItem("opType") : ""
  );

  // in the event if there is an operation in progress and we want to start over
  const handleStartOver = () => {
    console.log("handlestart over called")
    const defaultState = {
      inProgress: false,
      opType: "",
      lastActivityTime: cachedState.lastActivityTime,
      currStep: 0,
      totalSteps: 0,
      user: cachedState.user,
      manifest: null,
      loadList: [],
      offloadList: [],
    };

    localStorage.clear();
    setCachedState(defaultState);
    /*
    localStorage.clear();
    Object.keys(defaultState).forEach((key) => {
      localStorage.setItem(key, defaultState[key]);
    });
    */
    console.log(localStorage);

  };

  const handleContinue = () => {
    console.log("continue");
    // do something here with reloading everything from local storage back into cachedState then navigating to /dock-view
    /*
    const storedInProgress = localStorage.getItem("inProgress");
    const storedLastActivityTime = localStorage.getItem("lastActivityTime");
    const storedOpType = localStorage.getItem("opType");
    const storedCurrStep = localStorage.getItem("currStep");
    const storedTotalSteps = localStorage.getItem("totalSteps");
    const storedUser = localStorage.getItem("user");
    const storedManifest = localStorage.getItem("manifest");
    const storedLoadList = JSON.parse(localStorage.getItem("loadList"));
    const storedOffloadList = JSON.parse(localStorage.getItem("offloadList"));

    // Update cachedState with retrieved data
    setCachedState({
      inProgress: storedInProgress === "true",
      opType: storedOpType,
      lastActivityTime: storedLastActivityTime,
      currStep: parseInt(storedCurrStep),
      totalSteps: parseInt(storedTotalSteps),
      user: storedUser,
      manifest: storedManifest,
      loadList: storedLoadList || [],
      offloadList: storedOffloadList || [],
    });
    */
    parseManifestFile(localStorage.getItem("manifest"), setCachedState);

    // Navigate to /dock-view
    nav("/dock-view");
  };

  const handleSubmit = (e) => {
    // logging function goes here
    const uploadtime = handleTimestamp();
    e.preventDefault();

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const manifestContent = e.target.result;
      // Set the manifest content in the state
      //console.log('MANIFEST CONTENT READ IN FROM FILE:\n', manifestContent)
      //setCachedState({...cachedState,
      //manifest: manifestContent})
      parseManifestFile(manifestContent, updateCachedState);
      if (op === "Offloading/Onloading") {
        nav("/upload-transfer");
      } else {
        nav("/dock-view");
      }
    };
    
    setCachedState({
      ...cachedState,
      opType: op,
      lastActivityTime: handleTimestamp(),
    });

    //localStorage.setItem("opType", op);
    //localStorage.setItem("lastActivityTime", uploadtime);
    fileReader.readAsText(txtFile);
  };

  const handleLogout = () => {
    localStorage.setItem("lastActivityTime", handleTimestamp());
    localStorage.setItem("user", "");
    nav("/");
  };

  const testBackend = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/");
      //const data = await response.json()
      if (response.ok) {
        //console.log(data)
        console.log("Backend is running and responsive!");
      } else {
        console.error("Backend is not responsive. Status:", response.status);
      }
    } catch (error) {
      console.error("Error while trying to reach the backend:", error.message);
    }
  };

  //testBackend();

  // refreshes every single time CachedState is changed.  async function

  return (
    <div>
      <button onClick={handleLogout} className="primary-submit-btn">
        Logout
      </button>
      <h1>R³ Solutions</h1>
      {cachedState.inProgress ? (
        <Alert>
          There is currently an operation in progress. would you like to
          continue?
          <Button color="success" onClick={handleContinue}>
            Yes
          </Button>
          <Button color="warning" onClick={handleStartOver}>
            No
          </Button>
        </Alert>
      ) : (
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <label htmlFor="upload-manifest">Upload Manifest List </label>
            <input
              type="file"
              id="upload-manifest"
              accept=".txt"
              onChange={(e) => setTxtFile(e.target.files[0])}
              required
            />
            <br />
            <span>Please select the type of operation:</span>
            <br />
            <input
              type="radio"
              id="onoff"
              name="op-type"
              value="Offloading/Onloading"
              onChange={(e) => setOp(e.target.value)}
              required
            />
            <label htmlFor="loadbalancing">Offloading/Onloading</label>
            <input
              type="radio"
              id="loadbalancing"
              name="op-type"
              value="Load-Balancing"
              onChange={(e) => setOp(e.target.value)}
              required
            />
            <label htmlFor="loadbalancing">Load-Balancing</label>
            <br />
            <button type="submit" className="primary-submit-btn">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Home;
