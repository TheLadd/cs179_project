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
print(isBalance)
print(op)
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


# DO BFS
# root = Node(None, 0, state)
# tree = Tree(root)

# bfs_begin = time.time()
# bfs_solution = bfs(tree, isBalance)
# bfs_end = time.time()

# print(f'BFS took {bfs_end-bfs_begin} to find solution of cost {bfs_solution.val.cost} found:')
# for move in backtrace(bfs_solution, tree):
#     print(f'\t{move}')
# print("")
# print(bfs_solution.val)
# print('\n\n')


# DO UCS
root = Node(None, 0, state)
tree = Tree(root)

ucs_begin = time.time()
ucs_solution = ucs(tree, isBalance)
ucs_end = time.time()

print(f'UCS took {ucs_end-ucs_begin} to find solution of cost {ucs_solution.val.cost} found:')
for move in backtrace(ucs_solution, tree):
    print(f'\t{move}')
print("")
print(ucs_solution.val)
print('\n\n')


# DO A*
root = Node(None, 0, state)
tree = Tree(root)
h = hueristics.balanceScore if isBalance else hueristics.transferHueristic 

ucs_begin = time.time()
ucs_solution = ucs(tree, isBalance, h)
ucs_end = time.time()

print(f'A* took {ucs_end-ucs_begin} to find solution of cost {ucs_solution.val.cost} found:')
for move in backtrace(ucs_solution, tree):
    print(f'\t{move}')
print("")
print(ucs_solution.val)
print('\n\n')