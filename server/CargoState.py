from typing import List, Dict, Tuple
from copy import deepcopy

class Container:
    """
    Contains information of a container
    """
    weight: int
    name: str

    def __init__(self, line: str=None, info: Tuple | None=None):
            """
            Creates a Container object from a text-line of the manifest.txt

            Let info = (name, weight)
            """
            #print("LINE has length; ", len(line))
            #print(line)
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
                self.name = line[18:] # ignore newline

    def __str__(self):
            return f"[{self.weight}], {self.name}"
    
    def __repr__(self):
            return self.name

    def __lt__(self, other):
          if type(other) == type(self):
                return self.weight < other.weight

    def __eq__(self, other):
            return (self.name == other.name and self.weight == other.weight)

    def __add__(self, other):
          if type(other) == type(self):
                return other.weight + self.weight
          return other + self.weight

    def __radd__(self, other):
          return other + self.weight

class Position:
      """
      area: denotes the area in which the Position is located
            Areas:
            0: Ship
            1: Buffer
            2: Truck
      row: a zero-indexed row of the position
      col: a zero-indexed column of the position
      container: a Container object containing the container present in cell 
            * Note: container can be an empty (UNUSED) or a NAN  container
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
      """ 
      src: a Position object defining the origin of the move
      dst: a Position object defining the destination of the move
      * See Position description
      """
      src: Position
      dst: Position

      def __init__(self, src: Position, dst: Position):
            self.src = src
            self.dst = dst

      def cost(self):
            INTER_PINK_COST = 4
            TRUCK_PINK_COST = 2

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
            return f'Moved {self.src.container.name} from: {self.src} To: {self.dst} w/ cost: {self.cost()}'
      
      def __repr__(self):
            return self.__str__()

class CargoState:
      """
      Defines the current configuration, transfer list, and cost of a Cargo's state
      """
      # Manifest
      ship:   List[List[Container]]   # 8x12, row by col
      buf:    List[List[Container]]   # 4x24, row by col

      # Transfer List
      offload:    List[str]   # Where each element is a Container.name
      load:       List[Container]   # 

      # Other
      cost: int       # Cost to get to this state
      lastMove: Move


    # --------------------------- Class Intrinsics -----------------------------
      def __init__(self, manifest: List[List[Container]], offload: List[str], load: List[Container], cost: int = 0, lastMove: Move = None):
            #print("MANIFEST FROM CARGOSTATE.PY INITIALIZE CARGOSTATE: ")
            self.ship = manifest
            #print(self.ship)
            self.buf = [[Container() for j in range(24)] for i in range(4)] # Initialized to empty 4x24 empty buffer
            self.offload = offload
            self.load = load
            self.cost = cost
            self.lastMove = lastMove

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
                        #print("AREA PRINTED: ")
                        #print(AREA)
                        cell = AREA[row][col]
                        #print("CELL PRINTED IN CARGOSTATE: ")
                        #print(cell)
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
                        cell = AREA[row][col]
                        if cell.name != 'NAN':
                              bots[col] = Position(0 if isShip else 1, row, col, cell)
                  if None not in bots:
                        break
            return bots


    # ------------------------- The Meat --------------------------------------

      def balanceScore(self) -> float:
            left = 0
            right = 0
            
            # Make sure buffer is empty
            for row in range(4):
                  for col in range(24):
                        if self.buf[row][col].name != 'UNUSED':
                              return -1.0
                        
            # Measure weight on left and right of ship
            for row in range(8):
                  for col in range(6):
                        left += self.ship[row][col].weight
                  for col in range(6, 12):
                        right += self.ship[row][col].weight

            return (min(left, right)/max(left, right))

      def isBalanced(self) -> bool:
            score = self.balanceScore()
            if score == -1.0:
                  return False
            return score >= 0.9

      def isComplete(self) -> bool:
            return (len(self.load) == 0 and len(self.offload) == 0)

      def util(self, isBalance: bool) -> bool:
            if isBalance:
                  return self.isBalanced()
            return self.isComplete()

      def isBalanceable(self):
            containers: List[Container] = []
            for row in range(8):
                  for col in range(12):
                        cell = self.ship[row][col]
                        if cell.name != 'UNUSED' and cell.name != 'NAN':
                              containers.append(cell)
            containers.sort(key=lambda x: x.weight, reverse=True)

            left: int = 0
            right: int = 0
            while len(containers) > 0:
                  cur = containers.pop(0).weight
                  # print(f'Added {cur} to ', end='')
                  if left <= right:
                        left += cur
                        # print(f'left resulting in {left}')
                  else:
                        right += cur
                        # print(f'right resulting in {right}')

            # print(f'left: {left}    right: {right}')
            return ( min(left, right)/max(left, right) ) >= 0.9



      def move(self, mov: Move):
            """
            Returns a CargoState object that represents the current state AFTER taking the move
            described by the 'mov' parameter
            """
            newCargoState = deepcopy(self)
            newCargoState.lastMove = mov
            newCargoState.cost += mov.cost()
            
            src = mov.src
            srcArea = (newCargoState.ship if src.area == 0 else newCargoState.buf) if src.area != 2 else 'trk'
            dst = mov.dst
            dstArea = (newCargoState.ship if dst.area == 0 else newCargoState.buf) if dst.area != 2 else 'trk'

            temp = src.container
            if srcArea != 'trk':
                  srcArea[src.row][src.col] = Container()
            if dstArea != 'trk':
                  dstArea[dst.row][dst.col] = temp
            #print(newCargoState)
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
                              
                        if dstRow > 7:   # I ain't gonnna fw stacking ships past the 7th row
                              continue
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

                        if dstRow > 7:   # I ain't gonnna fw stacking ships past the 8th row
                              continue
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

                        if dstRow > 3:   # I ain't gonnna fw stacking ships past the 4th row
                              continue
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

                  if dstRow > 7:   # I ain't gonnna fw stacking ships past the 8th row
                        continue
                  dst = Position(0, dstRow, col, self.ship[dstRow][col])
                  for con in self.load:
                        #weight = 4
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
                  # moves.extend(self.interShipMoves())

            return moves

      def toManifest(self, path: str='manifest.txt') -> str:
            """
            Writes the current manifest to a string and returns it
            """
            #file = open(path, 'w')
            man = ''
            #print("PRINT SELF.SHIP")
            #print(len(self.ship), " x ", len(self.ship[0]))
            #print(self.ship)
            for row in range(8):
                  for col in range(12):
                        fRow = ('0' if (row+1) // 10 == 0 else '') + str(row+1)     # 0-index -> 1-index
                        fCol = ('0' if (col+1) // 10 == 0 else '') + str(col+1)     # ... and prepend 0 if needed

                        #print("ROW: ", row, " COL: ", col)
                        cell = self.ship[row][col]
                        #print("ABOUT TO PRINT CELL: ")
                        #print(cell)
                        fWeight = str(cell.weight)
                        fWeight = ( '0' * (6-len(fWeight)) ) + fWeight  # Prepend 0's if needed
                        
                        line = f'[{fRow}][{fCol}], {{{fWeight}}}, {cell.name}' + ('' if (row == 7 and col == 11) else '\n')
                        # file.write(line)
                        man += line
            return man
      
      def toBuffer(self) -> List[List[str]]:
            """
            Returns the buffer as a single dimensional array where 
            each element is a triplet of [[x,y], weight, name]

            NOTE: [x,y] are *not* zero-indexed
            NOTE: each element (including [x,y]) is a string
            """
            buf = []
            for row in range(4):
                  for col in range(24):
                        cell: Container = self.buf[row][col]
                        item = [f'{row+1}, {col+1}', str(cell.weight), cell.name]
                        buf.append(item)
            return buf

      def toShip(self) -> List[List[str]]:
            """
            Returns the ship as a single dimensional array where 
            each element is a triplet of [[x,y], weight, name]
            NOTE: [x,y] are *not* zero-indexed
            NOTE: each element (including [x,y]) is a string
            """ 
            ship = []
            for row in range(8):
                  for col in range(12):
                        cell: Container = self.ship[row][col]
                        item = [f'{row+1}, {col+1}', str(cell.weight), cell.name]
                        ship.append(item)
            return ship

      def toDict(self) -> Dict[str, List[List[str]]]:
            dic = {}
            dic['ship'] = self.toShip()
            dic['buffer'] = self.toBuffer()
            return dic
            