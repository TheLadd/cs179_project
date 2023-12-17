import React, { useState } from 'react'
import { TextField, Autocomplete } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import handleTimestamp from './Timestamp'
import { Unstable_NumberInput as NumberInput } from '@mui/base'
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

function UploadTransfer ({ cachedState, setCachedState }) {
  //const [empty, setEmpty] = useState(false); // no transfer list items have been uploaded

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

    if (currentContainer.operation === 'onload') {

        const currLoad = [...cachedState.loadList, [currentContainer.name, currentContainer.weight.toString()]]; 
        setCachedState({
            ...cachedState, 
            loadList: currLoad
        }); 
        
    } else {
        const currOffload = [...cachedState.offloadList, currentContainer.name]
        setCachedState({
            ...cachedState, 
            offloadList: currOffload
        }); 
    }
    rowData.push(currentContainer); 
    console.log(currentContainer); 
    setCurrentContainer({
      name: '',
      weight: 0,
      operation: '', 
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

  const rowData = [];   

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

  return (
    <div>
      <form id='container-form' onSubmit={handleSubmitContainer}>
        <span>Select the operation: </span> <br />
        <input
          type='radio'
          name='optype'
          id='off'
          value='offload'
          onChange={e =>
            setCurrentContainer({
              ...currentContainer,
              operation: e.target.value
            })
          }
        />
        <label htmlFor='off'>Offload</label> <br/> 
        
        <input
          type='radio'
          name='optype'
          id='on'
          value='onload'
          onChange={e =>
            setCurrentContainer({
              ...currentContainer,
              operation: e.target.value
            })
          }
       /><label htmlFor='on'>Onload</label><br/> 
        <label htmlFor='cratenm'>Type the crate name and hit enter: </label>
        <Autocomplete
          id='cratenm'
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
        <label htmlFor='weight'>Weight (only input if onloading):</label>
        <NumberInput
          onChange={e => setCurrentContainer({ ...currentContainer, weight: e.target.value })}
          min={0}
          max={9999}
          type="number"
          required={currentContainer.operation === "onload" ? true : false}
          id='weight'
        //   slots={{
        //     incrementButton: Button, 
        //     decrementButton: Button, 
        //   }}
        //   slotProps={{
        //     incrementButton: {
        //         children: <span className="arrow">▴</span>,
        //     }, 
        //     decrementButton: {
        //         children: <span className="arrow">▾</span>,
        //     }, 
        //   }}
        />
        <button type='submit'>Submit</button>
      </form>
      <button onClick={handleOperationSubmission}>Finish</button>
      <AgGridReact columnDefs={columns} rowData={rowData}/> 
    </div>
  )

}

export default UploadTransfer; 
