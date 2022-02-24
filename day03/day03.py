def parse_input():
    data = []
    with open("input.txt") as f:
        for line in f:
            data.append(line.strip().split(","))
    return data


xMoves = {"U": 0, "D": 0, "R": 1, "L": -1}
yMoves = {"U": 1, "D": -1, "R": 0, "L": 0}


def getVisited(moves):
    visited = set()
    point = (0, 0)
    step = 0
    steps = {}

    for dir, numSteps in moves:
        for _ in range(numSteps):
            point = (point[0] + xMoves[dir], point[1] + yMoves[dir])
            step += 1
            visited.add(point)
            if point not in steps:
                steps[point] = step

    return visited, steps


firstWires, secondWires = parse_input()

firstMoves = [(move[0], int(move[1:])) for move in firstWires]
secondMoves = [(move[0], int(move[1:])) for move in secondWires]

firstSet, firstSteps = getVisited(firstMoves)
secondSet, secondSteps = getVisited(secondMoves)

intersections = firstSet & secondSet
partOne = min(abs(point[0]) + abs(point[1]) for point in intersections)
partTwo = min(firstSteps[point] + secondSteps[point] for point in intersections)

print(partOne)
print(partTwo)
