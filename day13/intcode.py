ADD, MUL, IN, OUT, JNZ, JZ, LT, EQ, REL = range(1, 10)
HALT = 99

OPCODE_NUM_PARAMS = {
    ADD: 3,
    MUL: 3,
    IN: 1,
    OUT: 1,
    JNZ: 2,
    JZ: 2,
    LT: 3,
    EQ: 3,
    REL: 1,
    HALT: 0,
}

MODE_POSITION, MODE_IMMEDIATE, MODE_RELATIVE = range(3)
TYPE_SRC, TYPE_DEST = range(2)

OPCODE_PARAM_TYPES = {
    ADD: (TYPE_SRC, TYPE_SRC, TYPE_DEST),
    MUL: (TYPE_SRC, TYPE_SRC, TYPE_DEST),
    IN: (TYPE_DEST,),
    OUT: (TYPE_SRC,),
    JNZ: (TYPE_SRC, TYPE_SRC),
    JZ: (TYPE_SRC, TYPE_SRC),
    LT: (TYPE_SRC, TYPE_SRC, TYPE_DEST),
    EQ: (TYPE_SRC, TYPE_SRC, TYPE_DEST),
    REL: (TYPE_SRC,),
    HALT: 0,
}


class Intcode:
    def __init__(self, code) -> None:
        self.program = code[:] + [0] * 10000
        self.pointer = 0
        self.running = True
        self.output = []
        self.relative_base = 0

    def run(self, input=None):
        self.output = []
        while self.running is True:
            opcode = self.program[self.pointer]

            if opcode == 99:  # exit
                self.running = False
                return self.output

            modes = (
                (opcode // 100) % 10,
                (opcode // 1000) % 10,
                (opcode // 10000) % 10,
            )
            opcode %= 10
            num_params = OPCODE_NUM_PARAMS[opcode]
            types = OPCODE_PARAM_TYPES[opcode]
            params = self.program[self.pointer + 1 : self.pointer + 1 + num_params]

            for i in range(len(params)):
                if modes[i] == MODE_POSITION:
                    if types[i] == TYPE_SRC:
                        params[i] = self.program[params[i]]
                elif modes[i] == MODE_RELATIVE:
                    if types[i] == TYPE_SRC:
                        params[i] = self.program[self.relative_base + params[i]]
                    elif types[i] == TYPE_DEST:
                        params[i] += self.relative_base

            if opcode == ADD:  # add
                a, b, c = params
                self.program[c] = a + b
                self.pointer += 4
            elif opcode == MUL:  # mul
                a, b, c = params
                self.program[c] = a * b
                self.pointer += 4
            elif opcode == IN:  # input
                a = params[0]
                if input is not None:
                    self.program[a] = input
                    self.pointer += 2
                    input = None
                else:
                    return self.output
            elif opcode == OUT:  # output
                a = params[0]
                # print("OUTPUT: ", a)
                self.output.append(a)
                self.pointer += 2
            elif opcode == JNZ:  # jump if true
                a, b = params
                self.pointer = b if a != 0 else self.pointer + 3
            elif opcode == JZ:  # jump if false
                a, b = params
                self.pointer = b if a == 0 else self.pointer + 3
            elif opcode == LT:  # less than
                a, b, c = params
                self.program[c] = 1 if a < b else 0
                self.pointer += 4
            elif opcode == EQ:  # equal
                a, b, c = params
                self.program[c] = 1 if a == b else 0
                self.pointer += 4
            elif opcode == REL:  # adjust relative base
                a = params[0]
                self.relative_base += a
                self.pointer += 2
            else:
                print(f"Unknown opcode: {opcode}")
                return None
