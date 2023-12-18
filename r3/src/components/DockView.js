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

// 
export default function DockView ({ cachedState, setCachedState }) {
  const [cargoState, setCargoState] = useState(null); 
  const [currMove, setCurrMove] = useState({
    'cost': -1, 
    'current-area': '', 
    'name': '', 
    'current-grid-position': [], 
    'next-area': '', 
    'next-grid-position': []
  }); 
  const [goalCargo, setGoalCargo] = useState([]); 




  const createCargoState = async () => {
    try {
      await handleCreateCargoState(
        localStorage.getItem('manifest'),
        cachedState.offloadList,
        cachedState.loadList
      ).then(() => runAstar()); 
      console.log('successfully created Cargo state'); 
    } catch (error) {
      console.error('Error creating cargo state:', error); 
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
      setCachedState({...cachedState, 
          moveList: astarResult.moves
      }); 
      return astarResult; 
      // Perform any actions based on the response from handleRunAstar
      // console.log('A* Algorithm solution:', astarResult.solution)
      // console.log('A* Algorithm moves:', astarResult.moves)
      
    } catch (error) {
      console.error('Error creating cargo state:', error)
    }
  }


  const runMove = async (moveData) => {
    try {
      const moveResult = await handleRunMove(moveData)
      return moveResult; 
      // Perform any actions based on the response from handleRunMove
      console.log('Move execution result:', moveResult.message)
      // You may want to update your component state or perform other actions here
    } catch (error) {
      console.error('Error running move:', error)
    }
  }

  const mapArea = num => {
    if (num === 0) {
      return "ship"
    } else if (num === 1) {
      return "buffer"
    } else if (num === 2) {
      return "truck"
    } else {
      return ""
    }
  }

  const BUFFER = 'buffer'
  const SHIP = 'ship'

  useEffect(() => {
    if (cargoState === null) {
      setCachedState({
        ...cachedState, 
        inProgress: true
      }); 
      localStorage.setItem("inProgress", true); 
      setCargoState(createCargoState()); 
    } 
    console.log("move list: ", cachedState.moveList); 
    if (cachedState.moveList) {
      let currmoves = cachedState.moveList; 
      const nextMove = currmoves.shift(); 
      const currarea = mapArea(nextMove['current-area']); 
      const nextarea = mapArea(nextMove['next-area']); 
      setCurrMove({
        ...nextMove, 
        'current-area': currarea, 
        'next-area': nextarea
      })
      setCachedState({
        ...cachedState, 
        moveList: currmoves
      }); 
    }
  }, [cachedState.moveList]);

  return (
    <div className='dock-view-container'>
      {cachedState.moveList ? (
        null
      ) : (
        <div>
        <Grid type={SHIP} items={cachedState.manifest} id='ship-dock' />
        <Grid type={BUFFER} items={[]} id='buffer-dock' />
        <div className='instruction-box'>
          <h1 value={currMove}>
            Step {cachedState.currStep + 1} of {cachedState.totalSteps + 1}: 
          </h1>
          <h2 className='instruction' value={currMove}>
            Move {currMove['name']} in {currMove['current-area']} from slot {currMove['current-grid-position'].toString()} to slot {currMove['next-grid-position'].toString()} in {currMove['next-area']}
          </h2>
          <button>Make Move</button>
          <button>Skip Move</button>
          <button>Log something</button>
        </div>
        </div> 

      )}

    </div>
  )
}
