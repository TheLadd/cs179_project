import React, { useState } from 'react';
//import { renderMatches } from "react-router-dom";
import { TextField } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';

function UploadTransfer({ selectItems, cachedState, setCachedState }) {
    //const [empty, setEmpty] = useState(false); // no transfer list items have been uploaded
    const [currentOp, setCurrentOp] = useState(null);
    const [currentContainer, setCurrentContainer] = useState({
        name: '',
        quantity: '',
        operation: ''
    });
    const handleSubmit = (e) => { // log 
        setCurrentOp({
            name: currentContainer.name,
            quantity: currentContainer.quantity,
            operation: currentContainer.operation === "offload" ? 0 : 1
        });

    }
    console.log(cachedState);



    return (
        <div>
            <form>
                <label htmlFor="optype">Select the operation: </label> <br />
                <input type="radio" name="optype" id="off" value="offload" onChange={(e) => setCurrentContainer({ ...currentContainer, operation: e.target.value })}></input>
                <label htmlFor="off">Offload</label>
                <input type="radio" name="optype" id="on" value="onload" onChange={(e) => setCurrentContainer({ ...currentContainer, operation: e.target.value })}></input>
                <label htmlFor="on">Onload</label>
                <label htmlFor="cratenm">Select the crate name: </label>
                <Autocomplete disablePortal id="name" options={selectItems} onChange={(event, value) => setCurrentContainer({ ...currentContainer, name: value })} renderInput={(p) => <TextField {...p} label="Name" />}></Autocomplete>
                <label htmlFor="q">Select the quantity of these container(s) you wish to perform this operation for: </label>
                <input type="number" id="q" min="1" max="96" onChange={(e) => setCurrentContainer({ ...currentContainer, quantity: e.target.value })}></input>
                <button type="submit" onSubmit={handleSubmit}>Submit</button>
            </form>



        </div>

    );

}

export default UploadTransfer; 