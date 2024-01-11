import React, { useEffect, useState } from "react";
import { TextField, Autocomplete, useColorScheme, colors } from "@mui/material";
import { useNavigate } from "react-router-dom";
import handleTimestamp from "./Timestamp";
import trash from "../trashicon.png"; 
import "../css/InstructionList.css"; // Theme

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

  // triggered with finish button; navigates to dock view page, passes load/offload list to backend. 
  const handleOperationSubmission = (e) => {
    e.preventDefault();
    setCachedState({
      ...cachedState,
      lastActivityTime: handleTimestamp(),
    });

    localStorage.setItem(
      "offloadList",
      JSON.stringify(cachedState.offloadList)
    );
    localStorage.setItem("loadList", JSON.stringify(cachedState.loadList));
    //localStorage.setItem("lastActivityTime", cachedState.lastActivityTime);
    nav("/dock-view");
  };


  const deleteRow = (idx) => {
    console.log("DELETEROW")
    let currRows = rowData; 
    let currRow = currRows.splice(idx, 1); 
    console.log(currRow); 
    if (currRow.operation === "Offload") {
      let off = cachedState.offloadList
      off.splice(off.indexOf(currRow.name), 1)
      console.log(off)
      setCachedState({
        ...cachedState, 
        offloadList: off 
      }); 
    } else { 
      let on = cachedState.loadList
      for (let i = 0; i < on.length; i = i + 2) { 
        if (currRow.name === on[i] && String(currRow.weight) === on[i + 1]) { 
          on.splice(i, 2)
          i = on.length + 1
        }
      }
      console.log(on)
      setCachedState({
        ...cachedState, 
        loadList: on
      }); 
    }
    console.log(cachedState)
  }




  useEffect(() => {
    console.log("row data: ", rowData);
  }, [rowData]);

  return (
    <div>
      <h1>Upload Transfer Items</h1>
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
            className="secondary-submit-btn"
            disabled={disableSubmit}
          >
            Submit
          </button>
        </form>
        <button
          onClick={handleOperationSubmission}
          className="primary-submit-btn"
        >
          Finish
        </button>
      </div>
      {rowData && !rowData.empty ? (
        <table className="table-styling">
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
      </table>): (<p1>poop</p1>)}
    </div>
  );
}

export default UploadTransfer;
