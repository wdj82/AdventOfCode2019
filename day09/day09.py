from intcode import Intcode


def parse_input():
    with open("input.txt") as f:
        return [int(n) for n in f.read().split(",")]


program = parse_input()


senserProgram = Intcode(program)
senserProgram.run(1)

senserProgram = Intcode(program)
senserProgram.run(2)
