import { rawInput } from './input.js';
import IntCode from './IntCode.js';

const program = rawInput.split(',').map(Number);

// using the wall follower algorithm to build the maze
function createMaze() {
    const NORTH = 1;
    const SOUTH = 2;
    const WEST = 3;
    const EAST = 4;

    const CLOCKWISE = [0, EAST, WEST, NORTH, SOUTH];
    const COUNTER_CLOCKWISE = [0, WEST, EAST, SOUTH, NORTH];

    const MOVE = {
        1: [-1, 0],
        2: [1, 0],
        3: [0, -1],
        4: [0, 1],
    };
    const maze = new Set();

    const robot = new IntCode('robot', program);
    robot.run();

    let curPosition = [0, 0];
    let curDirection = NORTH;
    let oxygenPosition = null;
    let isMazeComplete = false;

    while (!isMazeComplete) {
        // try and turn right
        const newDirection = CLOCKWISE[curDirection];
        let [dx, dy] = MOVE[newDirection];
        let newPosition = [curPosition[0] + dx, curPosition[1] + dy];

        robot.processInput(newDirection);
        let output = robot.run();
        if (output === 0) {
            // Hit wall - try straight instead
            [dx, dy] = MOVE[curDirection];
            newPosition = [curPosition[0] + dx, curPosition[1] + dy];
            robot.processInput(curDirection);
            output = robot.run();

            if (output === 0) {
                // another wall - turning around';
                curDirection = COUNTER_CLOCKWISE[curDirection];
            } else {
                // 'valid position in maze';
                maze.add(newPosition.toString());
                if (output === 2) {
                    oxygenPosition = newPosition.toString();
                }
                curPosition = newPosition;
            }
        } else {
            // valid position in maze'
            if (output === 2) {
                oxygenPosition = newPosition.toString();
            }
            maze.add(newPosition.toString());
            curPosition = newPosition;
            curDirection = newDirection;
        }

        if (curPosition[0] === 0 && curPosition[1] === 0 && curDirection === 1) {
            isMazeComplete = true;
        }
    }
    return [maze, oxygenPosition];
}

function getNeighbors(node, maze) {
    const [x, y] = node.split(',').map(Number);
    const neighbors = [[x + 1, y].toString(), [x - 1, y].toString(), [x, y + 1].toString(), [x, y - 1].toString()];
    return neighbors.filter((position) => maze.has(position));
}

function bfs(maze, src, dest = null) {
    let distance = 0;
    const queue = [[src, distance]];
    const visited = new Set();
    let currentNode = null;

    while (queue.length) {
        [currentNode, distance] = queue.shift();

        // part two has no destination
        if (currentNode === dest) {
            return distance;
        }

        if (!visited.has(currentNode)) {
            visited.add(currentNode);

            getNeighbors(currentNode, maze).forEach((neighbor) => {
                if (!visited.has(neighbor)) {
                    queue.push([neighbor, distance + 1]);
                }
            });
        }
    }
    return distance;
}

const [maze, oxygenPosition] = createMaze();

const shortest = bfs(maze, [0, 0].toString(), oxygenPosition);
console.log(shortest);

const farthest = bfs(maze, oxygenPosition);
console.log(farthest);

document.getElementById('partOne').appendChild(document.createTextNode(shortest));
document.getElementById('partTwo').appendChild(document.createTextNode(farthest));
