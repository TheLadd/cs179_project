import React, { useState } from 'react';
import { TextField, Autocomplete } from "@mui/material";
import { Unstable_NumberInput as NumberInput } from '@mui/base'; 

function UploadTransfer({ selectItems, cachedState, setCachedState }) {
    //const [empty, setEmpty] = useState(false); // no transfer list items have been uploaded
    const [currentContainer, setCurrentContainer] = useState({
        name: '',
        weight: 0,
        operation: ''
    });
    const [offloadList, setOffloadList] = useState([]); 
    const [onloadList, setOnloadList] = useState([]); 
    
    console.log("cachedState in uploadTRansfer: ", cachedState)
    const handleSubmit = (e) => { // log 
        console.log(currentContainer); 
    }
    
    return (
        <div>
            <form>
                <label htmlFor="optype">Select the operation: </label> <br />
                <input type="radio" name="optype" id="off" value="offload" onChange={(e) => setCurrentContainer({ ...currentContainer, operation: e.target.value })}></input>
                <label htmlFor="off">Offload</label>
                <input type="radio" name="optype" id="on" value="onload" onChange={(e) => setCurrentContainer({ ...currentContainer, operation: e.target.value })}></input>
                <label htmlFor="on">Onload</label>
                <label htmlFor="cratenm">Type the crate name and hit enter: </label>
                <Autocomplete id="cratenm"
                    freeSolo
                    options={cachedState.manifest.map((option) => option[2])}
                    onInputChange={(e) => setCurrentContainer({...currentContainer, name: e.target.value })}
                    renderInput={(params) => <TextField {...params} label="Crate Name" />} 
                /> 
                <label htmlFor="weight">Weight (only input if onloading):</label>
                <NumberInput onChange={e => setCurrentContainer({...currentContainer, weight: e.target.value})}/> 
                <button type="submit" onSubmit={handleSubmit}>Submit</button>
        
            </form>
        </div>

    );

}


export default UploadTransfer;