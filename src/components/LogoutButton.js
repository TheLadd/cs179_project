import DefaultState from "./DefaultState"; 
import { useNavigate  } from "react-router-dom";
import "../css/Form.css";

// logout button. 
const LogoutButton = ({ setCachedState }) => {
    const nav = useNavigate(); 

    const handleLogout = (() => {
        setCachedState({DefaultState}); 
        nav('/login'); 
    }); 

    return (
        <button onClick={handleLogout} className="primary-submit-btn">Logout</button>
    )

}; 

export default LogoutButton; 