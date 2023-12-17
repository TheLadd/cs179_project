import { useState, useEffect } from 'react'; 
import Grid from './Grid'; 

// assumption: by the time we get to this part of the flow, manifest is already stored in a state 
export default function DockView({cachedState, setCachedState}) {
    const [hoveredItem, setHoveredItem] = useState(null); 
    const BUFFER = "buffer"; 
    const SHIP = "ship"; 

    return (
        <div className='dock-view-container'>
            <Grid type={SHIP} items={cachedState.manifest} /> 
            <Grid type={BUFFER} items={[]} /> 
        </div>
        
    ); 



}; 