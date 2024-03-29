import React, { useEffect, useState } from "react";
import { TextField, Autocomplete, useColorScheme, colors } from "@mui/material";
import { useNavigate } from "react-router-dom";
import handleTimestamp from "./Timestamp";
import trash from "../trashicon.png"; 
import "../css/InstructionList.css"; // Theme
import Div from "./Div";

function UploadTransfer({ cachedState, setCachedState }) {
  const nav = useNavigate();

  const [onload, setOnload] = useState(false); // switches to read-only in form if the operation is true or is onload operation
  const [rowData, setRowData] = useState([]); // contains our data in a convenient fashion when used to display our inputted instruction list 
  const [disableSubmit, setDisableSubmit] = useState(true); // disables submit until all form data is filled in correctly 
  const [autocompleteValue, setAutocompleteValue] = useState(""); // two types of trackers for the value using autocomplete coz its weird 

  const MANIFEST = cachedState.manifest; // note: if user refreshes the page, cached state and local storage is set to default. possibly fix later. 

  const [currentContainer, setCurrentContainer] = useState({ // keeps track of the conrainer that the user is currently inputting into form. 
    name: "",
    weight: 0,
    operation: "",
  });
  

  // items that we have already selected from our manifest list, so it doesn't appear again if it's not on the ship. 
  const selected = {};
   // items that repeat in table 
  const container_names = new Set();


  // clear weight input in form; triggered if offload option is selected.  
  function clearWeight() {
    var weightField = document.querySelector('.input-weight')
    weightField.value = ''
    
  }; 

  // save the container input and operation to our cached state; triggered by submit button on form.  
  const handleSubmitContainer = (e) => {
    // log
    e.preventDefault();
    let container = {};

    if (onload) {
      const currLoad = [
        ...cachedState.loadList,
        currentContainer.name,
        currentContainer.weight.toString(),
      ];
      container = {
        ...currentContainer,
        operation: "Onload",
      };
      setCachedState({
        ...cachedState,
        loadList: currLoad,
      });
    } else {
      const currOffload = [...cachedState.offloadList, currentContainer.name];
      container = {
        ...currentContainer,
        operation: "Offload",
        weight: "-"
      };
      setCachedState({
        ...cachedState,
        offloadList: currOffload,
      });
    }
    setRowData([...rowData, container]);
    // console.log(container, rowData);
    setCurrentContainer({
      name: "",
      operation: "",
      weight: 0,
    });
    document.getElementById("container-form").reset();

    setAutocompleteValue(""); // Reset the state to an empty string
    setDisableSubmit(true);
  };

  
  // sets the autocomplete options in the container names for the form. filters out NAN/unused containers. 
  const filterOptions = (option) => {
    let name = option[2];
    if (name === "UNUSED" || name === "NAN" || container_names.has(name)) {
      return false;
    }
    return true;
  };

  
  // finished making transfer list, triggered with finish button, navigate to dock view page, actual algorithm now
  const handleOperationSubmission = (e) => {
    e.preventDefault();
    setCachedState({
      ...cachedState,
      lastActivityTime: handleTimestamp(),
    });
    nav("/dock-view");
  };

  
  // triggered when users click the delete button. 
  const deleteRow = (idx) => {
    console.log("DELETEROW")
    let currRows = rowData; 
    let currRow = currRows.splice(idx, 1); 
    console.log("CURR ROW", currRow)
    if (currRow[0].operation === "Offload") {
      let off = cachedState.offloadList
      off.splice(off.indexOf(currRow[0].name), 1)
      const offload = off
      console.log("UPDATED LIST ", off)
      setCachedState({
        ...cachedState, 
        offloadList: offload, 
      }); 
    } else { 
      let on = cachedState.loadList
      for (let i = 0; i < on.length; i = i + 2) { 
        if (currRow[0].name === on[i] && currRow[0].weight === on[i + 1]) { 
          on.splice(i, 2)
          i = on.length
        }
      }
      console.log("UPDATED LIST ", on)
      const onload = on
      setCachedState({
        ...cachedState, 
        loadList: onload, 
      }); 
    }
  }

  
  useEffect(() => {
    console.log("row data: ", rowData);
  }, [rowData]);

  
  return (
    <div>
    <Div sx={{ bgcolor: 'finish.main', 
      padding: '0.75%', 
      maxHeight: 1000, 
      margin: 'auto', 
      marginTop: '3%', 
      border: 25, 
      borderColor: 'finish.border', 
      borderRadius: 10, 
      fontWeight: 'bold',  
      fontSize: 20,  
      height: '100%', 
      width: '60%', 
      fontFamily: 'Raleway', 
      color: 'finish.text', 
      display: 'flex', 
      textAlign: 'center', 
      marginBottom: '2em', 
      alignItems: 'center', 
     flexDirection: 'column', }}>
      <h1 className="header-styling" style={{fontSize: '2.5em', marginBottom: '1%'}}>Upload Transfer Items</h1>
      <div className="form-wrapper">
        <form id="container-form" onSubmit={handleSubmitContainer}>
          <span>Select the operation: </span> <br />
          <input
            type="radio"
            name="optype"
            id="on"
            value="onload"
            onClick={(e) => {
              setOnload(true);
              setDisableSubmit(false);
            }}
          />
          <label htmlFor="on">Onload</label> <br />
          <input
            type="radio"
            name="optype"
            id="off"
            value="offload"
            onClick={(e) => {
              setOnload(false);
              clearWeight(); 
              setDisableSubmit(false);
            }}
          />
          <label htmlFor="off">Offload</label>
          <br />
          <span>Type the container name and hit enter:</span>
          <br />
          <Autocomplete
            id="containernm"
            sx={{
              marginTop: 1,
            }}
            freeSolo
            options={Array.isArray(MANIFEST) ? (MANIFEST.filter(filterOptions).map((opt) => opt[2])) : []}
            onInputChange={(e, value) => {
              setAutocompleteValue(value);
              setCurrentContainer({
                ...currentContainer,
                name: value,
              });
            }}
            onChange={(event, value) =>
              setCurrentContainer({ ...currentContainer, name: value })
            }
            value={autocompleteValue}
            renderInput={(params) => (
              <TextField {...params} label="Container Name" required={true} />
            )}
          />
          <span>Weight (only input if onloading): </span>
          <br />
          <input
            type="number"
            className="input-weight"
            min="0"
            max="9999"
            readOnly={onload ? false : true}
            onChange={(e) =>
              setCurrentContainer({
                ...currentContainer,
                weight: e.target.value,
              })
            }
          />
          <button
            type="submit"
            className="button-styling"
            style={{
              border: '3px solid #0A9396',
              padding: '5px',
              fontSize: '13px'  
            }}
            disabled={disableSubmit}
          >
            Submit
          </button>
        </form>
        <button
          onClick={handleOperationSubmission}
          className="button-styling" style={{
            fontSize: '25px',
            padding: '10px', 
            border: '8px solid #E9D8A6'
          }}
        >
          Finish
        </button>
      </div>
      </Div>
      {rowData && !rowData.empty ? (
        <div> 
        <table className="table-styling">
          <caption>COUNT: {rowData.length}</caption>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Operation</th>
              <th>Weight</th>
              <th> </th>
            </tr>
          {rowData.map((row, key) => {
            return (
            <tr key={key}>
              <td>{row.name}</td>
              <td>{row.operation}</td>
              <td>{row.weight}</td>
              <td>
                <a onClick={() => deleteRow(key)}>
                  <img src={trash} alt="delete" width="20" height="20"></img>
                </a> 
              </td>
            </tr> 
          )})}
          </tbody>
      </table>
      </div> 
      ): (<p1>poop</p1>)}
    </div>
  );
}

export default UploadTransfer;
