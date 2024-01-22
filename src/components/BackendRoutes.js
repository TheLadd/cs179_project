// initializes the cargo state in the backend
const initializeCargoState = async (cachedState, setCachedState) => {
  // Prepare the data to send in the request
  const cargoStateData = {
    manifest: localStorage.getItem("manifest"),
    offload: cachedState.offloadList,
    load: cachedState.loadList,
  };

  try {
    const response = await fetch("http://127.0.0.1:5000/create-cargo-state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cargoStateData),
    });

    if (response.ok) {
      const result = await response.json();

      // cargo state is stored in the backend, this function retrieves the cargostate stored in backend and stores them in cachedState.buffer and cachedState.ship
      console.log("BACKENDROUTES.JS: initializeCargoState success from localstorage.manifest ", result);

      setCachedState({
        ...cachedState,
        manifest: result.ship,
        buffer: result.buffer,
      });
      
      // any time you try to set the cachedState's manifest or buffer you must also set them in localstorage, can't think of a better way to do this unfortunately
      localStorage.setItem("manifest", result.shipTxt);
      localStorage.setItem("buffer", result.bufferTxt);
      
      return result;
    } else {
      console.error("Failed to create CargoState. Status:", response.status);
    }
  } catch (error) {
    console.error("Error during CargoState creation:", error.message);
  }
};

// runs astar on the cargo state which is already stored in the backend
const runAstar = async (cachedState, setCachedState) => {
  const isBalance = cachedState.opType === 'Offloading/Onloading' ? false : true; 
  const requestData = {
    isBalance: isBalance,
    offload: cachedState.offloadList,
    load: cachedState.loadList,
  };

  try {
    const response = await fetch("http://127.0.0.1:5000/run-astar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("BACKENDROUTES.JS: runAstar called ", result);

      setCachedState({
        ...cachedState,
        currStep: result.currStep, // the current step you are on (will always return 0 here)
        instruction: makeInstruction(result.currStep, result.moves), // the instruction in string form for the current move you are on
        moves: result.moves, // the moves generated by astar to reach the goalstate
        inProgress: true,
        solution: result.solution,  // the goalstate
      });

      return result;
    } else {
      console.error("Failed to run A* algorithm. Status:", response.status);
    }
  } catch (error) {
    console.error("Error during A* algorithm:", error.message);
  }
};

// runs a move
const runMove = async (cachedState, setCachedState) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/run-move", {
      method: "POST",
    });

    if (response.ok) {
      const result = await response.json();
      console.log("BACKENDROUTES.JS: runmove", result);

      handleLogMessage("made a move"); // make it a more descriptive message that actually describes what move was made

      setCachedState({
        ...cachedState,
        currStep: result.currStep,
        instruction: makeInstruction(result.currStep, cachedState.moves),
        manifest: result.ship,
        buffer: result.buffer,
        offloadList: result.offload,
        loadList: result.load,
      });

      localStorage.setItem("manifest", result.shipTxt);
      localStorage.setItem("buffer", result.bufferTxt);
      
      return;
    } else {
      console.error("Failed to run move. Status:", response.status);
    }
  } catch (error) {
    console.error("Error during move execution:", error.message);
  }
};

const skipMove = async (cachedState, setCachedState) => {
    if (cachedState.opType !== 'Offloading/Onloading') { 
      throw new Error("Skipping moves is not allowed for load balancing. The ship could tip over!!!\n"); 
    }
  
    try {
      const response = await fetch("http://127.0.0.1:5000/skip-move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("BACKENDROUTES.JS: ** skip move ** runAstar called ", result);
  
        setCachedState({
          ...cachedState,
          currStep: 0, 
          instruction: makeInstruction(result.currStep, result.moves), 
          moves: result.moves, 
          inProgress: true,
          solution: result.solution,  
        });
        console.log("BACKENDROUTES.JS: for skip move: ", result); 
        return result;
      } else {
        console.error("Failed to run A* algorithm. Status:", response.status);
      }
    } catch (error) {
      console.error("Error during A* algorithm:", error.message);
    }
};

// gets the current move from the moves list passed into it and the step # you are on, then builds an instruction string which is then returned as a string
const makeInstruction = (currStep, moves) => {
  // if we have already made all the moves, return a special string
  if (currStep >= moves.length){
    const instructionString = "You have finished the operation!"
    return(instructionString);
  }
  const currmove = moves[currStep]

  const area_keys = {
    0: "Ship",
    1: "Buffer",
    2: "Truck",
  };

  const mapArea = (st) => {
    const curr = currmove[st];
    return area_keys[curr];
  };

  // todo: run some logic so that if the area is truck it doesnt say Truck [1,1]
  const instructionString = `Move ${currmove.name} in ${mapArea("current-area")}
  from slot ${String(currmove["current-grid-position"])} to
  slot ${String(currmove["next-grid-position"])} in ${mapArea("next-area")}`;

  return(instructionString);
}

const handleLogMessage = async (message) => {
  const requestData = {
    message: message,
  };

  try {
    const response = await fetch("http://127.0.0.1:5000/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);
    } else {
      console.error("Failed to log message. Status:", response.status);
    }
  } catch (error) {
    console.error("Error during message logging:", error.message);
  }
};

// when a user wants to log a custom message, makes a little pop up window
const handleCustomLog = async () => {
  try {
    const userInput = window.prompt("Enter your custom message:");
    if (userInput !== null) {
      // Log the custom message using handleLogMessage
      await handleLogMessage(userInput);
      console.log("Custom message logged:", userInput);
    }
  } catch (error) {
    console.error("Error during handling custom log:", error.message);
  }
};

export {
  initializeCargoState,
  runAstar,
  runMove,
  skipMove,
  handleLogMessage,
  handleCustomLog,
};
