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
    console.log("HOME.JS: handle start over called")
    const defaultState = {
      inProgress: false,
      opType: "",
      lastActivityTime: null,
      currStep: 0,
      totalSteps: 0,
      user: cachedState.user,
      manifest: null,
      loadList: [],
      offloadList: [],
      moves: []
    };

    localStorage.clear();
    setCachedState(defaultState);
  };

  const handleContinue = () => {
    console.log("HOME.JS: continue with current operation");
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
      // parses the content and updates cachedState along with storing the original manifest in localStorage
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
    });

    fileReader.readAsText(txtFile);
  };

  const handleLogout = () => {
    localStorage.setItem("lastActivityTime", handleTimestamp());
    localStorage.setItem("user", "");
    nav("/");
  };

  // refreshes every single time CachedState is changed.  async function

  return (
    <div>
      <button onClick={handleLogout} className="primary-submit-btn">
        Logout
      </button>
      <h1>R³ Solutions</h1>
      {cachedState.inProgress == true ? (
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
