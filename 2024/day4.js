const DAY_NUM = 4;

let TESTING = true;
let PART_NUMBER = 1;

const sampleData1 = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;
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
  return rawData
    .trim()
    .split("\n")
    .map((line) => line.split(""));
}

function gridValue(grid, col, row) {
  return { value: grid[row]?.[col] || null, col, row };
}

const GRID_FNS = {
  top: (grid, col, row) => gridValue(grid, col, row - 1),
  bottom: (grid, col, row) => gridValue(grid, col, row + 1),
  left: (grid, col, row) => gridValue(grid, col - 1, row),
  right: (grid, col, row) => gridValue(grid, col + 1, row),
  topLeft: (grid, col, row) => gridValue(grid, col - 1, row - 1),
  topRight: (grid, col, row) => gridValue(grid, col + 1, row - 1),
  bottomLeft: (grid, col, row) => gridValue(grid, col - 1, row + 1),
  bottomRight: (grid, col, row) => gridValue(grid, col + 1, row + 1),
};

function findXMAS(grid, xCol, xRow) {
  if (gridValue(grid, xCol, xRow).value !== "X") {
    return 0;
  }
  // Find which directions the Ms are
  return Object.values(GRID_FNS).filter((fn) => {
    const { value: mValue, col: mCol, row: mRow } = fn(grid, xCol, xRow);
    if (mValue !== "M") return false;

    // See if we can continue this direction for an A and a S
    const { value: aValue, col: aCol, row: aRow } = fn(grid, mCol, mRow);
    if (aValue !== "A") return false;

    const { value: sValue } = fn(grid, aCol, aRow);
    return sValue === "S";
  }).length;
}

async function part1() {
  PART_NUMBER = 1;
  const grid = await getProcessedData();
  let answer = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      answer += findXMAS(grid, col, row);
    }
  }

  console.log(`Part 1: ${answer}`);
}

const DIAG_FNS = {
  downwards: { top: GRID_FNS.topLeft, bottom: GRID_FNS.bottomRight },
  upwards: { top: GRID_FNS.topRight, bottom: GRID_FNS.bottomLeft },
};

function findX_MAS(grid, aCol, aRow) {
  if (gridValue(grid, aCol, aRow).value !== "A") {
    return false;
  }

  return Object.values(DIAG_FNS).every(({ top, bottom }) => {
    const expected = new Set(["M", "S"]);
    expected.delete(top(grid, aCol, aRow).value);
    expected.delete(bottom(grid, aCol, aRow).value);
    return expected.size === 0;
  });
}

async function part2() {
  PART_NUMBER = 2;
  const grid = await getProcessedData();
  let answer = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      answer += findX_MAS(grid, col, row) ? 1 : 0;
    }
  }

  console.log(`Part 2: ${answer}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  await part1();
  await part2();
}
