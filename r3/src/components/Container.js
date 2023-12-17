import { useState } from 'react'; 


const Container = (props) => { 
    let name = props.name; 
    const weight = props.weight; 
    let pos = props.position; 
    let classes = ''; 
    // LEAVING COMMENTED OUT FOR NOW 
    // const [name, setName] = useState(''); 
    // const [position, setPosition] = useState([]); 
    // const [weight, setWeight] = useState([]); 
    // const [classes, setClasses] = useState(''); 
    // const [select, enableSelect] = useState(false); // probably to make these slots read-only or something?? 
    
    if (props.name === "NAN") {
        name = ''; 
        classes = 'nan-grid'; 
        // setName(''); 
        // setClasses('nan-grid'); 
    } else if (props.name === "UNUSED") {
        name = ''; 
        classes = 'undefined-grid'; 
        // setName(''); 
        // setClasses('undefined-grid'); 
    } else {
        classes = 'item-grid'; 
        // setClasses('item-grid'); 
        // enableSelect(true); 
    }

    return (
        <div className={classes}> 
            <p>{name}</p>
        </div>

    ); 
}

export default Container; 