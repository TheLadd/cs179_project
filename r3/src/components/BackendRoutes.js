
const handleCreateCargoState = async (manifest, offloadList, loadList) => {
  // Prepare the data to send in the request
  const cargoStateData = {
    manifest: manifest,
    offload: offloadList,
    load: loadList,
  };

  try {
    // Make a POST request to the backend
    const response = await fetch('http://127.0.0.1:5000/create-cargo-state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cargoStateData),
    });

    // Check if the request was successful (status code 200)
    if (response.ok) {
      const result = await response.json();
      console.log(result.message);  // Log the response from the backend
      // Perform any additional actions based on the response
    } else {
      console.error('Failed to create CargoState. Status:', response.status);
    }
  } catch (error) {
    console.error('Error during CargoState creation:', error.message);
  }
};

const handleRunAstar = async (manifest, isBalance, offload, load) => {
  const requestData = {
    manifest: manifest,
    isBalance: isBalance,
    offload: offload,
    load: load,
  };

  try {
    const response = await fetch('http://127.0.0.1:5000/run-astar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);  // Log the response from the backend
      return (result);
      // Perform any additional actions based on the response
    } else {
      console.error('Failed to run A* algorithm. Status:', response.status);
    }
  } catch (error) {
    console.error('Error during A* algorithm:', error.message);
  }
};

const handleRunMove = async (moveData) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/runMove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ move: moveData }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message);  // Log the response from the backend
      // Perform any additional actions based on the response
    } else {
      console.error('Failed to run move. Status:', response.status);
    }
  } catch (error) {
    console.error('Error during move execution:', error.message);
  }
};

const handleGetManifest = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/getManifest', {
      method: 'GET',
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);  // Log the response from the backend
      return(result)
      // Perform any additional actions based on the response
    } else {
      console.error('Failed to get manifest. Status:', response.status);
    }
  } catch (error) {
    console.error('Error during manifest retrieval:', error.message);
  }
};

const handleLogMessage = async (message) => {
  const requestData = {
    message: message,
  };

  try {
    const response = await fetch('http://127.0.0.1:5000/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);  // Log the response from the backend
      // Perform any additional actions based on the response
    } else {
      console.error('Failed to log message. Status:', response.status);
    }
  } catch (error) {
    console.error('Error during message logging:', error.message);
  }
};

const handleGetCurrentCargoState = async () => {
  try {
    // Make a GET request to the backend
    const response = await fetch('http://127.0.0.1:5000/get-current-cargo-state', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        
      },
    });

    // Check if the request was successful (status code 200)
    if (response.ok) {
      const result = await response.json();
      console.log("Current Cargo State:", result);  // Log the response from the backend
      // Perform any additional actions based on the response
    } else {
      console.error('Failed to get current CargoState. Status:', response.status);
    }
  } catch (error) {
    console.error('Error during getting current CargoState:', error.message);
  }
};

export { handleCreateCargoState,
  handleRunAstar,
  handleRunMove,
  handleGetManifest,
  handleLogMessage,
handleGetCurrentCargoState}



