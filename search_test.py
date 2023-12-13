from CargoState import *
from Tree import *
from search import *
import hueristics
import time

# 1. Get test case to work with
testCase = input('Enter the test case you want to test: ')
file = 'manifests/ShipCase' + testCase + '.txt'

# 2. Determine operation
op = input('Which operation do you want to perform on this case? Enter 0 for load balancing or 1 for load/offload: ')
isBalance = False if op == '1' else True

# 2.2 If load/offload, get transfer lists
load = []
offload = []
if not isBalance:
    print('Input the containers you want to load (case sensitive); enter name, then enter weight; enter exit to quit:')
    while True:
        name = input()
        if name == 'exit':
            break
        weight = input()
        load.append(Container(info=(name, weight)))


    print('Input the containers you want to offload (case sensitive); enter name, then enter weight; enter exit to quit:')
    while True:
        name = input()
        if name == 'exit':
            break
        offload.append(name)

# 3.
print(f'Performing operation {op} on test case {testCase}...')

manifest = readManifest(file)
state = CargoState(manifest, offload, load)

print('Original Manifest:')
printManifest(manifest)
print('\n\n')

if isBalance:
    if not state.isBalanceable():
        print('CargoState is not able to be balanced. Implement SIFT.')
        exit()


# def astar(manifest_path:str, isBalance:bool, offload:List[str]=None, load:List[str]=None):
#     """
#     manifest: the contents of a manifest file
#     isBalance: whether or not the operation is load balancing
#     offload: a list of names of containers to offload (only needed if doing tranfer operation)
#     load: a list of containers (name+weight) to load (only needed if doing transfer operation)
#     """
#     # Initialize problem state and tree
#     manifest = readManifest(manifest_path)
#     state = CargoState(manifest, offload, load)
#     root = Node(None, 0, state)
#     tree = Tree(root)

#     # Determine which hueristic to use based on operation
#     h = hueristics.balanceScore if isBalance else hueristics.transferHueristic 

#     # Time for the magic
#     solution = ucs(tree, isBalance, h)
#     moves = backtrace(solution, tree)
#     return solution, moves

solution, moves = astar(file, isBalance, offload=offload, load=load)
for move in moves:
    print(move)
print('\n')
print(solution)
