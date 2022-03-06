function gcd(a, b) {
    if (!b) {
        return a;
    }
    return gcd(b, a % b);
}

function lcm(a, b) {
    return Math.floor(Math.abs(a * b) / gcd(a, b));
}

const MAX_STEPS = 1000;

// does one time step for the given axis
function stepAxis(moons, axis) {
    moons.forEach((moonA) => {
        moons.forEach((moonB) => {
            if (moonA.name !== moonB.name) {
                if (moonA.pos[axis] < moonB.pos[axis]) {
                    moonA.vel[axis] += 1;
                } else if (moonA.pos[axis] > moonB.pos[axis]) {
                    moonA.vel[axis] -= 1;
                }
            }
        });
    });
    moons.forEach((moon) => {
        moon.pos[axis] += moon.vel[axis];
    });
}

function totalEnergy(originalMoons) {
    // copy to avoid mutating input
    const moons = originalMoons.map(({ name, pos, vel }) => ({ name, pos: [...pos], vel: [...vel] }));

    let steps = 0;
    while (steps < MAX_STEPS) {
        for (let i = 0; i < 3; i++) {
            stepAxis(moons, i);
        }
        steps += 1;
    }
    return moons.reduce((acc, moon) => {
        const potentialEnergy = Math.abs(moon.pos[0]) + Math.abs(moon.pos[1]) + Math.abs(moon.pos[2]);
        const kineticEnergy = Math.abs(moon.vel[0]) + Math.abs(moon.vel[1]) + Math.abs(moon.vel[2]);
        return acc + potentialEnergy * kineticEnergy;
    }, 0);
}

function findPeriod(originalMoons) {
    // copy to avoid mutation input
    const moons = originalMoons.map(({ name, pos, vel }) => ({ name, pos: [...pos], vel: [...vel] }));

    // step once to avoid initial velocities all being zero
    for (let i = 0; i < 3; i++) {
        stepAxis(moons, i);
    }

    const periods = [];
    // check for zero velocities for each axis
    for (let i = 0; i < 3; i++) {
        let period = 1; // already did one step
        while (period < Infinity) {
            // check if all velocities on this axis are 0
            if (moons.every(({ vel }) => vel[i] === 0)) {
                break;
            }

            stepAxis(moons, i);
            period += 1;
        }

        periods.push(period);
    }
    // return the least common multiplier for the three periods
    // doubling to get back to initial state (all velocities hit zero half way to initial positions)
    return 2 * periods.reduce((acc, period) => lcm(acc, period), 1);
}

// didn't feel like parsing the input
const moons = [
    { name: 'a', pos: [-4, -9, -3], vel: [0, 0, 0] },
    { name: 'b', pos: [-13, -11, 0], vel: [0, 0, 0] },
    { name: 'c', pos: [-17, -7, 15], vel: [0, 0, 0] },
    { name: 'd', pos: [-16, 4, 2], vel: [0, 0, 0] },
];

const partOne = totalEnergy(moons);
const partTwo = findPeriod(moons);

console.log(partOne);
console.log(partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
