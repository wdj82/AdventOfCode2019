import { rawInput } from './input.js';
// import { exampleInput as rawInput } from './input.js';

const imageData = rawInput.split('').map(Number);

function confirmImage(image, width = 25, height = 6) {
    const data = [...image];
    let savedPixelCount = [Infinity, Infinity, Infinity];
    while (data.length) {
        const layer = data.splice(0, width * height);
        // count each layer's 0, 1, 2 pixels
        const layerPixelCount = layer.reduce(
            (acc, pixel) => {
                acc[pixel] += 1;
                return acc;
            },
            [0, 0, 0],
        );
        // save layer with fewest zeroes
        if (layerPixelCount[0] < savedPixelCount[0]) {
            savedPixelCount = layerPixelCount;
        }
    }

    return savedPixelCount[1] * savedPixelCount[2];
}

function decodeImage(image, width = 25, height = 6) {
    const data = [...image];
    const topLayer = data.splice(0, width * height);

    // loop until no more transparent pixels
    while (topLayer.includes(2)) {
        const nextLayer = data.splice(0, width * height);
        // replace every transparent pixel of the top layer with next layer's pixel
        for (let i = 0; i < topLayer.length; i++) {
            if (topLayer[i] === 2) {
                topLayer[i] = nextLayer[i];
            }
        }
    }

    // convert top layer for drawing to html canvas
    const answer = [];
    let line = [];
    topLayer.forEach((pixel) => {
        const char = pixel === 0 ? ' ' : 'X';
        line.push(char);
        if (line.length === width) {
            answer.push(line);
            line = [];
        }
    });
    return answer;
}

// draw the answer in the html canvas
function printCode(pixels) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    const size = 6;

    pixels.forEach((line, yIndex) => {
        line.forEach((pixel, xIndex) => {
            if (pixel === 'X') {
                ctx.fillRect(xIndex * size, yIndex * size, size, size);
            }
        });
    });
}
const partOne = confirmImage(imageData);
console.log(partOne);

const partTwo = decodeImage(imageData);
console.log(partTwo);
printCode(partTwo);

document.getElementById('partOne').appendChild(document.createTextNode(partOne));
