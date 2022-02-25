start = 147981
end = 691423
part_one_count = 0
part_two_count = 0

for password in range(start, end + 1):
    digits = str(password)
    pairs = tuple(zip(digits, digits[1:]))

    if all(a <= b for a, b in pairs) and any(a == b for a, b in pairs):
        part_one_count += 1

        digits = "x" + digits + "x"
        quads = zip(digits, digits[1:], digits[2:], digits[3:])

        if any(a != b and b == c and c != d for a, b, c, d in quads):
            part_two_count += 1


print(part_one_count)
print(part_two_count)
