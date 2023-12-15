import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useState } from 'react'; 
import Login from "./components/Login"
import Home from "./components/Home"
import UploadTransfer from "./components/UploadTransfer"


function App() {
  const [cachedState, setCachedState] = useState({
    inProgress: localStorage.getItem("inProgress") ? localStorage.getItem("inProgress") : false, 
    opType: localStorage.getItem("opType") ? localStorage.getItem("opType") : "", 
    lastActivityTime: localStorage.getItem("lastActivityTime") ? localStorage.getItem("lastActivityTime"): "", 
    currStep: localStorage.getItem("currStep") ? localStorage.getItem("currStep") : 0, 
    totalSteps: localStorage.getItem("totalSteps") ? localStorage.getItem("totalSteps") : 0, 
    manifest: localStorage.getItem("manifest") ? localStorage.getItem("manifest") : null, 
    transferList: localStorage.getItem("transferList") ? localStorage.getItem("transferList") : null 
  });




  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login cachedState={cachedState} setCachedState={setCachedState}/>} /> 
        <Route path="/home" element={<Home cache={cachedState} setCachedState={setCachedState}/>} /> 
        <Route path="/upload-transfer" element={<UploadTransfer />} />

      </Routes>
    </BrowserRouter>


  );
}

export default App;
