from flask import Flask, jsonify, request
from CargoState import Container, CargoState
from Tree import Node, Tree
from search import astar, backtrace, readManifest

app = Flask(__name__)

@app.route('/solve', methods=['POST'])
def solve():
    print("hi")
    #todo implement backend lol

if __name__ == '__main__':
    app.run(debug=True)
