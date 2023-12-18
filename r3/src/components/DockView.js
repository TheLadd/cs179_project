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
  }
  createCargoState()
  .then(() => {
    // After cargo state is initialized, call runAstar
    runAstar()
  })
  .catch(error => {
    console.error('Error in initialization:', error)
  })



  const runMove = async (moveData) => {
    try {
      const moveResult = await handleRunMove(moveData)
      // Perform any actions based on the response from handleRunMove
      console.log('Move execution result:', moveResult.message)
      // You may want to update your component state or perform other actions here
    } catch (error) {
      console.error('Error running move:', error)
    }
  }

  const BUFFER = 'buffer'
  const SHIP = 'ship'

  return (
    <div className='dock-view-container'>
      <Grid type={SHIP} items={cachedState.manifest} id='ship-dock' />
      <Grid type={BUFFER} items={[]} id='buffer-dock' />
      <div className='instruction-box'>
        <h1>
          Step {cachedState.currStep + 1} of {cachedState.totalSteps + 1}
        </h1>
        <h2 className='instruction'></h2>
        <button>Log something</button>
      </div>
    </div>
  )
}
