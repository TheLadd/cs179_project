import React, { useEffect, useState } from "react";
import { TextField, Autocomplete, useColorScheme, colors } from "@mui/material";
import { useNavigate } from "react-router-dom";
import handleTimestamp from "./Timestamp";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

function UploadTransfer({ cachedState, setCachedState }) {
  const [onload, setOnload] = useState(false); // switches to read-only in form if the operation is true or is onload operation
  const [rowData, setRowData] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const MANIFEST = cachedState.manifest;
  const nav = useNavigate();

  // items that we have already selected
  const selected = {};
  const container_names = new Set();
  // items that repeat in table

  const [currentContainer, setCurrentContainer] = useState({
    name: "",
    weight: 0,
    operation: "",
  });

  // save to our cached state
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

  // ensuring the options autocomplete doesnt have any repeats in dropdown, or unused slots
  const filterOptions = (option) => {
    let name = option[2];
    if (name === "UNUSED" || name === "NAN" || container_names.has(name)) {
      return false;
    }
    return true;
  };

  const columns = [
    {
      field: "#",
      valueGetter: "node.rowIndex + 1",
    },
    {
      field: "operation",
    },
    {
      field: "name",
    },
    {
      field: "weight",
      cellRenderer: (params) => {
        if (params.value === 0) {
          return <p>-</p>;
        } else {
          return <span>{params.value} kg</span>;
        }
      },
    },
  ];

  // start onloading and offloading
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
    console.log(rowData);
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
      {/* <div
      className={ "ag-theme-quartz-dark" }
      style={{ width: '100%', height: '100%' }}
    >
      <AgGridReact columnDefs={columns} 
      rowData={rowData}/> 
    </div> */}
    </div>
  );
}

export default UploadTransfer;
