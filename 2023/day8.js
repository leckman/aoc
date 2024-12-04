const DAY_NUM = 8;

let TESTING = true;
let PART_NUMBER = 1;

const sampleData1 = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;
const sampleData2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

async function fetchData() {
  if (TESTING) {
    return sampleData2;
  }
  return fetch(`https://adventofcode.com/2023/day/${DAY_NUM}/input`).then(
    (res) => res.text()
  );
}

function parseData(lines) {
  const [directions, blank, ...nodes] = lines;
  const neighbors = {};
  nodes.forEach((node) => {
    const [label, left, right] = [...node.matchAll(/[A-Z]{3}/g)];
    neighbors[label] = { left: left[0], right: right[0] };
  });
  return {
    directions: directions.split(""),
    neighbors,
  };
}

async function getProcessedData() {
  const rawData = await fetchData();
  return rawData.trim().split("\n");
}

const memoFromStartPoint = {};

function coalesceMemos() {
  console.log("begin coalescing");
  console.log(memoFromStartPoint);
  let dirty = true;
  while (dirty === true) {
    dirty = false;
    Object.entries(memoFromStartPoint).forEach(([point, { value, steps }]) => {
      const next = memoFromStartPoint[value];
      if (next) {
        dirty = true;
        memoFromStartPoint[point] = {
          value: next.value,
          steps: steps + next.steps,
        };
      }
    });
  }
  console.log(memoFromStartPoint);
  console.log("end coalescing");
}

function runThroughFromStartPoint(directions, neighbors, startPoint) {
  const memoizedValue = memoFromStartPoint[startPoint];
  if (memoizedValue) {
    return memoizedValue;
  }
  console.log(
    "Running through start point " +
      startPoint +
      ", num start points is " +
      Object.keys(memoFromStartPoint).length
  );
  console.log(memoFromStartPoint);
  let numSteps = 0;
  let currentLocation = startPoint;
  while (numSteps < directions.length && currentLocation !== "ZZZ") {
    const direction = directions[numSteps];
    currentLocation =
      direction === "R"
        ? neighbors[currentLocation].right
        : neighbors[currentLocation].left;
    numSteps++;
  }
  const retVal = { value: currentLocation, steps: numSteps };
  memoFromStartPoint[startPoint] = retVal;
  coalesceMemos();
  return retVal;
}

function followDirectionsToTerminus(directions, neighbors) {
  let currentLocation = "AAA";
  let numSteps = 0;
  while (currentLocation !== "ZZZ") {
    const { value, steps } = runThroughFromStartPoint(
      directions,
      neighbors,
      currentLocation
    );
    currentLocation = value;
    numSteps += steps;
  }
  return numSteps;
}

async function part1() {
  PART_NUMBER = 1;
  const data = await getProcessedData();
  const { directions, neighbors } = parseData(data);
  if (TESTING) {
    console.log(directions, neighbors);
  }
  console.log(`Part 1: ${followDirectionsToTerminus(directions, neighbors)}`);
}

async function part2() {
  PART_NUMBER = 2;
  const data = await getProcessedData();
  let answer = 0;
  console.log(`Part 2: ${answer}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  await part1();
  await part2();
}
