from intcode import Intcode


def parse_input():
    with open("input.txt") as f:
        return [int(n) for n in f.read().split(",")]


def count_blocks():
    program = parse_input()
    testGame = Intcode(program)
    output = testGame.run()

    count = 0
    for i in range(2, len(output), 3):
        if output[i] == 2:
            count += 1
    print(count)


def play_game():
    program = parse_input()
    program[0] = 2
    freeGame = Intcode(program)

    score = 0
    paddle_x = 0
    input = 0

    while True:
        output = freeGame.run(input)
        if not output:
            break
        for i in range(0, len(output), 3):
            x, y, code = output[i : i + 3]

            if (x, y) == (-1, 0):
                score = code
            elif code == 3:
                paddle_x = x
            elif code == 4:
                if x > paddle_x:
                    input = 1
                elif x < paddle_x:
                    input = -1

    print(score)


count_blocks()
play_game()
