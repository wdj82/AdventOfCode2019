WIDTH, HEIGHT = 25, 6
SIZE = WIDTH * HEIGHT


def parse_input():
    with open("input.txt") as f:
        chars = f.readline().rstrip()
        return [chars[i : i + SIZE] for i in range(0, len(chars), SIZE)]


layers = parse_input()

best = min(layers, key=lambda l: l.count("0"))
checksum = best.count("1") * best.count("2")
print(checksum)

image = ["2"] * SIZE

for i in range(SIZE):
    for layer in layers:
        if layer[i] != "2":
            image[i] = layer[i]
            break

convert = {"0": " ", "1": "#"}
decoded = ""

for i in range(0, SIZE, WIDTH):
    decoded += "".join(map(convert.get, image[i : i + WIDTH])) + "\n"

print(decoded)
