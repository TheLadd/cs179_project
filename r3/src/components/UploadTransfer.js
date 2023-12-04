import { renderMatches } from "react-router-dom";
import { TextField } from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete'; 

export default function uploadTransfer({ selectItems }) {
    const [empty, setEmpty] = useState(false); // no transfer list items have been uploaded
    const [currentContainer, setCurrentContainer] = useState({
        name: '', 
        quantity: '', 
        operation: ''
    }); 
    let currentList = []
    const handleSubmit = (e) => { // log 
        currentOp = {
            name: currentContainer.name, 
            quantity: currentContainer.quantity, 
            operation: currentContainer.operation === "offload" ? 0 : 1 
        }
        currentList.push(currentOp); 
    }



    
    return (
        <div>
            <form>
                <label htmlFor="optype">Select the operation: </label> <br/> 
                <input type="radio" name="optype" id="off" value="offload" onChange={(e) => setCurrentContainer({...currentContainer, operation: e.target.value})}></input>
                <label htmlFor="off">Offload</label>
                <input type="radio" name="optype" id="on" value="onload" onChange={(e) => setCurrentContainer({...currentContainer, operation: e.target.value})}></input>
                <label htmlFor="on">Onload</label>
                <label htmlFor="cratenm">Select the crate name: </label>
                <Autocomplete disablePortal id="name" options={selectItems} onChange={(e) => setCurrentContainer({...currentContainer, name: e.target.value})} renderInput={(p) => <TextField {...p} label="Name"/>}></Autocomplete>
                <label htmlFor="q">Select the quantity of these container(s) you wish to perform this operation for: </label>
                <input type="number" id="q" min="1" max="96" onChange={(e) => setCurrentContainer({...currentContainer, quantity: e.target.value})}></input>
                <button type="submit" onSubmit={handleSubmit}>Submit</button>
            </form>



        </div>

    ); 

}