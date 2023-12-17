from flask import Flask, jsonify, request
from flask_cors import CORS
from CargoState import CargoState, Move, Container
import logging
import search
from typing import List

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
    #print("data in create cargo state: ", data)
    # Create CargoState
    manifest=data.get('manifest', []),
    manifest_8x12 = convert_manifest_to_8x12(manifest),
    print("manifest in create cargo state: ", manifest)
    offload=data.get('offload', []),
    load=data.get('load', []),
    cost=data.get('cost', 0)
    last_move=None


    #print("manifest in create cargo state edited: ", man)
    # Set the current_cargo_state after receiving data from frontend    
    global current_cargo_state
    current_cargo_state = CargoState(manifest_8x12, offload, load, cost, last_move)
    #print("ABOUT TO PRINT CURRENT CARGO STATE: ")

    #print(current_cargo_state.toManifestFixed())

    return jsonify({"message": "CargoState created successfully"})

def convert_manifest_to_8x12(manifest_data: List[str]) -> List[List[Container]]:
    # Implement your logic to convert manifest_data to 8x12 List[List[Container]]
    # For example, split the manifest_data and create Container objects accordingly
    # Make sure the resulting structure is an 8x12 grid

    # Sample logic (modify as needed)
    containers = [Container(line) for line in manifest_data]
    manifest_8x12 = [containers[i:i+12] for i in range(0, len(containers), 12)]

    print(manifest_8x12)
    return manifest_8x12

@app.route('/run-astar', methods=['POST'])
def run_astar():
    data = request.json
    # Extract data from request
    manifest = data.get("manifest")
    is_balance = data.get("isBalance")
    offload = data.get("offload", [])
    load = data.get("load", [])
    
    # Call search.astar
    solution, moves = search.astar(manifest, is_balance, offload, load)
    
    # return moves to frontend
    return jsonify({"solution": solution, "moves": moves})

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
    return jsonify({"manifest": current_cargo_state.toManifest()})

@app.route('/get-current-cargo-state', methods=['GET'])
def get_current_cargo_state():
    global current_cargo_state

    # Check if current_cargo_state is not None
    if current_cargo_state:
        # Return the current_cargo_state as JSON
        return jsonify(current_cargo_state.toManifestFixed())
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

if __name__ == '__main__':
    app.run(debug=True)
