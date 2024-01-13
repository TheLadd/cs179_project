import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import DefaultState from "./components/DefaultState"; 
import Login from "./components/Login";
import Home from "./components/Home";
import DockView from "./components/DockView";
import UploadTransfer from "./components/UploadTransfer";

function App() {

  const inProgress = localStorage.getItem("inProgress") === "true";

  const [cachedState, setCachedState] = useState(() => {
    return DefaultState;
  });

  // function that updates cachedState along with the corresponding values in localStorage every time it is called
  const updateCachedState = (newState) => {
    // Update localStorage for each key in newState
    Object.keys(newState).forEach((key) => {
      // if its the manifest or buffer being set dont update localStorage because we have to manually set localStorage for those..
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
      updateCachedState(DefaultState);
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
        <Route path="/finish" element={<Finish cachedState={cache}/>} /> 
        </Routes>
    </BrowserRouter>
  );
}

export default App;
