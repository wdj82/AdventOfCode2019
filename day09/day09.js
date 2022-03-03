import { rawInput } from './input.js';
// import { exampleInput as rawInput } from './input.js';
import IntCode from './IntCode.js';

const program = rawInput.split(',').map(Number);

const { output: partOne } = new IntCode('A', program, 1);
const { output: partTwo } = new IntCode('A', program, 2);

document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
