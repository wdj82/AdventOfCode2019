import input from './input.js';

const inputArray = input.split('\n').map(Number);

function requiredFuel(mass) {
    const fuel = Math.floor(mass / 3) - 2;
    if (fuel <= 0) {
        return 0;
    }
    return fuel + requiredFuel(fuel);
}

function calculateTotalFuel() {
    return inputArray.reduce((totalMass, currentMass) => (totalMass += requiredFuel(currentMass)), 0);
}

console.log(calculateTotalFuel());
