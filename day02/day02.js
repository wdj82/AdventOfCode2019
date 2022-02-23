import input from './input.js';

const input2 = `1,9,10,3,2,3,11,0,99,30,40,50`;

const inputArray = input.split(',').map(Number);

function processInput(input) {
    const output = [...input];
    for (let i = 0; i < output.length; i += 4) {
        const opcode = output[i];

        if (opcode === 99) {
            return output;
        }
        const noun = output[output[i + 1]];
        const verb = output[output[i + 2]];

        if (opcode === 1) {
            output[output[i + 3]] = noun + verb;
        } else if (opcode === 2) {
            output[output[i + 3]] = noun * verb;
        } else {
            throw new Error('unknown opcode');
        }
    }
}

function findNounVerb(input) {
    for (let noun = 0; noun < 100; noun++) {
        input[1] = noun;
        for (let verb = 0; verb < 100; verb++) {
            input[2] = verb;
            const result = processInput(input);
            if (result[0] === 19690720) {
                return 100 * noun + verb;
            }
        }
    }
}

console.log(findNounVerb(inputArray));
