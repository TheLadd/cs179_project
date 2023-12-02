from CargoState import Container, CargoState
from typing import List
from queue import PriorityQueue
from dataclasses import dataclass, field


def readManifest(filename: str) -> List[List[Container]]:
    """
    Returns manifest as a 2d list where manifest[i][j] == manifest[row][col]
    """
    file = open(filename)
    lines = file.readlines()
    manifest = [[None for j in range(12)].copy() for i in range(8)] # [row][col]

    for i in range(8):
        for j in range(12):
            if i == 7 and j == 11:  # Accounts for lack of newline character in last line
                lines[i*12+j] += ' '
            manifest[i][j] = Container(lines[i*12+j])

    return manifest

def printManifest(manifest: List[List[Container]]):
    temp = ''
    for row in range(7, -1, -1):
        for col in range(12):
            temp += manifest[row][col].name
            temp += '\t'
        temp += '\n'
    print(temp)


def bfs(state: CargoState):
    frontier: List[CargoState] = [ state ]
    explored = {}

    cnt = 0
    while len(frontier) > 0:
        cur = frontier.pop(0)
        # print(cur)
        if str(cur) in explored.keys():
            continue

        cnt += 1
        if cur.isBalanced():
            print(f'BFS took {cnt} explored nodes')
            return cur
        
        explored[str(cur)] = True
        children = cur.intraShipMoves()
        frontier.extend(children)
    return None


def ucs(state: CargoState):
    frontier = PriorityQueue()
    explored ={}
    frontier.put( (state.cost, state) )

    cnt = 0
    while not frontier.empty():
        curCost, cur = frontier.get()
        if str(cur) in explored.keys():
            continue

        cnt += 1
        if cur.isBalanced():
            print(f'UCS took {cnt} explored nodes')
            return cur
        
        explored[str(cur)] = True
        children = cur.intraShipMoves()
        for child in children:
            frontier.put( (child.cost, child) )
    
    return None

def backtrace(final: CargoState):
    moves = []

    cur = final
    while cur.lastState != None:
        moves.append(cur.lastMove)
        cur = cur.lastState

    return list(reversed(moves))