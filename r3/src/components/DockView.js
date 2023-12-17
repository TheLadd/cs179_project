import { useEffect } from 'react'
import {
  handleCreateCargoState,
  handleRunAstar,
  handleRunMove,
  handleGetManifest,
  handleLogMessage,
  handleGetCurrentCargoState
} from './BackendRoutes'

export default function DockView ({ cachedState, setCachedState }) {
  useEffect(() => {
    const fetchData = async () => {
      await handleCreateCargoState(
        localStorage.getItem('manifest'),
        cachedState.offloadList,
        cachedState.loadList
      )
      //const currentCargoState = await handleGetCurrentCargoState()
      //console.log('Current Cargo State:', currentCargoState)

      const currentCargoState = await handleGetManifest()
      console.log('Current Cargo manifest:', currentCargoState)
    }

    fetchData()
  }, [cachedState.manifest, cachedState.offloadList, cachedState.loadList])

  useEffect(() => {
    const runAstar = async () => {
      const isBalance =
        cachedState.opType === 'Offloading/Onloading' ? false : true

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
    }

    // Call the runAstar function when the component mounts or when specific dependencies change
    //runAstar()
  }, [cachedState.manifest, cachedState.opType, cachedState.offloadList, cachedState.loadList])

  return (
    <div id='dock-view-wrapper'>
      <div>
        <button>Log something</button>
      </div>
    </div>
  )
}
