import { useState } from 'react'; 
import Grid from './Grid'; 

// assumption: by the time we get to this part of the flow, manifest is already stored in a state 
export default function DockView({ cachedState, setCachedState }) {
    setCachedState({
        ...cachedState, 
        inProgress: true
    }); 
    const [hoveredItem, setHoveredItem] = useState(null); 
    const BUFFER = "buffer"; 
    const SHIP = "ship"; 
    // some back end stuff 
    // const renderNextInstruction = (e) => {

    // }; 



    return (
        <div className='dock-view-container'>
            <Grid type={SHIP} items={cachedState.manifest} /> 
            <Grid type={BUFFER} items={[]} /> 
            <div className='instruction-box'>
                <h1>Step {cachedState.currStep + 1} of {cachedState.totalSteps + 1}</h1>
                <h2 className='instruction'></h2>
            </div>
        </div>
        
    ); 



}; 