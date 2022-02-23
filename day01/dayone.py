def parseInput():
    with open("input.txt") as f:
        data = [x.strip() for x in f]
    return data


input = parseInput()
print(input)
