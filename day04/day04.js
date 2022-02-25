// import {rawInput} from './input.js';
// import {exampleInput} from './input.js';

function validPassword(password) {
    const number = password.toString().split('');
    let hasDouble = false;
    for (let i = 0; i < number.length - 1; i++) {
        if (!hasDouble && number[i] === number[i + 1]) {
            hasDouble = true;
        }
        if (number[i] > number[i + 1]) {
            // both parts fail if the current number is larger than next
            return [false, false];
        }
    }

    // check for an isolated pair for part two
    number.unshift('x');
    number.push('x');
    let hasIsolated = false;
    for (let i = 0; i < number.length - 3; i++) {
        if (number[i] !== number[i + 1] && number[i + 1] === number[i + 2] && number[i + 2] !== number[i + 3]) {
            hasIsolated = true;
            break;
        }
    }
    return [hasDouble, hasIsolated];
}

let currNum = 147981;
const end = 691423;
let partOneCount = 0;
let partTwoCount = 0;

// search through the given range for valid passwords
while (currNum <= end) {
    const [isPartOneValid, isPartTwoValid] = validPassword(currNum);
    if (isPartOneValid) {
        partOneCount += 1;
    }
    if (isPartTwoValid) {
        partTwoCount += 1;
    }
    currNum += 1;
}

console.log(partOneCount);
console.log(partTwoCount);
document.getElementById('partOne').appendChild(document.createTextNode(partOneCount));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwoCount));
