import { rawInput } from './input.js';

const inputSignal = rawInput.split('').map(Number);

function createPatterns(length) {
    const basePattern = [0, 1, 0, -1];
    const patterns = [];

    for (let index = 1; index <= length; index++) {
        const result = [];
        let baseIndex = 0;
        for (let i = 0; i <= length; i++) {
            if (baseIndex === basePattern.length) {
                // loop back in the base pattern
                baseIndex = 0;
            }
            for (let j = 0; j < index; j++) {
                result.push(basePattern[baseIndex]);
            }
            if (result.length > length) {
                break;
            }
            baseIndex += 1;
        }
        // remove the first value
        result.shift();
        patterns.push(result.slice(0, length));
    }
    return patterns;
}

function phaseInput(input) {
    let oldSignal = [...input];
    // the same patterns are used for every phase
    const patterns = createPatterns(input.length);

    for (let phases = 0; phases < 100; phases++) {
        const nextSignal = [];
        for (let i = 0; i < input.length; i++) {
            const result = oldSignal.reduce((acc, curr, index) => acc + curr * patterns[i][index], 0);
            const digit = Math.abs(result) % 10;
            nextSignal.push(digit);
        }
        oldSignal = [...nextSignal];
    }
    return oldSignal.slice(0, 8).join('');
}

// part two
function processSignal(input) {
    const bigSignal = [];
    for (let i = 0; i < 10000; i++) {
        for (let j = 0; j < input.length; j++) {
            bigSignal.push(input[j]);
        }
    }

    const offset = Number(input.slice(0, 7).join(''));
    const skipped = bigSignal.slice(offset);

    // since so many of the digits will be skipped the pattern is almost all zeros
    // meaning the current digit is the sum of all next digits - with the last the sum of itself

    // still do 100 phases
    for (let phases = 0; phases < 100; phases++) {
        let sum = 0;
        // looping backward for the running total for each digit
        for (let j = skipped.length - 1; j >= 0; j--) {
            sum += skipped[j];
            skipped[j] = sum % 10;
        }
    }

    return skipped.slice(0, 8).join('');
}

const partOne = phaseInput(inputSignal);
console.log(partOne);
const partTwo = processSignal(inputSignal);
console.log(partTwo);

document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
