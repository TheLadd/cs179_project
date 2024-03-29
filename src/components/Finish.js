import  { useNavigate } from 'react-router-dom'; 
import DefaultState from './DefaultState';
import Confetti  from 'react-confetti'; 
import { useWindowSize }  from 'react-use';
import Div from "./Div"; 
import "../css/Finish.css"; 
// will display the finish screen 
const Finish = ({ cachedState, setCachedState }) => { 
    const nav = useNavigate(); 
    const { width, height } = useWindowSize(); 
    const recycle = false; 

    const handleNavToHome = () => {
        setCachedState(DefaultState(cachedState)); 
        nav('/home'); 

    }

    const handleLogout = () => { 
        setCachedState(DefaultState(null)); 
        nav('/'); 

    }

    return (
        <div>
            <Confetti 
                width={width}
                height={height}
                recycle={recycle}
            /> 
        <Div sx={{
            bgcolor: 'finish.main', 
            padding: '3%', 
            margin: 'auto', 
            marginTop: '3%', 
            border: 80, 
            borderColor: 'finish.border', 
            borderRadius: 10, 
            fontWeight: 'bold', 
            fontSize: 80,  
            height: '80%', 
            width: '70%', 
            fontFamily: 'Raleway', 
            color: 'finish.text', 
            display: 'flex', 
            textAlign: 'center', 
            alignItems: 'center', 
            flexDirection: 'column', 
            
        }}>
            congrats!<br/>you're done.<br/>
            <div className='btn-grp'>
                <div className='button-styling' onClick={handleLogout}>Logout</div>
                <div className='button-styling' onClick={handleNavToHome}>Home</div>
            </div>
        </Div> 
        </div> 
    ); 
}; 

export default Finish; 