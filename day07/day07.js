import { rawInput } from './input.js';
// import { exampleInput as rawInput } from './input.js';
import InterCode from './InterCode.js';

const program = rawInput.split(',').map(Number);

// heap's algorithm to get all permutations
function getPermutations(array) {
    const result = [];

    function swapInPlace(arrayToSwap, index1, index2) {
        [arrayToSwap[index1], arrayToSwap[index2]] = [arrayToSwap[index2], arrayToSwap[index1]];
    }

    function generate(n, heapArray) {
        if (n === 1) {
            result.push([...heapArray]);
            return;
        }

        generate(n - 1, heapArray);
        for (let i = 0; i < n - 1; i++) {
            if (n % 2 === 0) {
                swapInPlace(heapArray, i, n - 1);
            } else {
                swapInPlace(heapArray, 0, n - 1);
            }

            generate(n - 1, heapArray);
        }
    }

    generate(array.length, [...array]);

    return result;
}

// runs through each amplifier's program
// inputting the output into the next until the last one has finished
function runAmplifiers(phaseSettings) {
    const amplifiers = [
        new InterCode('A', program, phaseSettings[0]),
        new InterCode('B', program, phaseSettings[1]),
        new InterCode('C', program, phaseSettings[2]),
        new InterCode('D', program, phaseSettings[3]),
        new InterCode('E', program, phaseSettings[4]),
    ];

    // first input is 0
    amplifiers[0].processInput(0);
    amplifiers[0].run();

    let index = 1;
    let result = amplifiers[0].output;
    while (!amplifiers[4].exited) {
        // input the output from previous amplifier and run it
        amplifiers[index].processInput(result);
        amplifiers[index].run();
        result = amplifiers[index].output;
        // check for looping back to the first amplifier
        index = index === 4 ? 0 : index + 1;
    }
    return result;
}

const partOnePermutations = getPermutations([0, 1, 2, 3, 4]);
const partOne = partOnePermutations.reduce((max, phaseSettings) => Math.max(max, runAmplifiers(phaseSettings)), 0);

const partTwoPermutations = getPermutations([5, 6, 7, 8, 9]);
const partTwo = partTwoPermutations.reduce((max, phaseSettings) => Math.max(max, runAmplifiers(phaseSettings)), 0);

console.log(partOne);
console.log(partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
