const DAY_NUM = 0;

let TESTING = true;
let PART_NUMBER = 1;

const sampleData1 = "";
const sampleData2 = "";

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

async function part1() {
  PART_NUMBER = 1;
  const data = await getProcessedData();
  let answer = 0;
  // TODO Implement
  console.log(`Part 1: ${answer}`);
}

async function part2() {
  PART_NUMBER = 2;
  const data = await getProcessedData();
  let answer = 0;
  console.log(`Part 2: ${answer}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  part1();
  part2();
}
