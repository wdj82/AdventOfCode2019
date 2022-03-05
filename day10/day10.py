from math import atan2, pi as PI, gcd


def parse_input():
    asteroids = set()
    with open("input.txt") as f:
        for y, row in enumerate(f):
            for x, cell in enumerate(row.rstrip()):
                if cell == "#":
                    asteroids.add((x, y))

    return asteroids


def ray(x1, y1, x2, y2):
    dx, dy = x2 - x1, y2 - y1
    div = abs(gcd(dx, dy))
    return dx // div, dy // div


def manhattan(x1, y1, x2, y2):
    return abs(x2 - x1) + abs(y2 - y1)


def angle(x1, y1, x2, y2):
    rad = atan2(y2 - y1, x2 - x1) + PI
    rad = rad % (2 * PI) - PI / 2
    return rad if rad >= 0 else 2 * PI + rad


asteroids = parse_input()

station = None
max_seen = 0

for src in asteroids:
    seen = set()

    for ast in asteroids:
        if ast == src:
            continue

        seen.add(ray(*src, *ast))

    if len(seen) > max_seen:
        max_seen = len(seen)
        station = src

print(max_seen)

closest = {}

assert max_seen >= 200

for target in asteroids:
    if target == station:
        continue

    line = ray(*station, *target)
    dist = manhattan(*station, *target)

    if line not in closest or dist < closest[line][1]:
        closest[line] = (target, dist)

ordered = sorted(closest.values(), key=lambda am: angle(*station, *am[0]))
x, y = ordered[199][0]
part_two = 100 * x + y
print(part_two)
