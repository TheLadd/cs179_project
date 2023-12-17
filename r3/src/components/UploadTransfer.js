import React, { useEffect, useState } from 'react'
import { TextField, Autocomplete } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import handleTimestamp from './Timestamp'
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

function UploadTransfer ({ cachedState, setCachedState }) {
  const [onload, setOnload] = useState(false); // switches to read-only in form if the operation is true or is onload operation 
  const [rowData, setRowData] = useState([]); 
  const MANIFEST = cachedState.manifest

  const nav = useNavigate()
  // items that we have already selected
  const selected = {}; 
  const container_names = new Set(); 
  // items that repeat in table

  const [currentContainer, setCurrentContainer] = useState({
    name: '',
    weight: 0,
    operation: '', 
  })

  console.log('cachedState in uploadTransfer: ', cachedState)

  // save to our cached state 
  const handleSubmitContainer = e => {
    // log
    e.preventDefault(); 

    if (onload) {

        const currLoad = [...cachedState.loadList, [currentContainer.name, currentContainer.weight.toString()]]; 
        setCurrentContainer({
          ...currentContainer, 
          operation: "Onload"
        }); 
        setCachedState({
            ...cachedState, 
            loadList: currLoad
        }); 
        
    } else {
        const currOffload = [...cachedState.offloadList, currentContainer.name]; 
        setCurrentContainer({
          ...currentContainer, 
          operation: "Offload"
        }); 
        setCachedState({
            ...cachedState, 
            offloadList: currOffload
        }); 
    }
setRowData([...rowData, currentContainer]); 
    console.log(currentContainer, rowData); 
    setCurrentContainer({
      name: '', 
      operation: '', 
      weight: 0
    }); 
    document.getElementById('container-form').reset(); 
  }

  // ensuring the options autocomplete doesnt have any repeats in dropdown, or unused slots
  const filterOptions = option => {
    let name = option[2]
    if (name === 'UNUSED' || name === 'NAN' || container_names.has(name)) {
      return false
    }
    return true
  }

  const columns = [
    {
        headerName: '#', 
        valueGetter: 'node.rowIndex + 1', 
        maxWidth: 80, 
    }, 
    {
        headerName: 'Operation', 
        field: 'operation', 
    }, 
    {
        headerName: 'Container Name', 
        field: 'name', 
    }, 
    {
        headerName: 'Weight',
        field: 'weight', 
        cellRenderer: (params) => {
            if (params.value === 0) {
                return <p>-</p>
            } else {
                return <span>{params.value} kg</span>
            }
        }
    }, 
  ]; 

  // start onloading and offloading 
  const handleOperationSubmission = e => {
    e.preventDefault(); 
    setCachedState({
        ...cachedState, 
        inProgress: true, 
        opType: 'Offloading/Onloading', 
        lastActivityTime: handleTimestamp()
    }); 
    localStorage.removeItem("inProgress"); 
    localStorage.removeItem("lastActivityTime"); 
    localStorage.removeItem("offloadList"); 
    localStorage.removeItem("loadList"); 

    localStorage.setItem("offloadList", JSON.stringify(cachedState.offloadList)); 
    localStorage.setItem("loadList", JSON.stringify(cachedState.loadList)); 
    localStorage.setItem("inProgress", true); 
    localStorage.setItem("lastActivityTime", cachedState.lastActivityTime); 
    nav('/ship-view'); 

  }

  useEffect(() => {


  }, [currentContainer.operation])

  return (
    <div>
      <h1>Upload Transfer Items</h1>
      <div className="form-wrapper">
      <form id='container-form' onSubmit={handleSubmitContainer}>
        <span>Select the operation: </span> <br />
        <input
          type='radio'
          name='optype'
          id='off'
          value='offload'
          onChange={e => setOnload(false)}
        />
        <label htmlFor='off'>Offload</label> <br/> 
        
        <input
          type='radio'
          name='optype'
          id='on'
          value='onload'
          onChange={e => setOnload(true)}
       /><label htmlFor='on'>Onload</label><br/> 
        <span>Type the crate name and hit enter:</span><br/>
        <Autocomplete
          id='cratenm'
          sx={{
            marginTop: 1
          }}
          freeSolo
          options={MANIFEST.filter(filterOptions).map(opt => opt[2])}
          onInputChange={e =>
            setCurrentContainer({ ...currentContainer, name: e.target.value })
          }
          onChange={(event, value) =>
            setCurrentContainer({ ...currentContainer, name: value })
          }
          renderInput={params => <TextField {...params} label='Container Name' required={true}/>}
        />
        <span>Weight (only input if onloading): </span><br/>
        <input type="number" className="input-weight" min="0" max="9999" readOnly={onload ? false : true} 
        onChange={e => setCurrentContainer({...currentContainer, weight: e.target.value})}/> 
        <button type='submit' className="secondary-submit-btn">Submit</button>
      </form>
      <button onClick={handleOperationSubmission} className="primary-submit-btn">Finish</button>
    </div> 
      <AgGridReact columnDefs={columns} rowData={rowData}/> 
    </div>
  )

}

export default UploadTransfer; 
