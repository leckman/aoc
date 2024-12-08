const DAY_NUM = 8;
let TESTING = true;
let PART_NUMBER = 1;

const sampleData1 = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;
const sampleData2 = sampleData1;

async function fetchData() {
  if (TESTING) {
    return PART_NUMBER === 1 ? sampleData1 : sampleData2;
  }
  return fetch(`https://adventofcode.com/2024/day/${DAY_NUM}/input`).then(
    (res) => res.text()
  );
}

async function getProcessedData() {
  const rawData = await fetchData();
  const lines = rawData.trim().split("\n");

  const gridSize = { rows: lines.length, cols: lines[0].length };
  const antennasBySignal = {};

  for (let row = 0; row < gridSize.rows; row++) {
    for (let col = 0; col < gridSize.cols; col++) {
      const char = lines[row][col];
      if (char === ".") continue;
      if (!antennasBySignal[char]) antennasBySignal[char] = [];
      antennasBySignal[char].push({ row, col });
    }
  }

  return { antennasBySignal, gridSize };
}

const pointToKey = ({ row, col }) => `${row},${col}`;

function isInBounds(point, gridSize) {
  const { row, col } = point;
  return row >= 0 && row < gridSize.rows && col >= 0 && col < gridSize.cols;
}

function addAntinodes(pointA, pointB, gridSize, antinodes) {
  const dCol = pointA.col - pointB.col;
  const dRow = pointA.row - pointB.row;
  const potentialAntinodes = [
    { row: pointA.row + dRow, col: pointA.col + dCol },
    { row: pointB.row - dRow, col: pointB.col - dCol },
  ];
  // console.log({ pointA, pointB, dCol, dRow, potentialAntinodes });
  potentialAntinodes.forEach((point) => {
    if (isInBounds(point, gridSize)) {
      antinodes.add(pointToKey(point));
    }
  });
}

function addAntinodes2(pointA, pointB, gridSize, antinodes) {
  const dCol = pointA.col - pointB.col;
  const dRow = pointA.row - pointB.row;

  // Positive direction
  let startingPoint = pointA;
  while (isInBounds(startingPoint, gridSize)) {
    antinodes.add(pointToKey(startingPoint));
    startingPoint = {
      row: startingPoint.row + dRow,
      col: startingPoint.col + dCol,
    };
  }

  // Negative direction
  startingPoint = pointB;
  while (isInBounds(startingPoint, gridSize)) {
    antinodes.add(pointToKey(startingPoint));
    startingPoint = {
      row: startingPoint.row - dRow,
      col: startingPoint.col - dCol,
    };
  }
}

function processSignals(antennasBySignal, gridSize) {
  const antinodes = new Set();
  const antinodeFn = PART_NUMBER === 1 ? addAntinodes : addAntinodes2;
  Object.values(antennasBySignal).forEach((antennas) => {
    if (antennas.length < 2) return;
    for (let i = 0; i < antennas.length - 1; i++) {
      for (let j = i + 1; j < antennas.length; j++) {
        antinodeFn(antennas[i], antennas[j], gridSize, antinodes);
      }
    }
  });
  return antinodes;
}

async function part1() {
  PART_NUMBER = 1;
  const { antennasBySignal, gridSize } = await getProcessedData();
  const antinodes = processSignals(antennasBySignal, gridSize);
  console.log(`Part 1: ${antinodes.size}`);
}

async function part2() {
  PART_NUMBER = 2;
  const { antennasBySignal, gridSize } = await getProcessedData();
  const antinodes = processSignals(antennasBySignal, gridSize);
  console.log(`Part 2: ${antinodes.size}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  await part1();
  await part2();
}
