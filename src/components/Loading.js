import "../css/Loading.css"; 
import { useState } from 'react'; 

const Loading = ({ displayText }) => { 
    // displayText: show something to users if they want 

    return ( 
        <div className="load-container"> 
        <div className="loading"> 
        <span style={{backgroundColor: '#005F73'}} className="span-st">L</span>
        <span style={{backgroundColor: '#0A9396'}} className="span-st">O</span>
        <span style={{backgroundColor: '#94D2BD'}} className="span-st">A</span>
        <span style={{backgroundColor: '#EE9B00'}} className="span-st">D</span>
        <span style={{backgroundColor: '#CA6702'}} className="span-st">I</span>
        <span style={{backgroundColor: '#BB3E03'}} className="span-st">N</span>
        <span style={{backgroundColor: '#AE2012'}} className="span-st">G</span>
        <div className="hidden">
            <span className="span-st"></span>
            <span className="span-st"></span>
            <span className="span-st"></span>
            <span className="span-st"></span>
            <span className="span-st"></span>
            <span className="span-st"></span>
            <span className="span-st"></span>
        </div>
        </div> 
            <h1>{displayText}</h1>
        </div> 
    )


}

export default Loading; 