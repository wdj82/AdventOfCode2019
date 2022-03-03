class IntCode {
    constructor(name, program, input = null, debug = false) {
        this.name = name;
        this.input = input;
        this.program = [...program];
        // add a bunch of zeroes to the program array
        for (let i = 0; i < 1000; i++) {
            this.program.push(0);
        }
        this.i = 0;
        this.running = true;
        this.waitingForInput = false;
        this.output = null;
        this.debug = debug;
        this.relativeBase = 0;
        this.opcode = null;
        this.a = null;
        this.b = null;
        this.c = null;
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

            this.getInstruction();
            if (this.debug) {
                console.log(this.name, 'opcode: ', this.opcode);
            }

            switch (this.opcode) {
                case 1: // add
                    this.add();
                    break;
                case 2: // mul
                    this.mul();
                    break;
                case 3: // input
                    if (this.input !== null) {
                        this.processInput(this.input);
                        this.input = null;
                    } else {
                        this.waitingForInput = true;
                        return this.opcode;
                    }
                    break;
                case 4: // output
                    this.printOutput();
                    break;
                case 5: // jump if true
                    this.jumpIfTrue();
                    break;
                case 6: // jump if false
                    this.jumpIfFalse();
                    break;
                case 7: // less than
                    this.lessThan();
                    break;
                case 8: // equal
                    this.equalTo();
                    break;
                case 9: // adjust relative base
                    this.adjustRelativeBase();
                    break;
                default:
                    throw new Error(`unknown opcode ${this.opcode}`);
            }
        }

        throw new Error(`error running program`);
    }

    add() {
        if (this.debug) {
            console.log(`adding ${this.a} + ${this.b} (${this.a + this.b}) into index ${this.c}`);
        }
        this.program[this.c] = this.a + this.b;
        this.i += 4;
    }

    mul() {
        if (this.debug) {
            console.log(`mul ${this.a} * ${this.b} (${this.a * this.b}) into index ${this.c}`);
        }
        this.program[this.c] = this.a * this.b;
        this.i += 4;
    }

    processInput(input) {
        if (this.debug) {
            console.log(`${this.name}: placing input of ${input} into index ${this.a}`);
        }
        this.program[this.a] = input;
        this.i += 2;
        this.waitingForInput = false;
    }

    printOutput() {
        if (this.debug) {
            console.log(`printing from index ${this.a}`);
        }
        console.log('PROGRAM OUTPUT: ', this.a);
        this.output = this.a;
        this.i += 2;
    }

    adjustRelativeBase() {
        if (this.debug) {
            console.log(`Adding ${this.a} to relative base ${this.relativeBase}: ${this.relativeBase + this.a}`);
        }
        this.relativeBase += this.a;
        this.i += 2;
    }

    jumpIfTrue() {
        if (this.a !== 0) {
            if (this.debug) {
                console.log(`${this.a} is non zero, jumping to ${this.b}`);
            }
            this.i = this.b;
        } else {
            if (this.debug) {
                console.log(`${this.a} is zero - skipping`);
            }
            this.i += 3;
        }
    }

    jumpIfFalse() {
        if (this.a === 0) {
            if (this.debug) {
                console.log(`${this.a} is zero, jumping to ${this.b}`);
            }
            this.i = this.b;
        } else {
            if (this.debug) {
                console.log(`${this.a} is non zero - skipping`);
            }
            this.i += 3;
        }
    }

    lessThan() {
        if (this.a < this.b) {
            if (this.debug) {
                console.log(`${this.a} is less than ${this.b}, storing 1 into index ${this.c}`);
            }
            this.program[this.c] = 1;
        } else {
            if (this.debug) {
                console.log(`${this.a} is not less than ${this.b}, storing 0 into index ${this.c}`);
            }
            this.program[this.c] = 0;
        }
        this.i += 4;
    }

    equalTo() {
        if (this.a === this.b) {
            if (this.debug) {
                console.log(`${this.a} equals ${this.b}, storing 1 into index ${this.c}`);
            }
            this.program[this.c] = 1;
        } else {
            if (this.debug) {
                console.log(`${this.a} is not equal to ${this.b}, storing 0 into index ${this.c}`);
            }
            this.program[this.c] = 0;
        }
        this.i += 4;
    }

    getInstruction() {
        const instruction = this.program[this.i];
        // const result = [instruction];
        this.opcode = instruction;

        const paramModes = [0, 0, 0];
        if (instruction > 9) {
            const opcodeDigits = instruction.toString().split('').reverse();
            this.opcode = Number(opcodeDigits[1] + opcodeDigits[0]);
            paramModes[0] = opcodeDigits[2] ? Number(opcodeDigits[2]) : 0;
            paramModes[1] = opcodeDigits[3] ? Number(opcodeDigits[3]) : 0;
            paramModes[2] = opcodeDigits[4] ? Number(opcodeDigits[4]) : 0;
        }

        if (paramModes[0] === 0) {
            // position mode - param is pointer
            if (this.opcode !== 3) {
                this.a = this.program[this.program[this.i + 1]];
            } else {
                this.a = this.program[this.i + 1];
            }
        } else if (paramModes[0] === 1) {
            // immediate mode - param is value
            this.a = this.program[this.i + 1];
        } else if (this.opcode !== 3) {
            // relative mode - param is pointer + relative base
            this.a = this.program[this.program[this.i + 1] + this.relativeBase];
        } else {
            this.a = this.program[this.i + 1] + this.relativeBase;
        }

        if (paramModes[1] === 0) {
            // position mode
            this.b = this.program[this.program[this.i + 2]];
        } else if (paramModes[1] === 1) {
            // immediate mode
            this.b = this.program[this.i + 2];
        } else {
            // relative mode
            this.b = this.program[this.program[this.i + 2] + this.relativeBase];
        }

        if (paramModes[2] === 0) {
            this.c = this.program[this.i + 3];
        } else if (paramModes[2] === 2) {
            this.c = this.program[this.i + 3] + this.relativeBase;
        } else if (paramModes[2] === 1) {
            throw new Error('implement immediate mode for c????');
        }
    }
}

export default IntCode;
