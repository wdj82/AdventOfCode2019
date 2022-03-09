from collections import defaultdict, deque
from math import ceil


def parse_input():
    recipes = {}
    with open("input.txt") as f:
        for line in f:
            input, output = line.rstrip().split(" => ")
            product_qty, product_name = output.split()

            ingredients = []
            for chem in input.split(", "):
                qty, name = chem.split()
                ingredients.append((int(qty), name))

            recipes[product_name] = (int(product_qty), ingredients)

    return recipes


recipes = parse_input()


def needed_ore(fuel_qty=1):
    queue = deque([(fuel_qty, "FUEL")])
    leftover = defaultdict(int)
    total_ore = 0

    while queue:
        needed_qty, chemical = queue.popleft()

        if chemical == "ORE":
            total_ore += needed_qty
            continue

        if leftover[chemical] >= needed_qty:
            leftover[chemical] -= needed_qty
            continue

        needed_qty -= leftover[chemical]
        leftover[chemical] = 0

        recipe_qty, ingredients = recipes[chemical]
        multiplier = ceil(needed_qty / recipe_qty)

        for qty, el in ingredients:
            queue.append((qty * multiplier, el))

        leftover[chemical] += multiplier * recipe_qty - needed_qty

    return total_ore


ore = needed_ore()
print(ore)

MAX_ORE = 10 ** 12

high = 2
while needed_ore(high) < MAX_ORE:
    high *= 2

low = high // 2

while high - low > 1:
    guess = (low + high) // 2
    ore = needed_ore(guess)

    if ore > MAX_ORE:
        high = guess
    else:
        low = guess

print(low)
