from collections import defaultdict
from intcode import Intcode

LEFT, RIGHT = 0, 1
NORTH, SOUTH, EAST, WEST = ("N", "S", "E", "W")

DIRMAP = {
    NORTH: (WEST, EAST),
    SOUTH: (EAST, WEST),
    EAST: (NORTH, SOUTH),
    WEST: (SOUTH, NORTH),
}

MOVEMAP = {NORTH: (-1, 0), SOUTH: (1, 0), EAST: (0, 1), WEST: (0, -1)}


def parse_input():
    with open("input.txt") as f:
        return [int(n) for n in f.read().split(",")]


def sparse_to_matrix(grid):
    min_x = min(x for x, _ in grid)
    max_x = max(x for x, _ in grid)
    min_y = min(y for _, y in grid)
    max_y = max(y for _, y in grid)

    height = max_x - min_x + 1
    width = max_y - min_y + 1

    matrix = [([" "] * width) for _ in range(height)]

    for x in range(height):
        for y in range(width):
            if grid[min_x + x, min_y + y] == 1:
                matrix[x][y] = "#"

    return matrix


def paintHull(startingInput):
    pos = (0, 0)
    dir = "N"
    hull = defaultdict(lambda: 0)

    robot = Intcode(program)
    output = robot.run(startingInput)

    while output != 99:
        color, newDir = output
        hull[pos] = color

        dir = DIRMAP[dir][newDir]
        dx, dy = MOVEMAP[dir]
        pos = (pos[0] + dx, pos[1] + dy)
        output = robot.run(hull[pos])

    return hull


program = parse_input()
partOne = paintHull(0)
print(len(partOne))
partTwo = paintHull(1)
hull = sparse_to_matrix(partTwo)
for row in hull:
    print("".join(row))
