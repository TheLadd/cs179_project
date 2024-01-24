# R^3 Solutions Shipping Container Optimizer
_note: this project is still in progress! The PR's are detailed if you would like to see what's currently still being changed (mostly stuff relating to the frontend)._
_additional documentation for this project can be found [here](https://docs.google.com/document/d/18Fr2UJx0ldRbrtTEScdsjOyBxeuJUFfjYuyB0pDtAI0/edit?usp=sharing)._

## Purpose
This project was made for Mr. Keogh, our 'client' who owns a ship dock. Currently, he has employees that spend a lot of time figuring out two main things: how to balance the load on the ship so that the ship is compliant with industry standards, and minimizing the number of moves needed to load and unload the ship. This was made to automate this process, and entails some of the main features: 

1. _logging:_ users can log at anytime of any concerns they have during their move set. There is some automated logging throughout the application, such as when a user signs in, a move is made, etc. This log is saved onto the desktop for Mr Keogh's use/management. 
2. _persistent data and storage:_ In the event of a crash, the cached state and local storage work together to save the user data and information. We start saving data after anything on the transfer list has been input. Users can resume this operation or choose to start a new operation. 
3.  _making the moves:_ This is the primary function of our app, which shows a grid display of the ship and 'buffer', which is an additional place for us to store the shipping containers in the event there's no room on the ship. Users can either choose to make the suggested move, or skip it, in which case the astar algorithm is ran again with a new list of expected moves.
4.  _uploading the transfer list:_ Users upload a 'manifest', which contains a description of the ship and buffer state, and then can input the transfer list, which contains the loading and offloading instructions for that ship. The transfer list is human-readable and very informal, hence why we need users to upload these instructions manually. 

## Search Algorithm & Functionality 
This project uses the A* algorithm and Manhattan Distance to calculate the minimum number of moves for both load-balancing and onloading/offloading. 

### For Onloading/Offloading: 

For each container to offload, O_i, calculate the Manhattan distance from the position of O_i from the ship hull (1, 1). Sum all Manhattan distances for all O_i and let that be your cost.

Then, for each container to load, L_i, calculate the Manhattan distance from the from the ship hull hull (1, 1) to the nearest available position. Sum all of these manattan distances and add them to your cost.

Return cost.

### For Load Balancing: 

Measure the weight on the left and right side. Determine which side is heavier, let the set of all containers on the heavier side be called HeavyContainers. Sort HeavyContainers so that heaviest containers come first.

Starting with the heaviest container (so long as moving the heaviest container to the other side wouldn’t create another imbalance), determine the amount of columns it would have to traverse to reach the beginning of the lighter side. Add this number to a variable called cellsMoved. Do this until the load is balanced.

Return cellsMoved as the cost

## Dependencies
- Node.js (or npm) 8.19.2: https://nodejs.org/en
- React 
- Python 3.12.0
- Flask 3.0.0
- Flask-cors
- and countless others.... run `npm install` to install all dependencies listed in package.json 

Once all necessary packages are installed, navigate to the project directory and run the command:
`npm run dev`

