from CargoState import Container, CargoState
from typing import List
from dataclasses import dataclass, field
from Tree import *
import heuristics


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


def bfs(tree: Tree, isBalance:bool = True):
    frontier: List[CargoState] = [ tree.getRoot() ]
    explored = {}

    cnt = 0
    while len(frontier) > 0:
        # 1. Get next node, cur, from frontier
        cur = frontier.pop(0)
        if str(cur.val) in explored:
            continue
        explored[str(cur)] = True

        # 2. Check to see if this is goal state
        cnt += 1
        if cur.val.util(isBalance):
            print(f'BFS took {cnt} explored nodes')
            return cur
        
        # 3. Expand node, adding children to frontier only if not explored yet
        children = cur.val.expand(isBalance)
        for child in children:
            tree.addNodeFrom(cur.getIndex(), child)
            temp = tree.getNode(-1)
            frontier.append(temp)
    return None


import heapq as hq
def ucs(tree: Tree, isBalance:bool, h=lambda x: 0):
    frontier = []
    explored = {}

    root = tree.getRoot()
    hq.heappush(frontier,  (root.val.cost + h(root.val), root) )

    cnt = 0
    while len(frontier) > 0:
        # Get next node, cur, from frontier
        cur = hq.heappop(frontier)[1] 
        if str(cur.val) in explored:
            continue
        explored[str(cur)] = True

        # Check if this is a goal state
        cnt += 1
        if cur.val.util(isBalance):
            print(f'UCS took {cnt} explored nodes')
            #print("cur: ")
            #print(cur)
            return cur
        
        # Expand, add children to frontier only if they haven't been explored yet
        children = cur.val.expand(isBalance)
        for child in children:
            tree.addNodeFrom(cur.getIndex(), child)
            childNode = tree.getNode(-1)
            hq.heappush(frontier,  (child.cost + h(childNode.val), childNode) )
    
    return None


# def astar(manifest_path:str, isBalance:bool, offload:List[str]=None, load:List[str]=None):
def astar(manifest: List[List[Container]], isBalance:bool, offload:List[str]=None, load:List[str]=None):
    """
    Parameters:
        manifest: the contents of a manifest file
        isBalance: whether or not the operation is load balancing
        offload: a list of names of containers to offload (only needed if doing tranfer operation)
        load: a list of containers (name+weight) to load (only needed if doing transfer operation)

    Returns:
        solution: a Node object where solution.val is the CargoState of the solution
        moves: a list of Move objects containing the moves taken to get from the origin
            CargoState to the solution.
    """
    # Initialize problem state and tree
    # manifest = readManifest(manifest_path)
    # manifest = manifest_path
    #print("MANIFEST FROM SEARCH.PY ASTAR CALLED, WILL BE PASSING INTO CARGOSTATE")
    #print(manifest)
    print("PRINTING OFFLOAD AND ONLOAD FROM SEARCH.PY: ")
    print(f'offload: {offload}')
    print(f'load: {load}')
    print(f'manifest: {manifest}')
    state = CargoState(manifest, offload, load)
    root = Node(None, 0, state)
    tree = Tree(root)

    # Determine which heuristic to use based on operation
    h = heuristics.balanceScore if isBalance else heuristics.transferHeuristic 

    # Time for the magic
    solution = ucs(tree, isBalance, h)
    #print("solution in astar")
    #print(solution)
    moves = backtrace(solution, tree)
    return solution, moves

def backtrace(final: Node, tree: Tree):
    moves = []

    cur = final
    while cur.pInd != None:
        moves.append(cur.val.lastMove)
        cur = tree.getNode(cur.getParentInd())

    return list(reversed(moves))