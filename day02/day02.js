import input from './input.js';

// const input = `1,9,10,3,2,3,11,0,99,30,40,50`;

const inputArray = input.split(',').map(Number);

function processInput(program, noun, verb) {
    program[1] = noun;
    program[2] = verb;

    for (let i = 0; i < program.length; i += 4) {
        const opcode = program[i];

        if (opcode === 99) {
            return program[0];
        }
        const a = program[program[i + 1]];
        const b = program[program[i + 2]];

        if (opcode === 1) {
            program[program[i + 3]] = a + b;
        } else if (opcode === 2) {
            program[program[i + 3]] = a * b;
        } else {
            throw new Error('unknown opcode');
        }
    }
    throw new Error('error no 99 opcode');
}

function findNounVerb(program) {
    for (let noun = 0; noun < 100; noun++) {
        for (let verb = 0; verb < 100; verb++) {
            const result = processInput([...program], noun, verb);
            if (result === 19690720) {
                return 100 * noun + verb;
            }
        }
    }
    throw new Error('problem finding part two solution');
}

const partOne = processInput([...inputArray], 12, 2);
const partTwo = findNounVerb(inputArray);

console.log(partOne);
console.log(partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
