from flask import Flask, jsonify, request
from flask_cors import CORS
from CargoState import CargoState, Move, Container
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

current_cargo_state = None

@app.route('/create-cargo-state', methods=['POST'])
def create_cargo_state():
    data = request.get_json()

    # Create CargoState
    manifest=data.get('manifest', [])
    #print("MANIFEST WE START OUT WITH AFTER CALLING CREATE CARGO STATE ROUTE")
    #print(manifest)
    manifest_8x12 = convert_manifest_to_8x12(manifest)
    #print("MANIFEST WE PASS INTO CARGOSTATE")
    #print(manifest_8x12)
    offload=data.get('offload', [])
    load=data.get('load', [])
    cost=data.get('cost', 0)
    last_move=None


    #print("manifest in create cargo state edited: ", man)
    # Set the current_cargo_state after receiving data from frontend    
    global current_cargo_state
    current_cargo_state = CargoState(manifest_8x12, offload, load, cost, last_move)
    #print("ABOUT TO PRINT CURRENT CARGO STATE: ")

    #print(current_cargo_state.toManifestFixed())

    return jsonify({"message": "CargoState created successfully"})

def convert_manifest_to_8x12(manifest_data: List[List[str]]) -> List[List[Container]]:
    #print("GOING THROUGH CONVERT_MANIFEST")
    
    #for line in manifest_data.splitlines():
        #print("PRINT EACH INDIVDUAL LINE IN MANIFEST TEST: ")
        #print(line)
    containers = [Container(line) for line in manifest_data.splitlines()]
    #print("CONTAINERS PRINTED: ")
    #print(containers)
    manifest_8x12 = [containers[i:i+12] for i in range(0, len(containers), 12)]

    #print("TRANSFORMED MANIFEST: ")
    #print(manifest_8x12)
    #for row in manifest_8x12:
     #   print(row)
    return manifest_8x12

@app.route('/run-astar', methods=['POST'])
def run_astar():
    # 1. Extract data from request
    data = request.json
    manifest = data.get("manifest")
    manifest_8x12 = convert_manifest_to_8x12(manifest)
    is_balance = data.get("isBalance")
    offload = data.get("offload", [])   # This is in format of [name1, weight1, name2, weight2, ..., nameN, weightN]
    load = data.get("load", [])

    # 1.2 Reformat from list of strings to list of Containers
    loadReformat: List[Container] = []
    print(f'load before formatting: {load}')
    for i in range(0, len(offload), 2):
        loadReformat.append( Container(info=(load[i], load[i+1])) )
    load = loadReformat

    print(f'Offload before astar: {offload}')

    # 2. Run astar
    solution, moves = search.astar(manifest_8x12, is_balance, offload=offload, load=load)

    # 2.2 Reformat moves from list of Move objects to list of Move-like dictionaries
    movesReformat: List[Dict[str, List[int]|int]] = []
    print(f'moves before formatting: {moves}')
    for move in moves:
        temp = {
            'current-grid-position': [move.src.row+1, move.src.col+1],
            'current-area': move.src.area,
            'next-position': [move.dst.row+1, move.dst.col+1],
            'next-area': move.dst.area,
            'cost': move.cost()
        }
        movesReformat.append(temp)
    moves = movesReformat
    print("MOVES PRINTED: ")
    print(moves)

    # 3. return moves to frontend
    return jsonify({"solution": solution.val.toDict(), "moves": moves})

@app.route('/runMove', methods=['POST'])
def run_move():
    data = request.get_json()

    move_data = data.get('move')
    move = Move(**move_data)

    global current_cargo_state
    current_cargo_state = current_cargo_state.move(move)

    return jsonify({"message": "Move executed successfully"})

@app.route('/getManifest', methods=['GET'])
def get_manifest():
    global current_cargo_state
    # Check if current_cargo_state is not None
    if current_cargo_state:
        # Return the current_cargo_state as JSON
        return jsonify(current_cargo_state.toManifest())
    else:
        return jsonify({"error": "CargoState not initialized."}), 404

@app.route('/get-current-cargo-state', methods=['GET'])
def get_current_cargo_state():
    global current_cargo_state

    # Check if current_cargo_state is not None
    if current_cargo_state:
        # Return the current_cargo_state as JSON
        return jsonify(current_cargo_state.toManifest())
    else:
        return jsonify({"error": "CargoState not initialized."}), 404

@app.route('/solve', methods=['GET'])
def solve():
    #print("hi")
    return jsonify({"message": "hi"})
    #todo implement backend lol

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
        return jsonify(cargo_state_dict)
    else:
        return jsonify({"error": "CargoState not initialized."}), 404

if __name__ == '__main__':
    app.run(debug=True)
