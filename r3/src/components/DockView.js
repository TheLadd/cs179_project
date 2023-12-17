
import { useEffect } from 'react'
import {
  handleCreateCargoState,
  handleRunAstar,
  handleRunMove,
  handleGetManifest,
  handleLogMessage,
  handleGetCurrentCargoState
} from './BackendRoutes'
import { useState } from 'react'; 
import Grid from './Grid'; 

export default function DockView ({ cachedState, setCachedState }) {
//   useEffect(() => {
//     const fetchData = async () => {
//       await handleCreateCargoState(
//         localStorage.getItem('manifest'),
//         cachedState.offloadList,
//         cachedState.loadList
//       )
//       //const currentCargoState = await handleGetCurrentCargoState()
//       //console.log('Current Cargo State:', currentCargoState)

//       const currentCargoState = await handleGetManifest()
//       console.log('Current Cargo manifest:', currentCargoState)
//     }

//     fetchData()
//   }, [cachedState.manifest, cachedState.offloadList, cachedState.loadList])

//   useEffect(() => {
//     const runAstar = async () => {
//       const isBalance =
//         cachedState.opType === 'Offloading/Onloading' ? false : true

//       const astarResult = await handleRunAstar(
//         localStorage.getItem('manifest'),
//         isBalance,
//         cachedState.offloadList, 
//         cachedState.loadList

//         // provide other required parameters here
//       )
//       // Perform any actions based on the response from handleRunAstar
//       console.log('A* Algorithm solution:', astarResult.solution.val)
//       console.log('A* Algorithm moves:', astarResult.moves)
//     }

    // Call the runAstar function when the component mounts or when specific dependencies change
//     //runAstar()
//   }, [cachedState.manifest, cachedState.opType, cachedState.offloadList, cachedState.loadList])
  
   setCachedState({
        ...cachedState, 
        inProgress: true
    }); 
    const [hoveredItem, setHoveredItem] = useState(null); 
    const BUFFER = "buffer"; 
    const SHIP = "ship"; 
    // some back end stuff 
    // const renderNextInstruction = (e) => {

    // }; 

  return (
        <div className='dock-view-container'>
            <Grid type={SHIP} items={cachedState.manifest} /> 
            <Grid type={BUFFER} items={[]} /> 
            <div className='instruction-box'>
                <h1>Step {cachedState.currStep + 1} of {cachedState.totalSteps + 1}</h1>
                <h2 className='instruction'></h2>
                <button>Log something</button> 
            </div>
        </div>
  )
}; 


