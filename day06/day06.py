from collections import defaultdict
import heapq
import math


def parse_input():
    with open("input.txt") as f:
        return [tuple(n.split(")")) for n in f.read().split("\n")]


def count_orbits(planet):
    count = 0
    while planet in Tree:
        count += 1
        planet = Tree[planet]
    return count


def shortestPath(start, end):
    queue = [(0, start)]
    distances = defaultdict(lambda: math.inf)
    distances[start] = 0

    while queue:
        dist, planet = heapq.heappop(queue)

        if planet == end:
            return dist - 2  # don't count YOU and SAN nodes

        if planet or distances[planet] != math.inf:
            for neighbor in Graph[planet]:
                new_dist = distances[planet] + 1
                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    heapq.heappush(queue, (new_dist, neighbor))

    return math.inf  # didn't find a path


orbits = parse_input()

Tree = {child: parent for parent, child in orbits}

partOne = sum(count_orbits(child) for child in Tree)
print(partOne)

Graph = defaultdict(set)

for parent, child in orbits:
    Graph[parent].add(child)
    Graph[child].add(parent)

partTwo = shortestPath("YOU", "SAN")
print(partTwo)
