import { useNavigate } from 'react-router-dom'; 
import DefaultState from './DefaultState';
import { ButtonGroup, Button } from '@mui/material';
import Div from "./Div"; 
import "../css/Finish.css"; 
// will display the finish screen 
const Finish = ({ cachedState, setCachedState }) => { 
    const nav = useNavigate(); 

    const handleNavToHome = () => {
        setCachedState(DefaultState(cachedState)); 
        nav('/home'); 

    }

    const handleLogout = () => { 
        setCachedState(DefaultState(null)); 
        nav('/'); 

    }

    return (
        <Div sx={{
            bgcolor: 'finish.main', 
            margin: 10, 
            padding: 30, 
            border: 80, 
            borderColor: 'finish.border', 
            borderRadius: 10, 
            fontWeight: 'bold', 
            fontSize: 80,  
            fontFamily: 'Raleway', 
            color: 'finish.text', 
            display: 'flex', 
            textAlign: 'center', 
            alignItems: 'center', 
            flexDirection: 'column', 
        }}> 
            congrats!<br/>you're done. 
            <ButtonGroup variant="text" color="secondary" aria-label="secondary button group">
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
                <Button onClick={handleNavToHome}>Home</Button>
            </ButtonGroup> 
        </Div> 
    ); 
}; 

export default Finish; 