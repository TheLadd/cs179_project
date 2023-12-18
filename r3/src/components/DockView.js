import { useRef, useEffect, useState } from "react";
import {
  handleCreateCargoState,
  handleRunAstar,
  handleRunMove,
  handleGetManifest,
  handleLogMessage,
  handleGetCurrentCargoState,
} from "./BackendRoutes";
import Grid from "./Grid";

// function DockView({ cachedState, setCachedState }) {
//   const [customMessage, setCustomMessage] = useState("");

//   };
// }

// // 
export default function DockView ({ cachedState, setCachedState }) {
  const logMessage = useRef(""); 
  const cargoState = useRef(false); 
  const currentCargoState = useRef(null); 
  const currentBufferState = useRef(null); 
  const goalCargoState = useRef([]); 

  const currMove = useRef({
    "cost": -1,
    "current-area": -1,
    "name": "",
    "current-grid-position": [],
    "next-area": -1,
    "next-grid-position": [],
    "weight": -1, 
  });
  const moveList = useRef([]);
  const [customMessage, setCustomMessage] = useState("");

  const logCustomMessage = () => {
    const userInput = window.prompt("Enter your custom message:");
    if (userInput !== null) {
      handleLogMessage(userInput);
      // You can log the message or perform other actions here
      console.log("Custom message logged:", userInput);
    }
  };

  // ------------------------------ flask backend functions -------------------------------------
  // initializes cargo state
  const createCargoState = async () => {
    console.log("DOCKVIEW.JS createcargostate");
    let state = await handleCreateCargoState(
      localStorage.getItem("manifest"),
      cachedState.offloadList,
      cachedState.loadList
    )
      .catch((err) => console.log(err))
      .then((response) => {
        cargoState.current = true;
        console.log(
          "DOCKVIEW current cargo state initialized: ",
          goalCargoState.current
        );
      });
    console.log("successfully created Cargo state");
  };

  // runs astar - only to be called at the beginning of ops or when the move is skipped
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

        // local storage 
        localStorage.setItem('moves', mvs)
        localStorage.setItem('totalSteps', mvs.length)
        localStorage.setItem('currStep', 1)

        // save in ref - we set here so we don't have to refresh as much 
        const nextMove = mvs.shift(); 
        currMove.current = nextMove; 
        moveList.current = mvs; 
        // const currarea = mapArea(nextMove['current-area']); 
        // const nextarea = mapArea(nextMove['next-area']); 
        // currMove.current = {
        //   ...currMove.current, 
        //   'current-area': currarea, 
        //   'next-area': nextarea
        // }
        console.log("CURRMOVE: ", currMove.current); 

        //sanity check 
        setCachedState({
          ...cachedState, 
          inProgress: true, 
          moves: mvs, // saves as an object?  
          totalSteps: mvs.length+1
        }); 
        localStorage.setItem("inProgress", "true");
       

      }
      // Perform any actions based on the response from handleRunAstar
      // console.log('A* Algorithm solution:', astarResult.solution)
      // console.log('A* Algorithm moves:', astarResult.moves)
  }; 

  const runMove = async (move) => {
    handleRunMove(move);
    //handleGetCurrentCargoState;
  };



  // assumption: current cargo state is being updated with every call to make move. 
  const skipMove = async (move) => {
    if (cachedState.opType === "Offloading/Onloading") {
      if (move['current-area'] < move['next-area']) { // offload operation - we check offload list
        let name = move['name']
        let newOffload = cachedState.offloadList
        let idx = cachedState.offloadList.indexOf(name); 
        newOffload.splice(idx, 1)
        setCachedState({
          ...cachedState, 
          offloadList: newOffload
        }); 
      } else { // we check onload list - onload includes weight 
        const name = move['name']
        const weight = move['weight'].toString()
        let newOnload = cachedState.loadList; 
        for (let i = 0; i < newOnload.length; i=i+2) { 
          if (newOnload[i] === name && newOnload[i+1] === weight) { 
            newOnload.splice(i, 2)
          }
        }
        setCachedState({
          ...cachedState, 
          loadList: newOnload
        }); 
      }

    }

    handleRunAstar(); 

  }; 


  // ------------------------------ end flask backend functions -------------------------------------
  const area_keys = {
    0: "Ship",
    1: "Buffer",
    2: "Truck",
  };

  const mapArea = (st) => {
    const curr = currMove.current[st];
    return area_keys[curr];
  };

  const BUFFER = "buffer";
  const SHIP = "ship";

  useEffect(() => {
    console.log("dockView...");
    localStorage.setItem("inProgress", "true");
    if (cargoState.current === false) {
      // cargo state has not been initialized yet
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
  }, [cachedState, currMove.current, moveList.current, goalCargoState]);

  return (
    <div className="dock-view-container">
      <div>
        <Grid type={SHIP} items={cachedState.manifest} id="ship-dock" />
        <Grid type={BUFFER} items={[]} id="buffer-dock" />
        <div className="instruction-box">
          <h1 value={cachedState}>
            Step {cachedState.currStep + 1} of {cachedState.totalSteps + 1}:
          </h1>
          <h2 className="instruction" value={currMove.current}>
            Move {currMove.current["name"]} in {mapArea("current-area")} from
            slot {String(currMove.current["current-grid-position"])} to slot{" "}
            {String(currMove.current["next-grid-position"])} in{" "}
            {mapArea("next-area")}
          </h2>
          <button onClick={() => runMove(currMove.current)}>Make Move</button>
          <button onClick={() => skipMove(currMove.current)}>Skip Move</button>
          <button onClick={logCustomMessage}>Write a comment in the log</button>
          {customMessage && <p>Custom Message: {customMessage}</p>}
        </div>
      </div>
    </div>
  );
}
