import { rawInput } from './input.js';
// import { exampleInput as rawInput } from './input.js';

const reactions = rawInput
    .split('\n')
    .map((line) => line.split(' => ').map((r) => r.split(', ').map((x) => x.split(' '))));

const recipes = {};

// parse the input into {outputType: {numProduced, inputs: [inputType, inputNeeded]}}
// 7 A, 1 B => 1 C becomes
// {C: {producedPerReaction: 1, input: [[A, 7], [B, 1]]}}
reactions.forEach(([inputs, [output]]) => {
    const input = inputs.map(([amount, inputType]) => [inputType, Number(amount)]);
    const [produced, outputType] = output;
    recipes[outputType] = { producedPerReaction: Number(produced), input };
});

// recursively go through the reactions for the amount of ore needed to produce the given fuel
function calculateOre(fuelToProduce = 1) {
    const extraChemicals = {};
    let totalOre = 0;

    function recursiveLookup(type, quantity) {
        // ore is the base case
        if (type === 'ORE') {
            totalOre += quantity;
            return;
        }

        // check for leftover chemicals we can use
        if (extraChemicals[type]) {
            if (extraChemicals[type] >= quantity) {
                extraChemicals[type] -= quantity;
                return;
            }
            quantity -= extraChemicals[type];
            extraChemicals[type] = 0;
        }

        const { producedPerReaction, input } = recipes[type];

        // how many times the reaction needs to be run rounded up
        const numOfReactions = Math.ceil(quantity / producedPerReaction);

        // save any leftover chemicals
        extraChemicals[type] = (extraChemicals[type] ?? 0) + numOfReactions * producedPerReaction - quantity;

        // for each needed input type lookup how much needs to be made with the correct quantity
        input.forEach(([inputType, amountForReaction]) => {
            recursiveLookup(inputType, numOfReactions * amountForReaction);
        });
    }

    recursiveLookup('FUEL', fuelToProduce);
    return totalOre;
}

// binary search for most fuel using 1 trillion ore
function findMaxFuel() {
    const maxOre = 1000000000000;

    let upper = 2;
    while (calculateOre(upper) < maxOre) {
        upper *= 2;
    }

    let lower = Math.floor(upper / 2);
    while (upper - lower > 1) {
        const guess = Math.floor((lower + upper) / 2);

        if (calculateOre(guess) > maxOre) {
            upper = guess;
        } else {
            lower = guess;
        }
    }
    return lower;
}

const partOne = calculateOre();
const partTwo = findMaxFuel();

console.log(partOne);
console.log(partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
