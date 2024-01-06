import React, { useEffect, useState } from "react";
import { TextField, Autocomplete, useColorScheme, colors } from "@mui/material";
import { useNavigate } from "react-router-dom";
import handleTimestamp from "./Timestamp";
// import { AgGridReact } from "ag-grid-react"; // React Grid Logic
// import "ag-grid-community/styles/ag-grid.css"; // Core CSS
// import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import InstructionList from "./InstructionList";

function UploadTransfer({ cachedState, setCachedState }) {
  const nav = useNavigate();

  const [onload, setOnload] = useState(false); // switches to read-only in form if the operation is true or is onload operation
  const [rowData, setRowData] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const MANIFEST = cachedState.manifest;
  const [currentContainer, setCurrentContainer] = useState({
    name: "",
    weight: 0,
    operation: "",
  });
  

  // items that we have already selected
  const selected = {};
   // items that repeat in table 
  const container_names = new Set();


  // clear weight input in form if offload function is selected.  
  function clearWeight() {
    var weightField = document.querySelector('.input-weight')
    weightField.value = ''
    
  }; 

  // save the container input and operation to our cached state. 
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

  // sets the autocomplete options in the container names. filters out NAN/unused containers. 
  const filterOptions = (option) => {
    let name = option[2];
    if (name === "UNUSED" || name === "NAN" || container_names.has(name)) {
      return false;
    }
    return true;
  };

  // for grid display of instruction list; naming and setting column properties. 
  const columns = [
    {
      field: "operation"
    },
    {
      field: "name"
    },
    {
      field: "weight"
      }
  ];

  // triggered with submit button; navigates to dock view page, passes load/offload list to backend. 
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
            options={MANIFEST.filter(filterOptions).map((opt) => opt[2])}
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
      <InstructionList /> 
    </div>
  );
}

export default UploadTransfer;
