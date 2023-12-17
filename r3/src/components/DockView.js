import { useState, useEffect } from 'react'; 
import Grid from './Grid'; 

// assumption: by the time we get to this part of the flow, manifest is already stored in a state 
export default function DockView({cachedState, setCachedState}) {
    const BUFFER = "buffer"; 
    const SHIP = "ship"; 

    return (
        <Grid type={SHIP} items={cachedState.manifest}/> 
    ); 



}; 