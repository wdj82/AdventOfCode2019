from operator import add, mul
from itertools import product


def parse_input():
    with open("input.txt") as f:
        return [int(n) for n in f.read().split(",")]


input = parse_input()


def run(program, *inputs):
    program[1:3] = inputs[:]
    pointer = 0
    while program[pointer] != 99:
        op = add if program[pointer] == 1 else mul
        a, b, c = program[pointer + 1 : pointer + 4]
        program[c] = op(program[a], program[b])
        pointer += 4
    return program[0]


print(run(input[:], 12, 2))

for noun, verb in product(range(100), range(100)):
    if run(input[:], noun, verb) == 19690720:
        break

print(100 * noun + verb)
