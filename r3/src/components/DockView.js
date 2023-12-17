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
        cachedState.manifest,
        cachedState.offloadList,
        cachedState.loadList
      )
      const currentCargoState = await handleGetCurrentCargoState()
      console.log('Current Cargo State:', currentCargoState)
    }

    fetchData()
  }, [cachedState.manifest, cachedState.offloadList, cachedState.loadList])

  return (
    <div id='dock-view-wrapper'>
      <div>
        <button>Log something</button>
      </div>
    </div>
  )
}

//handleCreateCargoState(manifestData, offloadListData, loadListData);
