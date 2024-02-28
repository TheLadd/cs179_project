import DefaultState from "./DefaultState"; 
import { useNavigate  } from "react-router-dom";
import "../css/Form.css";

// logout button. 
const LogoutButton = ({ setCachedState }) => {
    const nav = useNavigate(); 

    const handleLogout = (() => {
        setCachedState(DefaultState(null)); 
        nav('/'); 
    }); 

    return (
        <button onClick={handleLogout} className="button-styling" style={{
            width: '15%',
            marginTop: '0.5em',  
            fontSize: '30px', 
            fontWeight: 'bolder', 

          }}>Logout</button>
    )

}; 

export default LogoutButton; 