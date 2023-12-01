from CargoState import Container, CargoState
from typing import List
from queue import PriorityQueue
from dataclasses import dataclass, field
from Tree import *


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


# def bfs(state: CargoState):
def bfs(tree: Tree):
    frontier: List[CargoState] = [ tree.getRoot() ]
    explored = {}

    cnt = 0
    while len(frontier) > 0:
        # 1. Get next node, cur, from frontier
        cur = frontier.pop(0)
        if str(cur.val) in explored.keys():
            continue

        explored[str(cur)] = True

        # 2. Check to see if this is goal state
        cnt += 1
        if cur.val.isBalanced():
            print(f'BFS took {cnt} explored nodes')
            return cur
        
        # 3. Expand node, adding children to frontier only if not explored yet
        children = cur.val.intraShipMoves()
        for child in children:
            if str(child) not in explored.keys():
                tree.addNodeFrom(cur.getIndex(), child)
                temp = tree.getNode(-1)
                frontier.append(temp)
    return None


def ucs(tree: Tree):
    frontier = PriorityQueue()
    explored ={}

    root = tree.getRoot()
    frontier.put( (root.val.cost, root) )

    cnt = 0
    while not frontier.empty():
        # Get next node, cur, from frontier
        cur = frontier.get()[1]
        if str(cur.val) in explored.keys():
            continue
        explored[str(cur)] = True

        # Check if this is a goal state
        cnt += 1
        if cur.val.isBalanced():
            print(f'UCS took {cnt} explored nodes')
            return cur
        
        # Expand, add children to frontier only if they haven't been explored yet
        children = cur.val.intraShipMoves()
        for child in children:
            if explored.get(str(child)) == None:
                tree.addNodeFrom(cur.getIndex(), child)
                childNode = tree.getNode(-1)
                frontier.put( (child.cost, childNode) )
    
    return None

def backtrace(final: Node, tree: Tree):
    moves = []

    cur = final
    while cur.pInd != None:
        moves.append(cur.val.lastMove)
        cur = tree.getNode(cur.getParentInd())

    return list(reversed(moves))