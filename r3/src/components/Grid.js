import '../css/Grid.css'; 
import { useState } from 'react'; 
import Container from './Container'; 

export default function Grid(props) {
    let items = props.items; 


    // implemented for testing - no access to buffer yet 
    if (props.type === "buffer") {
        items = []
        for (let i = 1; i <= 4; i++) {
            for (let j = 1; j <= 24; j++) {
                const pos = String([i, j]); 
                items.push([pos, 0, "UNUSED"]); 
            }
        }
    }
    
    // create a unique identifier for it for animations to call
    const createUniqueID = (idx) => {
        return "buffer-" + String(idx); 
    }

    // console.log(items.length); 

    return (
        <div className={props.type}>
            <div className={props.type === "buffer" ? "buffer-header" : "grid-header"}>{props.type}</div>
            {items.map((arr, index) => 
                <Container key={index} id={() => createUniqueID(index)}
                position={arr[0]} weight={arr[1]} name={arr[2]} /> 
            )}
        </div>
    ); 
}; 





  