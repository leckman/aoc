const DAY_NUM = 1;

let TESTING = true;
let PART_NUMBER = 1;

const sampleData1 = `3   4
4   3
2   5
1   3
3   9
3   3`;
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
  const left = [];
  const right = [];
  lines.forEach((line) => {
    const bits = line.split(" ");
    left.push(+bits.at(0));
    right.push(+bits.at(-1));
  });
  left.sort();
  right.sort();
  return { left, right };
}

async function part1() {
  PART_NUMBER = 1;
  const { left, right } = await getProcessedData();

  let answer = 0;

  if (left.length !== right.length) {
    console.error("Lists are not the same length", left.length, right.length);
    return;
  }

  for (let i = 0; i < left.length; i++) {
    answer += Math.abs(left[i] - right[i]);
  }

  // TODO Implement
  console.log(`Part 1: ${answer}`);
}

async function part2() {
  PART_NUMBER = 2;
  const { left, right } = await getProcessedData();

  let answer = 0;

  const rightAsDict = {};
  right.forEach((el) => {
    if (!rightAsDict[el]) {
      rightAsDict[el] = 0;
    }
    rightAsDict[el] += 1;
  });

  left.forEach((el) => {
    const occurences = rightAsDict[el] || 0;
    answer += el * occurences;
  });

  console.log(`Part 2: ${answer}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  await part1();
  await part2();
}
