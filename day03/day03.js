import input from './input.js';

const inputArray = input.split('\n');
const firstWire = inputArray[0].split(',');
const secondWire = inputArray[1].split(',');

const xMoves = { U: 0, D: 0, R: 1, L: -1 };
const yMoves = { U: 1, D: -1, R: 0, L: 0 };

// returns a set of all coordinates and the number of steps it took to get there
function getVisited(wires) {
    // keep track of all points the wire goes through
    const visited = new Set();
    let point = [0, 0];

    // save steps for part two
    let step = 0;
    const steps = {};

    wires.forEach((move) => {
        const dir = move[0];
        const numSteps = Number(move.slice(1));

        for (let i = 0; i < numSteps; i++) {
            point = [point[0] + xMoves[dir], point[1] + yMoves[dir]];
            step += 1;
            const stringPoint = `${point[0]},${point[1]}`;
            visited.add(stringPoint);
            // only use the first step count for this point
            if (!steps[stringPoint]) {
                steps[stringPoint] = step;
            }
        }
    });
    return [visited, steps];
}

function manhattanDist(point) {
    const [x, y] = point.split(',').map(Number);
    return Math.abs(x) + Math.abs(y);
}

const [firstSet, firstSteps] = getVisited(firstWire);
const [secondSet, secondSteps] = getVisited(secondWire);

const intersections = [...firstSet].filter((x) => secondSet.has(x));

const partOne = Math.min(...intersections.map(manhattanDist));
const partTwo = Math.min(...intersections.map((point) => firstSteps[point] + secondSteps[point]));

console.log(partOne);
console.log(partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
