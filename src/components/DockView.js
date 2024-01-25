import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  runAstar,
  runMove,
  handleCustomLog,
  skipMove,
  skipMove2,
} from "./BackendRoutes";
import Loading from "./Loading"; 
import Grid from "./Grid";
import LogoutButton from "./LogoutButton";

export default function DockView ({ cachedState, setCachedState }) {
  const nav = useNavigate(); 
  // probably don't need these but will clean up later once i figure out skipmove
  const cargoState = useRef(false); 
  const currentCargoState = useRef(cachedState.manifest); 
  const currentBufferState = useRef([]); 
  const goalCargoState = useRef([]);
  const displayText = ""; 

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
  const isBalance = cachedState.opType === 'Offloading/Onloading' ? false : true; 


  const BUFFER = "buffer";
  const SHIP = "ship";



  // runs a star if there wasnt already an operation in progress and cargostate has already been initialized (cachedState.buffer)
  useEffect(() => {
    if (cachedState.inProgress == false && cachedState.buffer) {
      runAstar(cachedState, setCachedState);
    }
  }, [cachedState.inProgress, cachedState.buffer]);

  // useEffect that handles when u finish and generates the instruction every time we make a move (currStep changes)
  useEffect(() => {
    if (cachedState.inProgress === true) {
      if (cachedState.currStep === cachedState.moves.length && cachedState.currStep != 0 || cachedState.moves.length === 0) {
        nav("/finish");
      }
    }
  }, [cachedState.inProgress, cachedState.moves, cachedState.currStep]);
  

  return (
    <div> 
      <LogoutButton setCachedState={setCachedState}/> 
        {cachedState.inProgress ? (
          <div className="dock-view-container">
            <Grid type={SHIP} items={cachedState.manifest} id="ship-dock" />
            <Grid type={BUFFER} items={cachedState.buffer} id="buffer-dock" />
            <div className="instruction-box">
              <h1 value={cachedState}>
                Step {cachedState.currStep + 1} of {cachedState.moves.length}:
              </h1>
              <h2
                className="instruction"
                value={currMove.current}
                style={{ whiteSpace: "pre-line" }}
              >
                {cachedState.instruction}
              </h2>
              <div className="btn-grp">
                <button
                  onClick={() => runMove(cachedState, setCachedState)}
                  className="primary-submit-btn"
                >
                  Make Move
                </button>
                <button
                  onClick={() => {
                    //setCachedState({...cachedState, inProgress: false})
                    skipMove2(cachedState, setCachedState)}}
                  className="primary-submit-btn"
                >
                  Skip Move
                </button>
                <button
                  onClick={handleCustomLog}
                  className="primary-submit-btn"
                >
                  Write a comment in the log
                </button>
              </div>
          </div>
          </div> 
        ) : (
          <Loading displayText={displayText} /> 
        )}
    </div> 
)};
