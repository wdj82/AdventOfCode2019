def parseInput():
    with open("input.txt") as f:
        data = [int(x.strip()) for x in f]
    return data


input = parseInput()


def requiredFuel(mass):
    fuel = mass // 3 - 2
    if fuel < 0:
        return 0
    return fuel + requiredFuel(fuel)


mass_total = 0
fuel_total = 0
for mass in input:
    mass_total += mass // 3 - 2
    fuel_total += requiredFuel(mass)
print(mass_total, fuel_total)
