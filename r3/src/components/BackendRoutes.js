
export default function BackendRoutes (props) {
  // Assuming you have the necessary state and functions in your component

const handleCreateCargoState = async () => {
  // Prepare the data to send in the request
  const cargoStateData = {
    manifest: props.manifest,
    offload: props.offloadList,
    load: props.loadList,
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

// ...

// Trigger the cargo state creation when needed
handleCreateCargoState();

}


