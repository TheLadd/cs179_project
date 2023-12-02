from typing import List
import re

# The following link has a leetcode of a fast Python implementation of UCS on my account
# https://leetcode.com/problems/path-with-maximum-probability/ 


class Container:
    """
    Areas: "Ship", "Buffer", "Truck"
    """

    # area: str
    row: int
    col: int
    weight: int
    name: int

    def __init__(self, line: str=None):
            """
            Creates a Container object from a text-line of the manifest.txt
            """
            if line == None:
                self.name = 'UNUSED'
                self.weight = 0
            else:
                self.col = int(line[1:3])
                self.row = int(line[4:6])
                self.weight = int(line[10:15])
                self.name = line[18:-1] # 1ignore newline

    def __str__(self):
            return f"[{self.col}][{self.row}], [{self.weight}], {self.name}"
    
    def __repr__(self):
            return self.name

class Move:
    """
    Areas: "Ship", "Buffer", "Truck"
    """

    container: Container

    originArea: str
    originX:    int
    originY:    int

    destArea:   str
    destX:      int
    destY:      int

    def __init__(self, container: Container, originArea: str, origin: tuple, destArea: str, dest: tuple):
        self.container = container

        self.originArea = originArea
        self.originX = origin[0]
        self.originY = origin[1]

        self.destArea = destArea
        self.destX = dest[0]
        self.destY = dest[1]

    def __repr__(self):
        return f"From {self.originArea}[{self.originX}][{self.originY}] to {self.destArea}[{self.destX}][{self.destY}]"

    def cost(self):
        pass

class CargoState:
    # Manifest
    ship:   List[List[Container]]   # , row by col
    buf:    List[List[Container]]   # 4x24, row by col

    # Transfer List
    offload:    List[str]   # Where each element is a Container.name
    load:       List[str]   # 

    # Other
    cost: int       # Cost to get to this state
    lastMove: Move


    # ------------------------------------ HELPER METHODS ------------------------------------ 

    def __init__(self, manifest: List[List[Container]], offload: List[str], load: List[str], cost: int = 0, lastMove: Move = None):
        self.ship = manifest
        self.buf = [[Container() for j in range(24)] for i in range(4)] # Initialized to empty 24x4 empty buffer
        self.offload = offload
        self.load = load
        self.cost = cost
        self.lastMove = lastMove

    def topOfCol(self, col: int, isShip: bool = True) -> int:
        """
        Finds the index of the 'highest' filled cell in column col
        """
        for i in range(11, -1, -1):
            if self.ship[col][i].name == 'UNUSED':
                continue
            if self.ship[col][i].name == 'NAN':
                return i+1
            else:
                return i

    def loadMove(self, c: Container, dest: tuple) -> Move:
        """ Assuming this always loads from truck to ship; no buffer """
        return Move(c, "Truck", (0,0), "Ship", dest)

    def offloadMove(self, c: Container, origin: tuple) -> Move:
        """ Assuming this always offloads from ship to truck; no buffer """
        return Move(c, "Ship", origin, "Truck", (0,0))

    def intraAreaMove(self, c: Container, isShip: bool, origin: tuple, dest: tuple) -> Move:
        """
        isShip = true   -> moving within ship
               = false  -> moving within buffer
        """
        if isShip:
            area = "Ship"
        else:
            area = "Buffer"
        return Move(c, area, origin, area, dest)

    def interAreaMove(self, c: Container, fromShip: bool, origin: tuple, dest: tuple) -> Move:
        """ 
        fromShip = true     -> moving from ship to buffer 
                 = false    -> moving from buffer to ship
        """
        if fromShip:
            originArea = "Ship"
            destArea = "Buffer"
        else:
            originArea = "Buffer"
            destArea = "Ship"

        return Move(c, originArea, origin, destArea, dest)
    
    def searchShip(self, c: str):
        """
        Returns a container with the name 'c' if it exists on the ship, otherwise returns None
        """
        for i in range(8):
            for j in range(12):
                if self.ship[i][j].name == c:
                    return self.ship[i][j]
        return None
    
    # ------------------------------------ THE MEAT ------------------------------------  
    
    def availableMoves(self) -> List[Move]:
        """ 
        For now, the process is as follows:

        1. Offload all containers in offload list
        2. Load all containers in load list
        3. Move all containers in buffer back to ship
        4. Make sure ship configuration is legal

        Assume this function is only called when the transfer list is not empty
        Note: Might want to split this into two functions? For offload and load seperately
        """
        moves = []

        print('Beginining availableMoves()')
        print(f'offload: {self.offload} | load: {self.load}')
        # 1. Offload containers
        if len(self.offload) > 0:
            print('Offloading...')
            for off in self.offload:
                off = self.searchShip(off)
                top = self.topOfCol(off.col, isShip=True)

                if off.row < top:    # If 'off' is currently reachable
                    topOfOffCol = self.ship[off.col][top]
                    moves.append(self.offloadMove(off, (off.col,off.row))) 
                else:   # If not, move the container that is above 'off'
                    origin = (off.col, topOfOffCol)
                    containerToMove = self.ship[ origin[0] ][ origin[1] ]
                    
                    for i in range(12): # From ship to ship
                        if i == off.row:
                            continue
                        destRow = self.topOfCol(i, isShip=True)
                        moves.append(self.intraAreaMove(containerToMove, origin, (i, destRow)))

                    for i in range(24): # From ship to buffer
                        destRow = self.topOfCol(i, isShip=False)
                        moves.append(self.interAreaMove(containerToMove, origin, (i, destRow), fromShip=True))


        # 2. Load containers
        else:
            print('Loading...')
            for on in self.load:
                for destCol in range(12):
                    destRow = self.topOfCol(destCol, isShip=True)
                    moves.append(self.loadMove(on, (destCol,destRow)))

        print('Finished availableMoves()')
        return moves
    
    def move(self, m: Move):
        newShip = self.ship.copy()
        newBuf = self.buf.copy()
        newLoad = self.load.copy()
        newOff = self.offload.copy()

        originArea = m.originArea
        destArea = m.destArea

        # Intra-area move
        if originArea == destArea:
            # Transfer list not updated, just manifest
            area = newShip if originArea == 'Ship' else newBuf
            area[m.destX][m.destY] = area[m.originX][m.originY]
            area[m.originX][m.originY] = Container()
            
        
        # Load
        elif originArea == 'Truck':
            if destArea == 'Ship':
                pass
            elif destArea == 'Bufer':
                pass
            newLoad.remove(m.container)

        # Offload
        elif destArea == 'Truck':
            if originArea == 'Ship':
                pass
            elif originArea == 'Buffer':
                pass
            newOff.remove(m.container)

        # Inter-area move
        elif originArea == 'Ship':
            pass
        elif originArea == 'Buffer':
            pass