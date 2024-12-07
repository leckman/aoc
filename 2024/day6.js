const DAY_NUM = 6;

let TESTING = true;
let PART_NUMBER = 1;

const sampleData1 = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;
const sampleData2 = sampleData1;

async function fetchData() {
  if (TESTING) {
    return PART_NUMBER === 1 ? sampleData1 : sampleData2;
  }
  return fetch(`https://adventofcode.com/2024/day/${DAY_NUM}/input`).then(
    (res) => res.text()
  );
}

const Direction = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  UP: "UP",
  DOWN: "DOWN",
};

const Movement = {
  [Direction.LEFT]: { dCol: -1, dRow: 0, rotate: Direction.UP },
  [Direction.RIGHT]: { dCol: 1, dRow: 0, rotate: Direction.DOWN },
  [Direction.UP]: { dCol: 0, dRow: -1, rotate: Direction.RIGHT },
  [Direction.DOWN]: { dCol: 0, dRow: 1, rotate: Direction.LEFT },
};

const CELL_TYPE = {
  OUT_OF_BOUNDS: "OUT_OF_BOUNDS",
  OBSTACLE: "OBSTACLE",
};

function rowColToKey(row, col, direction) {
  const position = `${row},${col}`;
  if (direction) {
    return `${position},${direction}`;
  } else {
    return position;
  }
}

async function getProcessedData() {
  const rawData = await fetchData();
  const cells = {};
  let guardPosition = null;
  const lines = rawData.trim().split("\n");

  if (PART_NUMBER === 2) {
    console.log({ rows: lines.length });
  }

  const gridSize = { rows: lines.length, cols: 0 };

  lines.forEach((line, rowNum) => {
    const chars = line.split("");
    gridSize.cols = chars.length;
    cells[rowColToKey(rowNum, -1)] = CELL_TYPE.OUT_OF_BOUNDS;
    cells[rowColToKey(rowNum, chars.length)] = CELL_TYPE.OUT_OF_BOUNDS;
    chars.forEach((char, colNum) => {
      cells[rowColToKey(-1, colNum)] = CELL_TYPE.OUT_OF_BOUNDS;
      cells[rowColToKey(lines.length, colNum)] = CELL_TYPE.OUT_OF_BOUNDS;
      if (char === "^") {
        guardPosition = {
          row: rowNum,
          col: colNum,
          direction: Direction.UP,
          cellsVisited: new Set([
            rowColToKey(
              rowNum,
              colNum,
              PART_NUMBER == 2 ? Direction.UP : undefined
            ),
          ]),
          done: false,
          doneBecauseOfCycle: false,
          cycleOpportunities: new Set(),
        };
      } else if (char === "#") {
        cells[rowColToKey(rowNum, colNum)] = CELL_TYPE.OBSTACLE;
      }
    });
  });
  return { cells, guardPosition, gridSize };
}

function move(guardPosition, cells) {
  const { row, col, direction } = guardPosition;
  const { dRow, dCol, rotate } = Movement[direction];
  const nextPosition = rowColToKey(row + dRow, col + dCol);
  const nextCell = cells[nextPosition];
  if (nextCell === CELL_TYPE.OUT_OF_BOUNDS) {
    guardPosition.done = true;
    return;
  } else if (nextCell === CELL_TYPE.OBSTACLE) {
    guardPosition.direction = rotate;
    return;
  } else {
    guardPosition.row = row + dRow;
    guardPosition.col = col + dCol;
    guardPosition.cellsVisited.add(
      rowColToKey(guardPosition.row, guardPosition.col)
    );
    return;
  }
}

async function part1() {
  PART_NUMBER = 1;
  const { guardPosition, cells } = await getProcessedData();

  console.log(cells);

  while (!guardPosition.done) {
    console.log(guardPosition);
    move(guardPosition, cells);
  }

  console.log(`Part 1: ${guardPosition.cellsVisited.size}`);
}

// Largely the same as move 2, but tracks direction as part of cellsVisited to
// detect cycles (revisit same cell facing same direction)
function move2(guardPosition, cells) {
  const { row, col, direction } = guardPosition;
  const { dRow, dCol, rotate } = Movement[direction];
  const nextPosition = rowColToKey(row + dRow, col + dCol);
  const nextCell = cells[nextPosition];
  if (nextCell === CELL_TYPE.OUT_OF_BOUNDS) {
    guardPosition.done = true;
    return;
  } else if (nextCell === CELL_TYPE.OBSTACLE) {
    guardPosition.direction = rotate;
    const guardAt = rowColToKey(
      guardPosition.row,
      guardPosition.col,
      guardPosition.direction
    );
    guardPosition.cellsVisited.add(guardAt);
    return;
  } else {
    guardPosition.row = row + dRow;
    guardPosition.col = col + dCol;
    const guardAt = rowColToKey(
      guardPosition.row,
      guardPosition.col,
      guardPosition.direction
    );
    if (guardPosition.cellsVisited.has(guardAt)) {
      guardPosition.done = true;
      guardPosition.doneBecauseOfCycle = true;
      return;
    }
    guardPosition.cellsVisited.add(guardAt);
    return;
  }
}

async function part2() {
  PART_NUMBER = 2;
  const { guardPosition, cells } = await getProcessedData();
  const { row, col, direction } = guardPosition;
  const originalGuardMaker = () => {
    return {
      row,
      col,
      direction,
      cellsVisited: new Set([rowColToKey(row, col, direction)]),
      done: false,
    };
  };

  // First, let's get the cells in the guard's path.
  // Any new obstacle would need to be along the path to create a cycle.
  while (!guardPosition.done) {
    move(guardPosition, cells);
  }

  // Check if any visited cell could have been a cycle-creating obstacle
  let cyclePositions = new Set();
  let count = 0;
  guardPosition.cellsVisited.forEach((cell) => {
    count += 1;
    console.log(
      `Checking cell ${cell}: (${
        (count / guardPosition.cellsVisited.size) * 100
      }%)`
    );
    const [row, col] = cell.split(",");
    const newObstacle = rowColToKey(row, col);
    const originalGuard = originalGuardMaker();
    const updatedCells = { ...cells, [newObstacle]: CELL_TYPE.OBSTACLE };
    while (!originalGuard.done) {
      move2(originalGuard, updatedCells);
    }
    if (originalGuard.doneBecauseOfCycle) {
      console.log("\t Found cycle");
      cyclePositions.add(newObstacle);
    }
  });

  console.log(`Part 2: ${cyclePositions.size}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  await part1();
  await part2();
}
