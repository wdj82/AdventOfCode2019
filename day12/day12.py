from math import gcd
from functools import reduce
from collections import namedtuple
from itertools import combinations, count


initial_positions = [
    [-4, -9, -3],
    [-13, -11, 0],
    [-17, -7, 15],
    [-16, 4, 2],
]


def lcm(a, b):
    return abs(a * b) // gcd(a, b)


Moon = namedtuple("Moon", ["pos", "vel"])
moons = [Moon(pos.copy(), [0, 0, 0]) for pos in initial_positions]

for step in range(1000):
    for moon1, moon2 in combinations(moons, 2):
        for axis in range(3):
            if moon2.pos[axis] > moon1.pos[axis]:
                moon1.vel[axis] += 1
                moon2.vel[axis] -= 1
            elif moon2.pos[axis] < moon1.pos[axis]:
                moon1.vel[axis] -= 1
                moon2.vel[axis] += 1

    for moon in moons:
        for axis in range(3):
            moon.pos[axis] += moon.vel[axis]

potential = (sum(map(abs, m.pos)) for m in moons)
kinetic = (sum(map(abs, m.vel)) for m in moons)
total = sum(p * k for p, k in zip(potential, kinetic))


print(total)


periods = []
start = step + 1

for axis in range(3):
    for period in count(start):
        if all(m.vel[axis] == 0 for m in moons):
            break

        for moon1, moon2 in combinations(moons, 2):
            if moon2.pos[axis] > moon1.pos[axis]:
                moon1.vel[axis] += 1
                moon2.vel[axis] -= 1
            elif moon2.pos[axis] < moon1.pos[axis]:
                moon1.vel[axis] -= 1
                moon2.vel[axis] += 1

        for moon in moons:
            moon.pos[axis] += moon.vel[axis]

    periods.append(period)

total_steps = 2 * reduce(lcm, periods, 1)
print(total_steps)
