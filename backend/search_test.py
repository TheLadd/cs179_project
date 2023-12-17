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



solution, moves = astar(file, isBalance, offload=offload, load=load)
for move in moves:
    print(move)
print('\n')
print(solution)





# Testing CargoState.toBuffer()
# solution.val.buf[0][0] = Container(info=('owen test!', 99999))
# solution.val.buf[0][4] = Container(info=('owen test 2?', 777))
# for bufItem in solution.val.toBuffer():
#     print(bufItem)
