class IntCode {
    constructor(name, program, input, debug = false) {
        this.name = name;
        this.input = input;
        this.program = [...program];
        this.i = 0;
        this.running = true;
        this.waitingForInput = false;
        this.output = null;
        this.debug = debug;
        this.run();
    }

    run() {
        while (this.running && !this.waitingForInput) {
            if (this.program[this.i] === 99) {
                if (this.debug) {
                    console.log('exiting');
                }
                this.exited = true;
                return 99;
            }

            const [opcode, a, b] = this.getInstruction();
            if (this.debug) {
                console.log(this.name, 'opcode: ', opcode);
            }

            switch (opcode) {
                case 1: // add
                    this.add(a, b);
                    break;
                case 2: // mul
                    this.mul(a, b);
                    break;
                case 3: // input
                    if (this.input !== null) {
                        this.processInput(this.input);
                        this.input = null;
                    } else {
                        this.waitingForInput = true;
                        return opcode;
                    }
                    break;
                case 4: // output
                    this.printOutput(a);
                    break;
                case 5: // jump if true
                    this.jumpIfTrue(a, b);
                    break;
                case 6: // jump if false
                    this.jumpIfFalse(a, b);
                    break;
                case 7: // less than
                    this.lessThan(a, b);
                    break;
                case 8: // equal
                    this.equalTo(a, b);
                    break;
                default:
                    throw new Error(`unknown opcode ${opcode}`);
            }
        }

        throw new Error(`error running program`);
    }

    add(a, b) {
        if (this.debug) {
            console.log(`adding ${a} + ${b} (${a + b}) into index ${this.program[this.i + 3]}`);
        }
        this.program[this.program[this.i + 3]] = a + b;
        this.i += 4;
    }

    mul(a, b) {
        if (this.debug) {
            console.log(`mul ${a} * ${b} (${a * b}) into index ${this.program[this.i + 3]}`);
        }
        this.program[this.program[this.i + 3]] = a * b;
        this.i += 4;
    }

    processInput(input) {
        if (this.debug) {
            console.log(`${this.name}: placing input of ${input} into index ${this.program[this.i + 1]}`);
        }
        this.program[this.program[this.i + 1]] = input;
        this.i += 2;
        this.waitingForInput = false;
    }

    printOutput(a) {
        if (this.debug) {
            console.log('PROGRAM OUTPUT: ', a);
        }
        this.output = a;
        this.i += 2;
    }

    jumpIfTrue(a, b) {
        if (a !== 0) {
            if (this.debug) {
                console.log(`${a} is non zero, jumping to ${b}`);
            }
            this.i = b;
        } else {
            if (this.debug) {
                console.log(`${a} is zero - skipping`);
            }
            this.i += 3;
        }
    }

    jumpIfFalse(a, b) {
        if (a === 0) {
            if (this.debug) {
                console.log(`${a} is zero, jumping to ${b}`);
            }
            this.i = b;
        } else {
            if (this.debug) {
                console.log(`${a} is non zero - skipping`);
            }
            this.i += 3;
        }
    }

    lessThan(a, b) {
        if (a < b) {
            if (this.debug) {
                console.log(`${a} is less than ${b}, storing 1 into index ${this.program[this.i + 3]}`);
            }
            this.program[this.program[this.i + 3]] = 1;
        } else {
            if (this.debug) {
                console.log(`${a} is not less than ${b}, storing 0 into index ${this.program[this.i + 3]}`);
            }
            this.program[this.program[this.i + 3]] = 0;
        }
        this.i += 4;
    }

    equalTo(a, b) {
        if (a === b) {
            if (this.debug) {
                console.log(`${a} equals ${b}, storing 1 into index ${this.program[this.i + 3]}`);
            }
            this.program[this.program[this.i + 3]] = 1;
        } else {
            if (this.debug) {
                console.log(`${a} is not equal to ${b}, storing 0 into index ${this.program[this.i + 3]}`);
            }
            this.program[this.program[this.i + 3]] = 0;
        }
        this.i += 4;
    }

    getInstruction() {
        const instruction = this.program[this.i];
        const result = [instruction];

        const paramModes = [0, 0, 0];
        if (instruction > 9) {
            const opcodeDigits = instruction.toString().split('').reverse();
            result[0] = Number(opcodeDigits[1] + opcodeDigits[0]);
            paramModes[0] = opcodeDigits[2] ? Number(opcodeDigits[2]) : 0;
            paramModes[1] = opcodeDigits[3] ? Number(opcodeDigits[3]) : 0;
            paramModes[2] = opcodeDigits[4] ? Number(opcodeDigits[4]) : 0;
        }

        if (paramModes[0] === 1) {
            result.push(this.program[this.i + 1]);
        } else {
            result.push(this.program[this.program[this.i + 1]]);
        }

        if (paramModes[1] === 1) {
            result.push(this.program[this.i + 2]);
        } else {
            result.push(this.program[this.program[this.i + 2]]);
        }

        return result;
    }
}

export default IntCode;
