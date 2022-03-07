import { rawInput } from './input.js';
import IntCode from './IntCode.js';

const program = rawInput.split(',').map(Number);

// draw the current game to the HTML canvas
function paintGame(pixels) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1000, 1000);
    ctx.fillStyle = 'red';
    const size = 20;

    pixels.forEach((line, yIndex) => {
        line.forEach((pixel, xIndex) => {
            if (pixel === 'X') {
                ctx.fillStyle = 'red';
                ctx.fillRect(xIndex * size, yIndex * size, size, size);
            } else if (pixel === '_') {
                ctx.fillStyle = 'purple';
                ctx.fillRect(xIndex * size, yIndex * size, size, size);
            } else if (pixel === '|') {
                ctx.fillStyle = 'green';
                ctx.fillRect(xIndex * size, yIndex * size, size, size);
            } else if (pixel === 'O') {
                ctx.beginPath();
                ctx.arc(xIndex * size + xIndex / 2, yIndex * size + yIndex / 2, size / 2, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'yellow';
                ctx.fill();
            }
        });
    });
}

function countBlockTiles() {
    const game = new IntCode('game', program);
    const output = game.run();
    let count = 0;
    for (let i = 2; i < output.length; i += 3) {
        if (output[i] === 2) {
            count += 1;
        }
    }
    return count;
}
const partOne = countBlockTiles();

const freeGameProgram = [...program];
freeGameProgram[0] = 2;

const grid = new Array(26);
for (let i = 0; i < 26; i++) {
    grid[i] = new Array(46);
    for (let j = 0; j < 46; j++) {
        grid[i][j] = ' ';
    }
}
const game = new IntCode('freeGame', freeGameProgram);
let aiPlay = false;

async function playGame() {
    let ballX = 0;
    let paddleX = 0;
    let score = 0;
    const output = game.run();
    if (!output) {
        console.log('quitting');
        return;
    }
    // console.log(output);
    for (let i = 0; i < output.length; i += 3) {
        const x = output[i];
        const y = output[i + 1];
        const tileID = output[i + 2];

        if (tileID === 0) {
            grid[y][x] = ' ';
        }
        if (tileID === 1) {
            grid[y][x] = '|';
        } else if (tileID === 2) {
            grid[y][x] = 'X';
        } else if (tileID === 3) {
            grid[y][x] = '_';
            paddleX = x;
        } else if (tileID === 4) {
            grid[y][x] = 'O';
            if (x > paddleX) {
                ballX = 1;
            } else if (x < paddleX) {
                ballX = -1;
            }
        }
        if (x === -1 && y === 0) {
            score = Number(tileID);
            document.getElementById('partTwo').innerHTML = score;
        }
    }
    paintGame(grid);
    if (aiPlay) {
        await new Promise((r) => {
            setTimeout(r, 10);
        });
        game.processInput(ballX);
        playGame();
    }
}

function handleInput(event) {
    if (typeof event === 'number') {
        game.processInput(event);
    } else {
        game.processInput(Number(event.target.id));
    }
    playGame();
}

playGame();

console.log(partOne);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));

document.getElementById('-1').addEventListener('click', handleInput);
document.getElementById('1').addEventListener('click', handleInput);
document.getElementById('0').addEventListener('click', handleInput);
document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') {
        handleInput(-1);
    } else if (e.code === 'ArrowRight') {
        handleInput(1);
    } else if (e.code === 'ArrowDown') {
        handleInput(0);
    }
});
document.getElementById('AI').addEventListener('click', () => {
    if (aiPlay) {
        aiPlay = false;
        document.getElementById('AI').innerText = 'AI Play: OFF';
    } else {
        aiPlay = true;
        document.getElementById('AI').innerText = 'AI Play: ON';
        handleInput(0);
    }
});
