from flask import Flask, jsonify, request
from flask_cors import CORS
from CargoState import Container, CargoState
from Tree import Node, Tree
from search import astar, backtrace, readManifest

app = Flask(__name__)
CORS(app)

@app.route('/solve', methods=['GET'])
def solve():
    print("hi")
    return jsonify({"message": "hi"})
    #todo implement backend lol

if __name__ == '__main__':
    app.run(debug=True)
