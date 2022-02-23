import input from './input.js';

const inputArray = input.split('\n').map(Number);

function requiredFuel(mass) {
    const fuel = Math.floor(mass / 3) - 2;
    if (fuel <= 0) {
        return 0;
    }
    return fuel + requiredFuel(fuel);
}

let totalMass = 0;
let totalFuel = 0;
inputArray.forEach((mass) => {
    totalMass += Math.floor(mass / 3) - 2;
    totalFuel += requiredFuel(mass);
});

document.getElementById('partOne').appendChild(document.createTextNode(totalMass));
document.getElementById('partTwo').appendChild(document.createTextNode(totalFuel));
