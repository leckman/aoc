const DAY_NUM = 3;

let TESTING = true;
let PART_NUMBER = 1;

const sampleData1 = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;
const sampleData2 = sampleData1;

async function fetchData() {
  if (TESTING) {
    return PART_NUMBER === 1 ? sampleData1 : sampleData2;
  }
  return fetch(`https://adventofcode.com/2023/day/${DAY_NUM}/input`).then(
    (res) => res.text()
  );
}

async function getProcessedData() {
  const rawData = await fetchData();
  return rawData.trim().split("\n");
}

function getNeighbors(grid, { row, column }) {
  const neighbors = [];
  for (let r = row - 1; r <= row + 1; r += 1) {
    for (let c = column - 1; c <= column + 1; c += 1) {
      if (r == row && c == column) continue;
      const value = grid[r]?.[c];
      if (value) {
        neighbors.push({ value: value, row: r, column: c });
      }
    }
  }
  return neighbors;
}

const nonSymbols = new Set([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
]);

function candidateIsPartNumber(grid, row, col, matchValString) {
  let hasNeighborSymbol = false;
  // Iterate over the positions of all digits in the number
  for (let i = 0; i < matchValString.length; i++) {
    hasNeighborSymbol = getNeighbors(grid, { row, column: col + i }).some(
      (n) => !nonSymbols.has(n.value)
    );
    if (hasNeighborSymbol) {
      break;
    }
  }
  return hasNeighborSymbol;
}

async function part1() {
  PART_NUMBER = 1;
  const data = await getProcessedData();
  let answer = 0;

  data.forEach((line, row) => {
    const candidates = line.matchAll(/\d+/g);
    for (let match of candidates) {
      const candidate = match[0];
      if (candidateIsPartNumber(data, row, match.index, candidate)) {
        answer += +candidate;
      }
    }
  });

  console.log(`Part 1: ${answer}`);
}

function getGearsTouchingPartNumber(grid, row, col, matchValString) {
  const gears = new Set();
  // Iterate over the positions of all digits in the number
  for (let i = 0; i < matchValString.length; i++) {
    getNeighbors(grid, { row, column: col + i }).forEach((n) => {
      if (n.value === "*") {
        gears.add(`${n.row};${n.column}`);
      }
    });
  }
  return Array.from(gears);
}

async function part2() {
  PART_NUMBER = 2;
  const data = await getProcessedData();
  let answer = 0;

  const gearLocationToNumbers = {};
  data.forEach((line, row) => {
    const candidates = line.matchAll(/\d+/g);
    for (let match of candidates) {
      const candidate = match[0];
      getGearsTouchingPartNumber(data, row, match.index, candidate).forEach(
        (gear) => {
          if (!gearLocationToNumbers[gear]) {
            gearLocationToNumbers[gear] = [];
          }
          gearLocationToNumbers[gear].push(+candidate);
        }
      );
    }
  });

  if (TESTING) {
    console.log(gearLocationToNumbers);
  }

  Object.values(gearLocationToNumbers).forEach((numbers) => {
    if (numbers.length === 2) {
      answer += numbers[0] * numbers[1];
    }
  });

  console.log(`Part 2: ${answer}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  part1();
  part2();
}
