import PriorityQueue from './priorityQueue.js';
import { rawInput } from './input.js';
// import { exampleInput2 as rawInput } from './input.js';

const input = rawInput.split('\n').map((line) => line.split(')'));

class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }

    addEdge(vertex1, vertex2) {
        this.adjacencyList[vertex1].push(vertex2);
        this.adjacencyList[vertex2].push(vertex1);
    }

    shortestOrbit(start, end) {
        const distances = {};
        const nodes = new PriorityQueue();

        Object.keys(this.adjacencyList).forEach((vertex) => {
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(vertex, 0);
            } else {
                distances[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }
        });

        while (!nodes.isEmpty()) {
            const currentVertex = nodes.dequeue().value;
            if (currentVertex === end) {
                return distances[end] - 2; // don't count the YOU and SAN nodes
            }

            if (currentVertex || distances[currentVertex] !== Infinity) {
                this.adjacencyList[currentVertex].forEach((neighbor) => {
                    const possibleNewMinDistance = distances[currentVertex] + 1;
                    if (possibleNewMinDistance < distances[neighbor]) {
                        distances[neighbor] = possibleNewMinDistance;
                        nodes.enqueue(neighbor, possibleNewMinDistance);
                    }
                });
            }
        }
        return Infinity;
    }
}

const tree = new Map();
const graph = new Graph();

input.forEach(([parent, child]) => {
    tree.set(child, parent);
    graph.addVertex(parent);
    graph.addVertex(child);
    graph.addEdge(parent, child);
});

let partOne = 0;
tree.forEach((_, planet) => {
    while (tree.has(planet)) {
        partOne += 1;
        planet = tree.get(planet);
    }
});

console.log(partOne);

const partTwo = graph.shortestOrbit('YOU', 'SAN');

console.log(partTwo);

document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
