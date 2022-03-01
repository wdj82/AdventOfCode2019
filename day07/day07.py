from intcode import Intcode
from itertools import permutations


def parse_input():
    with open("input.txt") as f:
        return [int(n) for n in f.read().split(",")]


program = parse_input()


def run_amps(permutations):
    max = 0
    for phase_settings in permutations:
        amplifiers = [Intcode(program) for _ in range(5)]
        for amp, input in zip(amplifiers, phase_settings):
            amp.run(input)
        previous = 0

        while amplifiers[4].running:
            for amp in amplifiers:
                amp.run(previous)
                previous = amp.output

        if previous > max:
            max = previous
    return max


partOne = run_amps(permutations(range(5)))
print(partOne)
partTwo = run_amps(permutations(range(5, 10)))
print(partTwo)
