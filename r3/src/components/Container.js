import { useState } from 'react'; 
import { Popover, Typography } from '@mui/material'; 

const Container = (props) => { 
    const [anchor, setAnchor] = useState(null); 
    let name = props.name; 
    const weight = parseInt(props.weight); 
    let position = props.position; 

    let classes = ''; 
    
    if (props.name === "NAN") {
        classes = 'nan-grid'; 
    } else if (props.name === "UNUSED") {
        classes = 'undefined-grid'; 
    } else {
        classes = 'item-grid'; 

    }

    const handleClick = (e) => {
        setAnchor(e.currentTarget); 
    }; 

    const handleClose = () => {
        setAnchor(null); 
    }; 

    const open = Boolean(anchor); 



    return (
        <div name={name} position={position} weight={weight} className={classes}>
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