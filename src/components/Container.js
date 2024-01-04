import { useState, useRef, useEffect } from 'react'; 
import { Popover, Typography } from '@mui/material'; 

const Container = (props) => { 
    const [anchor, setAnchor] = useState(null); 
    const containerRef = useRef(null); 
    let name = props.name; 
    const weight = parseInt(props.weight); 
    const [position, setPosition] = useState(props.position); 

    let classes = ''; 
    
    // for setting appropriate classes on individual grid items 
    if (props.name === "NAN") {
        classes = 'nan-grid'; 
    } else if (props.name === "UNUSED") {
        classes = 'undefined-grid'; 
    } else {
        classes = 'item-grid'; 
    }

    // popup functionality 
    const handleClick = (e) => {
        setAnchor(e.currentTarget); 
    }; 

    const handleClose = () => {
        setAnchor(null); 
    }; 

   const open = Boolean(anchor); 

    // testing useRef and checking to see how we're gonna do the animation
    useEffect(() => {
        const containerPos = containerRef.current.getBoundingClientRect(); 
        //console.log(containerPos); 
    })



    return (
        <div name={name} ref={containerRef} position={position} weight={weight} className={classes}>
            <a href="#" aria-describedby={position} variant="contained" onClick={handleClick}>
                {name}
            </a>
            <Popover id={position} 
            open={open} 
            anchorEl={anchor}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom', 
                horizontal: 'left',
            }}
            >
            <Typography sx={{p: 1, fontWeight: 'bold', fontSize: 10,}}>
                Name: {name === 'NAN' ? 'SHIP HULL' : name} <br/> 
                Position: {position} <br/> 
                Weight: {name === 'NAN' ? '-' : weight}
            </Typography>
            </Popover>
      </div>

    ); 
}

export default Container; 