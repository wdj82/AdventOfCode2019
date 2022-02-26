def parse_input():
    with open("input.txt") as f:
        return [int(n) for n in f.read().split(",")]


input = parse_input()


def run(program, input):
    pointer = 0
    output = None
    while program[pointer] != 99:
        opcode = program[pointer]
        modes = ((opcode // 100) % 10, (opcode // 1000) % 10, (opcode // 10000) % 10)
        opcode %= 10

        if opcode == 1:  # add
            a, b, c = program[pointer + 1 : pointer + 4]
            if modes[0] == 0:
                a = program[a]
            if modes[1] == 0:
                b = program[b]
            program[c] = a + b
            pointer += 4
        elif opcode == 2:  # mul
            a, b, c = program[pointer + 1 : pointer + 4]
            if modes[0] == 0:
                a = program[a]
            if modes[1] == 0:
                b = program[b]
            program[c] = a * b
            pointer += 4
        elif opcode == 3:  # input
            program[program[pointer + 1]] = input
            pointer += 2
        elif opcode == 4:  # output
            a = program[pointer + 1]
            if modes[0] == 0:
                a = program[a]
            print("OUTPUT: ", a)
            output = a
            pointer += 2
        elif opcode == 5:  # jump if true
            a, b = program[pointer + 1 : pointer + 3]
            if modes[0] == 0:
                a = program[a]
            if modes[1] == 0:
                b = program[b]
            pointer = b if a != 0 else pointer + 3
        elif opcode == 6:  # jump if false
            a, b = program[pointer + 1 : pointer + 3]
            if modes[0] == 0:
                a = program[a]
            if modes[1] == 0:
                b = program[b]
            pointer = b if a == 0 else pointer + 3
        elif opcode == 7:  # less than
            a, b, c = program[pointer + 1 : pointer + 4]
            if modes[0] == 0:
                a = program[a]
            if modes[1] == 0:
                b = program[b]
            program[c] = 1 if a < b else 0
            pointer += 4
        elif opcode == 8:  # equal
            a, b, c = program[pointer + 1 : pointer + 4]
            if modes[0] == 0:
                a = program[a]
            if modes[1] == 0:
                b = program[b]
            program[c] = 1 if a == b else 0
            pointer += 4
        else:
            print(f"Unknown opcode: {opcode}")
            return None

    return output


print(run(input[:], 1))
print(run(input[:], 5))
