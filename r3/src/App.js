import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useState } from 'react'; 
import Login from "./components/Login"
import Home from "./components/Home"
import UploadTransfer from "./components/UploadTransfer"


function App() {

  const [cachedState, setCachedState] = useState({
    inProgress: localStorage.getItem("inProgress") === "true",
    opType: localStorage.getItem("opType") ? localStorage.getItem("opType") : "", 
    lastActivityTime: localStorage.getItem("lastActivityTime") ? localStorage.getItem("lastActivityTime"): "", 
    currStep: localStorage.getItem("currStep") ? localStorage.getItem("currStep") : 0, 
    totalSteps: localStorage.getItem("totalSteps") ? localStorage.getItem("totalSteps") : 0, 
    lastUser: localStorage.getItem("lastUser") ? localStorage.getItem("lastUser") : "", 
    manifest: localStorage.getItem("manifest") ? localStorage.getItem("manifest") : null, 
    loadList: localStorage.getItem("loadList") ? JSON.parse(localStorage.getItem("loadList")) : [],
    offloadList: localStorage.getItem("offloadList") ? JSON.parse(localStorage.getItem("offloadList")) : []
  });

  console.log("APP.JS CURRENT CACHE STATE\n", cachedState);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login cachedState={cachedState} setCachedState={setCachedState}/>} /> 
        <Route path="/home" element={<Home cachedState={cachedState} setCachedState={setCachedState}/>} /> 
        <Route path="/upload-transfer" element={<UploadTransfer cachedState={cachedState} setCachedState={setCachedState}/>} />

      </Routes>
    </BrowserRouter>


  );
}

export default App;
