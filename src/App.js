import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useState, useEffect } from 'react'

import Login from "./components/Login"
import Home from "./components/Home"
import DockView from "./components/DockView"
import UploadTransfer from "./components/UploadTransfer"
import { parseManifestFile } from "./components/manifestParser";


function App() {
  const defaultState = {
    inProgress: false,
    opType: "",
    lastActivityTime: null,
    currStep: 0,
    totalSteps: 0,
    user: "",
    manifest: null,
    loadList: [],
    offloadList: [], 
    moves: []
  }
  const inProgress = localStorage.getItem("inProgress") === "true";

  const [cachedState, setCachedState] = useState(() => {
    if (inProgress) {
      console.log("APP.JS: in progress, cachedstate restored from localstorage")
      return {
        inProgress : true,
        opType: localStorage.getItem("opType") || "",
        lastActivityTime: localStorage.getItem("lastActivityTime") || "",
        currStep: parseInt(localStorage.getItem("currStep")) || 0,
        totalSteps: parseInt(localStorage.getItem("totalSteps")) || 0,
        user: "",
        //manifest: localStorage.getItem("manifest") || null,
        loadList: JSON.parse(localStorage.getItem("loadList")) || [],
        offloadList: JSON.parse(localStorage.getItem("offloadList")) || [],
        moves: JSON.parse(localStorage.getItem("moves")) || [],
      };
    } else {
      localStorage.clear();
      console.log("APP.JS: not in progress, reset cachedstate and localstorage to default")
      return defaultState;
    }
  });

  useEffect(() => {
    // Call parseManifestFile after cachedState is initialized so that we can pass setCachedState into parseManifestFile
    if (inProgress) {
      parseManifestFile(localStorage.getItem("manifest"), setCachedState);
    }
  }, [cachedState.inProgress]);

  // function that updates cachedState along with the corresponding values in localStorage every time it is called
  const updateCachedState = (newState) => {
    setCachedState((prevCachedState) => {
      const updatedState = { ...prevCachedState, ...newState };

      // Update localStorage for each key in newState
      Object.keys(newState).forEach((key) => {
        if (key !== "manifest") {
          localStorage.setItem(key, newState[key]);
        }
        if (key == "moves" || key == "loadList" || key == "offloadList") {
          localStorage.setItem(key, JSON.stringify(newState[key]));
        }
      });

      return updatedState;
    });
  };

  console.log("APP.JS CURRENT CACHE STATE\n", cachedState);
  console.log('CURRENT LOCALSTORAGE\n', localStorage)


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login cachedState={cachedState} setCachedState={updateCachedState}/>} /> 
        <Route path="/home" element={<Home cachedState={cachedState} setCachedState={updateCachedState} updateCachedState={setCachedState}/>} /> 
        <Route path="/upload-transfer" element={<UploadTransfer cachedState={cachedState} setCachedState={updateCachedState}/>} />
        <Route path="/dock-view" element={<DockView cachedState={cachedState} setCachedState={updateCachedState}/>} /> 
      </Routes>
    </BrowserRouter>


  );
}

export default App;
