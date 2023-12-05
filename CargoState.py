from typing import List, Tuple
from copy import deepcopy

class Container:
    weight: int
    name: str

    def __init__(self, line: str=None, info: Tuple | None=None):
            """
            Creates a Container object from a text-line of the manifest.txt

            Let info = (name, weight)
            """
            if line == None and  info == None:
                self.name = 'UNUSED'
                self.weight = 0
            elif line == None:
                  self.name = info[0]
                  self.weight = info[1]
            elif line == 'NAN':
                  self.name = 'NAN'
                  self.weight = 0
            else:
                self.weight = int(line[10:15])
                self.name = line[18:-1] # ignore newline

    def __str__(self):
            return f"[{self.col}][{self.row}], [{self.weight}], {self.name}"
    
    def __repr__(self):
            return self.name

class Position:
      """
      Areas:
        0: Ship
        1: Buffer
        2: Truck
      """

      area: int
      row: int
      col: int
      container: Container

      def __init__(self, area: int, row: int, col: int, container: Container=None):
            self.area = area
            self.row = row
            self.col = col
            self.container = container

      def __str__(self):
            if self.area == 0:
                  a = 'ship'
            elif self.area == 1:
                  a = 'buffer'
            else:
                  a = 'truck'

            return f'{a}[{self.row}][{self.col}]'

      def __repr__(self):
            return self.__str__()

class Move:
      src: Position
      dst: Position

      def __init__(self, src: Position, dst: Position):
            self.src = src
            self.dst = dst

      def cost(self):
            INTER_PINK_COST = 3
            TRUCK_PINK_COST = 1

            if self.src.area == self.dst.area:  # Intra-area move
                  manhattan = ( abs(self.src.row - self.dst.row) + abs(self.src.col - self.dst.col) )
                  return manhattan 

            src = self.src
            dst = self.dst
            if (src.area == 0 or dst.area == 0) and (src.area == 1 or dst.area == 1): # Inter-area move 
                  shp = src if src.area == 0 else dst
                  buf = src if src.area == 1 else dst

                  # Calculate distance from ship-to-pink
                  pinkRow = 8      # 0-indexed
                  pinkCol = 0
                  shipDist =  abs(pinkRow - shp.row) + abs(pinkCol - shp.col)

                  # Calculate distance from buf-to-pink
                  pinkRow = 4
                  pinkCol = 24
                  bufDist = abs(pinkRow - buf.row) + abs(pinkCol - buf.col)

                  return shipDist + bufDist + INTER_PINK_COST
            if src.area == 2 or dst.area == 2:  # onload or offload
                  trk = src if src.area == 2 else dst
                  oth = src if src.area != 2 else dst

                  if oth.area == 0:
                        pinkRow = 8
                        pinkCol = 0
                  else:
                        pinkRow = 4
                        pinkCol = 24

                  return abs(pinkRow - oth.row) + abs(pinkCol - oth.col) + TRUCK_PINK_COST
            
            print('Something went wrong in Move.cost()')
            print(f'\tSrc: {src}    Dst: {dst}')
            return 0

      def __str__(self):
            return f'From: {self.src} To: {self.dst} w/ cost: {self.cost()}'
      
      def __repr__(self):
            return self.__str__()

class CargoState:
      # Manifest
      ship:   List[List[Container]]   # 8x12, row by col
      buf:    List[List[Container]]   # 4x24, row by col

      # Transfer List
      offload:    List[str]   # Where each element is a Container.name
      load:       List[Container]   # 

      # Other
      cost: int       # Cost to get to this state
      lastMove: Move
      depth: int      # of node in tree


    # --------------------------- Class Intrinsics -----------------------------
      def __init__(self, manifest: List[List[Container]], offload: List[str], load: List[Container], cost: int = 0, lastMove: Move = None, lastState = None):
            self.ship = manifest
            self.buf = [[Container() for j in range(24)] for i in range(4)] # Initialized to empty 4x24 empty buffer
            self.offload = offload
            self.load = load
            self.cost = cost
            self.lastMove = lastMove
            self.lastState = lastState
            self.depth = 0

      def __str__(self):
            retval = ""
            for row in range(7, -1, -1):
                  for col in range(12):
                        retval += self.ship[row][col].name
                        retval += '\t'
                  retval += '\n'
            retval += '\n'
            for row in range(3, -1, -1):
                  for col in range(24):
                        retval += self.buf[row][col].name
                        retval += '\t'
                  retval += '\n'
            return retval
      
      def __repr__(self):
            return self.__str__() 

      def __eq__(self, other):
            if type(self) != type(other):
                  return False
            return self.depth == other.depth

      def __lt__(self, other):
            if type(self) != type(other):
                  return False
            return self.depth < other.depth

    # ------------------------- Helpers ---------------------------------------
      def topContainers(self, isShip: bool=True) -> List[Position | None]:
            """
            Returns a list of Positions that contain the top Containers of each column

            isShip: true if looking for container ontop of ship, false if for container ontop of buf
            tops[i] = container atop column i
            if tops[i] = None, the column is empty
            """
            ROWS = 8 if isShip else 4
            COLS = 12 if isShip else 24
            AREA = self.ship if isShip else self.buf
            tops = [None for col in range(COLS)]
            for row in range(ROWS-1, -1, -1):
                  for col in range(COLS):
                        if tops[col] != None:
                              # We already found the top of this row
                              continue
                        cell = AREA[row][col]
                        if cell.name == 'UNUSED' or cell.name == 'NAN':
                              # Is either an empty cell or the 'bottom' of a column has been reached
                              continue
                        tops[col] = Position(0 if isShip else 1, row, col, cell)
            return tops

      def bottomCells(self, isShip: bool=True) -> List[Position]:
            """
            Returns the bottom-most non-NAN cell for each column
            """
            ROWS = 8 if isShip else 4
            COLS = 12 if isShip else 24
            AREA = self.ship if isShip else self.buf
            bots = [None for col in range(COLS)]
            for row in range(ROWS):
                  for col in range(COLS):
                        if bots[col] != None:   # If you already found the bottom of this col, move on
                              continue
                        # cell = self.ship[row][col]
                        cell = AREA[row][col]
                        if cell.name != 'NAN':
                              bots[col] = Position(0 if isShip else 1, row, col, cell)
                  if None not in bots:
                        break
            return bots


    # ------------------------- The Meat --------------------------------------

      def isBalanced(self) -> bool:
            left = 0
            right = 0

            # Make sure buffer is empty
            for row in range(4):
                  for col in range(24):
                        if self.buf[row][col].name != 'UNUSED':
                              return False
                        
            # Measure weight on left and right of ship
            for row in range(8):
                  for col in range(6):
                        left += self.ship[row][col].weight
                  for col in range(6, 12):
                        right += self.ship[row][col].weight

            return ( min(left, right)/max(left, right) >= 0.9 )

      def isComplete(self) -> bool:
            return (len(self.load) == 0 and len(self.offload) == 0)

      def util(self, isBalance: bool) -> bool:
            if isBalance:
                  return self.isBalanced()
            return self.isComplete()
                        

      def move(self, mov: Move):
            newCargoState = deepcopy(self)
            newCargoState.lastMove = mov
            newCargoState.lastState = self
            newCargoState.cost += mov.cost()
            newCargoState.depth += 1
            
            src = mov.src
            srcArea = (newCargoState.ship if src.area == 0 else newCargoState.buf) if src.area != 2 else 'trk'
            dst = mov.dst
            dstArea = (newCargoState.ship if dst.area == 0 else newCargoState.buf) if dst.area != 2 else 'trk'

            temp = src.container
            if srcArea != 'trk':
                  srcArea[src.row][src.col] = Container()
            if dstArea != 'trk':
                  dstArea[dst.row][dst.col] = temp

            return newCargoState
            


      def intraShipMoves(self):
            # Iterate through the ship and check for all top-containers, Tops
            # For each Top in Tops, move it to every possible place (top of each column)

            moves = []
            tops: List[Position] = self.topContainers()
            bots: List[Position] = self.bottomCells()
            for top in tops:
                  if top == None:
                        continue
                  
                  for col in range(12):
                        if top.col == col:
                              continue
                        if tops[col] == None:   # If col is empty, put at the bottom
                              dstRow = bots[col].row
                        else:                   # Else, put it ontop of the top-most container
                              dstRow = tops[col].row+1
                              
                        dst = Position(0, dstRow, col, self.ship[dstRow][col])
                        mov = Move(top, dst)
                        moves.append(self.move(mov))

            return moves
      
      def interShipMoves(self):
            # Iterate through all moves to be made from ship to buf
            # Then iterate through all moves to be made from buf to ship
            
            moves = []
            shipTops: List[Position] = self.topContainers(isShip=True)
            shipBots: List[Position] = self.bottomCells(isShip=True)
            bufTops: List[Position] = self.topContainers(isShip=False)
            bufBots: List[Position] = self.bottomCells(isShip=False)

            # Ship to buffer
            for shipTop in shipTops:
                  if shipTop == None:
                        continue

                  for col in range(24):   # Move from shipTop to above bufTops
                        if bufTops[col] == None:      # If buf col empty, put on bottom
                              dstRow = bufBots[col].row
                        else:                         # Else, put it ontop of the topmost container
                              dstRow = bufTops[col].row+1

                        bufDst = Position(1, dstRow, col, self.buf[dstRow][col])
                        mov = Move(shipTop, bufDst)
                        moves.append(self.move(mov))

            # Buffer to ship
            for bufTop in bufTops:
                  if bufTop == None:
                        continue

                  for col in range(12):   
                        if shipTops[col] == None:
                              dstRow = shipBots[col].row
                        else:
                              dstRow = shipTops[col].row+1

                        shipDst = Position(0, dstRow, col, self.ship[dstRow][col])
                        mov = Move(bufTop, shipDst)
                        moves.append(self.move(mov))

            return moves


      def loadMoves(self):
            if len(self.load) == 0:
                  return []
            
            moves = []
            shipTops: List[Position] = self.topContainers(isShip=True)
            shipBots: List[Position] = self.bottomCells(isShip=True)
            for col in range(12):
                  if shipTops[col] == None:
                        dstRow = shipBots[col].row
                  else:
                        dstRow = shipTops[col].row+1

                  dst = Position(0, dstRow, col, self.ship[dstRow][col])
                  for con in self.load:
                        weight = 4
                        trk = Position(2, 0, 0, con)
                        mov = Move(trk, dst)
                        moves.append(self.move(mov))
                        moves[-1].load.remove(con)

            return moves
      
      def offloadMoves(self):
            if len(self.offload) == 0:
                  return []
            
            shipTops: List[Position] = self.topContainers(isShip=True)
            off = []
            for top in shipTops:    # Check what *can* be offloaded (i.e. is on top)
                  if top == None:
                        continue
                  if top.container.name in self.offload:
                        off.append(top)

            moves = []
            for top in off:
                  con = Container(info=('truck', 0))
                  trk = Position(2, 0, 0, con)
                  mov = Move(top, trk)
                  moves.append(self.move(mov))
                  moves[-1].offload.remove(top.container.name)

            return moves
      
      def expand(self, isBalance: bool):
            moves = self.intraShipMoves()

            if not isBalance:
                  moves.extend(self.offloadMoves())
                  moves.extend(self.loadMoves())
                  moves.extend(self.interShipMoves())

            return moves
            