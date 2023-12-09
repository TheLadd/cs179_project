
from CargoState import *

def balanceScore(state: CargoState) -> float:
    left = 0
    right = 0
    
    # Make sure buffer is empty
    for row in range(4):
            for col in range(24):
                if state.buf[row][col].name != 'UNUSED':
                        return -1.0
                
    # Measure weight on left and right of ship
    for row in range(8):
            for col in range(6):
                left += state.ship[row][col].weight
            for col in range(6, 12):
                right += state.ship[row][col].weight

    balanceMass = (left+right)/2
    deficit = balanceMass - min(left,right)

    # Take note of all containers on the heavier side
    containers = []
    start = 0 if max(left,right) == left else 6
    for row in range(8):
          for col in range(start, start+6):
                cell = state.ship[row][col]
                if cell.name != 'UNUSED' and cell.name != 'NAN':
                      containers.append((cell, col))

    # Check the min # of containers in 'containers' that need to be moved to the other side
    # in order for 'state' to be balanced
    containers.sort(key=lambda x: x[0].weight, reverse=True)
    weightMoved = 0
    cellsMoved = 0
    goalCol = 0 if min(left,right) == left else 6
    for i in range(len(containers)):
            # Ensure we don't move a container that would create another imbalance
            con = containers[i][0]
            if 0.9*con.weight <= (deficit - weightMoved):
                  weightMoved += con.weight
                  cellsMoved += abs( (goalCol-containers[i][1]) )

            if (min(left, right)+weightMoved) / (max(left,right)-weightMoved) >= 0.9:
                return cellsMoved 
    
    return cellsMoved 

def transferListSize(state: CargoState):
    return (len(state.load) + len(state.offload))

def transferHueristic(state: CargoState):
    # Load Underestimation: 
        # Assume all containers to be loaded can be loaded onto ship[0][11]
            # 2 minutes for truck to ship-pink-portal (ship[0][12])
            # 1 minute for pink-portal to ship[0][11]
    cost = len(state.load)*3  

    # Offload Underestimation:
        # Calculate manhattan distance from between each offload container and pink-portal

    checklist = state.offload.copy()
    
    ROWS = 8
    COLS = 12
    pinkRow = 12    # These are zero-indexed
    pinkCol = 0     #
    for row in range(ROWS):
            if len(checklist) == 0:
                  break
            for col in range(COLS):
                if state.ship[row][col].name in checklist:
                      cost += pinkRow - row
                      cost += col - pinkCol
                      checklist.remove(state.ship[row][col].name)
    
    return cost