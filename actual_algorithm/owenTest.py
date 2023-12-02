from CargoState import *
# from misc import *
from misc_tree import *
from Tree import *

# Init. transfer list (NOTE: currently running tests for load balancing, so transfer list empty) 
offload = []
load = []

# Run code
for i in range(1, 6):
    print(f'MANIFEST {i}')
    manifest = readManifest('manifests/ShipCase' + str(i) + '.txt')
    printManifest(manifest)

    state = CargoState(manifest, offload, load)
    root = Node(None, 0, state)
    tree = Tree(root)

    # Do BFS
    solution = bfs(tree)
    print(f'BFS route with cost {solution.val.cost}:')
    for move in backtrace(solution, tree):
        print(f'\t{move}')
    print('\n')
    print(solution.val)
    print('\n\n')

    # solution = bfs(state)
    # print(f'BFS route with cost {solution.cost}:')
    # for move in backtrace(solution):
    #     print(f'\t{move}')
    # print('\n')
    # print(solution)
    # print('\n\n')


    # Do UCS
    root = Node(None, 0, state)
    tree = Tree(root)

    solution = ucs(tree)
    print(f'UCS route with cost {solution.val.cost}:')
    for move in backtrace(solution, tree):
        print(f'\t{move}')
    print('\n')
    print(solution.val)
    print('\n\n')
    
    # solution = ucs(state)
    # print(f'BFS route with cost {solution.cost}:')
    # for move in backtrace(solution):
    #     print(f'\t{move}')
    # print('\n')
    # print(solution)
    # print('\n\n')