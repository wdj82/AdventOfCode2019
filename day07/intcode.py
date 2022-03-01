class Intcode:
    def __init__(self, code) -> None:
        self.program = code[:]
        self.pointer = 0
        self.running = True
        self.output = None

    def run(self, input):
        while self.running is True:
            opcode = self.program[self.pointer]

            if opcode == 99:  # exit
                self.running = False
                return

            modes = (
                (opcode // 100) % 10,
                (opcode // 1000) % 10,
                (opcode // 10000) % 10,
            )
            opcode %= 10

            if opcode == 1:  # add
                a, b, c = self.program[self.pointer + 1 : self.pointer + 4]
                if modes[0] == 0:
                    a = self.program[a]
                if modes[1] == 0:
                    b = self.program[b]
                self.program[c] = a + b
                self.pointer += 4
            elif opcode == 2:  # mul
                a, b, c = self.program[self.pointer + 1 : self.pointer + 4]
                if modes[0] == 0:
                    a = self.program[a]
                if modes[1] == 0:
                    b = self.program[b]
                self.program[c] = a * b
                self.pointer += 4
            elif opcode == 3:  # input
                if input is not None:
                    self.program[self.program[self.pointer + 1]] = input
                    self.pointer += 2
                    input = None
                else:
                    return
            elif opcode == 4:  # output
                a = self.program[self.pointer + 1]
                if modes[0] == 0:
                    a = self.program[a]
                # print("OUTPUT: ", a)
                self.output = a
                self.pointer += 2
            elif opcode == 5:  # jump if true
                a, b = self.program[self.pointer + 1 : self.pointer + 3]
                if modes[0] == 0:
                    a = self.program[a]
                if modes[1] == 0:
                    b = self.program[b]
                self.pointer = b if a != 0 else self.pointer + 3
            elif opcode == 6:  # jump if false
                a, b = self.program[self.pointer + 1 : self.pointer + 3]
                if modes[0] == 0:
                    a = self.program[a]
                if modes[1] == 0:
                    b = self.program[b]
                self.pointer = b if a == 0 else self.pointer + 3
            elif opcode == 7:  # less than
                a, b, c = self.program[self.pointer + 1 : self.pointer + 4]
                if modes[0] == 0:
                    a = self.program[a]
                if modes[1] == 0:
                    b = self.program[b]
                self.program[c] = 1 if a < b else 0
                self.pointer += 4
            elif opcode == 8:  # equal
                a, b, c = self.program[self.pointer + 1 : self.pointer + 4]
                if modes[0] == 0:
                    a = self.program[a]
                if modes[1] == 0:
                    b = self.program[b]
                self.program[c] = 1 if a == b else 0
                self.pointer += 4
            else:
                print(f"Unknown opcode: {opcode}")
                return None
