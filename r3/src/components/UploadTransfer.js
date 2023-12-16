import React, { useState } from 'react'
import { TextField, Autocomplete } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Unstable_NumberInput as NumberInput } from '@mui/base'

function UploadTransfer ({ cachedState, setCachedState }) {
  //const [empty, setEmpty] = useState(false); // no transfer list items have been uploaded
  const MANIFEST = JSON.parse(cachedState.manifest)
  const nav = useNavigate()
  // items that we have already selected
  const selected = {}
  const container_names = new Set()
  // items that repeat in table

  const [currentContainer, setCurrentContainer] = useState({
    name: '',
    weight: 0,
    operation: ''
  })

  console.log('cachedState in uploadTransfer: ', cachedState)

  const handleSubmitContainer = e => {
    // log
    e.preventDefault()

    if (currentContainer.operation === 'onload') {
      let curr = [currentContainer.name, currentContainer.weight]
      setCachedState(prevState => {
        const newLoadList = [...prevState.loadList, ...curr]
        localStorage.setItem('loadList', JSON.stringify(newLoadList))
        return {
          ...prevState,
          loadList: newLoadList
        }
      })
    } else {
      setCachedState(prevState => {
        const newOffloadList = [...prevState.offloadList, currentContainer.name]
        localStorage.setItem('offloadList', JSON.stringify(newOffloadList))
        return {
          ...prevState,
          offloadList: newOffloadList
        }
      })
    }
    console.log(currentContainer)
    setCurrentContainer({
      name: '',
      weight: 0,
      operation: ''
    })
    document.getElementById('container-form').reset()
  }

  // ensuring the options autocomplete doesnt have any repeats in dropdown, or unused slots
  const filterOptions = option => {
    let name = option[2]
    if (name === 'UNUSED' || name === 'NAN' || container_names.has(name)) {
      return false
    }
    return true
  }

  return (
    <div>
      <form id='container-form' onSubmit={handleSubmitContainer}>
        <label htmlFor='optype'>Select the operation: </label> <br />
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
        ></input>
        <label htmlFor='off'>Offload</label>
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
        ></input>
        <label htmlFor='on'>Onload</label>
        <label htmlFor='cratenm'>Type the crate name and hit enter: </label>
        <Autocomplete
          id='cratenm'
          freeSolo
          options={MANIFEST.filter(filterOptions).map(opt => opt[2])}
          onInputChange={e =>
            setCurrentContainer({ ...currentContainer, name: e.target.value })
          }
          onChange={e =>
            setCurrentContainer({ ...currentContainer, name: e.target.value })
          }
          renderInput={params => <TextField {...params} label='Crate Name' />}
        />
        <label htmlFor='weight'>Weight (only input if onloading):</label>
        <NumberInput
          onChange={e =>
            setCurrentContainer({ ...currentContainer, weight: e.target.value })
          }
          id='weight'
        />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default UploadTransfer
