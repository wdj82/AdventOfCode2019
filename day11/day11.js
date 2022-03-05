import { rawInput } from './input.js';
// import {exampleInput as rawInput} from './input.js';
import IntCode from './IntCode.js';

const program = rawInput.split(',').map(Number);

function printCode(pixels) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    const size = 6;

    pixels.forEach((line, yIndex) => {
        line.forEach((pixel, xIndex) => {
            if (pixel === '#') {
                ctx.fillRect(xIndex * size, yIndex * size, size, size);
            }
        });
    });
}

function paintHull(startingInput) {
    const hull = new Map();
    const currPos = [0, 0];
    let direction = 0;
    const DIRECTIONS = { 0: [1, 0], 1: [0, 1], 2: [-1, 0], 3: [0, -1] };

    const robot = new IntCode('Robot', program, startingInput);

    let output = robot.run();
    while (output !== 99) {
        const [paint, newDir] = output;
        hull.set(currPos.toString(), paint);

        if (newDir === 0) {
            direction = direction === 0 ? 3 : direction - 1;
        } else {
            direction = direction === 3 ? 0 : direction + 1;
        }
        currPos[0] += DIRECTIONS[direction][0];
        currPos[1] += DIRECTIONS[direction][1];
        robot.processInput(hull.get(currPos.toString()) ?? 0);
        output = robot.run();
    }
    return hull;
}

const partOne = paintHull(0);
const partTwo = paintHull(1);

const grid = [];
for (let i = 0; i < 6; i++) {
    grid.push(new Array(40));
    for (let j = 0; j < 40; j++) {
        grid[i][j] = ' ';
    }
}

partTwo.forEach((paint, coords) => {
    if (paint) {
        const [x, y] = coords.split(',').map(Number);
        grid[Math.abs(x)][y] = '#';
    }
});

console.log(partOne.size);
console.log(grid);
document.getElementById('partOne').appendChild(document.createTextNode(partOne.size));
printCode(grid);
