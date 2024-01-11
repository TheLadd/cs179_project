from flask import Flask, jsonify, request
from flask_cors import CORS
from CargoState import CargoState, Move, Container, Position
import logging
import search
from typing import List, Dict

app = Flask(__name__)
CORS(app)
CORS(app, origins="*")

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

log_format = '%(asctime)s %(message)s'
date_format = '%B %dth %Y: %H:%M'
formatter = logging.Formatter(log_format, datefmt=date_format)

logging.basicConfig(filename='server/log.txt', level=logging.INFO, format=log_format, datefmt=date_format)

current_cargo_state = None  # stores the states for the ship and buffer
steps = []
currStep = 0

@app.route('/create-cargo-state', methods=['POST'])
def create_cargo_state():
    global current_cargo_state

    data = request.get_json()

    # Create CargoState
    manifest=data.get('manifest', [])
    manifest_8x12 = convert_manifest_to_8x12(manifest)
    offload=data.get('offload', [])
    load=data.get('load', [])

    # Set the current_cargo_state after receiving data from frontend    
    current_cargo_state = CargoState(manifest_8x12, offload, load)

    # Return the cargo state to frontend, the cargo state being the ship and buffer manifests in dict/json/array form
    return jsonify(current_cargo_state.toDict())

def convert_manifest_to_8x12(manifest_data: List[List[str]]) -> List[List[Container]]:
    containers = [Container(line) for line in manifest_data.splitlines()]
    manifest_8x12 = [containers[i:i+12] for i in range(0, len(containers), 12)]

    return manifest_8x12

@app.route('/run-astar', methods=['POST'])
def run_astar():
    global current_cargo_state
    global steps
    global currStep

    currStep = 0

    # 1. Extract data from request
    data = request.json
    is_balance = data.get("isBalance")
    load = data.get("load", []) # This is in format of [name1, weight1, name2, weight2, ..., nameN, weightN]
    current_cargo_state.offload = data.get("offload", [])  

    # 1.2 Reformat from list of strings to list of Containers
    loadReformat: List[Container] = []
    print(f'load before formatting: {load}')
    for i in range(0, len(load), 2):
        loadReformat.append( Container(info=(load[i], load[i+1])) )
    current_cargo_state.load = loadReformat

    print(f'Offload before astar: {current_cargo_state.offload}')

    # 2. Run astar
    solution, steps = search.astar(current_cargo_state, is_balance)

    # 2.2 Reformat moves from list of Move objects to list of Move-like dictionaries
    movesReformat: List[Dict[str, List[int]|int]] = []
    print(f'moves before formatting: {steps}')
    for move in steps:
        temp = {
            'name': move.src.container.name, 
            'current-grid-position': [move.src.row+1, move.src.col+1],
            'current-area': move.src.area,
            'next-grid-position': [move.dst.row+1, move.dst.col+1],
            'next-area': move.dst.area,
            'cost': move.cost(), 
            'weight': move.src.container.weight,
            'description': str(move), 
        }
        movesReformat.append(temp)
    steps = movesReformat
    print("MOVES PRINTED after reformat: ")
    print(steps)

    # 3. return the goal state, moves, and the step you are currently on to frontend (will always be 0 since you are just running the algorithm)
    return jsonify({"solution": solution.val.toDict(), "moves": steps, "currStep": currStep })

@app.route('/run-move', methods=['POST'])
def run_move():
    global current_cargo_state
    global steps
    global currStep
    global offload
    global load

    # only make the move if we have moves left
    if (currStep < len(steps)):
        # get the current move
        move_data = steps[currStep]

        # convert the move from the dict form it was stored in to an actual Move object that can be passed into a CargoState object

        # Init src
        src_pos = move_data['current-grid-position']
        src_con = Container(info=(move_data['name'], move_data['weight'])) 
        #src_con = Container(info=(move_data['name'])) 
        src = Position(move_data['current-area'], src_pos[0]-1, src_pos[1]-1, container=src_con)    

        # Init dst
        dst_pos = move_data['next-grid-position']
        dst = Position(move_data['next-area'], dst_pos[0]-1, dst_pos[1]-1)

        move = Move(src, dst)

        # make move
        current_cargo_state = current_cargo_state.move(move)

        # Check if the move is for a container in the offload or load list then update the corresponding list if so
        if move_data['next-area'] == 2: # the destination for the container is a truck
            print("APP.PY: popped from offload")
            current_cargo_state.offload.remove(src_con.name) # pop the container from the offload list with the same name as the container in the move
        elif move_data['current-area'] == 2: # the source for the container is a truck
            print("APP.PY: popped from load")
            current_cargo_state.load.remove(src_con) # pop the container from the load list with the same name as the container in the move

    # todo: make it so that it logs a message here should be incredibly simple

    # we are on the next move now
    currStep += 1

    dict = current_cargo_state.toDict()
    dict['currStep'] = currStep
    dict['offload'] = str(current_cargo_state.offload)
    dict['load'] = str(current_cargo_state.load)

    # return the current cargo state, the step # you are currently on, and the updated offload/load lists
    return jsonify(dict)

@app.route('/log', methods=['POST'])
def log():
    data = request.get_json()
    if data and 'message' in data:
        app.logger.info(data['message'])
        return jsonify({"result": "Message logged successfully"})
    else:
        return jsonify({"error": "Invalid request. 'message' parameter is missing."}), 400
    
@app.route('/get-cargo-state-dict', methods=['GET'])
def get_cargo_state_dict():
    global current_cargo_state

    # Check if current_cargo_state is not None
    if current_cargo_state:
        # Return the current_cargo_state as a dictionary
        cargo_state_dict = current_cargo_state.toDict()
        #print("APP.PY: \n", cargo_state_dict)
        return jsonify(cargo_state_dict)
    else:
        return jsonify({"error": "CargoState not initialized."}), 404

if __name__ == '__main__':
    app.run(debug=True)
