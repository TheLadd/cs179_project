import handleTimestamp from "./timestamp"; 
import { useNavigate } from "react-router-dom"; 
import React, { useState } from 'react'; 

function Login() {
    const [formData, setFormData] = useState({
        name: '', 
        timein: '', 
        timeout: ''
    }); 

    const nav = useNavigate(); 

    const handleSubmit = (e) => {
        e.preventDefault(); 
        const ti = handleTimestamp(e.nativeEvent.timeStamp); 
        setFormData({
            ...formData, 
            name: e.target.value, 
            timein: ti
        }); 
        console.log(formData); 
        nav('/home'); 

    }; 

    return (
    <div>
      <form id="login-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Name</label>
        <input type="text" id="username" name="username" value={formData.username}></input>
        <button type="submit">Login</button>
      </form>
    </div>

    ); 
}

export default Login; 