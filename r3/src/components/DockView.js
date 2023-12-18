import { create } from '@mui/material/styles/createTransitions';
import { useRef, useEffect, useState } from 'react'
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
  const cargoState = useRef(false); 
  const goalCargoState = useRef([]); 
  const currMove = useRef({
    'cost': -1, 
    'current-area': '', 
    'name': '', 
    'current-grid-position': [], 
    'next-area': '', 
    'next-grid-position': []
  }); 
  const moveList = useRef([]); 

  // ------------------------------ flask backend functions -------------------------------------

  const createCargoState = async () => {
    console.log("DOCKVIEW.JS createcargostate");
      let state = await handleCreateCargoState(
        localStorage.getItem('manifest'),
        cachedState.offloadList,
        cachedState.loadList
      ).catch(err => console.log(err))
      .then((response) => {
        cargoState.current = true
        console.log("DOCKVIEW current cargo state initialized: ", goalCargoState.current)}
      ); 
      console.log('successfully created Cargo state'); 
  };  


  const runAstar = async () => {
    const isBalance = cachedState.opType === 'Offloading/Onloading' ? false : true; 
      const aStarRes = await handleRunAstar(
        localStorage.getItem('manifest'),
        isBalance,
        cachedState.offloadList,
        cachedState.loadList
      ).catch(err => console.log(err.message))
      .then(result => {
        console.log("DOCKVIEW.JS: runastar completed")
        moveList.current = result.moves; 
      }); 
      console.log("DOCKVIEW.JS: result ", moveList.current); 
      if (moveList.current.length !== 0) {
        let mvs = moveList.current; 
        const nextMove = mvs.shift(); 
        currMove.current = nextMove; 
        moveList.current = mvs; 
        const currarea = mapArea(nextMove['current-area']); 
        const nextarea = mapArea(nextMove['next-area']); 
        currMove.current = {
          ...currMove.current, 
          'current-area': currarea, 
          'next-area': nextarea
        }
        console.log("CURRMOVE: ", currMove.current); 
        setCachedState({
          ...cachedState, 
          inProgress: true, 
          moves: mvs
        }); 
      }
      // Perform any actions based on the response from handleRunAstar
      // console.log('A* Algorithm solution:', astarResult.solution)
      // console.log('A* Algorithm moves:', astarResult.moves)
  }; 

  const runMove = async moveData => {
    await handleRunMove(moveData).catch(err => console.log(err))
    .then((response) => {
      console.log("DOCKVIEW.JS: handleRunMove completed")
      console.log(response.message)
    }); 
  }; 
  // ------------------------------ end flask backend functions -------------------------------------


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
  }; 

  const BUFFER = 'buffer'
  const SHIP = 'ship'

  useEffect(() => {
    console.log("dockView..."); 
    localStorage.setItem('inProgress', 'true'); 
    if (cargoState.current === false) { // cargo state has not been initialized yet 
      createCargoState(); 
      runAstar(); 
    }
    console.log("CURRMOVE: ", currMove.current); 
    // console.log(cargoState.current); 
    // if (cachedState.moves.length !== 0) {
    //   let currmoves = cachedState.moves; 
    //   const nextMove = currmoves.shift(); 
    //   const currarea = mapArea(nextMove['current-area']); 
    //   const nextarea = mapArea(nextMove['next-area']); 
    //   currMove.current = {
    //     ...nextMove, 
    //     'current-area': currarea, 
    //     'next-area': nextarea
    //   }
    //   setCachedState({
    //     ...cachedState, 
    //     inProgress: true, 
    //     moves: currmoves
    //   }); 
    // }
  }, [ cachedState, currMove.current, moveList.current, goalCargoState]);

  return (
    <div className='dock-view-container'>
      {cachedState.moves ? (
        <div>
        <Grid type={SHIP} items={cachedState.manifest} id='ship-dock' />
        <Grid type={BUFFER} items={[]} id='buffer-dock' />
        <div className='instruction-box'>
          <h1 value={cachedState}>
            Step {cachedState.currStep + 1} of {cachedState.totalSteps + 1}: 
          </h1>
          <h2 className='instruction' value={currMove.current}>
            Move {currMove.current['name']} in {currMove.current['current-area']} from slot {String(currMove.current['current-grid-position'])} to slot {String(currMove.current['next-position'])} in {currMove.current['next-area']}
          </h2>
          <button>Make Move</button>
          <button>Skip Move</button>
          <button>Log something</button>
        </div>
        </div> 
      ) : ( null )}
    </div>
  );
} 
