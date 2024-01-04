import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const nav = useNavigate(); 
  const logMessage = useRef(""); 
  const cargoState = useRef(false); 
  const currentCargoState = useRef(cachedState.manifest); 
  const currentBufferState = useRef([]); 
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
    console.log("DOCKVIEW: called astar")
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
        setCachedState({
          ...cachedState, 
          inProgress: true, 
          moves: mvs, // saves as an object?  
          totalSteps: mvs.length
        }); 

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
       
      }
      // Perform any actions based on the response from handleRunAstar
      // console.log('A* Algorithm solution:', astarResult.solution)
      // console.log('A* Algorithm moves:', astarResult.moves)
  }; 

  const runMove = async move => {
    await handleRunMove(move).catch(err => console.log(err))
    .then(async (response) => {
      console.log("DOCKVIEW.JS: handleRunMove completed")
      console.log(response)
      const dict = await handleGetCurrentCargoState().catch(err => console.log(err))
      .then((response) => {
       //  console.log(response);
        currentBufferState.current = response.buffer
        currentCargoState.current = response.ship
        console.log("DOCKVIEW.JS: getCurrentCargoState completed")
      }); 
    });

    if (moveList.current.length !== 0) {
      let mvs = moveList.current; 

      // save in ref - we set here so we don't have to refresh as much 
      const nextMove = mvs.shift(); 
      currMove.current = nextMove; 
      moveList.current = mvs; 

      console.log("RUNMOVE CURRMOVE: ", currMove.current); 

      //sanity check 
      setCachedState({
        ...cachedState, 
        inProgress: true, 
        moves: mvs, // saves as an object?  
        currStep: cachedState.currStep + 1
      }); 
  } else { // we're done with moves. fin 
    nav('/home'); 

  }

}; 

  // assumption: current cargo state is being updated with every call to make move. 
  const skipMove = async move => {
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
          loadList: newOnload, 
          currStep: cachedState.currStep + 1
        }); 
        if (cachedState.currStep === cachedState.totalSteps) {
          nav('/home')
        }

      }
    }

    await handleGetManifest().catch(e => console.log(e))
    .then(async (response) => {
      // may need to update this to setCache then parsemanifest file we shall see.
      localStorage.setItem('manifest', response)
      await runAstar().catch(e => console.log(e)).then(() => {
        console.log("handleGetManifest: astar successfully fetched")
      }); 
    })

    
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
        <Grid type={SHIP} items={currentCargoState.current} id="ship-dock" />
        <Grid
          type={BUFFER}
          items={[currentBufferState.current]}
          id="buffer-dock"
        />
        {cachedState.inProgress ? (
          <>
            <div className="instruction-box">
              <h1 value={cachedState}>
                Step {cachedState.currStep + 1} of {cachedState.totalSteps + 1}:
              </h1>
              <h2 className="instruction" value={currMove.current}>
                Move {currMove.current["name"]} in {mapArea("current-area")}<br/> 
                from slot {String(currMove.current["current-grid-position"])} to
                slot {String(currMove.current["next-grid-position"])} in{" "}
                {mapArea("next-area")}
              </h2>
              <div className="btn-grp">
              <button onClick={() => runMove(currMove.current)} className="primary-submit-btn">
                Make Move
              </button>
              <button onClick={() => skipMove(currMove.current)} className="primary-submit-btn">
                Skip Move
              </button>
              <button onClick={logCustomMessage} className="primary-submit-btn">
                Write a comment in the log
              </button>
              {customMessage && <p>Custom Message: {customMessage}</p>}
              </div>
            </div>
          </>
        ) : (
          <div class="lds-dual-ring"><div></div></div>
        )}
      </div>
    </div>
  );
}
