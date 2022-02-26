import { rawInput } from './input.js';

const output = [];
const inputArray = rawInput.split(',').map(Number);

function getInstruction(program, currIndex) {
    const instruction = program[currIndex];
    const result = [instruction];

    const paramModes = [0, 0, 0];
    if (instruction > 9) {
        const opcodeDigits = instruction.toString().split('').reverse();
        // console.log(opcodeDigits);
        result[0] = Number(opcodeDigits[1] + opcodeDigits[0]);
        paramModes[0] = opcodeDigits[2] ? Number(opcodeDigits[2]) : 0;
        paramModes[1] = opcodeDigits[3] ? Number(opcodeDigits[3]) : 0;
        paramModes[2] = opcodeDigits[4] ? Number(opcodeDigits[4]) : 0;
    }

    if (paramModes[0] === 1) {
        result.push(program[currIndex + 1]);
    } else {
        result.push(program[program[currIndex + 1]]);
    }

    if (paramModes[1] === 1) {
        result.push(program[currIndex + 2]);
    } else {
        result.push(program[program[currIndex + 2]]);
    }

    return result;
}

function processInput(program, input) {
    let i = 0;

    while (i < program.length) {
        if (program[i] === 99) {
            return program[0];
        }

        const [opcode, a, b] = getInstruction(program, i);

        switch (opcode) {
            case 1: // add
                // console.log(`adding ${a} + ${b} (${a + b}) into index ${program[i + 3]}`);
                program[program[i + 3]] = a + b;
                i += 4;
                break;
            case 2: // mul
                // console.log(`mul ${a} * ${b} (${a * b}) into index ${program[i + 3]}`);
                program[program[i + 3]] = a * b;
                i += 4;
                break;
            case 3: // input
                // console.log(`placing input of ${input} into index ${program[i + 1]}`);
                program[program[i + 1]] = input;
                i += 2;
                break;
            case 4: // output
                console.log('PROGRAM OUTPUT: ', a);
                // for final answers saving to output
                if (a > 0) {
                    output.push(a);
                }
                i += 2;
                break;
            case 5: // jump if true
                if (a !== 0) {
                    // console.log(`${a} is non zero, jumping to ${b}`);
                    i = b;
                } else {
                    i += 3;
                }
                break;
            case 6: // jump if false
                if (a === 0) {
                    // console.log(`${a} is zero, jumping to ${b}`);
                    i = b;
                } else {
                    i += 3;
                }
                break;
            case 7: // less than
                if (a < b) {
                    // console.log(`${a} is less than ${b}, storing 1 into index ${program[i + 3]}`);
                    program[program[i + 3]] = 1;
                } else {
                    // console.log(`${a} is not less than ${b}, storing 0 into index ${program[i + 3]}`);
                    program[program[i + 3]] = 0;
                }
                i += 4;
                break;
            case 8: // equal
                if (a === b) {
                    // console.log(`${a} equals ${b}, storing 1 into index ${program[i + 3]}`);
                    program[program[i + 3]] = 1;
                } else {
                    // console.log(`${a} is not equal to ${b}, storing 0 into index ${program[i + 3]}`);
                    program[program[i + 3]] = 0;
                }
                i += 4;
                break;
            default:
                throw new Error(`unknown opcode ${opcode}`);
        }
    }
    throw new Error('error no 99 opcode');
}

processInput([...inputArray], 1);
processInput([...inputArray], 5);

document.getElementById('partOne').appendChild(document.createTextNode(output[0]));
document.getElementById('partTwo').appendChild(document.createTextNode(output[1]));
