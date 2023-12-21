import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useState, useEffect } from 'react'

import Login from "./components/Login"
import Home from "./components/Home"
import DockView from "./components/DockView"
import UploadTransfer from "./components/UploadTransfer"


function App() {

  const [cachedState, setCachedState] = useState({
    inProgress: localStorage.getItem("inProgress") === "true" ? true : false,
    opType: localStorage.getItem("opType")
      ? localStorage.getItem("opType")
      : "",
    lastActivityTime: localStorage.getItem("lastActivityTime")
      ? localStorage.getItem("lastActivityTime")
      : "",
    currStep: localStorage.getItem("currStep")
      ? localStorage.getItem("currStep")
      : 0,
    totalSteps: localStorage.getItem("totalSteps")
      ? localStorage.getItem("totalSteps")
      : 0,
    user: "",
    manifest: localStorage.getItem("manifest")
      ? localStorage.getItem("manifest")
      : null,
    loadList: localStorage.getItem("loadList")
      ? localStorage.getItem("loadList")
      : [],
    offloadList: localStorage.getItem("offloadList")
      ? localStorage.getItem("offloadList")
      : [],
    moves: localStorage.getItem("moves") ? localStorage.getItem("moves") : [],
  });

  const updateCachedState = (newState) => {
    setCachedState((prevCachedState) => {
      const updatedState = { ...prevCachedState, ...newState };

      // Update localStorage for each key in newState
      Object.keys(newState).forEach((key) => {
        if (key !== "manifest") {
          localStorage.setItem(key, newState[key]);
        }
      });

      return updatedState;
    });
  };

useEffect(() => {
  if (localStorage.getItem("inProgress") === "false") {
    const defaultState = {
      inProgress: false,
      opType: '',
      lastActivityTime: cachedState.lastActivityTime,
      currStep: 0,
      totalSteps: 0,
      user: cachedState.user,
      manifest: null,
      loadList: [],
      offloadList: [], 
      moves: []
    }

    localStorage.clear();
    updateCachedState(defaultState);

    console.log("reset cachedstate and localstorage to default")
    /*
    Object.keys(defaultState).forEach(key => {
      localStorage.setItem(key, (defaultState[key]))

    })
    */
  }
}, [cachedState.inProgress])

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
