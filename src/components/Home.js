// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import handleTimestamp from "./Timestamp";
import { useNavigate } from "react-router-dom";
import { Alert, Button } from "@mui/material";
import { manifestTxtToArray } from "./manifestParser";
import { initializeCargoState } from "./BackendRoutes";
import DefaultState from "./DefaultState"; 
import "../css/Form.css";

// cached state is passed in the event of a crash.
// nav is used for route switching between different link paths

function Home ({ cachedState, setCachedState }) {
  const nav = useNavigate()

  // checks if there is a file present to see if we're in the middle of an operation, if not, takes you to home page
  const [txtFile, setTxtFile] = useState(
    localStorage.getItem("manifest") ? localStorage.getItem("manifest") : null
  );
  const [op, setOp] = useState(null)

  // in the event if there is an operation in progress and we want to start over
  const handleStartOver = () => {
    console.log("HOME.JS: handle start over called")
    localStorage.clear();
    setCachedState(DefaultState(cachedState));
  };

  const handleContinue = () => {
    console.log("HOME.JS: continue with current operation");

    // create new state backed up from localstorage
    const updatedState = {
      ...cachedState,
      inProgress : true,
      instruction: localStorage.getItem("instruction") || "",
      opType: localStorage.getItem("opType") || "",
      lastActivityTime: localStorage.getItem("lastActivityTime") || "",
      currStep: parseInt(localStorage.getItem("currStep")) || 0,
      manifest: manifestTxtToArray(localStorage.getItem("manifest")),
      buffer: manifestTxtToArray(localStorage.getItem("buffer")),
      loadList: JSON.parse(localStorage.getItem("loadList")) || [],
      offloadList: JSON.parse(localStorage.getItem("offloadList")) || [],
      moves: JSON.parse(localStorage.getItem("moves")) || [],
    };

    // set cachedState to the state that was backed up from localstorage
    setCachedState({
      ...updatedState
    });
    initializeCargoState(updatedState, setCachedState);
    nav("/dock-view");
  };

  // when you chose the type of operation you want then navigate to appropriate screen
  const handleSubmit = (e) => {
    console.log("HOME.JS: handlesubmit");
    // logging function goes here
    e.preventDefault();

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const manifestContent = e.target.result;

      const updatedState = {
        ...cachedState,
        //manifest: manifestTxtToArray(manifestContent),
        manifest: manifestContent,
        opType: op,
      };
      //console.log("HOME.JS: ", manifestContent)
      setCachedState({
        ...updatedState,
        manifest: manifestTxtToArray(manifestContent),
      });

      localStorage.setItem("manifest", manifestContent);

      initializeCargoState(updatedState, setCachedState);

      if (op === "Offloading/Onloading") {
        nav("/upload-transfer");
      } else {
        nav("/dock-view");
      }
    };

    fileReader.readAsText(txtFile);

  };

  const handleLogout = () => {
    console.log("HOME.JS: handle log out");
    // TODO FIX THIS
    localStorage.setItem("lastActivityTime", handleTimestamp());
    localStorage.setItem("user", "");
    nav("/");
  };

  // i dont think this code does anything but i am too scared to remove it just yet...

  // refreshes every single time CachedState is changed.  async function
  // useEffect(() => {
  //   if (localStorage.getItem("inProgress" === "true")){
  //     console.log("HOME.JS: reset to default");
  //     setCachedState(defaultState);
  //   }
  // }, [cachedState.inProgress]);

  return (
    <div>
      <button onClick={handleLogout} className="primary-submit-btn">
        Logout
      </button>
      <h1>R³ Solutions</h1>
      {localStorage.getItem("inProgress") === "true" ? (
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
