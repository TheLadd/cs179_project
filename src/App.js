import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./components/Login";
import Home from "./components/Home";
import DockView from "./components/DockView";
import UploadTransfer from "./components/UploadTransfer";
import { manifestTxtToArray } from "./components/manifestParser";

function App() {
  const defaultState = {
    inProgress: false,
    instruction: "",
    opType: "",
    lastActivityTime: null,
    currStep: 0,
    user: "",
    manifest: null,
    buffer: null,
    loadList: [],
    offloadList: [],
    moves: [],
  };
  const inProgress = localStorage.getItem("inProgress") === "true";

  const [cachedState, setCachedState] = useState(() => {
    return defaultState;
  });

  // function that updates cachedState along with the corresponding values in localStorage every time it is called
  const updateCachedState = (newState) => {
    // Update localStorage for each key in newState
    Object.keys(newState).forEach((key) => {
      // if its the manifest or buffer being set dont update localStorage because we run special logic for that
      // console.log("APP.JS: ", key)
      if (key !== "manifest" && key !== "buffer") {
        localStorage.setItem(key, newState[key]);
        //console.log("APP.JS: not manifest or buffer set ", key)
      }
      if (key == "moves" || key == "loadList" || key == "offloadList") {
        localStorage.setItem(key, JSON.stringify(newState[key]));
        //console.log("APP.JS: moves loadlist or offloadlist jsonified set ", key)
      }
    });
    //console.log("APP.JS: localstorage ", localStorage)
    setCachedState(newState);
  };

  useEffect(() => {
    if (!inProgress) {
      console.log("APP.JS: not in progress, reset cachedstate and localstorage to default");
      localStorage.clear();
      updateCachedState(defaultState);
    } else {
      console.log("APP.JS: in progress");
    }
  }, []);

  console.log("APP.JS CURRENT CACHE STATE\n", cachedState);
  console.log("CURRENT LOCALSTORAGE\n", localStorage);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login cachedState={cachedState} setCachedState={setCachedState}/>}/>
        <Route path="/home" element={<Home cachedState={cachedState} setCachedState={updateCachedState} updateCachedState={setCachedState}/>}/>
        <Route path="/upload-transfer" element={<UploadTransfer cachedState={cachedState} setCachedState={updateCachedState}/>}/>
        <Route path="/dock-view" element={<DockView cachedState={cachedState} setCachedState={updateCachedState}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
