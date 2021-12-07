const sampleInput = `16,1,2,0,4,2,7,1,2,14`;
const input = await fetch('https://adventofcode.com/2021/day/7/input').then(i => i.text());

function processInput(inputStr) {
  return inputStr.split(',').map(x => +x);
}

// Used to double check play fn against known sample input answers
function bruteForceLeastFuelMiddle(crabs, version = 1) {
  const calcFuel = version === 1 ? linearFuel : summationFuel;
  const leftCrab = Math.min(...crabs);
  const rightCrab = Math.max(...crabs);
  const fuels = []
  for (let c = leftCrab; c <= rightCrab; c++) {
    fuels.push(calcFuel(crabs, c));
  }
  const minFuel = Math.min(...fuels);
  console.log({ leftCrab, rightCrab, minFuel, center: fuels.indexOf(minFuel) })
  return minFuel;
}

// Part 1

function medianOptions(crabs) {
  crabs.sort((a,b) => a - b);
  if (crabs.length % 2 === 0) {
    const upperBound = crabs.length / 2;
    const lowerBound = upperBound - 1;
    return [crabs[lowerBound], crabs[upperBound]];
  } else {
    const medianIndex = crabs[(crabs.length - 1) / 2]
    return [crabs[medianIndex]];
  }
}

function linearFuel(crabs, alignment) {
  return crabs.reduce((acc, a) => acc + Math.abs(alignment - a), 0)
}

// Part 2

function averageOptions(crabs) {
  const avg = crabs.reduce((acc, a) => acc + (a / crabs.length), 0);
  return [Math.floor(avg), Math.ceil(avg)];
}

function summationFuel(crabs, alignment) {
  let totalFuel = 0;
  crabs.forEach(c => {
    const n = Math.abs(c - alignment);
    const fuelCost = n * (n + 1) / 2;
    totalFuel += fuelCost;
  })
  return totalFuel;
}

// Put it together

function play(input, version = 1) {
  const crabs = processInput(input);

  const calcMiddles = version === 1 ? medianOptions : averageOptions;
  const calcFuel = version === 1 ? linearFuel : summationFuel;

  const options = calcMiddles(crabs);
  return Math.min(...options.map(opt => calcFuel(crabs, opt)))
}

console.log('Part 1, Sample Input:', play(sampleInput));
console.log('Part 1, Real Input:', play(input));
console.log('Part 2, Sample Input:', play(sampleInput, 2));
console.log('Part 2, Real Input:', play(input, 2));
