import { useEffect, useState } from 'react'
import {
  handleCreateCargoState,
  handleRunAstar,
  handleRunMove,
  handleGetManifest,
  handleLogMessage,
  handleGetCurrentCargoState
} from './BackendRoutes'
import Grid from './Grid'

export default function DockView ({ cachedState, setCachedState }) {

  // -------------- flask backend methods ----------------
  const createCargoState = async () => {
    try {
      await handleCreateCargoState(
        localStorage.getItem('manifest'),
        cachedState.offloadList,
        cachedState.loadList
      )
      console.log('successfully created Cargo state:')
    } catch (error) {
      console.error('Error creating cargo state:', error)
    }
  }

  const runAstar = async () => {
    const isBalance =
      cachedState.opType === 'Offloading/Onloading' ? false : true

    try {
      const astarResult = await handleRunAstar(
        localStorage.getItem('manifest'),
        isBalance,
        cachedState.offloadList,
        cachedState.loadList

        // provide other required parameters here
      )
      // Perform any actions based on the response from handleRunAstar
      console.log('A* Algorithm solution:', astarResult.solution.val)
      console.log('A* Algorithm moves:', astarResult.moves)
    } catch (error) {
      console.error('Error creating cargo state:', error)
    }
  };

  const runMove = async (moveData) => {
    try {
      const moveResult = await handleRunMove(moveData)
      // Perform any actions based on the response from handleRunMove
      console.log('Move execution result:', moveResult.message)
      // You may want to update your component state or perform other actions here
    } catch (error) {
      console.error('Error running move:', error)
    }
  }; 

  // -------------- flask backend methods ----------------


  
    const BUFFER = "buffer"; 
    const SHIP = "ship"; 
    // parameters: 
    // prev/next = [row, col] - 1 indexed
    // prevLocation/nextLocation = 0 || 1 || 2 
    // 0 = ship, 1 - buffer, 2 - truck 
    const showNextInstruction = (prev, prevLocation, next, nextLocation) => {
        let prevID = ""; 
        let nextID = ""; 
        if (prevLocation === 0) {
            let num = (prev[0] - 1) * 12 + prev[1]
            prevID = "#ship-" + num.toString()
        } else if (prevLocation === 1) {
            let num = (prev[0] - 1) * 12 + prev[1]
            prevID = "#buffer" + num.toString() 
        } else { 
            // have some fixed id for truck 
        }

        if (nextLocation === 0) {
            let num = (next[9] - 1) * 12 + next[1]
            nextID = "#ship-" + num.toString()
        } else if (nextLocation === 1) {
            let num = (next[0] - 1) * 12 + next[1]
            nextID = "#buffer" + num.toString() 
        } else { 
            // have some fixed id for truck 
        }

        const prevGridItem = document.querySelector(prevID); 
        const nextGridItem = document.querySelector(nextID); 

        const prevPos = prevGridItem.getBoundingClientRect(); 
        const nextPos = nextGridItem.getBoundingClientRect(); 



    }; 


  return (
        <div className='dock-view-container'>
            <Grid type={SHIP} items={cachedState.manifest} id="ship-dock"/> 
            <Grid type={BUFFER} items={[]} id="buffer-dock"/> 
            <div className='instruction-box'>
                <h1>Step {cachedState.currStep + 1} of {cachedState.totalSteps + 1}</h1>
                <h2 className='instruction'></h2>
                <button>Make Move</button>
                <button>Skip Move</button>
                <button>Log Something</button> 
            </div>
        </div>
  ); 
}
