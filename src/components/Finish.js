import { useNavigate } from 'react-router-dom'; 
import DefaultState from './DefaultState';
import { ButtonGroup } from '@mui/material';
import Div from "./Div"; 
// will display the finish screen 
const Finish = ({ cachedState, setCachedState }) => { 
    const nav = useNavigate(); 

    const handleNavToHome = () => {
        setCachedState(DefaultState(cachedState)); 
        nav('/home'); 

    }

    const handleLogout = () => { 
        setCachedState(DefaultState(null)); 
        nav('/login'); 

    }

    return (
        <Div sx={{
            bgcolor: 'finish.main', 
            width: 1/2, 
        }}> 
            congrats! you're done. 
            <ButtonGroup>
                <button onClick={handleLogout}>Logout</button>
                <button onClick={handleNavToHome}>Home</button>
            </ButtonGroup> 
        </Div> 
    ); 
}; 

export default Finish; 