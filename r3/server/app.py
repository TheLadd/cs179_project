from flask import Flask, jsonify, request
from flask_cors import CORS
from CargoState import CargoState, Move
import search

app = Flask(__name__)
CORS(app)

current_cargo_state = None

@app.route('/create-cargo-state', methods=['POST'])
def create_cargo_state():
    data = request.get_json()

    # Create CargoState
    manifest=data.get('manifest', []),
    offload=data.get('offload', []),
    load=data.get('load'),
    cost=data.get('cost', 0)
    last_move=None


    # Set the current_cargo_state after receiving data from frontend    
    global current_cargo_state
    current_cargo_state = CargoState(manifest, offload, load, cost, last_move)

    return jsonify({"message": "CargoState created successfully"})

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

@app.route('/solve', methods=['GET'])
def solve():
    #print("hi")
    return jsonify({"message": "hi"})
    #todo implement backend lol

if __name__ == '__main__':
    app.run(debug=True)
