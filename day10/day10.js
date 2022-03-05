import { rawInput } from './input.js';
// import { exampleInput as rawInput } from './input.js';

function gcd(a, b) {
    if (!b) {
        return a;
    }
    return gcd(b, a % b);
}

function ray([x1, y1], [x2, y2]) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const div = Math.abs(gcd(dx, dy));
    return [dx / div, dy / div];
}

function manhattan([x1, y1], [x2, y2]) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function angle([x1, y1], [x2, y2]) {
    let rad = Math.atan2(y2 - y1, x2 - x1) + Math.PI;
    rad = (rad % (2 * Math.PI)) - Math.PI / 2;
    return rad >= 0 ? rad : 2 * Math.PI + rad;
}

function parseInput() {
    const map = rawInput.split('\n').map((line) => line.split(''));
    const asteroids = [];

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === '#') {
                asteroids.push([x, y]);
            }
        }
    }
    return asteroids;
}

function findStation(asteroids) {
    let partOne = 0;
    let station = null;
    asteroids.forEach((src, index) => {
        const lines = new Set();

        asteroids.forEach((dest, i) => {
            if (i !== index) {
                const line = ray(src, dest);
                lines.add(line.toString());
            }
        });

        if (lines.size > partOne) {
            station = src;
            partOne = lines.size;
        }
    });
    return [partOne, station];
}

function fireLasers(station, asteroids) {
    const closest = {};

    asteroids.forEach((target) => {
        if (target !== station) {
            const line = ray(station, target).toString();
            const dist = manhattan(station, target);

            if (!closest[line] || dist < closest[line].dist) {
                closest[line] = { target, dist };
            }
        }
    });

    const ordered = Object.values(closest).sort((a, b) => {
        const angle1 = angle(station, a.target);
        const angle2 = angle(station, b.target);
        return angle1 - angle2;
    });

    return 100 * ordered[199].target[0] + ordered[199].target[1];
}

const asteroids = parseInput();
const [partOne, station] = findStation(asteroids);
const partTwo = fireLasers(station, asteroids);

console.log(partOne);
console.log(partTwo);
document.getElementById('partOne').appendChild(document.createTextNode(partOne));
document.getElementById('partTwo').appendChild(document.createTextNode(partTwo));
